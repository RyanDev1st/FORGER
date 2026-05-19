# Variation Pipeline — Stakeholder Prism

Parent: ARCHITECTURE.md

## Status
Created v24 variation centered on stakeholder-specific evidence synthesis.

## Pipeline
1. Parse brief into stakeholder groups, decision makers, consequence bearers, incentive asymmetries, and likely hidden actors.
2. Spawn three isolated lanes.
3. Force each lane to emit stakeholder cards instead of generic findings.
4. Validate stakeholder, effect direction, linked claim, quote, decision relevance, and asymmetry/tradeoff.
5. Audit URLs, quote matches, stakeholder labeling consistency, and Edge redundancy.
6. Build stakeholder prism:
   - direct beneficiary
   - direct risk-bearer
   - hidden cost-bearer
   - gatekeeper
   - implementer
   - bystander externality
   - delayed stakeholder
   - misaligned incentive actor
7. Synthesize recommendations by stakeholder position.
8. Re-fan one stakeholder conflict if it controls final synthesis.

## WHY
Stakeholder Prism improves reTruth by preventing average-case conclusions from erasing uneven costs, incentives, and exposure. It answers “true for whom?” before “what should we do?”

## Difference From Original
Original architecture compares claim strength across lanes. Stakeholder Prism compares claim effect across actors, then returns actor-specific conclusions.

## Expected Benefit
- Better decision guidance for real-world tradeoffs.
- Clearer visibility into hidden cost transfers.
- Stronger incentive-bias detection.
- Less overgeneralized synthesis.

## Tradeoff
Less compact final answer. Best for policy, product, organizational, safety, and implementation questions; less useful for neutral fact lookup.

## Main Risk
Over-fragmenting stakeholders until synthesis becomes unwieldy. Mitigation: merge only actors with matching exposure and decision relevance.

## Next Variation Ideas
1. Method Stack: separate claims by evidence method before merging.
2. Counterfactual Lab: stress-test findings under alternate assumptions.
3. Threshold Finder: identify decision thresholds where recommendation flips.
