# Variation Pipeline — Failure Atlas

Parent: ARCHITECTURE.md

## Status
Created v8 variation centered on failure-first research.

## Pipeline
1. Parse brief into target claim or plan.
2. Define success and residual risk.
3. Spawn three isolated lanes.
4. Force lanes to collect failure cards before success evidence.
5. Validate trigger, impact, detectability, mitigation, quote, and source quality.
6. Cluster failures into atlas categories.
7. Produce resilience plan linked to failure cards.
8. Re-fan one under-evidenced high-risk cluster if needed.

## WHY
Failure-first search fights optimism bias. It turns research into risk discovery before recommendation. This may bear better results for architecture, strategy, safety, product design, and any claim where hidden constraints matter more than headline success.

## Difference From Original
Original fan-out asks each lane for best evidence in its domain. Failure Atlas asks each lane for ways the target breaks, then uses synthesis to decide what remains safe, robust, or conditionally useful.

## Expected Benefit
- Earlier discovery of hidden constraints.
- More useful recommendations.
- Better risk register.
- Less success-story bias.

## Tradeoff
May feel pessimistic for exploratory creative work. Use when bad plans cost more than missed upside.
