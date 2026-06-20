import os
import json
import base64
from io import BytesIO
from pydantic import BaseModel
from typing import Type, TypeVar, Optional, List
from PIL import Image
from dotenv import load_dotenv
from tenacity import retry, wait_exponential, stop_after_attempt
from openai import OpenAI

load_dotenv()

T = TypeVar('T', bound=BaseModel)

class LLMService:
    def __init__(self):
        api_key = os.environ.get("OPENROUTER_API_KEY")
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )
        # Using OpenRouter's model ID format
        self.default_model = "google/gemini-2.5-flash"
    
    @retry(
        wait=wait_exponential(multiplier=2, min=4, max=60), 
        stop=stop_after_attempt(7),
        reraise=True
    )
    def generate_structured(self, prompt: str, schema: Type[T], images: Optional[List[Image.Image]] = None) -> T:
        """
        Generates a structured response conforming to the provided Pydantic schema using OpenRouter.
        """
        # Inject schema requirement into the prompt for maximum compatibility across OpenRouter models
        schema_json = json.dumps(schema.model_json_schema(), indent=2)
        full_prompt = f"{prompt}\n\nYou MUST return ONLY valid JSON. Your JSON response must perfectly match this JSON Schema:\n{schema_json}"
        
        content_array = [{"type": "text", "text": full_prompt}]
        
        if images:
            for img in images:
                buffered = BytesIO()
                # Ensure compatibility for jpeg
                if img.mode != "RGB":
                    img = img.convert("RGB")
                img.save(buffered, format="JPEG", quality=85)
                base64_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
                content_array.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                })
        
        try:
            response = self.client.chat.completions.create(
                model=self.default_model,
                messages=[
                    {"role": "user", "content": content_array}
                ],
                response_format={"type": "json_object"},
                temperature=0.0
            )
            
            result_text = response.choices[0].message.content
            return schema.model_validate_json(result_text)
            
        except Exception as e:
            print(f"Error calling LLM via OpenRouter: {e}")
            raise e
