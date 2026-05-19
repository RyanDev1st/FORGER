# Variation Pipeline — Rejection Flow Auditor v64

Parent: ARCHITECTURE.md

## Status

Generated variation v64 with search-first and direct `playwright-cli` source checks.

## Scope

Adds first-class accounting for rejected leads and excluded sources.

## Evidence

Browser-checked sources:

1. PRISMA 2020 flow diagram page: visible text says flow diagram maps records identified, included, excluded, and reasons for exclusions.
2. Hapgood SIFT page: visible text lists four moves: Stop, Investigate the source, find better coverage, trace original context.
3. University of Washington SIFT guide: visible text says assess reputation/trustworthiness and seek corroboration in trusted sources.
4. Cochrane Handbook Chapter 4 page: visible text shows searching and selecting studies as explicit systematic-review phase.

## Pipeline

1. Search broad lead pool.
2. Register every candidate before opening.
3. Open each source with `playwright-cli`.
4. Record browser status, final URL, title, quote, include/exclude verdict.
5. Build PRISMA-like screening flow counts.
6. Route included and rejected leads to lanes.
7. Lanes write findings and exclusion notes.
8. Audit count math and quote presence.
9. Synthesize included evidence plus rejection patterns.

## Why this drift might work

Most research pipelines only show survivors. This variant makes source mortality visible. Exclusion patterns reveal bias: blocked sources, vendor-heavy results, weak academic coverage, stale practitioner evidence, or crank-rich edge search.

## Risks

- More bookkeeping.
- Can overfocus on rejects.
- Slower than v63.

## Mitigations

- Exclusion notes are short.
- Rejected edge sources can guide search terms but not claims.
- Audit enforces count math and prevents fake completeness.

## Next

1. Add strict exclusion taxonomy.
2. Add minimum source-flow counts before lane spawn.
3. Compare against v63: does rejection ledger improve synthesis trust?
