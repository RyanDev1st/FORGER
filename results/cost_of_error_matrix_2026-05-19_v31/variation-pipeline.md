# Variation Pipeline — Cost of Error Matrix

Parent: ARCHITECTURE.md

## Status
Created v31 variation centered on converting evidence into asymmetric false-yes and false-no decision costs.

## Pipeline
1. Parse brief into action, false-yes cost, false-no cost, reversibility, scope, deadline, and tolerance for delay.
2. Spawn three isolated lanes.
3. Force each lane to emit error cards instead of generic findings.
4. Validate error direction, cost severity, quote, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, severity consistency, and Edge redundancy.
6. Build cost-of-error matrix:
   - false-yes catastrophic
   - false-yes expensive
   - false-no catastrophic
   - false-no expensive
   - reversible trial zone
   - asymmetric caution zone
   - evidence gap zone
   - low-cost exploration zone
7. Synthesize allow/hedge/delay/block recommendation under dominant error direction.
8. Re-fan one decision-controlling error zone if needed.

## WHY
Cost of Error Matrix improves reTruth by making recommendations sensitive to asymmetric downside. Many research questions are not neutral classification problems: wrong approval, wrong rejection, wrong delay, and wrong acceleration can produce different harm profiles. This drift forces that asymmetry into evidence collection and synthesis.

## Difference From Original
Original architecture validates evidence quality, then synthesizes confidence. Cost of Error Matrix validates evidence quality, then prices what happens if the resulting recommendation is wrong in each direction.

## Expected Benefit
- Better high-stakes recommendations.
- Clearer conservative versus aggressive advice.
- Stronger handling of irreversible actions.
- More explicit rationale for delaying or allowing action.

## Tradeoff
Can make synthesis more decision-theoretic and less explanatory. Best for action decisions, policy choices, investment choices, migrations, launches, safety tradeoffs, and medical/legal/finance-adjacent questions; less useful for pure knowledge summaries.

## Main Risk
False precision in cost labels. Mitigation: every card must include source quote, cost severity, reversibility note or operational proxy, and explicit recommendation.

## Next Variation Ideas
1. Signal Decay Tracker: weight evidence by freshness and half-life.
2. Reversal Sentinel: search for cases where consensus flipped after deployment.
3. Dependency Stressor: map recommendations to hidden upstream assumptions.
