Parent: ARCHITECTURE.md

# Why This Variation — Incentive Bias Ledger v74

## Status

v74. Search-first, browser-read, disclosure-sensitive.

## Scope

This variation extends v73 by adding incentive-aware claim weighting after search, provenance, and stop logic.

## Evidence

- Cochrane Chapter 7 was opened with `playwright-cli`; visible title confirmed the source concerns bias and conflicts of interest among included studies.
- Cochrane Chapter 7 indexed text said conflicts can affect trial design, conduct, analysis, reporting, directness, heterogeneity, risk of bias, and missing results.
- Cochrane Chapter 7 indexed text said conflicts should not be inserted directly into risk-of-bias assessment because the pathway is broader than one trial estimate.
- Cochrane Chapter 7 indexed text said conflicts may contribute to non-publication of negative trials or unfavourable results.
- ICMJE indexed text said authors are responsible for disclosing relationships and activities that might bias or be seen to bias work.
- ICMJE indexed text said support sources, sponsor names, funder roles, restrictions, and data access should be declared.
- CRAAP guide candidate returned 404, reinforcing that generic credibility guides should not substitute for source-specific disclosure evidence.

## Rationale

Search-first verification can prove a source exists and says something, but not why the source says it. Incentive Bias Ledger separates incentives from ad hominem dismissal by requiring a plausible bias pathway and corroboration check before downgrading or excluding claims.

## Tradeoff

Better credibility weighting and fewer naive source reads, but more judgment burden and risk of over-penalizing transparent sources while under-detecting undisclosed incentives.

## Next

1. Add independent-corroboration thresholds for each incentive vector.
2. Pair with triangulation confidence matrix so incentive downgrades affect tiering.
3. Test on domains with known sponsor, platform, or ideology pressure.
