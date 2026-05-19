# Variation Pipeline — Method Stack

Parent: ARCHITECTURE.md

## Status
Created v25 variation centered on method-separated synthesis.

## Pipeline
1. Parse brief into candidate evidence methods, likely method conflicts, acceptable inference strength, and method failure modes.
2. Spawn three isolated lanes.
3. Force each lane to emit method cards instead of generic findings.
4. Validate method class, quote, method strength, failure mode, and transfer limit.
5. Audit URLs, quote matches, method labels, and Edge redundancy.
6. Build method stack:
   - experimental
   - quasi-experimental
   - observational
   - benchmark
   - incident report
   - expert practice
   - archival/historical
   - analogue transfer
   - theory/model
7. Synthesize only after method reconciliation.
8. Re-fan one method conflict if it controls final synthesis.

## WHY
Method Stack improves reTruth by preventing evidence-method collapse. It asks “what kind of knowing is this?” before “what does it prove?”

## Difference From Original
Original architecture separates lanes by source ecology. Method Stack separates findings by inference method, then decides which claims can be safely merged.

## Expected Benefit
- Fewer inference transfer errors.
- Clearer benchmark-versus-field boundaries.
- Better causal caution.
- More honest confidence ratings.

## Tradeoff
More complex synthesis and possible slower convergence. Best for empirical, technical, medical, policy, or performance questions; less useful for simple descriptive topics.

## Main Risk
Over-partitioning evidence until synthesis becomes too cautious. Mitigation: merge across methods when transfer limits are explicit and compatible.

## Next Variation Ideas
1. Counterfactual Lab: stress-test findings under alternate assumptions.
2. Threshold Finder: identify decision thresholds where recommendation flips.
3. Intervention Backcast: start from desired outcome and trace backward to evidence-backed levers.
