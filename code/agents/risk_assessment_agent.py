from typing import List, Dict, Tuple
from models.schemas import UserHistory, RiskFlag, FraudIntelligence

class RiskAssessmentAgent:
    def __init__(self, history_data: List[UserHistory]):
        self.history_map = {h.user_id: h for h in history_data}
        
    def assess_risk(self, user_id: str) -> Tuple[List[RiskFlag], FraudIntelligence]:
        user_history = self.history_map.get(user_id)
        if not user_history:
            return [RiskFlag.none], FraudIntelligence(
                fraud_risk_score=0,
                repeated_claims_flag=False,
                high_rejection_history_flag=False,
                rapid_submissions_flag=False,
                missing_evidence_patterns=False,
                fraud_rationale="No history available."
            )
            
        flags = []
        if "user_history_risk" in user_history.history_flags:
            flags.append(RiskFlag.user_history_risk)
        if "manual_review_required" in user_history.history_flags:
            flags.append(RiskFlag.manual_review_required)
            
        if not flags:
            flags = [RiskFlag.none]
            
        # Compute Fraud Intelligence Layer
        score = 0
        repeated = user_history.past_claim_count > 5
        rapid = user_history.last_90_days_claim_count >= 3
        high_rej = (user_history.rejected_claim / max(1, user_history.past_claim_count)) > 0.4
        missing_ev = "missing_evidence" in user_history.history_summary.lower()
        
        if repeated: score += 15
        if rapid: score += 35
        if high_rej: score += 40
        if missing_ev: score += 20
        
        score = min(100, score)
        
        rationale = "User exhibits normal behavior."
        if score > 50:
            rationale = "High fraud risk detected based on historical patterns."
        elif score > 20:
            rationale = "Moderate risk; user has frequent activity."
            
        fraud = FraudIntelligence(
            fraud_risk_score=score,
            repeated_claims_flag=repeated,
            high_rejection_history_flag=high_rej,
            rapid_submissions_flag=rapid,
            missing_evidence_patterns=missing_ev,
            fraud_rationale=rationale
        )
            
        return flags, fraud
