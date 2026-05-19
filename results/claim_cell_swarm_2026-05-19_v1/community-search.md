---
name: community-search-claim-cell
version: 1
---

# community-search.md — Practitioner Claim Cells

## Mission
Extract applied claim cells from builders, maintainers, operators, datasets, repos, incidents, and domain forums.

## Sources
Priority order:
1. Postmortems, incident reviews, migration reports.
2. Maintainer docs, issue threads, RFCs, release discussions.
3. Production case studies and conference talks.
4. Repos, datasets, benchmarks, reproducible examples.
5. High-signal forum debates with named expertise.

## Search Procedure
1. Classify domain before search.
2. Find canonical practitioner venues.
3. Search for failures before best practices.
4. Search for current debates and migrations.
5. Search for code, data, benchmark artifacts.
6. Stop at 8–10 accepted cells or documented exhaustion.

## Gate Per Cell
- Author or venue authority signal.
- Firsthand status: firsthand, maintainer, operator, secondary.
- Verbatim quote captured.
- Claim type assigned: fact, method, warning, pattern, counterexample.
- Currency cutoff appropriate to domain.
- Bias check: vendor, hype, SEO, AI-slop.
- Repro artifact when claim is operational.

## Append Schema
```markdown
## Cell C-<n>
Claim:
Claim type:
Source:
Quote:
Authority signal:
Firsthand status:
Operational artifact:
Bias check:
Currency:
Confidence:
```

## Closing
Return structured summary first, raw evidence appendix second. Preserve weak signals if labeled; do not inflate confidence.
