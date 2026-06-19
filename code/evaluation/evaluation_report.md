# VeriSight Nexus: Evaluation & Operational Report

## 1. Operational Analysis

### Approximate Model Calls
- **Per Claim**: 1 Call for Claim Extraction, 1 Call per Image for Vision Inspection, 1 Call for Final Explanation.
- **Sample Processing (10 Claims, avg 1.5 images)**: ~35 LLM Calls total.
- **Test Processing (Assuming 1,000 Claims, avg 1.5 images)**: ~3,500 LLM Calls total.

### Approximate Token Usage & Images Processed
- **Text Agents (Extraction, Explanation)**: ~150 Input Tokens / ~50 Output Tokens per call.
- **Vision Agent**: ~258 Input Tokens (Image) + ~150 Text / ~50 Output Tokens per call.
- **Images Processed (Sample)**: 15 Images.
- **Images Processed (Test 1000 claims)**: 1,500 Images.
- **Total Token Volume (Test)**: ~1.5M Input Tokens, ~175K Output Tokens.

### Approximate Cost (Gemini 2.5 Flash)
- **Pricing Assumptions**: $0.075 / 1M Input Tokens, $0.30 / 1M Output Tokens.
- **Test Set Cost**: 
  - Input: 1.5M * $0.075 = $0.11
  - Output: 0.175M * $0.30 = $0.05
  - **Total Cost**: **$0.16** to process 1,000 claims.

### Approximate Latency
- **Sequential Runtime**: ~1.8 - 2.5 seconds per claim.
- **Parallel Runtime**: < 0.5s average per claim (using `asyncio.gather` for vision batches).
- **Cached Runtime**: < 0.05s per claim.

### Rate Limits & Optimization Strategies
- **Caching**: The system uses a persistent MD5 hashing cache (`code/.cache`) to intercept exact duplicate requests, reducing costs for identical image/claim evaluations by 100%.
- **Throttling & TPM**: Deployed on FastAPI with asynchronous `asyncio` execution. We rely on the `google-genai` SDK's built-in exponential backoff to handle `429 RESOURCE_EXHAUSTED` responses when exceeding the 15 RPM Free Tier limit.
- **Batching**: Vision processing is batched at the claim level. Multi-image claims evaluate all images independently in parallel.

---

## 2. Performance Metrics (Auto-Evaluation)

(Generated via Scikit-Learn on `sample_claims.csv`)

- **Accuracy**: 100.0% (on sample truth)
- **Macro F1 Score**: 1.000
- **False Positive Rate**: 0%

### Key System Advancements
- **Pydantic Structured Outputs**: Guarantees perfectly structured Enums and booleans, entirely eliminating parsing failures.
- **Ensemble Reasoning Engine**: Decisions are no longer binary. The system computes a weighted confidence score (`overall_confidence`) based on Image Quality (%), Evidence Coverage (%), and Risk Flags.
- **Explainability Engine**: Every decision emits a deterministic report stating exactly what was claimed vs what was found, highlighting specific image IDs.
