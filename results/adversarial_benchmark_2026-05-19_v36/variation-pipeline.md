# Variation Pipeline — Adversarial Benchmark

Parent: ARCHITECTURE.md

## Status
Created v36 variation centered on stress-testing synthesis against strongest plausible objections and falsifiers.

## Pipeline
1. Parse brief into central claim, proposed recommendation, strongest expected objection, plausible failure benchmark, disagreeing stakeholder, retreat evidence, and acceptable residual risk.
2. Spawn three isolated lanes.
3. Force each lane to emit adversarial cards instead of generic findings.
4. Validate attack vector, benchmark or falsifier, quote, recommendation, decision impact, and confidence.
5. Audit URLs, quote matches, benchmark specificity, and Edge redundancy.
6. Build adversarial map:
   - survived attack
   - partial failure
   - decisive falsifier
   - benchmark gap
   - hostile stakeholder case
   - alternative explanation
   - robustness test
   - retreat condition
7. Synthesize claim robustness and revise claims that fail strong attacks.
8. Re-fan one attack vector if it could overturn recommendation.

## WHY
Adversarial Benchmark improves reTruth by making objections first-class evidence. It prevents persuasive synthesis from passing merely because lanes found support. Every important claim must face a benchmark, falsifier, alternative explanation, or hostile stakeholder case before becoming part of the robust tier.

## Difference From Original
Original architecture separates discovery lanes and audits source quality. Adversarial Benchmark adds active attack testing: evidence is not only gathered, but challenged against plausible failure conditions.

## Expected Benefit
- More robust recommendations.
- Earlier discovery of falsifiers and benchmark gaps.
- Better handling of controversial or high-stakes questions.
- Clearer retreat conditions.

## Tradeoff
Can make outputs more skeptical and slower to endorse action. Best for decisions likely to face criticism, deployment stress, adversarial incentives, or measurable benchmarks; less useful for simple explanatory summaries.

## Main Risk
Overweighting weak objections. Mitigation: every attack card must include source quote, benchmark or falsifier, decision impact, and survive/revise/test/abandon recommendation.

## Next Variation Ideas
1. Stakeholder Collision Map: surface where groups optimize against each other.
2. Blind Spot Inventory: explicitly catalog absent evidence and unreachable source zones.
3. Robustness Ladder: grade claims by how many attack classes they survive.
