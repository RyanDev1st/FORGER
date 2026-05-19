Parent: ARCHITECTURE.md

# Why This Variation — Evidence Freshness Clock v75

## Status

v75. Search-first, browser-read, update-sensitive.

## Scope

This variation extends v74 by adding recency and update-state weighting after incentive and provenance checks.

## Evidence

- Cochrane Chapter IV was opened with `playwright-cli`; visible title confirmed the source concerns updating a review.
- Cochrane Chapter IV indexed text said reviews that are out of date and omit available evidence risk misleading decision makers.
- Cochrane Chapter IV indexed text said new studies, new data, new methods, and new analyses can change review findings.
- Cochrane Chapter IV indexed text said some research areas evolve rapidly while others are stable.
- Cochrane Chapter IV indexed text said update decisions can rely on surveillance searches, expert contact, and quantitative or qualitative assessments.
- Cochrane Chapter IV indexed text said updates can reconsider review questions, PICO, eligibility criteria, comparisons, and outcomes.
- BMJ living evidence candidate returned 403, demonstrating that current-method sources can be access-blocked and should be logged rather than inferred.

## Rationale

Search-first pipelines often mix old authoritative sources, current weak sources, historical context, and stale operational advice. Evidence Freshness Clock prevents recency bias in both directions: old foundations can survive, but stale fast-moving claims must be refreshed or downgraded.

## Tradeoff

Better currentness control and clearer historical framing, but more date bookkeeping and risk of overfitting freshness labels without domain-specific decay calibration.

## Next

1. Add default decay windows for medical, software, policy, finance, and historical domains.
2. Combine with Saturation Stop Rule so stale high-impact claims trigger re-search before stop.
3. Test on topics where old seminal work remains true but current implementation changed.
