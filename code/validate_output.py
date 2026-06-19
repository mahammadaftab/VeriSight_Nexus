import pandas as pd
import sys
import os
from typing import List, Dict

# HackerRank Defined Schemas
VALID_CLAIM_STATUSES = {"supported", "contradicted", "not_enough_information"}
VALID_SEVERITIES = {"low", "medium", "high", "none", "unknown"}

# As per problem statement schema
REQUIRED_COLUMNS = [
    "user_id",
    "image_paths",
    "claim_status",
    "issue_type",
    "object_part",
    "evidence_standard_met",
    "severity",
    "risk_flags"
]

def validate_output(file_path: str = "../output.csv") -> bool:
    print("="*60)
    print("VERISIGHT NEXUS: OUTPUT VALIDATION ENGINE (PHASE 24)")
    print("="*60)

    if not os.path.exists(file_path):
        print(f"[FAIL] Output file not found: {file_path}")
        return False
        
    df = pd.read_csv(file_path)
    print(f"[INFO] Loaded {len(df)} rows for validation.")
    
    issues = 0
    
    # 1. Check required columns
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        print(f"[FAIL] Missing required columns: {missing_cols}")
        issues += 1
    else:
        print("[OK] All required columns present.")
        
    # 2. Validate claim_status
    if "claim_status" in df.columns:
        invalid_statuses = df[~df["claim_status"].isin(VALID_CLAIM_STATUSES)]
        if not invalid_statuses.empty:
            print(f"[FAIL] Found {len(invalid_statuses)} rows with invalid claim_status.")
            print(f"       Valid values: {VALID_CLAIM_STATUSES}")
            issues += 1
        else:
            print("[OK] All claim_status values are valid.")
            
    # 3. Validate severity
    if "severity" in df.columns:
        invalid_severities = df[~df["severity"].isin(VALID_SEVERITIES)]
        if not invalid_severities.empty:
            print(f"[FAIL] Found {len(invalid_severities)} rows with invalid severity.")
            print(f"       Valid values: {VALID_SEVERITIES}")
            issues += 1
        else:
            print("[OK] All severity values are valid.")
            
    # 4. Check for null values in critical fields
    critical_cols = ["user_id", "claim_status", "issue_type"]
    for col in critical_cols:
        if col in df.columns:
            null_count = df[col].isnull().sum()
            if null_count > 0:
                print(f"[FAIL] Column '{col}' contains {null_count} null/NaN values.")
                issues += 1
                
    # 5. Check Output Types
    if "user_id" in df.columns and not pd.api.types.is_string_dtype(df["user_id"]):
        # It's okay if they are purely numbers, but they should be strings
        df["user_id"] = df["user_id"].astype(str)
        print("[WARN] user_id column is not strictly string typed. Converted to string.")
        
    print("="*60)
    if issues == 0:
        print("[PASS] OUTPUT VALIDATION SUCCESSFUL. FILE IS SUBMISSION READY.")
        return True
    else:
        print(f"[ERROR] OUTPUT VALIDATION FAILED WITH {issues} ISSUES.")
        return False

if __name__ == "__main__":
    success = validate_output()
    sys.exit(0 if success else 1)
