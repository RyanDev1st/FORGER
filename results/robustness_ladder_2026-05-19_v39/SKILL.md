---
name: gnosis-robustness-ladder
description: reTruth orchestrator variation that grades claims by how many independent stress classes they survive before synthesis.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
displayName: Gnosis Robustness Ladder
---

# gnosis-robustness-ladder

## Invocation
Use when claims need tiered confidence: not just supported or unsupported, but robust across methods, contexts, time, stakeholders, mechanisms, and adversarial tests.

## Pipeline

### Step 1 — Parse Robustness Frame
Extract:
- central claim
- candidate recommendation
- required confidence tier
- stress classes to test
- failure tolerance
- decision stakes
- acceptable fallback tier

### Step 2 — Spawn Lanes
Spawn Scholar, Community, and Edge in parallel. Each lane emits robustness cards plus findings.

### Step 3 — Validate
Run V1–V8:
- V1 file exists and non-empty.
- V2 at least 5 robustness cards or pivot log.
- V3 no top-level refusal.
- V4 every card has source and verbatim quote.
- V5 every card names stress class.
- V6 every card names pass, partial, or fail result.
- V7 every card recommends promote, hold, demote, or discard.
- V8 closing block present.

### Step 4 — Audit
Check URLs, quote matches, tier consistency, and Edge redundancy. Preserve failures as downgrade flags.

### Step 5 — Build Robustness Ladder
Classify cards into:
- tier 0 unsupported
- tier 1 single-source support
- tier 2 multi-source support
- tier 3 method-robust
- tier 4 context-robust
- tier 5 adversarially robust
- tier 6 action-grade
- demotion trigger

### Step 6 — Synthesize
Return:
- claim tier by ladder level
- claims safe for action
- claims safe only for hypothesis
- demotion triggers
- minimum test to promote each important claim

### Step 7 — Re-fan
Re-fan only when one promotion or demotion would change action-grade recommendation. One round max unless user escalates.

## Output
Return:
1. Robustness ladder.
2. Promote/hold/demote/discard decisions.
3. Current synthesis by claim tier.
4. Demotion triggers.
5. Promotion tests.
6. Evidence appendix.

## Constraints
- No action-grade recommendation below required tier.
- No tier promotion without named stress class survived.
- Maximum four concurrent threads.
- Preserve raw evidence appendices.
