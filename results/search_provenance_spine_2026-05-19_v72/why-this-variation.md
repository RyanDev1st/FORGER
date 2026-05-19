Parent: ARCHITECTURE.md

# Why This Variation — Search Provenance Spine v72

## Status

v72. Search-first, browser-read, reproducibility-aware.

## Scope

This variation extends v71 by preserving not only anchors and chains, but exact search-path decisions that determined what evidence survived.

## Evidence

- Cochrane Chapter 4 indexed text said search strategies should be copied and pasted exactly as run and in full.
- Cochrane Chapter 4 indexed text said set numbers, records retrieved, and interface used should be specified where possible.
- Cochrane Chapter 4 indexed text said recreating a search post hoc can be nearly impossible without methodical record keeping.
- Cochrane Chapter 4 indexed text said review authors should check reference lists of included studies and relevant systematic reviews.
- Cochrane technical supplement was opened with `playwright-cli`, but on-page extraction was thin.
- PRISMA-S candidate fetched to unrelated PMC content, which exposed source mismatch risk inside documentation workflows.

## Rationale

Search-first systems usually preserve conclusions and maybe queries, but not full decision path. That weakens trust when later readers need to know why one source was followed, another was excluded, and a route changed. Provenance Spine makes search behavior inspectable and reproducible enough to audit.

## Tradeoff

Better auditability and stronger reproduction path, but more logging overhead and higher risk of bloated state if trivial actions are not filtered out.

## Next

1. Add rules for what counts as provenance-worthy versus trivial noise.
2. Pair with contradiction matrix to show where search path shaped apparent disagreement.
3. Test whether provenance spine improves post-run debugging of bad syntheses.
