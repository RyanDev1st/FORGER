# Variation Pipeline — Signal Decay Tracker

Parent: ARCHITECTURE.md

## Status
Created v32 variation centered on weighting evidence by freshness, decay drivers, and update boundaries before synthesis.

## Pipeline
1. Parse brief into domain velocity, decision date, version or policy boundary, stale-risk tolerance, and update triggers.
2. Spawn three isolated lanes.
3. Force each lane to emit decay cards instead of generic findings.
4. Validate evidence date or version, decay driver, quote, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, date/version consistency, and Edge redundancy.
6. Build signal decay map:
   - fresh stable
   - fresh volatile
   - aging but usable
   - stale high-risk
   - superseded
   - version-bound
   - evergreen principle
   - refresh trigger
7. Synthesize current answer after downgrading stale or superseded evidence.
8. Re-fan one stale high-risk or superseded zone if needed.

## WHY
Signal Decay Tracker improves reTruth by separating evidence strength from evidence freshness. Strong old evidence can remain valid in slow domains, while fresh evidence can be volatile in fast domains. This variation forces lanes to identify decay drivers before synthesis, reducing stale consensus and shallow recency bias.

## Difference From Original
Original architecture verifies existence, quote fidelity, and lane quality. Signal Decay Tracker adds temporal validity: every finding must name why its signal should be kept, discounted, refreshed, or retired.

## Expected Benefit
- Less stale operational advice.
- Better handling of fast-moving tools, laws, policies, security practices, and benchmarks.
- Stronger treatment of evergreen academic principles.
- Clear update triggers for future runs.

## Tradeoff
Can overemphasize freshness in domains where old evidence remains strong. Best for time-sensitive synthesis; less useful for timeless conceptual explanations.

## Main Risk
Recency bias. Mitigation: include `evergreen principle` and `aging but usable` categories so older evidence can remain central when decay drivers are weak.

## Next Variation Ideas
1. Reversal Sentinel: search for consensus flips and post-deployment reversals.
2. Dependency Stressor: expose hidden upstream assumptions behind recommendations.
3. Provenance Chain: trace claims back to origin and mutation trail.
