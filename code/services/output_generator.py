import os
import pandas as pd
from typing import Dict, Any
import datetime
from database import get_database

class OutputGeneratorService:
    EXPECTED_COLUMNS = [
        "user_id",
        "image_paths",
        "user_claim",
        "claim_object",
        "evidence_standard_met",
        "evidence_standard_met_reason",
        "risk_flags",
        "issue_type",
        "object_part",
        "claim_status",
        "claim_status_justification",
        "supporting_image_ids",
        "valid_image",
        "severity"
    ]

    ALLOWED_CLAIM_STATUSES = {"supported", "contradicted", "not_enough_information"}
    ALLOWED_SEVERITIES = {"none", "low", "medium", "high", "unknown"}

    def __init__(self, base_dir: str):
        # The output path should be in the dataset directory at the root
        self.output_csv_path = os.path.join(os.path.dirname(base_dir), "dataset", "output.csv")
    
    def validate_and_format_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Validates fields against expected Enums and ensures all columns exist."""
        
        # 1. Validation
        status = record.get("claim_status", "unknown").lower()
        if status not in self.ALLOWED_CLAIM_STATUSES:
            raise ValueError(f"Invalid claim_status: {status}")
            
        severity = record.get("severity", "unknown").lower()
        if severity not in self.ALLOWED_SEVERITIES:
            raise ValueError(f"Invalid severity: {severity}")

        # Ensure booleans are correctly formatted
        record["evidence_standard_met"] = str(record.get("evidence_standard_met", False)).lower()
        record["valid_image"] = str(record.get("valid_image", False)).lower()

        # Handle lists -> strings (risk_flags, supporting_image_ids)
        if isinstance(record.get("risk_flags"), list):
            record["risk_flags"] = ";".join(record["risk_flags"]) if record["risk_flags"] else "none"
            
        if isinstance(record.get("supporting_image_ids"), list):
            record["supporting_image_ids"] = ";".join(record["supporting_image_ids"])

        # 2. Schema Enforcement
        formatted_record = {}
        for col in self.EXPECTED_COLUMNS:
            formatted_record[col] = record.get(col, "")
            
        return formatted_record

    def append_to_csv(self, record: Dict[str, Any]):
        """Safely updates or appends the record into output.csv using pandas."""
        os.makedirs(os.path.dirname(self.output_csv_path), exist_ok=True)
        
        new_row = pd.DataFrame([record])
        
        if not os.path.exists(self.output_csv_path):
            new_row.to_csv(self.output_csv_path, index=False)
            return

        try:
            # Read existing
            df = pd.read_csv(self.output_csv_path, dtype=str)
            
            # Find match using primary key: user_id + image_paths
            mask = (df["user_id"] == record["user_id"]) & (df["image_paths"] == record["image_paths"])
            
            if mask.any():
                # Update existing row
                df.loc[mask, self.EXPECTED_COLUMNS] = pd.Series(record)
            else:
                # Append new row
                df = pd.concat([df, new_row], ignore_index=True)
                
            # Write atomically (write to temp file, then replace)
            temp_path = self.output_csv_path + ".tmp"
            df.to_csv(temp_path, index=False)
            os.replace(temp_path, self.output_csv_path)
            
        except Exception as e:
            # Fallback if parsing fails for some reason
            print(f"Error merging output CSV: {e}")
            new_row.to_csv(self.output_csv_path, mode='a', header=False, index=False)

    async def store_in_mongodb(self, record: Dict[str, Any]):
        """Persists the prediction into MongoDB."""
        db = get_database()
        if db is None:
            return
            
        predictions_col = db.predictions
        
        mongo_doc = {
            "user_id": record["user_id"],
            "image_paths": record["image_paths"],
            "prediction": record["claim_status"],
            "confidence": record.get("confidence", 0.0), # Optional field for db only
            "risk_flags": record["risk_flags"].split(";") if isinstance(record["risk_flags"], str) else record["risk_flags"],
            "issue_type": record["issue_type"],
            "object_part": record["object_part"],
            "severity": record["severity"],
            "timestamp": datetime.datetime.utcnow()
        }
        
        # Upsert based on user_id and image_paths
        await predictions_col.update_one(
            {
                "user_id": mongo_doc["user_id"], 
                "image_paths": mongo_doc["image_paths"]
            },
            {"$set": mongo_doc},
            upsert=True
        )

# Initialize a singleton-like service (requires BASE_DIR to be passed or constructed)
def get_output_generator(base_dir: str) -> OutputGeneratorService:
    return OutputGeneratorService(base_dir)
