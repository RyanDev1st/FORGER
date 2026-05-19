# Variation Pipeline — Provenance Graph

Parent: ARCHITECTURE.md

## Status
Created v10 variation centered on source dependency analysis.

## Pipeline
1. Parse brief into claim and independence threshold.
2. Spawn three isolated lanes.
3. Force each finding to include source ancestry and independence status.
4. Validate quote, link, ancestry, and derivation path.
5. Build provenance graph across lanes.
6. Detect false consensus from shared roots.
7. Synthesize with independence-weighted evidence.
8. Re-fan one lane if primary roots remain missing.

## WHY
Provenance Graph improves reTruth by separating true corroboration from repeated citation. It helps avoid source laundering, vendor echo, lore loops, and academic citation cascades.

## Difference From Original
Original synthesis preserves consensus counts. This variation qualifies consensus by ancestry, so five sources repeating one root count differently from five independent roots.

## Expected Benefit
- Better independence checks.
- Stronger audit trail.
- False consensus detection.
- Primary-source recovery.

## Tradeoff
More time spent tracing ancestry. Best for high-stakes factual claims, weaker for fast exploratory scans.
