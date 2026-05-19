# Why This Variation — Lateral Verification Loop v68

Parent: ARCHITECTURE.md

## Status

v68. Search-first, browser-read, laterally verified.

## Scope

This variation extends v67 by focusing less on coverage gaps and more on source-context verification before claims form.

## Evidence

- Stanford Civic Online Reasoning page was opened with `playwright-cli`; visible text asks who is behind information, what evidence exists, and what other sources say.
- Hapgood SIFT page was opened with `playwright-cli`; visible text lists Stop, Investigate the source, find better coverage, and trace original context.
- University of Washington SIFT guide was opened with `playwright-cli`; visible text discusses reputation, trustworthiness, corroboration, and original sources.
- NN/g confirmation-bias candidate was opened with `playwright-cli`; page returned 404, showing why dead or hallucinated URLs must be counted.

## Rationale

Search-first pipelines can produce confident synthesis from sources whose identity or original context was never checked. Lateral Verification Loop makes credibility checks happen before lane routing, not only after output.

## Tradeoff

Higher trust, lower speed. Some useful but hard-to-trace sources become fragile instead of robust.

## Next

1. v69 can combine lateral verdicts with scent scoring.
2. v70 can add source-producer taxonomy.
3. v71 can test whether fragile leads improve re-fan targeting without contaminating robust synthesis.
