import json
import os
from datetime import datetime
from typing import Dict, Any

class AuditService:
    def __init__(self, audit_dir: str = "audit"):
        self.audit_dir = audit_dir
        os.makedirs(self.audit_dir, exist_ok=True)
        
    def log_claim(self, claim_id: str, data: Dict[str, Any]) -> str:
        """Saves a comprehensive audit trail for a processed claim."""
        timestamp = datetime.utcnow().isoformat() + "Z"
        data['audit_timestamp'] = timestamp
        
        file_path = os.path.join(self.audit_dir, f"audit_{claim_id}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)
            
        return file_path
        
    def get_audit(self, claim_id: str) -> Dict[str, Any]:
        """Retrieves an audit trail for a claim."""
        file_path = os.path.join(self.audit_dir, f"audit_{claim_id}.json")
        if not os.path.exists(file_path):
            return {"error": "Audit not found."}
            
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
