# Variation Pipeline — Decision Fork Map

Parent: ARCHITECTURE.md

## Status
Created v42 variation centered on recommendations that must branch across incompatible assumptions, contexts, thresholds, stakeholder goals, and risk postures.

## Pipeline
1. Parse brief into central decision, candidate actions, assumed world states, context variables, thresholds, stakeholder objectives, and branch-resolution evidence.
2. Spawn three isolated lanes.
3. Force each lane to emit fork cards instead of generic findings.
4. Validate fork condition, branch options, recommended branch, choose/split/defer/test action, source, quote, evidence needed, and confidence.
5. Audit URLs, quote matches, branch consistency, and Edge redundancy.
6. Build decision fork map:
   - assumption fork
   - context fork
   - threshold fork
   - stakeholder fork
   - timing fork
   - resource fork
   - risk fork
   - test-to-resolve fork
7. Synthesize after preserving incompatible branches instead of averaging them into one answer.
8. Re-fan only when one unresolved fork controls current action.

## WHY
Decision Fork Map improves reTruth by preventing premature convergence. Many research questions do not have one best answer; they have branches whose correctness depends on scale, cost of error, user segment, time horizon, evidence threshold, stakeholder goal, or implementation capacity.

## Difference From Original
Original architecture seeks consensus across lanes and flags dissent. Decision Fork Map treats dissent as potentially structural: disagreement may mean different branch conditions, not lower-quality evidence.

## Expected Benefit
- More useful recommendations under uncertainty.
- Clearer action paths for different operating contexts.
- Better separation between choose, split, defer, and test decisions.
- Lower risk of forcing one answer across incompatible assumptions.

## Tradeoff
Can feel less decisive when users want a single answer. Best for strategic decisions, policy choices, product tradeoffs, intervention design, and domains with strong context dependence; less useful for factual lookup or binary verification.

## Main Risk
Over-branching until synthesis becomes a decision tree with no guidance. Mitigation: every fork must name a branch action and safe default if unresolved.

## Next Variation Ideas
1. Intervention Friction Audit: identify where implementation effort destroys theoretical benefit.
2. Temporal Drift Tracker: monitor how fast evidence relevance decays after publication or deployment.
3. Confidence Budget Allocator: spend research effort only where uncertainty changes action.
