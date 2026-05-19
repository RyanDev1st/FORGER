# Variation Pipeline — Blind Spot Inventory

Parent: ARCHITECTURE.md

## Status
Created v38 variation centered on explicitly cataloging absent evidence and search-space holes before synthesis.

## Pipeline
1. Parse brief into expected evidence types, missing stakeholder groups, likely unpublished evidence, inaccessible sources, measurement gaps, and decision risk from absence.
2. Spawn three isolated lanes.
3. Force each lane to emit blind-spot cards instead of generic findings.
4. Validate absent evidence zone, bias mechanism, source or absence log, quote when available, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, absence-log specificity, and Edge redundancy.
6. Build blind spot map:
   - absent population
   - unpublished negative
   - inaccessible archive
   - language gap
   - measurement gap
   - survivorship bias
   - platform bias
   - proxy evidence zone
7. Synthesize with explicit limits where missing evidence weakens or blocks conclusions.
8. Re-fan one blind spot if it could overturn conclusion or block safe recommendation.

## WHY
Blind Spot Inventory improves reTruth by treating absence as structured evidence about search limits, not vague uncertainty. It reduces overconfidence from visible-source bias and gives the user a clear view of which gaps are harmless, proxy-searchable, decision-critical, or conclusion-blocking.

## Difference From Original
Original architecture handles under-sourced lanes and pivot logs. Blind Spot Inventory turns missingness itself into the primary object of inquiry, with source-zone names, bias mechanisms, proxy routes, and block decisions.

## Expected Benefit
- Better handling of under-studied groups and silent failures.
- Clearer limits on conclusions.
- Stronger proxy search planning.
- Less overconfidence from indexed-source visibility.

## Tradeoff
Can make synthesis more cautious and gap-heavy. Best for domains with selection bias, unpublished failures, private operational evidence, non-English sources, or weak measurement; less useful when source coverage is known to be complete.

## Main Risk
Overstating absence from a shallow search. Mitigation: every blind-spot card must include source-zone specificity, bias mechanism, and accept gap/proxy/search deeper/block decision.

## Next Variation Ideas
1. Robustness Ladder: grade claims by how many attack classes they survive.
2. Incentive Gradient: model how actor behavior changes after recommendation adoption.
3. Evidence Compression Index: measure whether many findings reduce to same mechanism.
