# Why This Variation — Triangulation Confidence Matrix v69

Parent: ARCHITECTURE.md

## Status

v69. Search-first, browser-read, confidence-tiered.

## Scope

This variation extends v68 by turning verified leads into confidence-rated claim candidates before lane synthesis.

## Evidence

- BetterEvaluation triangulation candidates were opened with `playwright-cli`; weak extraction showed source-surface promise is not enough for claims.
- NCBI Bookshelf source was opened with `playwright-cli`; visible title concerned risk of bias and confounding in observational studies.
- Cochrane Chapter 24 was opened with `playwright-cli`; visible text concerned including non-randomized studies and risk/certainty handbook chapters.
- Existing gnosis files were read for triangulation, isolated-claim caps, cross-source corroboration, and robust-tier exclusion rules.

## Rationale

Cross-source agreement matters only when sources are independent, diverse, and low enough risk. This variation prevents same-network agreement, vendor clusters, or exploratory edge analogues from being treated as robust consensus.

## Tradeoff

More precise synthesis labels, but more bookkeeping and possible overconfidence in tiers.

## Next

1. v70 can combine lateral verification with confidence matrix.
2. v71 can add contradiction matrix.
3. v72 can test tier labels against actual audit failure rates.
