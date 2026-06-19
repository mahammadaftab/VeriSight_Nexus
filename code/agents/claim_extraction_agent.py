from models.schemas import ClaimExtractionResult
from services.llm_service import LLMService

class ClaimExtractionAgent:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        
    def extract_claim(self, user_claim: str, claim_object: str) -> ClaimExtractionResult:
        prompt = f"""
        You are an expert claims intent extractor.
        Review the following conversation between a Customer and Support regarding a damage claim.
        
        Conversation:
        "{user_claim}"
        
        The object claimed is: {claim_object}.
        
        Extract:
        1. issue_type: the exact damage being claimed (e.g., dent, scratch, crack, shattered_glass, broken_part, missing_part, torn_packaging, crushed_packaging, water_damage, stain). Use "none" if no damage is claimed, or "unknown" if unclear.
        2. object_part: the specific part of the {claim_object} being claimed. 
           - For car: front_bumper, rear_bumper, door, hood, windshield, side_mirror, headlight, taillight, fender, quarter_panel, body, unknown
           - For laptop: screen, keyboard, trackpad, hinge, lid, corner, port, base, body, unknown
           - For package: box, package_corner, package_side, seal, label, contents, item, unknown
        3. issue_family: a general category combining both, e.g., "dent or scratch", "crack, broken, or missing part", "crushed, torn, or seal damage", "water, stain, or label damage", "contents or inner item".
        
        Return exactly conforming to the schema.
        """
        
        return self.llm_service.generate_structured(prompt, ClaimExtractionResult)
