# Variation Pipeline — Reversal Sentinel

Parent: ARCHITECTURE.md

## Status
Created v33 variation centered on finding consensus reversals, failed reversal narratives, and sentinel conditions that would change recommendations.

## Pipeline
1. Parse brief into current claim, prior dominant view, proposed action, flip conditions, adoption boundary, and reversal stakes.
2. Spawn three isolated lanes.
3. Force each lane to emit reversal cards instead of generic findings.
4. Validate reversal direction, reversal mechanism, chronology, quote, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, chronology consistency, and Edge redundancy.
6. Build reversal map:
   - confirmed reversal
   - partial reversal
   - failed reversal claim
   - deployment-only reversal
   - incentive-driven reversal
   - measurement-driven reversal
   - scope-bound reversal
   - sentinel warning
7. Synthesize trust/hedge/test/reject recommendation by claim durability.
8. Re-fan one reversal mechanism if it could change recommendation.

## WHY
Reversal Sentinel improves reTruth by turning historical and deployment-driven flips into active safeguards. Instead of only asking what evidence says now, it asks what made similar claims become wrong before. That improves recommendations in domains where consensus is real but brittle.

## Difference From Original
Original architecture emphasizes divergent evidence lanes and validation. Reversal Sentinel adds temporal contradiction: evidence is judged partly by whether its claim class has reversed, resisted reversal, or only holds within narrow scope.

## Expected Benefit
- Better detection of brittle consensus.
- Stronger warnings before rollout or adoption.
- Clearer handling of failed contrarian claims.
- More actionable monitoring conditions.

## Tradeoff
Can over-index on historical analogy and make stable consensus look fragile. Best for fast-changing, deployment-sensitive, policy, medical, technical, and investment decisions; less useful when current evidence is mature and boundary conditions are stable.

## Main Risk
Mistaking disagreement for reversal. Mitigation: every reversal card must include chronology, mechanism, and evidence-shift or adoption-shift basis.

## Next Variation Ideas
1. Dependency Stressor: expose hidden upstream assumptions behind recommendations.
2. Provenance Chain: trace claims to origin and mutation trail.
3. Adversarial Benchmark: test synthesis against strongest plausible attack cases.
