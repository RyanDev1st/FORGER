# Variation Pipeline — Lateral Verification Loop v68

Parent: ARCHITECTURE.md

## Status

Generated variation v68 with search-first, browser-read, lateral verification before lane claims.

## Scope

Adds source-identity, corroboration, and original-context checks before routing leads into lane findings.

## Evidence

Browser-checked sources:

1. Stanford Civic Online Reasoning page: visible text asks who is behind information, what evidence exists, and what other sources say.
2. Hapgood SIFT page: visible text lists four moves: Stop, Investigate the source, find better coverage, trace original context.
3. University of Washington SIFT guide: visible text emphasizes reputation, trustworthiness, corroboration, and tracing original sources.
4. NN/g confirmation-bias candidate: browser returned 404; logged as dead/hallucinated URL caution.

## Pipeline

1. Parse brief for verification risk and source-authority needs.
2. Search broad lead pool across academic, practitioner, and edge surfaces.
3. Register each candidate before opening.
4. Open each candidate with `playwright-cli` and capture visible text, quote, source producer, and failure state.
5. Build `lateral-ledger.md` with who/evidence/other-sources/original-context fields.
6. Run SIFT-style loop: Stop, Investigate, Find better coverage, Trace original context.
7. Route leads by verdict: pass, fragile, fail, blocked.
8. Lanes cite lateral-ledger IDs and use only pass or explicitly flagged fragile leads.
9. Audit that source identity and trace fields exist for every claim source.
10. Synthesize verified claims, fragile claims, failed high-scent leads, access gaps, and lateral search lessons.

## Why this drift might work

It moves verification earlier. Rather than letting lanes build polished claims from plausible pages and only auditing later, this variant makes source context a precondition for claim formation.

## Risks

- Slower than direct lane fan-out.
- Can over-penalize useful firsthand field notes with weak institutional identity.
- Tracing original context may fail on archived or dynamic sources.

## Mitigations

- Fragile verdict preserves useful leads without promoting them to robust claims.
- Edge lane can keep non-institutional sources if provenance and track record are visible.
- Blocked leads become access gaps instead of disappearing.

## Next

1. Add verdict thresholds by domain-harm level.
2. Add lateral-ledger compact schema for token control.
3. Compare v68 against v63: does pre-claim verification reduce quote/link audit failures?
