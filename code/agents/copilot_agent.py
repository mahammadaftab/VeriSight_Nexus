from models.schemas import ClaimExtractionResult, VisionInspectionResult, ClaimStatus, ConfidenceScores, EvidenceCoverage, FraudIntelligence, CopilotSummary
from services.llm_service import LLMService

class CopilotAgent:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        
    def generate_copilot_brief(self, 
                               extraction: ClaimExtractionResult, 
                               vision: VisionInspectionResult, 
                               status: ClaimStatus,
                               health_score: int,
                               coverage: EvidenceCoverage,
                               fraud: FraudIntelligence) -> CopilotSummary:
        prompt = f"""
        You are the VeriSight Nexus Investigation Copilot.
        Generate a concise executive summary brief for a human reviewer.
        
        Data:
        Claim: {extraction.issue_type.value} on {extraction.object_part}
        Final Decision: {status.value}
        Claim Health Score: {health_score}/100
        Fraud Risk Score: {fraud.fraud_risk_score}/100
        Evidence Coverage: {coverage.coverage_percentage}%
        Vision Finding: {vision.visible_damage_type.value} on {vision.visible_object_part}
        
        Determine the 'recommended_action' (e.g. "Approve Claim", "Reject - Fraud Risk", "Manual Review Required", "Reject - No Evidence").
        Write a short 'reason' for this action.
        Write an 'evidence_summary' detailing the visual evidence quality and coverage.
        List 'potential_concerns' based on fraud scores or missing evidence. Use "None detected." if none.
        
        Keep it professional and concise.
        """
        
        return self.llm_service.generate_structured(prompt, CopilotSummary)
