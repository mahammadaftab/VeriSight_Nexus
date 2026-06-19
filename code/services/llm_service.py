import os
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import Type, TypeVar, Optional, List
from PIL import Image
from dotenv import load_dotenv
import time
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type

load_dotenv()

T = TypeVar('T', bound=BaseModel)

class LLMService:
    def __init__(self):
        # We assume OPENAI_API_KEY or GEMINI_API_KEY or GOOGLE_API_KEY is available.
        # Since I proposed Gemini, we will use the genai SDK.
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        self.client = genai.Client(api_key=api_key)
        self.default_model = "gemini-2.5-flash"
    
    @retry(
        wait=wait_exponential(multiplier=2, min=4, max=60), 
        stop=stop_after_attempt(7),
        reraise=True
    )
    def generate_structured(self, prompt: str, schema: Type[T], images: Optional[List[Image.Image]] = None) -> T:
        """
        Generates a structured response conforming to the provided Pydantic schema with exponential backoff for 429 errors.
        """
        contents = []
        if images:
            for img in images:
                contents.append(img)
        
        contents.append(prompt)
        
        try:
            response = self.client.models.generate_content(
                model=self.default_model,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                    temperature=0.0 # Deterministic
                )
            )
            
            # The SDK will automatically parse to the schema if provided, but we can also parse the raw JSON.
            # In google-genai, if response_schema is provided, response.text contains the JSON.
            return schema.model_validate_json(response.text)
            
        except Exception as e:
            print(f"Error calling LLM: {e}")
            raise e
