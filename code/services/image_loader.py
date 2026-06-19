import os
from PIL import Image
from typing import Optional, List

def load_image(image_path: str, base_dir: str = "../") -> Optional[Image.Image]:
    """Loads a PIL image from a relative path."""
    full_path = os.path.join(base_dir, image_path.replace("\\", "/"))
    try:
        if os.path.exists(full_path):
            img = Image.open(full_path)
            img.load() # Ensure image is fully loaded
            return img
    except Exception as e:
        print(f"Error loading image {full_path}: {e}")
    return None

def extract_image_id(image_path: str) -> str:
    """Extracts the image ID (filename without extension) from a path."""
    filename = os.path.basename(image_path.replace("\\", "/"))
    return os.path.splitext(filename)[0]
