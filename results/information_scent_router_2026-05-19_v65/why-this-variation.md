# Why This Variation — Information Scent Router v65

Parent: ARCHITECTURE.md

## Status

v65. Search-first, browser-read, scent-routed.

## Scope

This variation extends v64 by moving from rejection accounting to attention allocation. Instead of only counting source mortality, it asks which leads deserve effort before lane work begins.

## Evidence

- NN/g Information Foraging page was opened with `playwright-cli`; visible text says people weigh likely relevant information against effort required.
- NN/g Information Scent page was opened with `playwright-cli`; visible text describes cues from labels, context, and prior knowledge.
- Cochrane Chapter 4 was opened with `playwright-cli`; visible text treats searching and selecting studies as part of systematic-review process.
- PRESS search-strategy source was inspected as a possible search-quality lead, but claims from it should require a fresh quote check before use.

## Rationale

v64 made excluded leads visible. v65 makes effort allocation visible. Search-first research needs a way to decide which leads to read deeply, which to route to specialist lanes, and which to drop before they consume time.

## Tradeoff

Faster and more selective than equal fan-out, but more vulnerable to bias from familiar labels and easy extraction.

## Next

1. v66 can introduce adaptive query mutation from false-scent drops.
2. v67 can make lane budgets dynamic based on scent distribution.
3. v68 can compare high-scent included leads against low-scent discarded leads for blind spots.
