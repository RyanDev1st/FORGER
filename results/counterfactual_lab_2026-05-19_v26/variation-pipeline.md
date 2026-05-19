# Variation Pipeline — Counterfactual Lab

Parent: ARCHITECTURE.md

## Status
Created v26 variation centered on counterfactual stress testing before synthesis.

## Pipeline
1. Parse brief into baseline assumptions, hidden variables, plausible alternate worlds, premise reversals, and survival criteria.
2. Spawn three isolated lanes.
3. Force each lane to emit counterfactual cards instead of generic findings.
4. Validate baseline claim, counterfactual condition, expected synthesis change, quote, and observable discriminator.
5. Audit URLs, quote matches, condition clarity, and Edge redundancy.
6. Build counterfactual grid:
   - premise reversal
   - variable removal
   - variable amplification
   - context shift
   - actor substitution
   - time shift
   - boundary violation
   - black-swan analogue
7. Synthesize claims by robustness across plausible worlds.
8. Re-fan one synthesis-flipping counterfactual if needed.

## WHY
Counterfactual Lab improves reTruth by preventing hidden assumptions from masquerading as evidence strength. It reveals which recommendations survive plausible changes and which depend on narrow conditions.

## Difference From Original
Original architecture aggregates and checks findings. Counterfactual Lab actively perturbs the assumptions behind findings before merging them.

## Expected Benefit
- More robust recommendations.
- Earlier discovery of fragile claims.
- Clearer load-bearing assumptions.
- Better decision support under uncertainty.

## Tradeoff
More speculative overhead. Best for strategy, risk, policy, forecasting, and product decisions; less useful for stable factual lookup.

## Main Risk
Inventing counterfactuals with no evidence anchor. Mitigation: each counterfactual requires source quote and observable discriminator.

## Next Variation Ideas
1. Threshold Finder: identify decision thresholds where recommendation flips.
2. Intervention Backcast: start from desired outcome and trace backward to evidence-backed levers.
3. Failure Budgeter: convert uncertainties into acceptable risk budgets.
