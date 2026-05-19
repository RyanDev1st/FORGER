# Variation Pipeline — Triangulation Confidence Matrix v69

Parent: ARCHITECTURE.md

## Status

Generated variation v69 with search-first, browser-read, confidence-tiered triangulation.

## Scope

Adds shared claim confidence matrix before synthesis. Claims are sorted by source diversity, independence, evidence type, bias risk, and confidence tier.

## Evidence

Browser-checked sources:

1. BetterEvaluation triangulation candidates: opened with `playwright-cli`, but extraction was weak; treated as caution about promising search surfaces.
2. NCBI Bookshelf source: visible title concerned risk of bias and confounding in observational studies.
3. Cochrane Chapter 24: visible text concerned non-randomized studies and linked handbook chapters for risk of bias and certainty of evidence.
4. Existing gnosis mandates: browser-independent repo read showed triangulation, isolated-claim caps, cross-source corroboration, and robust-tier exclusion for flagged findings.

## Pipeline

1. Parse brief for claim types and confidence needs.
2. Search broad lead pool across lanes and corroboration surfaces.
3. Register leads, then open candidates with `playwright-cli`.
4. Build `confidence-matrix.md` with source diversity, independence, evidence type, bias risk, and tier.
5. Classify claims as robust, supported, fragile, exploratory, or drop.
6. Route method/synthesis claims to Scholar, firsthand/practice claims to Community, exploratory analogues to Edge.
7. Require every lane finding to cite matrix ID and tier.
8. Audit that robust claims have independent/cross-class support and edge exploratory claims stay out of robust tier.
9. Synthesize by tier, not by raw count.
10. Preserve dropped and contradicted claims as calibration data.

## Why this drift might work

Current gnosis already values triangulation, but the scoring happens inside lanes and synthesis. This variation turns confidence into a shared object before final claims are written.

## Risks

- Extra matrix bookkeeping.
- False precision if tiers look more objective than they are.
- Weak but original firsthand claims may be underweighted.

## Mitigations

- Tiers are labels, not numeric truth scores.
- Firsthand evidence has its own evidence type.
- Edge keeps exploratory signals separate from robust consensus.
- Bias risk must be named for every claim.

## Next

1. Add confidence-tier examples.
2. Add independence taxonomy.
3. Compare v69 against v68: does matrix tiering improve synthesis clarity after lateral verification?
