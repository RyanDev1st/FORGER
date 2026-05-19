Parent: ARCHITECTURE.md

# Why This Variation — Saturation Stop Rule v73

## Status

v73. Search-first, browser-read, saturation-gated.

## Scope

This variation extends v72 by adding explicit stop logic to the search process, so search ending becomes auditable rather than quota-driven.

## Evidence

- Cochrane Chapter 4 was opened with `playwright-cli`; visible title confirmed the source concerns searching and selecting studies.
- Cochrane Chapter 4 indexed text said database search development is iterative and exploratory.
- Cochrane Chapter 4 indexed text said suggested stopping rules include no new relevant records or precision below a cutoff.
- Cochrane Chapter 4 indexed text said scarce evidence means authors should be cautious about deciding when to stop.
- Cochrane Chapter 4 indexed text mentioned capture-recapture and relative recall as approaches for assessing search performance.
- Qualitative saturation PMC candidate returned 404, and CERQual candidate returned 403; both show stop decisions may be caused by access limits rather than true saturation.

## Rationale

Volume contracts prevent under-searching, but they do not prove search is complete. Saturation Stop Rule records whether further searching still produces new relevant records, only redundancy, unusable noise, or blocked paths. It keeps uncertainty visible when stopping is pragmatic rather than evidentiary.

## Tradeoff

More defensible stopping and fewer arbitrary cutoffs, but more bookkeeping and potential false confidence if marginal-yield signals are over-interpreted.

## Next

1. Calibrate stop thresholds against real `/gnosis` runs.
2. Pair with Search Provenance Spine to make stop decisions reproducible.
3. Add lane-specific scarcity overrides for medical, legal, safety, and finance domains.
