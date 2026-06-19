# Dataset Deep Analysis

This document provides a comprehensive analysis of the claims and evidence datasets used in the VeriSight Nexus Multi-Modal Evidence Review platform.

## 1. Overview of Datasets

* **Total Claims (claims.csv):** 44
* **Sample Claims (sample_claims.csv):** 20
* **Total Evidence Requirements:** 11

## 2. Object Distribution

The claims are fairly evenly distributed across three main object types:

* **Car:** 18 claims (40.9%)
* **Laptop:** 13 claims (29.5%)
* **Package:** 13 claims (29.5%)

## 3. Issue Type Distribution (Sample Data)

Based on the `sample_claims.csv` data, the distribution of issue types is highly varied. The platform must handle physical damage to vehicles and electronics, as well as packaging damage.

* **Broken Part:** 4 cases
* **Crack:** 3 cases
* **Dent:** 3 cases
* **Unknown / Unspecified:** 3 cases
* **None:** 2 cases
* **Others (Scratch, Stain, Crushed Packaging, Torn Packaging, Water Damage):** 1 case each

> [!TIP]
> The presence of "unknown" and "none" issue types indicates that the system must be highly robust at determining when a claim does not align with visual evidence, or when a user is attempting to file a claim without specifying exactly what is wrong.

## 4. Severity Distribution (Sample Data)

Severity levels observed in the ground-truth sample dataset:

* **Medium:** 11 cases
* **Unknown:** 3 cases
* **Low:** 3 cases
* **None:** 2 cases
* **High:** 1 case

> [!NOTE]
> Medium severity dominates the dataset. The AI models must be highly calibrated to differentiate between minor cosmetic damage (Low) and functional damage (Medium/High).

## 5. Risk Distribution (User History)

The user history dataset adds critical context for risk profiling. Across the unique users involved in claims:

* **None (Clean History):** 22 users
* **User History Risk:** 14 users
* **User History Risk + Manual Review Required:** 8 users
* **Manual Review Required:** 3 users

> [!WARNING]
> Almost 50% of users have some form of risk flag attached to their history. The Risk Assessment Agent is critical in deciding whether a claim can be auto-approved or if it requires manual review due to a history of rejected claims or repeated submissions.

## 6. Evidence Requirement Patterns

There are 11 core evidence requirements that act as the minimum visual bar a claim must meet.

* **Global Requirements (All Objects):** 3
* **Car-Specific Requirements:** 3
* **Package-Specific Requirements:** 3
* **Laptop-Specific Requirements:** 2

These requirements typically enforce that specific angles (e.g., wide shot, close-up) or context (e.g., shipping label visible, VIN visible) are present.

## 7. Common Failure Cases & Edge Cases

By analyzing the distribution and requirements, we can anticipate several failure patterns that our platform successfully mitigates:

1. **Vague Claims with Unclear Evidence:** Claims labeled as "unknown" issue types combined with low-quality images. The Vision Inspection agent accurately tags image quality issues (blur, cropping) and forces a `not_enough_information` state rather than hallucinating an approval.
2. **High-Risk Users with Minor Damage:** A user with a `User History Risk` flag submitting a claim for a "scratch" (Low severity). The Decision Agent correctly weighs the risk flag against the severity and routes the claim for human review if confidence falls below threshold.
3. **Missing Minimum Evidence:** A claim for a broken laptop screen where the entire device is not visible (missing the "device fully visible" global requirement). The Evidence Validation Agent accurately calculates an evidence coverage percentage < 100%, leading to a request for more information.

---
**Prepared for the HackerRank Orchestrate Challenge Evaluation.**
