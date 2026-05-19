---
name: gnosis-cost-of-error-matrix
description: reTruth orchestrator variation that allocates evidence effort and synthesis caution by asymmetric decision error costs.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
displayName: Gnosis Cost of Error Matrix
---

# gnosis-cost-of-error-matrix

## Invocation
Use when wrong yes and wrong no have different costs, so research depth, evidence weighting, and recommendation style should follow downside asymmetry instead of raw uncertainty alone.

## Pipeline

### Step 1 — Parse Error Frame
Extract:
- central question
- action under consideration
- false-yes cost
- false-no cost
- reversibility
- exposure scope
- decision deadline

### Step 2 — Spawn Lanes
Spawn Scholar, Community, and Edge in parallel. Each lane emits error cards plus findings.

### Step 3 — Validate
Run V1–V8:
- V1 file exists and non-empty.
- V2 at least 5 error cards or pivot log.
- V3 no top-level refusal.
- V4 every card has source and verbatim quote.
- V5 every card names error direction.
- V6 every card names cost severity.
- V7 every card recommends allow, hedge, delay, or block.
- V8 closing block present.

### Step 4 — Audit
Check URLs, quote matches, cost-direction consistency, and Edge redundancy. Preserve failures as downgrade flags.

### Step 5 — Build Error Matrix
Classify cards into:
- false-yes catastrophic
- false-yes expensive
- false-no catastrophic
- false-no expensive
- reversible trial zone
- asymmetric caution zone
- evidence gap zone
- low-cost exploration zone

### Step 6 — Synthesize
Return:
- safest current action
- strongest case for action
- strongest case against action
- which error direction dominates
- evidence still needed to reduce dominant error cost

### Step 7 — Re-fan
Re-fan only decision-controlling error zone. One round max unless user escalates.

## Output
Return:
1. Cost-of-error matrix.
2. Allow/hedge/delay/block recommendation.
3. Dominant error direction.
4. Current synthesis.
5. Evidence gaps worth paying for.
6. Evidence appendix.

## Constraints
- No symmetric treatment when downside is asymmetric.
- No action recommendation without naming dominant error direction.
- Maximum four concurrent threads.
- Preserve raw evidence appendices.
