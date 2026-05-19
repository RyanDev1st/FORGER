# Variation Pipeline — Consensus Ladder

Parent: ARCHITECTURE.md

## Status
Created v19 variation centered on claim-tier ranking by convergence depth.

## Pipeline
1. Parse brief into claim clusters and uncertainty tolerance.
2. Spawn three isolated lanes.
3. Force each lane to emit consensus cards.
4. Validate cluster, independence, contradiction pressure, quote, and source.
5. Audit links, quotes, and redundancy.
6. Build ladder tiers from isolated to robust and overfit consensus.
7. Synthesize with tier-weighted claims.
8. Re-fan one ambiguous cluster if needed.

## WHY
Consensus Ladder improves reTruth by separating deep independent agreement from shallow repetition. It gives user stronger sense of what is truly robust versus merely popular.

## Difference From Original
Original architecture preserves consensus counts. Consensus Ladder interprets what kind of consensus those counts represent.

## Expected Benefit
- Better robustness ranking.
- False-consensus warnings.
- Clearer monitoring of emerging claims.
- More honest answer tiers.

## Tradeoff
More classification overhead. Best for disputed or high-stakes claims, less useful for simple fact lookup.
