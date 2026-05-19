Parent: ARCHITECTURE.md

# Variation Pipeline — Evidence Freshness Clock v75

## Status

v75. Search-first, browser-read, recency-aware.

## Scope

This variation adds a freshness clock before synthesis so evidence is weighted by topic pace, update signal, and decay risk instead of date alone.

## Pipeline

1. Parse topic pace, harm domain, tool/version exposure, and likely decay modes.
2. Search broad lead pool across source classes and time windows.
3. Open candidates directly with `playwright-cli`.
4. Build `freshness-clock.md` with source date, last updated, topic pace, freshness status, update signal, and decay risk.
5. Separate older sources into foundation, historical context, stale guidance, superseded method/tool claim, or unresolved unknown.
6. Re-search high-impact aging/stale claims in fast-moving topics.
7. Route freshness problems by lane:
   - scholar = new studies, methods, updated reviews, certainty changes
   - community = tool-version drift, deprecations, stale benchmarks, maintainer updates
   - edge = historical precursors, revived ideas, stale contrarian claims
8. Synthesize current, aging, historical, stale, and unknown-update claims.

## Audit checks

- Old does not automatically mean stale.
- Recent does not automatically mean reliable.
- High-impact stale claims trigger re-search.
- Historical claims are preserved only when they change interpretation.

## Evidence

- Cochrane Chapter IV was browser-opened and visibly titled "Updating a review".
- Cochrane Chapter IV indexed text said out-of-date reviews that omit available evidence risk misleading decision makers.
- Cochrane Chapter IV indexed text said new studies, new data, new methods, or new analyses can change review findings.
- Cochrane Chapter IV indexed text said some fields evolve rapidly while others are more stable.
- Cochrane Chapter IV indexed text said update decisions may use surveillance searches, expert contact, and quantitative or qualitative assessments.
- Cochrane Chapter IV indexed text said updates can reconsider PICO, eligibility criteria, comparisons, and outcomes.
- BMJ living evidence candidate returned 403 and was treated as access-limit evidence.

## Next

1. Test on fast-moving tooling topics and slower foundational research topics.
2. Pair with Incentive Bias Ledger to distinguish stale-but-independent from recent-but-sponsored.
3. Add lane-specific decay defaults after calibration.
