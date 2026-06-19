from typing import List, Tuple
from models.schemas import ClaimExtractionResult, VisionInspectionResult, ClaimStatus, RiskFlag, ExplainabilityReport
from services.llm_service import LLMService

class ExplanationAgent:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        
    def generate_explanation(self,
                             extraction: ClaimExtractionResult,
                             vision_results: dict[str, VisionInspectionResult],
                             claim_status: ClaimStatus,
                             risk_flags: List[RiskFlag]) -> Tuple[ExplainabilityReport, str]:
                             
        prompt = f"""
        You are an expert evidence explainer. Generate an ExplainabilityReport for the final claim status.
        
        Inputs:
        - Extracted Claim: {extraction.issue_type.value} on {extraction.object_part}
        - Final Decision Status: {claim_status.value}
        - Risk Flags: {[r.value for r in risk_flags]}
        
        Vision Findings by Image ID:
        """
        for img_id, v in vision_results.items():
            prompt += f"- {img_id}: Found {v.visible_damage_type.value} on {v.visible_object_part}. Valid image: {v.is_valid_image}. Desc: {v.description}\n"
            
        prompt += """
        Generate an ExplainabilityReport.
        Also, I need to know which image_ids supported the decision (e.g. img_1). If none support it, or if status is not_enough_information, return 'none'.
        Because ExplainabilityReport schema doesn't have an `image_ids` field, we will construct a temporary schema here.
        Wait, we will use the ExplainabilityReport directly and just extract the image_ids from a separate call or embed it in the prompt.
        Actually, we can just return a combined schema or just rely on the prompt to fill `ExplainabilityReport`. 
        Let's just ask you to put the supporting image IDs in the `evidence_supporting` field.
        """
        
        # We need both the report and the image IDs. Let's create an inline schema to wrap them.
        class ExplanationWrapper(ExplainabilityReport):
            supporting_image_ids_str: str
            
        result = self.llm_service.generate_structured(prompt, ExplanationWrapper)
        
        report = ExplainabilityReport(
            what_was_claimed=result.what_was_claimed,
            what_was_observed=result.what_was_observed,
            evidence_supporting=result.evidence_supporting,
            evidence_contradicting=result.evidence_contradicting,
            final_verdict_rationale=result.final_verdict_rationale
        )
        return report, result.supporting_image_ids_str
