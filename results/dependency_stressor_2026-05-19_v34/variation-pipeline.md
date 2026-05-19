# Variation Pipeline — Dependency Stressor

Parent: ARCHITECTURE.md

## Status
Created v34 variation centered on exposing hidden upstream dependencies and stress-testing recommendation viability.

## Pipeline
1. Parse brief into recommendation, intended outcome, explicit assumptions, suspected hidden prerequisites, actor dependencies, resource dependencies, and failure consequence.
2. Spawn three isolated lanes.
3. Force each lane to emit dependency cards instead of generic findings.
4. Validate prerequisite, dependency type, quote, failure mode, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, prerequisite consistency, and Edge redundancy.
6. Build dependency stress map:
   - hard prerequisite
   - soft prerequisite
   - hidden bottleneck
   - actor dependency
   - data dependency
   - infrastructure dependency
   - incentive dependency
   - assumption collapse
7. Synthesize conditional recommendation and list dependencies requiring verification or mitigation.
8. Re-fan one unresolved dependency if it controls recommendation viability.

## WHY
Dependency Stressor improves reTruth by preventing clean recommendations from hiding brittle prerequisite chains. Many decisions work only under specific staffing, infrastructure, legal, data, incentive, or adoption conditions. This variation forces each lane to surface those conditions before synthesis.

## Difference From Original
Original architecture validates evidence and preserves divergent lanes. Dependency Stressor adds precondition validity: evidence can be strong yet unusable when critical prerequisites fail.

## Expected Benefit
- More realistic recommendations.
- Better rollout and implementation planning.
- Earlier detection of hidden blockers.
- Clearer cheap tests before commitment.

## Tradeoff
Can make outputs more conditional and less decisive. Best for implementation decisions, policy rollout, technical adoption, organizational change, and safety-critical plans; less useful for pure descriptive research.

## Main Risk
Over-conditioning recommendations until nothing seems actionable. Mitigation: every dependency receives accept, verify, mitigate, or reject status plus cheapest stress test where possible.

## Next Variation Ideas
1. Provenance Chain: trace claims to origin and mutation trail.
2. Adversarial Benchmark: test synthesis against strongest plausible attack cases.
3. Stakeholder Collision Map: surface where groups optimize against each other.
