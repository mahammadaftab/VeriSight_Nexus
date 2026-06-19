import json
import os
import hashlib
from typing import Any, Optional

class CacheService:
    def __init__(self, cache_dir: str = ".cache"):
        self.cache_dir = cache_dir
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
            
    def _generate_key(self, prefix: str, data: str) -> str:
        # Create a deterministic hash for the input data
        hash_val = hashlib.md5(data.encode('utf-8')).hexdigest()
        return os.path.join(self.cache_dir, f"{prefix}_{hash_val}.json")
        
    def get(self, prefix: str, data: str) -> Optional[dict]:
        filepath = self._generate_key(prefix, data)
        if os.path.exists(filepath):
            try:
                with open(filepath, 'r') as f:
                    return json.load(f)
            except:
                pass
        return None
        
    def set(self, prefix: str, data: str, result: dict):
        filepath = self._generate_key(prefix, data)
        with open(filepath, 'w') as f:
            json.dump(result, f)
