# Variation Pipeline — Provenance Chain

Parent: ARCHITECTURE.md

## Status
Created v35 variation centered on tracing claim origin, mutation trail, relay layers, and fidelity loss.

## Pipeline
1. Parse brief into central claim, likely origin type, repeated downstream forms, suspected relay layers, mutation risk, evidence stakes, and need for origin recovery.
2. Spawn three isolated lanes.
3. Force each lane to emit provenance cards instead of generic findings.
4. Validate claim stage, mutation or fidelity risk, quote, chain relation, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, chronology, and Edge redundancy.
6. Build provenance map:
   - origin source
   - early relay
   - stable restatement
   - mutated summary
   - citation laundering
   - orphaned claim
   - fidelity-preserving chain
   - broken provenance
7. Synthesize by origin confidence and discount echoed downstream claims.
8. Re-fan one origin uncertainty if it controls recommendation strength.

## WHY
Provenance Chain improves reTruth by stopping repeated claims from masquerading as independent evidence. Many strong-sounding consensus statements are downstream copies, scope-crept summaries, or claims detached from their original conditions. This drift makes origin and mutation visible before synthesis.

## Difference From Original
Original architecture preserves consensus counts while discarding only true redundancy. Provenance Chain goes deeper: it distinguishes independent convergence from shared ancestry, copied lore, and citation laundering.

## Expected Benefit
- Less echo-chamber inflation.
- Better recovery of original evidence scope.
- Stronger handling of copied best practices and overclaimed reviews.
- Clearer downgrade path for orphaned claims.

## Tradeoff
Can spend effort tracing lineage instead of discovering new evidence. Best for repeated claims, best-practice lore, controversial metrics, academic consensus summaries, and advice that seems copied across many sources.

## Main Risk
Over-penalizing legitimate repeated consensus. Mitigation: preserve `fidelity-preserving chain` and `stable restatement` categories where downstream sources accurately retain original scope.

## Next Variation Ideas
1. Adversarial Benchmark: test synthesis against strongest plausible attack cases.
2. Stakeholder Collision Map: surface where groups optimize against each other.
3. Blind Spot Inventory: explicitly catalog absent evidence and unreachable source zones.
