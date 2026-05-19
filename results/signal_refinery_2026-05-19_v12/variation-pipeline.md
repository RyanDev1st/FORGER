# Variation Pipeline — Signal Refinery

Parent: ARCHITECTURE.md

## Status
Created v12 variation centered on calibrated signal processing.

## Pipeline
1. Parse brief into target question, stakes, and confidence need.
2. Spawn three isolated lanes.
3. Force each lane to output signal packets.
4. Validate direction, strength, reliability, actionability, quote, and source.
5. Audit links, quotes, and redundancy.
6. Classify packets into confidence bands.
7. Return calibrated answer and noise register.
8. Re-fan one missing signal type if it could raise confidence.

## WHY
Signal Refinery improves reTruth when answer quality depends less on finding more sources and more on judging signal quality. It makes uncertainty visible and prevents weak but numerous findings from overwhelming fewer strong signals.

## Difference From Original
Original architecture filters then synthesizes. Signal Refinery filters, calibrates, and only then synthesizes.

## Expected Benefit
- Clear confidence bands.
- Better noise handling.
- More action-oriented synthesis.
- Less false certainty.

## Tradeoff
Can under-serve exploratory discovery by downgrading novel weak signals. Edge lane keeps novelty alive but labels it low reliability until corroborated.
