from typing import List, Tuple
from models.schemas import ClaimExtractionResult, VisionInspectionResult, ClaimStatus, RiskFlag, ConfidenceScores, EvidenceCoverage, FraudIntelligence

class DecisionAgent:
    def __init__(self):
        pass
        
    def make_decision(self, 
                      extraction: ClaimExtractionResult, 
                      vision: VisionInspectionResult, 
                      history_flags: List[RiskFlag],
                      coverage: EvidenceCoverage,
                      fraud: FraudIntelligence) -> Tuple[ClaimStatus, List[RiskFlag], ConfidenceScores, int]:
        
        all_flags = set(vision.image_quality_flags + vision.authenticity_concerns + history_flags)
        if RiskFlag.none in all_flags:
            all_flags.remove(RiskFlag.none)
            
        # 1. Image Confidence (Based on quality score)
        image_conf = max(0.0, vision.image_quality_score / 100.0)
        
        # 2. Evidence Confidence (Based on coverage)
        evidence_conf = max(0.0, coverage.coverage_percentage / 100.0)
        
        # 3. Claim Confidence (Simulated via extraction clarity)
        claim_conf = 0.95 if extraction.issue_type.value != "unknown" else 0.50
        
        # 4. Risk Confidence (Inversely proportional to historical and calculated fraud risk)
        risk_conf = max(0.0, 1.0 - (fraud.fraud_risk_score / 100.0))
        
        # 5. Overall Confidence Ensemble
        overall_conf = (image_conf * 0.4) + (evidence_conf * 0.3) + (claim_conf * 0.2) + (risk_conf * 0.1)
        
        scores = ConfidenceScores(
            overall_confidence=round(overall_conf, 2),
            image_confidence=round(image_conf, 2),
            claim_confidence=round(claim_conf, 2),
            evidence_confidence=round(evidence_conf, 2),
            risk_confidence=round(risk_conf, 2)
        )
        
        # 6. Claim Health Score (Phase 13)
        # Represents the overall "safety" and "quality" of this claim submission.
        # High image quality + high coverage - high fraud risk.
        base_health = (vision.image_quality_score * 0.5) + (coverage.coverage_percentage * 0.5)
        health_score = max(0, min(100, int(base_health - fraud.fraud_risk_score)))
            
        # Rules:
        # not_enough_information if vision flags quality issues preventing judgement
        if not vision.is_valid_image or \
           RiskFlag.blurry_image in all_flags or \
           RiskFlag.wrong_angle in all_flags or \
           RiskFlag.cropped_or_obstructed in all_flags or \
           evidence_conf < 0.5:
            
            # If we also detect fraud, escalate to contradicted
            if RiskFlag.wrong_object in all_flags or RiskFlag.non_original_image in all_flags or fraud.fraud_risk_score > 70:
                return ClaimStatus.contradicted, list(all_flags), scores, health_score
            return ClaimStatus.not_enough_information, list(all_flags), scores, health_score
            
        # Contradicted rules:
        # 1. Claimed damage not present
        if vision.visible_damage_type.value == "none" and extraction.issue_type.value != "none":
            all_flags.add(RiskFlag.damage_not_visible)
            return ClaimStatus.contradicted, list(all_flags), scores, health_score
            
        # 2. Opposite condition or wrong object
        if RiskFlag.wrong_object in all_flags or \
           RiskFlag.wrong_object_part in all_flags or \
           RiskFlag.claim_mismatch in all_flags or \
           (vision.visible_damage_type.value != extraction.issue_type.value and vision.visible_damage_type.value != "unknown"):
           
            # Handle edge case where extract = dent, vision = scratch (mismatch)
            all_flags.add(RiskFlag.claim_mismatch)
            return ClaimStatus.contradicted, list(all_flags), scores, health_score
            
        # Supported rule: image evidence clearly matches claim
        if vision.visible_damage_type.value == extraction.issue_type.value and \
           vision.visible_damage_type.value != "unknown" and \
           vision.visible_damage_type.value != "none":
            return ClaimStatus.supported, list(all_flags), scores, health_score
            
        return ClaimStatus.not_enough_information, list(all_flags), scores, health_score
