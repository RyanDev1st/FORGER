Parent: ARCHITECTURE.md

# Why This Variation — Double Diamond Grounding v76

## Status

v76. Search-first, browser-read, divergence-convergence gated.

## Scope

This variation extends v75 by adding phase discipline: first ground the problem, then generate options, then converge through small-scale testing and rejection.

## Evidence

- Design Council Double Diamond was opened with `playwright-cli`; visible title confirmed the source.
- Design Council text said the first diamond helps people understand rather than assume what the problem is.
- Design Council text said discovery involves speaking to and spending time with affected people.
- Design Council text said discovery insight can define the challenge in a different way.
- Design Council text said the second diamond encourages different answers, inspiration from elsewhere, and co-design.
- Design Council text said delivery tests different solutions at small scale, rejecting those that will not work.
- NN/g Design Thinking 101 was opened with `playwright-cli`; visible title confirmed the source.
- NN/g text framed design thinking as understand, explore, and materialize.
- NN/g text listed empathize, define, ideate, prototype, test, and implement.
- IxDF divergent thinking page was opened with `playwright-cli`; visible title confirmed updated 2026 source.
- IxDF text said divergent thinking widens the design space, generates many ideas, then convergent thinking isolates useful ideas.

## Rationale

The original reTruth philosophy says AI creativity must come after grounding, like humans learning existing work before adding spices. Double Diamond Grounding gives that philosophy an operational clock: discover before define, define before develop, develop before deliver.

This directly targets the facial emotion recognition failure mode. The system must first find grounded problem evidence and working implementations, then define what is actually needed, then generate options, then reject non-working ones through small-scale tests.

## Tradeoff

Better anti-fantasy discipline and clearer creative phase control, but slower early execution because solution ideation is blocked until problem evidence exists.

## Next

1. Add explicit `rejected-options.md` when a run produces many plausible but non-working ideas.
2. Pair with Citation Chaining Lattice to expand from working implementations before ideation.
3. Pair with Incentive Bias Ledger to prevent co-design and practitioner evidence from becoming vendor capture.
