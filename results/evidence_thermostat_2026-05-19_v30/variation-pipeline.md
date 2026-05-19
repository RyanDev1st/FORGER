# Variation Pipeline — Evidence Thermostat

Parent: ARCHITECTURE.md

## Status
Created v30 variation centered on adaptive research depth driven by uncertainty heat instead of fixed evidence volume.

## Pipeline
1. Parse brief into central question, stakes, ambiguity tolerance, time budget, known uncertainty sources, and escalation triggers.
2. Spawn three isolated lanes.
3. Force each lane to emit heat cards instead of generic findings.
4. Validate heat score, uncertainty driver, quote, recommendation, and decision impact fields.
5. Audit URLs, quote matches, heat consistency, and Edge redundancy.
6. Build evidence heat map:
   - cold stable
   - warm disputed
   - hot ambiguous
   - hot high-stakes
   - cold low-impact
   - re-fan trigger
   - stop condition
   - under-sourced zone
7. Synthesize answer depth to match heat instead of treating all claims equally.
8. Re-fan one high-impact hot zone if needed.

## WHY
Evidence Thermostat improves reTruth by allocating research effort where uncertainty matters most. It treats search depth as a control system: stable claims stop early, disputed claims get targeted follow-up, and high-stakes ambiguity gets escalation. This reduces wasted effort and makes uncertainty handling more explicit.

## Difference From Original
Original architecture keeps lane volume relatively fixed, then synthesizes. Evidence Thermostat dynamically changes depth, stopping pressure, and re-fan pressure according to uncertainty heat.

## Expected Benefit
- Better token efficiency on easy questions.
- More defensible escalation on hard questions.
- Clearer distinction between stable claims and decision-critical ambiguity.
- Stronger prioritization for re-fan.

## Tradeoff
Can under-explore low-signal areas that later prove important if heat is assigned too early. Best for budget-aware synthesis; less ideal when exhaustive coverage matters more than adaptive stopping.

## Main Risk
Bad heat scoring can prematurely cool important evidence. Mitigation: require uncertainty driver, decision impact, and explicit stop/deepen/re-fan recommendation on every card.

## Next Variation Ideas
1. Drift Ladder: force every claim through evidence-strength upgrade and downgrade paths.
2. Cost-of-Error Matrix: rank research effort by downside of false yes versus false no.
3. Signal Decay Tracker: weight freshness and evidence half-life across lanes.
