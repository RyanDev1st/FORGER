# Variation Pipeline — Threshold Finder

Parent: ARCHITECTURE.md

## Status
Created v27 variation centered on thresholds where recommendations flip.

## Pipeline
1. Parse brief into central decision, options, measurable variables, likely flip points, and user constraints.
2. Spawn three isolated lanes.
3. Force each lane to emit threshold cards instead of generic findings.
4. Validate variable, threshold direction, decision effect, quote, and measurement route.
5. Audit URLs, quote matches, variable consistency, and Edge redundancy.
6. Build threshold table:
   - cost threshold
   - scale threshold
   - risk threshold
   - confidence threshold
   - time threshold
   - quality threshold
   - adoption threshold
   - failure-rate threshold
7. Synthesize recommendation for current known values.
8. Re-fan one unresolved decision-controlling threshold if needed.

## WHY
Threshold Finder improves reTruth by replacing static recommendations with conditional decision boundaries. It answers “what should we do?” plus “when would that answer change?”

## Difference From Original
Original architecture ranks claim strength. Threshold Finder identifies variables that change ranking once crossed.

## Expected Benefit
- Better practical decision support.
- Clearer measurement priorities.
- Less brittle recommendation language.
- Better handling of nonlinear systems.

## Tradeoff
Requires measurable variables or credible proxies. Best for operations, product, policy, engineering, cost-benefit, and risk decisions; less useful for purely descriptive topics.

## Main Risk
False precision around weak thresholds. Mitigation: every threshold requires uncertainty band or measurement route.

## Next Variation Ideas
1. Intervention Backcast: start from desired outcome and trace backward to evidence-backed levers.
2. Failure Budgeter: convert uncertainties into acceptable risk budgets.
3. Decision Ledger: persist decisions, triggers, and revisit dates as output objects.
