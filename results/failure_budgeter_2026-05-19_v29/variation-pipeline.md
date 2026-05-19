# Variation Pipeline — Failure Budgeter

Parent: ARCHITECTURE.md

## Status
Created v29 variation centered on risk budgets and containment-first decisions.

## Pipeline
1. Parse brief into intended action, acceptable failure level, irreversible harms, likely failure modes, monitoring signals, and rollback options.
2. Spawn three isolated lanes.
3. Force each lane to emit failure-budget cards instead of generic findings.
4. Validate failure mode, budget dimension, severity, detectability, quote, and containment route.
5. Audit URLs, quote matches, severity consistency, and Edge redundancy.
6. Build failure budget:
   - acceptable loss
   - warning threshold
   - stop-loss trigger
   - irreversible harm
   - detection gap
   - rollback dependency
   - blast-radius limiter
   - experiment guardrail
7. Synthesize go/no-go judgment under explicit budget.
8. Re-fan one decision-controlling failure mode if needed.

## WHY
Failure Budgeter improves reTruth by translating uncertainty into operational risk boundaries. It helps user decide what can be tried, what must be monitored, and when to stop.

## Difference From Original
Original architecture flags risks. Failure Budgeter assigns risks to budgets, triggers, and containment plans before recommending action.

## Expected Benefit
- Better go/no-go decisions.
- Clearer stop-loss triggers.
- Stronger monitoring and rollback planning.
- More usable uncertainty handling.

## Tradeoff
Can make answers more operational and less explanatory. Best for launch, migration, policy, investment, experiment, and safety decisions; less useful for pure research summaries.

## Main Risk
False comfort from poorly measurable budgets. Mitigation: no budget without detectability and containment route.

## Next Variation Ideas
1. Decision Ledger: persist decisions, triggers, and revisit dates as output objects.
2. Evidence Thermostat: adjust research depth dynamically based on uncertainty heat.
3. Redundancy Harvester: exploit repeated claims to find origin and mutation trail.
