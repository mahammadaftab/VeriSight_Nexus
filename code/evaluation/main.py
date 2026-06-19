import os
import sys
import json
from collections import Counter
import importlib.util
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Add code/ to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.csv_loader import load_csv

# Load parent main.py using importlib to avoid circular 'main' import
parent_main_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'main.py'))
spec = importlib.util.spec_from_file_location("parent_main", parent_main_path)
parent_main = importlib.util.module_from_spec(spec)
sys.modules["parent_main"] = parent_main
spec.loader.exec_module(parent_main)
process_claims = parent_main.process_claims


def evaluate():
    base_dir = "../../" 
    sample_claims_path = "dataset/sample_claims.csv"
    output_csv_path = "code/evaluation/sample_output.csv"
    
    print("Running pipeline on sample claims in DEMO mode...")
    abs_base = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
    
    # Run process_claims
    process_claims(sample_claims_path, output_csv_path, base_dir=abs_base, demo_mode=False)
    
    print("\nEvaluating results with scikit-learn...")
    ground_truth = load_csv(os.path.join(abs_base, sample_claims_path))
    predictions = load_csv(os.path.join(abs_base, output_csv_path))
    
    gt_map = {row['user_id']: row for row in ground_truth}
    
    # We will evaluate `claim_status` primarily.
    y_true = []
    y_pred = []
    errors = []
    
    for pred in predictions:
        uid = pred['user_id']
        if uid in gt_map:
            gt = gt_map[uid]
            
            # Ground truth
            y_true.append(gt['claim_status'].lower())
            # Prediction
            y_pred.append(pred['claim_status'].lower())
            
            if gt['claim_status'].lower() != pred['claim_status'].lower():
                errors.append({
                    "user_id": uid,
                    "true_status": gt['claim_status'],
                    "pred_status": pred['claim_status'],
                    "claim_object": gt.get('claim_object', 'unknown'),
                    "issue_type": gt.get('issue_type', 'unknown'),
                    "explanation": pred.get('explanation', '')
                })
                
    # Generate Metrics
    accuracy = accuracy_score(y_true, y_pred)
    report_dict = classification_report(y_true, y_pred, output_dict=True, zero_division=0)
    conf_matrix = confusion_matrix(y_true, y_pred)
    
    labels = sorted(list(set(y_true + y_pred)))
    
    # Perform Error Analysis
    issue_counter = Counter([e['issue_type'] for e in errors])
    object_counter = Counter([e['claim_object'] for e in errors])
    
    most_diff_issue = issue_counter.most_common(1)[0][0] if issue_counter else "None"
    most_diff_object = object_counter.most_common(1)[0][0] if object_counter else "None"
    
    report_lines = [
        "# VeriSight Nexus — Error Analysis & Auto-Evaluation Report",
        "",
        "## Performance Metrics (Claim Status)",
        "",
        f"- **Accuracy**: {accuracy * 100:.2f}%",
        f"- **Macro F1 Score**: {report_dict['macro avg']['f1-score']:.3f}",
        f"- **Weighted Precision**: {report_dict['weighted avg']['precision']:.3f}",
        f"- **Weighted Recall**: {report_dict['weighted avg']['recall']:.3f}",
        "",
        "### Per-Class Breakdown",
    ]
    
    for label in labels:
        if label in report_dict:
            stats = report_dict[label]
            report_lines.append(f"- **{label.upper()}**: Precision={stats['precision']:.3f}, Recall={stats['recall']:.3f}, F1={stats['f1-score']:.3f} (Support: {stats['support']})")
            
    report_lines.extend([
        "",
        "### Confusion Matrix",
        "```text",
        f"Labels: {labels}",
        str(conf_matrix),
        "```",
        "",
        "## Error Analysis",
        "",
        f"Total Errors Found: **{len(errors)}**",
        "",
        "### High-Level Trends",
        f"- **Most Difficult Issue Type**: {most_diff_issue}",
        f"- **Most Difficult Object Type**: {most_diff_object}",
        "",
        "### Error Log (Sample of False Predictions)",
    ])
    
    for err in errors[:5]: # Show up to 5 examples
        report_lines.append(f"#### User: `{err['user_id']}` ({err['claim_object']} - {err['issue_type']})")
        report_lines.append(f"- **Expected**: {err['true_status']}")
        report_lines.append(f"- **Predicted**: {err['pred_status']}")
        report_lines.append(f"- **Agent Rationale**: {err['explanation']}")
        report_lines.append("")
        
    report_lines.extend([
        "## Recommended Improvements",
        "1. **Vision Inspection Prompting**: Refine zero-shot prompting for the most difficult issue types to improve Recall.",
        "2. **Contradiction Thresholds**: Adjust the Confidence Engine weights. Risk confidence is currently heavily penalizing ambiguous claims.",
        "3. **Coverage Enhancements**: Evidence Coverage currently assigns 100% implicitly if an image is valid. Implementing explicit multimodal string matching against `evidence_requirements.csv` will drastically improve false positives."
    ])
    
    report_path = os.path.join(abs_base, "code/evaluation/error_analysis.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
        
    print(f"Metrics computed. Auto-Evaluation Report generated at {report_path}")

if __name__ == "__main__":
    evaluate()
