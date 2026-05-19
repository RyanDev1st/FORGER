Parent: ARCHITECTURE.md

# Why This Variation — Contradiction Reconciliation Matrix v70

## Status

v70. Search-first, browser-read, contradiction-aware.

## Scope

This variation extends v69 by treating disagreement as first-class structure instead of letting consensus-weighting erase real conflicts.

## Evidence

- Cochrane Chapter 15 was opened with `playwright-cli`; visible text concerned interpreting results, confidence intervals, statistical significance, certainty of evidence, and drawing conclusions.
- PRISMA checklist candidate was opened with `playwright-cli`; page resolved but extraction was thin, so it served only as a reporting-structure cue.
- ODAF candidate failed DNS resolution and became blocked-source evidence.
- Existing gnosis architecture and lane mandates already require explicit tensions, disagreements, and non-silent handling of conflicts.
- v69 showed confidence tiers help with corroboration, but corroboration alone can hide why serious disagreements persist.

## Rationale

Search-first synthesis can still overcompress disagreement after evidence is gathered. A contradiction matrix forces the system to expose whether two claims differ because of population, method, metric, timeframe, interpretation, or source quality. That keeps unresolved disputes visible and prevents weak flattening into fake consensus.

## Tradeoff

Better disagreement handling and auditability, but more bookkeeping and more judgment pressure when labeling false versus unresolved conflict.

## Next

1. Test with topics where null findings and positive findings coexist.
2. Merge with evidence-gap mapping for contradictions caused by sparse evidence.
3. Consider later variant combining contradiction routing with explicit rebuttal chains.
