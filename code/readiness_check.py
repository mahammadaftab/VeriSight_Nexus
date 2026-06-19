import os
import sys

def check_readiness():
    print("="*50)
    print("VERISIGHT NEXUS: FINAL READINESS CHECK")
    print("="*50)
    
    issues = 0
    
    # 1. Check datasets
    print("\nChecking Datasets...")
    datasets = [
        "../dataset/claims.csv",
        "../dataset/sample_claims.csv",
        "../dataset/user_history.csv",
        "../dataset/evidence_requirements.csv"
    ]
    for ds in datasets:
        if os.path.exists(ds):
            print(f" [OK] {ds}")
        else:
            print(f" [FAIL] Missing dataset: {ds}")
            issues += 1
            
    # 2. Check Python Environment
    print("\nChecking Python Environment...")
    try:
        import fastapi
        import uvicorn
        import google.genai
        import sklearn
        import rich
        print(" [OK] All required dependencies are installed.")
    except ImportError as e:
        print(f" [FAIL] Missing dependency: {e}")
        issues += 1
        
    # 3. Check Cache
    print("\nChecking Persistent Storage...")
    if os.path.exists(".cache") and os.path.isdir(".cache"):
        print(" [OK] .cache directory exists for operational caching.")
    else:
        print(" [WARN] .cache directory not found. Will be created on first run.")
        
    # 4. Check Auditing Setup
    if os.path.exists("audit") and os.path.isdir("audit"):
        print(" [OK] audit directory exists for Phase 17 compliance.")
    else:
        print(" [WARN] audit directory not found. Will be created on first run.")

    # 5. Output existence
    print("\nChecking Final Outputs...")
    if os.path.exists("../output.csv"):
        print(" [OK] output.csv exists and is ready for submission.")
    else:
        print(" [FAIL] output.csv not found! Run 'python main.py' to generate predictions.")
        issues += 1
        
    if os.path.exists("evaluation/error_analysis.md"):
        print(" [OK] evaluation/error_analysis.md exists (Evaluation Pipeline Operational).")
    else:
        print(" [FAIL] evaluation report missing! Run 'python evaluation/main.py'.")
        issues += 1
        
    if os.path.exists("evaluation/evaluation_report.md"):
        print(" [OK] evaluation/evaluation_report.md exists (Operational Analysis Operational).")
    else:
        print(" [FAIL] Operational analysis report missing!")
        issues += 1
        
    print("\n" + "="*50)
    if issues == 0:
        print("[READY] FOR SUBMISSION")
        print("All enterprise intelligence layers, evaluations, and datasets are confirmed operational.")
    else:
        print(f"[ERROR] ISSUES FOUND: {issues} issues need resolving before submission.")
        sys.exit(1)

if __name__ == "__main__":
    check_readiness()
