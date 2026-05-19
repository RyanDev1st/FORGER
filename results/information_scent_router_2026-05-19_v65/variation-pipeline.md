# Variation Pipeline — Information Scent Router v65

Parent: ARCHITECTURE.md

## Status

Generated variation v65 with search-first, browser-read, scent-scored routing.

## Scope

Adds explicit effort allocation before lane work. Leads are not treated equally; they are scored by information scent, corroboration potential, and extraction cost.

## Evidence

Browser-checked sources:

1. NN/g Information Foraging page: visible text says users decide based on likely relevant information against effort required.
2. NN/g Information Scent page: visible text says users use cues from link labels, context, and prior experience to choose paths.
3. Cochrane Handbook Chapter 4 page: visible text places searching and selecting studies inside systematic-review process.
4. PRESS search-strategy article candidate was inspected as a search-quality lead; use only if later browser text exposes a clear quote.

## Pipeline

1. Parse brief into source classes and likely scent cues.
2. Search broad lead pool across academic, practitioner, and edge surfaces.
3. Open each candidate with `playwright-cli`.
4. Record final URL, title, visible quote, source class, scent cues, extraction cost, and corroboration potential in `scent-ledger.md`.
5. Score each lead with plain-language priority: strong scent + corroboration - extraction cost.
6. Route high-method leads to Scholar, high-action leads to Community, and weak-but-upside leads to Edge.
7. Discard low-scent/high-cost leads unless needed to cover a known gap.
8. Lanes cite scent-ledger IDs in every finding.
9. Audit that top-scent leads were used, high-cost leads were justified, and quote text exists in browser-read content.
10. Synthesize high-scent claims, expensive-but-worth-it claims, false-scent drops, and search-route lessons.

## Why this drift might work

Research agents often spend equal time on unequal leads. This variation makes attention allocation visible. It should improve yield when search space is large and many results are vague, promotional, blocked, or expensive to extract.

## Risks

- Scent scoring can overvalue familiar terms.
- Low-scent sources may contain important disconfirming evidence.
- Extraction cost can bias against PDFs, archives, or non-English material.

## Mitigations

- Edge lane owns weak-scent/high-upside exceptions.
- Audit checks whether discarded leads hide known gaps.
- Search lessons preserve false-scent cues for future runs.

## Next

1. Add a calibration rubric for scent strength.
2. Compare v65 against v64: does scent scoring improve claim/action yield or hide rejected-source bias?
3. Test whether Edge recovers valuable low-scent leads without becoming random.
