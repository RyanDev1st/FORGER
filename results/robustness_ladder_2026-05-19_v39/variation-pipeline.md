# Variation Pipeline — Robustness Ladder

Parent: ARCHITECTURE.md

## Status
Created v39 variation centered on grading claims by how many independent stress classes they survive.

## Pipeline
1. Parse brief into central claim, candidate recommendation, required confidence tier, stress classes, failure tolerance, decision stakes, and acceptable fallback tier.
2. Spawn three isolated lanes.
3. Force each lane to emit robustness cards instead of generic findings.
4. Validate stress class, pass/partial/fail result, quote, current tier, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, tier consistency, and Edge redundancy.
6. Build robustness ladder:
   - tier 0 unsupported
   - tier 1 single-source support
   - tier 2 multi-source support
   - tier 3 method-robust
   - tier 4 context-robust
   - tier 5 adversarially robust
   - tier 6 action-grade
   - demotion trigger
7. Synthesize by tier, not by generic confidence.
8. Re-fan one promotion or demotion question if it changes action-grade recommendation.

## WHY
Robustness Ladder improves reTruth by making confidence compositional. A claim can be supported yet fragile, replicated yet context-bound, or adversarially robust enough for action. This drift creates a clear route for promoting or demoting claims based on stress survival.

## Difference From Original
Original architecture validates each finding and synthesizes across lanes. Robustness Ladder adds claim-tier accounting: every important claim gets placed on a ladder, and no claim becomes action-grade without surviving named stress classes.

## Expected Benefit
- Clearer confidence tiers.
- Better separation of hypothesis from action-ready advice.
- Easier identification of promotion tests.
- Stronger demotion logic when contradictions appear.

## Tradeoff
Can make outputs more formal and slower. Best for high-stakes recommendations, technical evaluations, policy claims, and research reviews; less useful for quick exploratory summaries.

## Main Risk
False ladder precision. Mitigation: each tier move must cite stress class, pass/partial/fail result, source quote, and promote/hold/demote/discard recommendation.

## Next Variation Ideas
1. Incentive Gradient: model how actor behavior changes after recommendation adoption.
2. Evidence Compression Index: measure whether many findings reduce to same mechanism.
3. Decision Fork Map: produce branching recommendations under mutually exclusive assumptions.
