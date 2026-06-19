import os
import sys
import asyncio
import time

# Ensure we can import from code directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.append(BASE_DIR)

from services.csv_loader import load_csv
from services.image_loader import load_image, extract_image_id
from services.cache_service import CacheService
from services.output_generator import get_output_generator

from database import connect_to_mongo, close_mongo_connection
from services.llm_service import LLMService
from models.schemas import ClaimExtractionResult, VisionInspectionResult, Severity, UserHistory, EvidenceRequirement
from models.enums import IssueType, RiskFlag

from agents.claim_extraction_agent import ClaimExtractionAgent
from agents.evidence_validation_agent import EvidenceValidationAgent
from agents.vision_inspection_agent import VisionInspectionAgent
from agents.object_part_agent import ObjectPartAgent
from agents.risk_assessment_agent import RiskAssessmentAgent
from agents.decision_agent import DecisionAgent
from agents.explanation_agent import ExplanationAgent

async def process_all():
    print("Starting bulk processing of all claims...")
    
    await connect_to_mongo()

    llm_service = LLMService()
    history_data = load_csv(os.path.join(os.path.dirname(BASE_DIR), "dataset/user_history.csv"))
    evidence_data = load_csv(os.path.join(os.path.dirname(BASE_DIR), "dataset/evidence_requirements.csv"))
    
    histories = [UserHistory(**h) for h in history_data]
    requirements = [EvidenceRequirement(**r) for r in evidence_data]

    cache_service = CacheService(os.path.join(BASE_DIR, ".cache"))
    claim_extractor = ClaimExtractionAgent(llm_service)
    evidence_validator = EvidenceValidationAgent(requirements)
    vision_inspector = VisionInspectionAgent(llm_service)
    object_part_agent = ObjectPartAgent()
    risk_assessor = RiskAssessmentAgent(histories)
    decision_agent = DecisionAgent()
    explanation_agent = ExplanationAgent(llm_service)
    
    out_gen = get_output_generator(BASE_DIR)
    
    claims = load_csv(os.path.join(os.path.dirname(BASE_DIR), "dataset/claims.csv"))
    
    for i, claim_row in enumerate(claims):
        user_id = claim_row['user_id']
        print(f"[{i+1}/{len(claims)}] Processing {user_id}...")
        
        try:
            user_claim = claim_row['user_claim']
            claim_object = claim_row['claim_object']
            image_paths_raw = claim_row['image_paths']
            
            # 1. Extraction
            cache_key = f"{user_claim}_{claim_object}"
            cached_ext = cache_service.get("extract", cache_key)
            if cached_ext:
                extraction = ClaimExtractionResult(**cached_ext)
            else:
                extraction = claim_extractor.extract_claim(user_claim, claim_object)
                cache_service.set("extract", cache_key, extraction.model_dump(mode='json'))
                
            # 2. Risk Assessment
            history_flags, fraud_intel = risk_assessor.assess_risk(user_id)
            str_flags = [f.value for f in history_flags]
            
            # 3. Vision Inspection
            image_paths = image_paths_raw.split(";")
            vision_results = {}
            
            all_quality_flags = set()
            all_auth_flags = set()
            best_severity = Severity.unknown
            best_damage_type = IssueType.unknown
            best_part = "unknown"
            any_valid_image = False
            
            best_quality_score = 0
            
            for path in image_paths:
                img_id = extract_image_id(path)
                img = load_image(path, BASE_DIR)
                if not img: continue
                
                v_cache_key = f"{img_id}_{claim_object}_{extraction.issue_type.value}_{extraction.object_part}"
                cached_vis = cache_service.get("vision", v_cache_key)
                if cached_vis:
                    vis_res = VisionInspectionResult(**cached_vis)
                else:
                    vis_res = vision_inspector.inspect_images([img], claim_object, extraction.issue_type.value, extraction.object_part)
                    cache_service.set("vision", v_cache_key, vis_res.model_dump(mode='json'))
                    
                vision_results[img_id] = vis_res
                if vis_res.is_valid_image: any_valid_image = True
                if getattr(vis_res, "image_quality_score", 0) > best_quality_score:
                    best_quality_score = getattr(vis_res, "image_quality_score", 0)
                
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
            
            # 4. Object Part
            final_object_part = object_part_agent.verify_part(extraction, agg_vision)
            
            # 5. Evidence Validation
            ev_met, ev_reason, coverage = evidence_validator.validate_evidence(extraction, claim_object, any_valid_image)
            
            # 6. Decision Maker
            claim_status, final_risk_flags, confidence, health_score = decision_agent.make_decision(
                extraction, agg_vision, history_flags, coverage, fraud_intel
            )
            str_final_flags = [f.value for f in final_risk_flags]
            
            # 7. Explanation
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
                
            # Output Generation
            raw_record = {
                "user_id": user_id,
                "image_paths": image_paths_raw,
                "user_claim": user_claim,
                "claim_object": claim_object,
                "evidence_standard_met": ev_met,
                "evidence_standard_met_reason": ev_reason,
                "risk_flags": str_final_flags,
                "issue_type": extraction.issue_type.value,
                "object_part": final_object_part,
                "claim_status": claim_status.value,
                "claim_status_justification": report['final_verdict_rationale'],
                "supporting_image_ids": supp_imgs,
                "valid_image": any_valid_image,
                "severity": best_severity.value,
                "confidence": confidence.overall_confidence
            }
            
            valid_record = out_gen.validate_and_format_record(raw_record)
            
            # Write to CSV and Mongo
            out_gen.append_to_csv(valid_record)
            await out_gen.store_in_mongodb(valid_record)
            
            print(f"  -> SUCCESS ({claim_status.value})")
            
        except Exception as e:
            print(f"  -> ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(process_all())
