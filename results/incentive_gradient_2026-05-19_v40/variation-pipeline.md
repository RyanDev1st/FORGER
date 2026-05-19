# Variation Pipeline — Incentive Gradient

Parent: ARCHITECTURE.md

## Status
Created v40 variation centered on modeling actor adaptation after incentives change.

## Pipeline
1. Parse brief into recommendation, affected actors, current incentive structure, post-adoption incentive shift, likely strategic response, unintended behavior risk, and monitoring signals.
2. Spawn three isolated lanes.
3. Force each lane to emit incentive cards instead of generic findings.
4. Validate actor and incentive shift, predicted adaptation, quote, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, actor specificity, and Edge redundancy.
6. Build incentive gradient map:
   - aligned adaptation
   - gaming risk
   - moral hazard
   - adverse selection
   - metric capture
   - compliance theater
   - displacement effect
   - stabilizing feedback
7. Synthesize recommendation after expected actor adaptation, not before.
8. Re-fan one behavioral adaptation if it could invert the recommendation.

## WHY
Incentive Gradient improves reTruth by treating adoption as an intervention that changes actor behavior. Static recommendations fail when people optimize against metrics, rules, rankings, prices, enforcement, or audits. This drift forces lanes to forecast adaptation and propose guardrails.

## Difference From Original
Original architecture asks what evidence supports a conclusion. Incentive Gradient asks what actors will do once the conclusion becomes a rule or recommendation, then re-evaluates whether it still holds.

## Expected Benefit
- Better policy, governance, market, and product recommendations.
- Earlier detection of gaming and compliance theater.
- Stronger guardrail and monitoring design.
- More realistic adoption forecasts.

## Tradeoff
Can add speculative behavioral modeling. Best for incentive-sensitive decisions; less useful for static factual questions.

## Main Risk
Overpredicting strategic adaptation. Mitigation: every incentive card must name actor, incentive shift, behavioral adaptation, source quote, and preserve/redesign/monitor/reject recommendation.

## Next Variation Ideas
1. Evidence Compression Index: measure whether many findings reduce to same mechanism.
2. Decision Fork Map: produce branching recommendations under mutually exclusive assumptions.
3. Intervention Friction Audit: identify where implementation effort destroys theoretical benefit.
