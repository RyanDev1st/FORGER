---
name: gnosis-intervention-friction-audit
description: reTruth orchestrator variation that tests whether implementation friction, adoption load, and coordination drag erase theoretical benefit.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
---

# gnosis-intervention-friction-audit

## Invocation
Use when a recommendation looks correct in theory but may fail because adoption, operations, coordination, incentives, training, compliance, migration, or maintenance costs destroy the benefit.

## Pipeline

### Step 1 — Parse Friction Frame
Extract:
- proposed intervention
- claimed upside
- adoption surface
- implementation prerequisites
- coordination actors
- operational load
- switching costs
- maintenance burden
- failure modes caused by friction

### Step 2 — Spawn Lanes
Spawn Scholar, Community, and Edge in parallel. Each lane emits friction cards plus findings.

### Step 3 — Validate
Run V1–V8:
- V1 file exists and non-empty.
- V2 at least 5 friction cards or pivot log.
- V3 no top-level refusal.
- V4 every card has source and verbatim quote.
- V5 every card names friction source.
- V6 every card names benefit erosion mechanism.
- V7 every card recommends adopt, redesign, stage, defer, or reject.
- V8 closing block present.

### Step 4 — Audit
Check URLs, quote matches, friction consistency, and Edge redundancy. Preserve failures as downgrade flags.

### Step 5 — Build Friction Map
Classify cards into:
- adoption friction
- coordination friction
- migration friction
- compliance friction
- training friction
- tooling friction
- maintenance friction
- incentive friction
- measurement friction
- rollback friction

### Step 6 — Synthesize
Return:
- theoretical benefit
- friction-adjusted benefit
- intervention redesigns
- staging sequence
- minimum viable adoption path
- stop-loss and rollback triggers

### Step 7 — Re-fan
Re-fan only when one friction class controls whether current action should proceed. One round max unless user escalates.

## Output
Return:
1. Friction-adjusted recommendation.
2. Intervention friction map.
3. Adopt/redesign/stage/defer/reject decisions.
4. Staging and rollback plan.
5. Friction hot spots.
6. Evidence appendix.

## Constraints
- No recommendation may ignore implementation friction.
- No friction card without erosion mechanism and branch action.
- Maximum four concurrent threads.
- Preserve raw evidence appendices.
