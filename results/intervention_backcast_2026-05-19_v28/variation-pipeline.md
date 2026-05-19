# Variation Pipeline — Intervention Backcast

Parent: ARCHITECTURE.md

## Status
Created v28 variation centered on desired-outcome backcasting and intervention ranking.

## Pipeline
1. Parse brief into desired outcome, current state, controllable levers, constraints, intermediate states, and harm boundaries.
2. Spawn three isolated lanes.
3. Force each lane to emit intervention cards instead of generic findings.
4. Validate intervention, intermediate state, target outcome, quote, controllability, and failure mode.
5. Audit URLs, quote matches, intervention-chain completeness, and Edge redundancy.
6. Build backcast chain:
   - direct lever
   - enabling condition
   - bottleneck removal
   - feedback accelerator
   - harm reducer
   - adoption trigger
   - maintenance requirement
   - failure guardrail
7. Synthesize highest-leverage chains by controllability and evidence strength.
8. Re-fan one missing intervention link if it blocks action-quality guidance.

## WHY
Intervention Backcast improves reTruth by making action pathways explicit. It links desired outcome → intermediate state → intervention → failure mode, so advice is not detached from mechanism.

## Difference From Original
Original architecture synthesizes what evidence says. Intervention Backcast synthesizes what evidence suggests user can change.

## Expected Benefit
- Better action guidance.
- Clearer controllability assessment.
- Earlier detection of side effects and rollout traps.
- Stronger first-experiment design.

## Tradeoff
Less suitable for pure understanding tasks. Best for strategy, implementation, product, policy, operations, and behavior-change questions.

## Main Risk
Over-advising where evidence only supports description. Mitigation: no intervention advice without outcome chain and failure mode.

## Next Variation Ideas
1. Failure Budgeter: convert uncertainties into acceptable risk budgets.
2. Decision Ledger: persist decisions, triggers, and revisit dates as output objects.
3. Evidence Thermostat: adjust research depth dynamically based on uncertainty heat.
