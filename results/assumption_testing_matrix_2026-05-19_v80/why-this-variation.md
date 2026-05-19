Parent: ARCHITECTURE.md

# Why This Variation — Assumption Testing Matrix v80

## Status

v80. Search-first, browser-read, riskiest-assumption gated.

## Scope

This variation extends v79 by shifting from imagined failure modes to testable assumptions. Instead of only asking how synthesis might fail, it asks which hidden beliefs the synthesis depends on and whether evidence already supports them.

## Evidence

- Product Talk assumption testing page was opened with `playwright-cli`; visible title confirmed the source.
- Product Talk text said a regular cadence of assumption testing helps teams quickly determine which ideas will work and which ones will not.
- Product Talk text said assumption mapping uses two dimensions: how important the assumption is to success and how much evidence already exists.
- Product Talk text said riskiest assumptions are critical to success and have little evidence that they are safe.
- Product Talk text said the goal of assumption testing is to collect more evidence.
- Product Talk text listed prototype tests, one-question surveys, data mining, and research spikes as practical test types.
- Strategyzer library page was opened with `playwright-cli`; visible title confirmed a generic source about designing better strategy and testing ideas.
- Multiple targeted assumption-method pages from Strategyzer, DesignKit, Leanstack, and NN/g returned dead, blocked, or mismatched pages, reinforcing need for explicit access-quality handling.

## Rationale

reTruth problem is not only bad answers. It is hidden assumptions dressed up as insight. AI often jumps from source fragments to confident solutions without checking whether crucial beliefs have evidence behind them. Assumption Testing Matrix attacks this exact failure mode.

This also fits user philosophy. Human creativity comes after grounding, not before it. If recommendation depends on untested assumptions about feasibility, stakeholder behavior, benchmark portability, or repo viability, framework should surface and test those assumptions before claiming robustness.

v80 also pairs well with v79. v79 asks, "how could final answer fail?" v80 asks, "what hidden belief would need to be true for final answer to work?" Together they move framework closer to disciplined grounded ideation.

## Tradeoff

Better discipline and less drift, but more gating overhead. On mature topics with strong evidence, explicit assumption logging may feel repetitive. On weakly sourced topics, though, slowdown is feature, not bug.

## Next

1. Pair with Need-to-Knowledge Broker so hidden assumptions about existing knowledge get tested before invention drift.
2. Pair with Triangulation Confidence Matrix so assumption evidence quality affects confidence tier directly.
3. Test on topic where AI commonly hallucinates implementation feasibility despite weak artifact evidence.
