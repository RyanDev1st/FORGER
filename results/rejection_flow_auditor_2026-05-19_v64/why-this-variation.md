# Why This Variation — Rejection Flow Auditor v64

Parent: ARCHITECTURE.md

## Status

v64. Search-first, browser-read, rejection-aware.

## Scope

This variation extends v63 by treating excluded sources as data. It uses direct page reads before writing and records failed leads instead of silently discarding them.

## Evidence

- PRISMA page was opened with `playwright-cli`; visible text says flow diagram maps records identified, included, excluded, and exclusion reasons.
- Hapgood SIFT page was opened with `playwright-cli`; visible text names Stop, Investigate, Find better coverage, Trace original context.
- University of Washington SIFT guide was opened with `playwright-cli`; visible text discusses reputation, trustworthiness, and corroboration.
- Cochrane Chapter 4 was opened with `playwright-cli`; visible text places searching/selecting studies inside systematic review process.

## Rationale

v63 proved direct source reading matters. v64 adds accountability for what did not make it into synthesis. This should reduce cherry-picking and make gaps easier to see.

## Tradeoff

More tokens and time for screening ledger. Better auditability.

## Next

1. v65 can introduce source-flow thresholds.
2. v66 can make exclusion taxonomy adaptive by domain.
3. v67 can compare included vs excluded source distributions.
