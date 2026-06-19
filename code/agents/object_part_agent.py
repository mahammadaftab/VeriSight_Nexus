from models.schemas import ClaimExtractionResult, VisionInspectionResult

class ObjectPartAgent:
    def __init__(self):
        pass
        
    def verify_part(self, extraction: ClaimExtractionResult, vision: VisionInspectionResult) -> str:
        # Deterministic verification if the part extracted matches the part seen
        if extraction.object_part == "unknown" and vision.visible_object_part != "unknown":
            return vision.visible_object_part
            
        if extraction.object_part == vision.visible_object_part:
            return extraction.object_part
            
        if vision.visible_object_part == "unknown":
            return extraction.object_part # Give benefit of doubt to extraction if vision can't tell but damage is found
            
        # If they disagree, we might have a wrong_object_part risk, handled in decision.
        return vision.visible_object_part
