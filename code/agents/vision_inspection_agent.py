from typing import List
from PIL import Image
from models.schemas import VisionInspectionResult
from services.llm_service import LLMService

class VisionInspectionAgent:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        
    def inspect_images(self, images: List[Image.Image], claim_object: str, extracted_issue: str, extracted_part: str) -> VisionInspectionResult:
        prompt = f"""
        You are an expert damage inspector and visual evidence validator.
        Review the provided image(s). The user claims there is a '{extracted_issue}' on the '{extracted_part}' of a '{claim_object}'.
        
        Inspect the images carefully.
        
        1. Identify the 'visible_damage_type' (must be exactly one of: dent, scratch, crack, glass_shatter, broken_part, missing_part, torn_packaging, crushed_packaging, water_damage, stain, none, unknown). Use 'none' if the part is visible but undamaged.
        2. Identify the 'visible_object_part' that is shown (e.g. front_bumper, screen, box, etc.). Use 'unknown' if it cannot be determined.
        3. Determine 'image_quality_flags' (e.g., blurry_image, cropped_or_obstructed, low_light_or_glare, wrong_angle). If none, use 'none'.
        4. Determine 'authenticity_concerns' (e.g., wrong_object, wrong_object_part, claim_mismatch, possible_manipulation, non_original_image, text_instruction_present). If none, use 'none'.
        5. 'is_valid_image': True if the image is clear enough to make a judgment, False otherwise.
        6. 'severity_estimate': 'none', 'low', 'medium', 'high', or 'unknown'.
        7. Provide a short 'description' of what you see.
        8. Provide an 'image_quality_score' (0-100) quantifying how clear and useful the evidence is.
        """
        
        return self.llm_service.generate_structured(prompt, VisionInspectionResult, images=images)
