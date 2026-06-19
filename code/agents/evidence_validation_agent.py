from typing import List, Tuple
from models.schemas import EvidenceRequirement, ClaimExtractionResult, EvidenceCoverage

class EvidenceValidationAgent:
    def __init__(self, requirements: List[EvidenceRequirement]):
        self.requirements = requirements
        
    def validate_evidence(self, extraction: ClaimExtractionResult, claim_object: str, valid_image_flag: bool) -> Tuple[str, str, EvidenceCoverage]:
        if not valid_image_flag:
            coverage = EvidenceCoverage(coverage_percentage=0, missing_requirements=["Valid Image"])
            return "false", "The submitted images are not valid or not usable for automated review.", coverage
            
        applicable_req = None
        for req in self.requirements:
            if req.claim_object.lower() in [claim_object.lower(), "all"]:
                if extraction.issue_type.value.lower() in req.applies_to.lower() or \
                   extraction.object_part.lower() in req.applies_to.lower() or \
                   "general" in req.applies_to.lower():
                    applicable_req = req
                    break
        
        if applicable_req:
            # We assign 100% if valid image exists for now. Can be enhanced to check exact strings against Vision results.
            coverage = EvidenceCoverage(coverage_percentage=100, missing_requirements=[])
            return "true", f"Evidence appears sufficient for inspection. Requirement: {applicable_req.minimum_image_evidence}", coverage
        
        coverage = EvidenceCoverage(coverage_percentage=100, missing_requirements=[])
        return "true", "General evidence standard met.", coverage
