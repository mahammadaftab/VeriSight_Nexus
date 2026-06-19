from pydantic import BaseModel, Field
from typing import List, Optional
from models.enums import (
    ClaimObject, ClaimStatus, IssueType, 
    ObjectPartCar, ObjectPartLaptop, ObjectPartPackage,
    RiskFlag, Severity
)

class UserHistory(BaseModel):
    user_id: str
    past_claim_count: int
    accept_claim: int
    manual_review_claim: int
    rejected_claim: int
    last_90_days_claim_count: int
    history_flags: str
    history_summary: str

class EvidenceRequirement(BaseModel):
    requirement_id: str
    claim_object: str
    applies_to: str
    minimum_image_evidence: str

class ClaimExtractionResult(BaseModel):
    issue_type: IssueType
    object_part: str # Can be one of ObjectPartCar, Laptop, Package or unknown
    issue_family: str

class VisionInspectionResult(BaseModel):
    visible_damage_type: IssueType
    visible_object_part: str
    image_quality_flags: List[RiskFlag]
    authenticity_concerns: List[RiskFlag]
    is_valid_image: bool
    severity_estimate: Severity
    description: str
    image_quality_score: int = Field(description="Score from 0-100 indicating visual quality")

class ImageQualityResult(BaseModel):
    is_blurry: bool
    is_cropped_or_obstructed: bool
    has_low_light_or_glare: bool
    wrong_angle: bool
    wrong_object: bool
    wrong_object_part: bool
    quality_score: int = Field(description="Score from 0-100")

class EvidenceCoverage(BaseModel):
    coverage_percentage: int = Field(description="Percentage 0-100 of required evidence shown")
    missing_requirements: List[str]

class ConfidenceScores(BaseModel):
    overall_confidence: float = Field(description="0.0 to 1.0 overall ensemble confidence")
    image_confidence: float = Field(description="0.0 to 1.0 confidence in the visual evidence")
    claim_confidence: float = Field(description="0.0 to 1.0 confidence in the claim text extraction")
    evidence_confidence: float = Field(description="0.0 to 1.0 confidence in evidence coverage")
    risk_confidence: float = Field(description="0.0 to 1.0 confidence in user history risk assessment")

class ExplainabilityReport(BaseModel):
    what_was_claimed: str
    what_was_observed: str
    evidence_supporting: str
    evidence_contradicting: str
    final_verdict_rationale: str

class FraudIntelligence(BaseModel):
    fraud_risk_score: int = Field(description="Score from 0-100 where higher means higher fraud risk")
    repeated_claims_flag: bool
    high_rejection_history_flag: bool
    rapid_submissions_flag: bool
    missing_evidence_patterns: bool
    fraud_rationale: str

class CopilotSummary(BaseModel):
    recommended_action: str
    reason: str
    evidence_summary: str
    potential_concerns: str


class OutputRow(BaseModel):
    user_id: str
    image_paths: str
    claim_status: str
    issue_type: str
    object_part: str
    evidence_standard_met: str
    severity: str
    risk_flags: str
    overall_confidence: float = 0.0
    image_confidence: float = 0.0
    claim_confidence: float = 0.0
    evidence_confidence: float = 0.0
    risk_confidence: float = 0.0
    explanation: str = ""
    health_score: int = 0
    fraud_score: int = 0
