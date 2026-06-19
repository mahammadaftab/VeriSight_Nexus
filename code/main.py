import os
import sys
import traceback
import argparse
from typing import List, Dict

from rich.console import Console
from rich.panel import Panel
from rich.text import Text

from models.schemas import (
    UserHistory, EvidenceRequirement, OutputRow, RiskFlag, Severity,
    ClaimExtractionResult, VisionInspectionResult
)
from models.enums import ClaimStatus, IssueType
from services.csv_loader import load_csv, write_csv
from services.image_loader import load_image, extract_image_id
from services.llm_service import LLMService
from services.cache_service import CacheService

from agents.claim_extraction_agent import ClaimExtractionAgent
from agents.evidence_validation_agent import EvidenceValidationAgent
from agents.vision_inspection_agent import VisionInspectionAgent
from agents.object_part_agent import ObjectPartAgent
from agents.risk_assessment_agent import RiskAssessmentAgent
from agents.decision_agent import DecisionAgent
from agents.explanation_agent import ExplanationAgent
from agents.copilot_agent import CopilotAgent
from services.audit_service import AuditService

def process_claims(input_csv: str, output_csv: str, base_dir: str = "../", demo_mode: bool = False):
    console = Console()
    if demo_mode:
        console.print(Panel("[bold cyan]VeriSight Nexus - Judge Demo Mode[/bold cyan]\n[white]Advanced Intelligence Ensemble Execution[/white]"))
        
    claims_data = load_csv(os.path.join(base_dir, input_csv))
    history_data = load_csv(os.path.join(base_dir, "dataset/user_history.csv"))
    evidence_data = load_csv(os.path.join(base_dir, "dataset/evidence_requirements.csv"))
    
    histories = [UserHistory(**h) for h in history_data]
    requirements = [EvidenceRequirement(**r) for r in evidence_data]
    
    llm_service = LLMService()
    cache_service = CacheService(os.path.join(base_dir, "code/.cache"))
    
    claim_extractor = ClaimExtractionAgent(llm_service)
    evidence_validator = EvidenceValidationAgent(requirements)
    vision_inspector = VisionInspectionAgent(llm_service)
    object_part_agent = ObjectPartAgent()
    risk_assessor = RiskAssessmentAgent(histories)
    decision_agent = DecisionAgent()
    explanation_agent = ExplanationAgent(llm_service)
    copilot_agent = CopilotAgent(llm_service)
    audit_service = AuditService(os.path.join(base_dir, "code/audit"))
    
    results: List[Dict[str, str]] = []
    
    # If demo mode, just process the first 3
    if demo_mode:
        claims_data = claims_data[:3]
        
    total = len(claims_data)
    
    for i, claim_row in enumerate(claims_data):
        user_id = claim_row['user_id']
        image_paths_raw = claim_row['image_paths']
        user_claim = claim_row['user_claim']
        claim_object = claim_row['claim_object']
        
        if demo_mode:
            console.print(f"\n[bold yellow]Processing Claim {i+1}/{total}:[/bold yellow] {user_id}")
            console.print(f"[dim]User Says:[/dim] {user_claim[:100]}...")
            console.print(f"[dim]Images:[/dim] {image_paths_raw}")
        
        try:
            # 1. Claim Extraction
            cache_key = f"{user_claim}_{claim_object}"
            cached_ext = cache_service.get("extract", cache_key)
            if cached_ext:
                extraction = ClaimExtractionResult(**cached_ext)
            else:
                extraction = claim_extractor.extract_claim(user_claim, claim_object)
                cache_service.set("extract", cache_key, extraction.model_dump(mode='json'))
                
            if demo_mode:
                console.print(f" [green]✓[/green] Extracted: {extraction.issue_type.value} on {extraction.object_part}")
            
            # 2. Risk Assessment (Fraud Layer)
            history_flags, fraud_intel = risk_assessor.assess_risk(user_id)
            if demo_mode:
                console.print(f" [green]✓[/green] Risk Flags: {[f.value for f in history_flags]} | Fraud Score: {fraud_intel.fraud_risk_score}")
            
            # 3. Vision Inspection
            image_paths = image_paths_raw.split(";")
            vision_results: dict[str, VisionInspectionResult] = {}
            
            all_quality_flags = set()
            all_auth_flags = set()
            best_severity = Severity.unknown
            best_damage_type = IssueType.unknown
            best_part = "unknown"
            any_valid_image = False
            best_quality_score = 0
            
            for path in image_paths:
                img_id = extract_image_id(path)
                img = load_image(path, base_dir)
                
                if not img:
                    continue
                    
                v_cache_key = f"{img_id}_{claim_object}_{extraction.issue_type.value}_{extraction.object_part}"
                cached_vis = cache_service.get("vision", v_cache_key)
                if cached_vis:
                    vis_res = VisionInspectionResult(**cached_vis)
                else:
                    vis_res = vision_inspector.inspect_images([img], claim_object, extraction.issue_type.value, extraction.object_part)
                    cache_service.set("vision", v_cache_key, vis_res.model_dump(mode='json'))
                    
                vision_results[img_id] = vis_res
                if vis_res.is_valid_image: any_valid_image = True
                if vis_res.image_quality_score > best_quality_score:
                    best_quality_score = vis_res.image_quality_score
                    
                for qf in vis_res.image_quality_flags:
                    if qf != RiskFlag.none: all_quality_flags.add(qf)
                for af in vis_res.authenticity_concerns:
                    if af != RiskFlag.none: all_auth_flags.add(af)
                    
                if vis_res.visible_damage_type != IssueType.none and vis_res.visible_damage_type != IssueType.unknown:
                    best_damage_type = vis_res.visible_damage_type
                    best_part = vis_res.visible_object_part
                    if best_severity in [Severity.unknown, Severity.none] or vis_res.severity_estimate == Severity.high:
                        best_severity = vis_res.severity_estimate
                    elif vis_res.severity_estimate == Severity.medium and best_severity != Severity.high:
                        best_severity = Severity.medium
            
            agg_vision = VisionInspectionResult(
                visible_damage_type=best_damage_type if any_valid_image else IssueType.unknown,
                visible_object_part=best_part,
                image_quality_flags=list(all_quality_flags) if all_quality_flags else [RiskFlag.none],
                authenticity_concerns=list(all_auth_flags) if all_auth_flags else [RiskFlag.none],
                is_valid_image=any_valid_image,
                severity_estimate=best_severity,
                description="Aggregated",
                image_quality_score=best_quality_score
            )
            
            if demo_mode:
                console.print(f" [green]✓[/green] Vision: Found {agg_vision.visible_damage_type.value} on {agg_vision.visible_object_part} (Quality Score: {agg_vision.image_quality_score})")
            
            # 4. Object Part Alignment
            final_object_part = object_part_agent.verify_part(extraction, agg_vision)
            
            # 5. Evidence Validation (Phase 4: Evidence Coverage)
            ev_met, ev_reason, coverage = evidence_validator.validate_evidence(extraction, claim_object, any_valid_image)
            if demo_mode:
                console.print(f" [green]✓[/green] Evidence Coverage: {coverage.coverage_percentage}%")
            
            # 6. Ensemble Decision & Confidence Engine
            claim_status, final_risk_flags, confidence, health_score = decision_agent.make_decision(
                extraction, agg_vision, history_flags, coverage, fraud_intel
            )
            if demo_mode:
                console.print(f" [cyan]►[/cyan] Ensemble Status: {claim_status.value.upper()}")
                console.print(f" [cyan]►[/cyan] Confidence Metrics:")
                console.print(f"    - Overall: {confidence.overall_confidence}")
                console.print(f"    - Image: {confidence.image_confidence}")
                console.print(f"    - Evidence: {confidence.evidence_confidence}")
                console.print(f"    - Health Score: {health_score}/100")
            
            # 7. Explainability Engine
            expl_cache_key = f"{extraction.issue_type.value}_{claim_status.value}_{'-'.join(sorted(vision_results.keys()))}_v2"
            cached_expl = cache_service.get("expl", expl_cache_key)
            if cached_expl:
                report = cached_expl["report"]
                supp_imgs = cached_expl["supporting_image_ids"]
            else:
                explain_report, supp_imgs = explanation_agent.generate_explanation(
                    extraction, vision_results, claim_status, final_risk_flags
                )
                report = explain_report.model_dump()
                cache_service.set("expl", expl_cache_key, {"report": report, "supporting_image_ids": supp_imgs})
                
            if demo_mode:
                console.print(Panel(
                    f"[bold]Explainability Report[/bold]\n"
                    f"[dim]What was claimed:[/dim] {report['what_was_claimed']}\n"
                    f"[dim]What was observed:[/dim] {report['what_was_observed']}\n"
                    f"[dim]Supporting Evidence:[/dim] {report['evidence_supporting']}\n"
                    f"[dim]Rationale:[/dim] {report['final_verdict_rationale']}",
                    border_style="cyan"
                ))
            
            # 8. Investigation Copilot
            copilot_brief = copilot_agent.generate_copilot_brief(
                extraction, agg_vision, claim_status, health_score, coverage, fraud_intel
            )
            
            # 9. Audit Logging
            audit_service.log_claim(user_id, {
                "user_id": user_id,
                "claim_status": claim_status.value,
                "confidence": confidence.model_dump(),
                "health_score": health_score,
                "fraud_intelligence": fraud_intel.model_dump(),
                "copilot_summary": copilot_brief.model_dump()
            })
            
            str_risk_flags = ";".join([f.value for f in final_risk_flags]) if final_risk_flags else "none"
            if not str_risk_flags: str_risk_flags = "none"
            
            row = OutputRow(
                user_id=user_id,
                image_paths=image_paths_raw,
                claim_status=claim_status.value,
                issue_type=extraction.issue_type.value,
                object_part=final_object_part,
                evidence_standard_met=ev_met,
                severity=best_severity.value,
                risk_flags=str_risk_flags,
                overall_confidence=confidence.overall_confidence,
                image_confidence=confidence.image_confidence,
                claim_confidence=confidence.claim_confidence,
                evidence_confidence=confidence.evidence_confidence,
                risk_confidence=confidence.risk_confidence,
                explanation=report['final_verdict_rationale'],
                health_score=health_score,
                fraud_score=fraud_intel.fraud_risk_score
            )
            results.append(row.model_dump())
            
        except Exception as e:
            if demo_mode:
                console.print(f"[bold red]Error:[/bold red] {e}")
            else:
                traceback.print_exc()
            
            # Fallback row
            row = OutputRow(
                user_id=user_id,
                image_paths=image_paths_raw,
                claim_status="not_enough_information",
                issue_type="unknown",
                object_part="unknown",
                evidence_standard_met="false",
                severity="unknown",
                risk_flags="manual_review_required",
                overall_confidence=0.0,
                image_confidence=0.0,
                claim_confidence=0.0,
                evidence_confidence=0.0,
                risk_confidence=0.0,
                explanation="An error occurred during automated processing.",
                health_score=0,
                fraud_score=0
            )
            results.append(row.model_dump())
            
    # Write output
    fieldnames = list(OutputRow.model_fields.keys())
    write_csv(os.path.join(base_dir, output_csv), fieldnames, results)
    if not demo_mode:
        print(f"Done! Results written to {output_csv}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo", action="store_true", help="Run Judge Demo Mode")
    args = parser.parse_args()
    
    process_claims("dataset/claims.csv", "output.csv", base_dir="../", demo_mode=args.demo)
