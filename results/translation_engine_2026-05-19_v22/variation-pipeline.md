# Variation Pipeline — Translation Engine

Parent: ARCHITECTURE.md

## Status
Created v22 variation centered on vocabulary mapping before claim synthesis.

## Pipeline
1. Parse brief into central concepts, suspected synonym families, domain vocabularies, and possible term drift.
2. Spawn three isolated lanes.
3. Force each lane to emit translation cards instead of generic findings.
4. Validate source vocabulary, target vocabulary, linked concept, equivalence strength, quote, and false-friend risk.
5. Audit URLs, quote matches, vocabulary consistency, and Edge redundancy.
6. Build translation matrix:
   - strong equivalent
   - partial overlap
   - false friend
   - renamed concept
   - regional variant
   - historical term
   - adjacent-domain analogue
   - untranslatable remainder
7. Synthesize normalized claims after vocabulary mapping.
8. Re-fan one ambiguous translation if it controls final synthesis.

## WHY
Translation Engine improves reTruth by preventing search-term lock-in and false disagreement. It treats vocabulary as a source of both hidden consensus and hidden error.

## Difference From Original
Original architecture compares findings across lanes. Translation Engine first translates lane vocabularies, then compares claims. It can reveal that two lanes agree under different names or disagree despite using same word.

## Expected Benefit
- Better cross-domain search recall.
- Fewer false disagreements.
- Clearer detection of term drift and renamed concepts.
- Stronger synthesis across academic, practitioner, and fringe vocabularies.

## Tradeoff
More overhead before synthesis. Best for interdisciplinary, historical, regional, or jargon-heavy research; less useful for simple fact lookup.

## Main Risk
Over-merging terms that only partially overlap. Mitigation: every mapping requires equivalence strength and false-friend risk.

## Next Variation Ideas
1. Temporal Decay: rank evidence by age, update cadence, and staleness risk.
2. Stakeholder Prism: synthesize by affected party and incentives.
3. Method Stack: separate conclusions by methodology before merging.
