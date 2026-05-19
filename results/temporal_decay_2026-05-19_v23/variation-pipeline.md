# Variation Pipeline — Temporal Decay

Parent: ARCHITECTURE.md

## Status
Created v23 variation centered on time-weighted evidence and reversal risk.

## Pipeline
1. Parse brief into relevant time horizon, evidence half-life, regime shifts, and freshness sensitivity.
2. Spawn three isolated lanes.
3. Force each lane to emit decay cards instead of generic findings.
4. Validate time marker, freshness class, quote, durability or decay reason, and reversal trigger.
5. Audit URLs, quote matches, date extraction, freshness consistency, and Edge redundancy.
6. Build time map:
   - durable baseline
   - current but volatile
   - aging evidence
   - stale but still cited
   - recently reversed
   - cyclical pattern
   - regime-shift dependent
   - update-needed unknown
7. Synthesize time-weighted claims.
8. Re-fan one stale-or-current dispute if needed.

## WHY
Temporal Decay improves reTruth by preventing stale but authoritative sources from dominating current synthesis. It separates durable knowledge from expired operational lore and volatile current signals.

## Difference From Original
Original architecture validates source quality and quote fidelity. Temporal Decay adds temporal fitness: whether evidence is still valid for the user's time horizon.

## Expected Benefit
- Better current-state answers.
- Explicit stale-evidence downgrades.
- Clear refresh triggers.
- Better handling of fast-moving technical and policy domains.

## Tradeoff
Older evidence needs extra justification instead of automatic inclusion. Best for fast-changing or historically cyclical topics; less useful for timeless facts.

## Main Risk
Overvaluing recency and discarding durable older work. Mitigation: old evidence can remain high-weight if durability reason is explicit.

## Next Variation Ideas
1. Stakeholder Prism: synthesize by affected party and incentive position.
2. Method Stack: separate claims by evidence method before merging.
3. Counterfactual Lab: stress-test findings under alternate assumptions.
