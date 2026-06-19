from enum import Enum

class ClaimObject(str, Enum):
    car = "car"
    laptop = "laptop"
    package = "package"

class ClaimStatus(str, Enum):
    supported = "supported"
    contradicted = "contradicted"
    not_enough_information = "not_enough_information"

class IssueType(str, Enum):
    dent = "dent"
    scratch = "scratch"
    crack = "crack"
    glass_shatter = "glass_shatter"
    broken_part = "broken_part"
    missing_part = "missing_part"
    torn_packaging = "torn_packaging"
    crushed_packaging = "crushed_packaging"
    water_damage = "water_damage"
    stain = "stain"
    none = "none"
    unknown = "unknown"

class ObjectPartCar(str, Enum):
    front_bumper = "front_bumper"
    rear_bumper = "rear_bumper"
    door = "door"
    hood = "hood"
    windshield = "windshield"
    side_mirror = "side_mirror"
    headlight = "headlight"
    taillight = "taillight"
    fender = "fender"
    quarter_panel = "quarter_panel"
    body = "body"
    unknown = "unknown"

class ObjectPartLaptop(str, Enum):
    screen = "screen"
    keyboard = "keyboard"
    trackpad = "trackpad"
    hinge = "hinge"
    lid = "lid"
    corner = "corner"
    port = "port"
    base = "base"
    body = "body"
    unknown = "unknown"

class ObjectPartPackage(str, Enum):
    box = "box"
    package_corner = "package_corner"
    package_side = "package_side"
    seal = "seal"
    label = "label"
    contents = "contents"
    item = "item"
    unknown = "unknown"

class RiskFlag(str, Enum):
    none = "none"
    blurry_image = "blurry_image"
    cropped_or_obstructed = "cropped_or_obstructed"
    low_light_or_glare = "low_light_or_glare"
    wrong_angle = "wrong_angle"
    wrong_object = "wrong_object"
    wrong_object_part = "wrong_object_part"
    damage_not_visible = "damage_not_visible"
    claim_mismatch = "claim_mismatch"
    possible_manipulation = "possible_manipulation"
    non_original_image = "non_original_image"
    text_instruction_present = "text_instruction_present"
    user_history_risk = "user_history_risk"
    manual_review_required = "manual_review_required"

class Severity(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"
    unknown = "unknown"
