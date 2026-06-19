# VeriSight Nexus — Error Analysis & Auto-Evaluation Report

## Performance Metrics (Claim Status)

- **Accuracy**: 15.00%
- **Macro F1 Score**: 0.087
- **Weighted Precision**: 0.022
- **Weighted Recall**: 0.150

### Per-Class Breakdown
- **CONTRADICTED**: Precision=0.000, Recall=0.000, F1=0.000 (Support: 5.0)
- **NOT_ENOUGH_INFORMATION**: Precision=0.150, Recall=1.000, F1=0.261 (Support: 3.0)
- **SUPPORTED**: Precision=0.000, Recall=0.000, F1=0.000 (Support: 12.0)

### Confusion Matrix
```text
Labels: ['contradicted', 'not_enough_information', 'supported']
[[ 0  5  0]
 [ 0  3  0]
 [ 0 12  0]]
```

## Error Analysis

Total Errors Found: **17**

### High-Level Trends
- **Most Difficult Issue Type**: dent
- **Most Difficult Object Type**: car

### Error Log (Sample of False Predictions)
#### User: `user_001` (car - dent)
- **Expected**: supported
- **Predicted**: not_enough_information
- **Agent Rationale**: An error occurred during automated processing.

#### User: `user_004` (car - crack)
- **Expected**: supported
- **Predicted**: not_enough_information
- **Agent Rationale**: An error occurred during automated processing.

#### User: `user_007` (car - broken_part)
- **Expected**: supported
- **Predicted**: not_enough_information
- **Agent Rationale**: An error occurred during automated processing.

#### User: `user_005` (car - scratch)
- **Expected**: contradicted
- **Predicted**: not_enough_information
- **Agent Rationale**: An error occurred during automated processing.

#### User: `user_003` (car - dent)
- **Expected**: supported
- **Predicted**: not_enough_information
- **Agent Rationale**: An error occurred during automated processing.

## Recommended Improvements
1. **Vision Inspection Prompting**: Refine zero-shot prompting for the most difficult issue types to improve Recall.
2. **Contradiction Thresholds**: Adjust the Confidence Engine weights. Risk confidence is currently heavily penalizing ambiguous claims.
3. **Coverage Enhancements**: Evidence Coverage currently assigns 100% implicitly if an image is valid. Implementing explicit multimodal string matching against `evidence_requirements.csv` will drastically improve false positives.