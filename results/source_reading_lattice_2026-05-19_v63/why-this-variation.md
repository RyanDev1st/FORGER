# Why This Variation — Source Reading Lattice v63

Parent: ARCHITECTURE.md

## Status

v63. Built after user correction: always search, then directly check contents with `playwright-cli`, then read source.

## Scope

This variation changes evidence intake. It does not trust WebSearch snippets or guessed URLs. Search creates candidates only. Browser-opened page text creates evidence.

## Evidence

- `playwright-cli` opened Cochrane Handbook current page and visible text showed systematic review workflow chapters.
- `playwright-cli` opened Springer/Systematic Reviews evidence-map article and visible text described evidence mapping as emerging systematic method.
- `playwright-cli` opened IxDF design-thinking article and visible text described iterative empathize/reframe/ideate/prototype/test logic.
- `playwright-cli` opened NN/g design-thinking article and visible text described hands-on, user-centric process.
- `playwright-cli` showed Google search was blocked and two leads were page-not-found, proving why direct checks matter.

## Rationale

Original gnosis already demands quotes, but quote verification happens after lanes. Source Reading Lattice moves source verification before lane work. This should improve quality because bad leads die before they shape synthesis.

## Tradeoff

More orchestration cost. Better provenance.

## Next

1. v64 should formalize rejected-source taxonomy.
2. v65 could add browser snapshot caching.
3. Later variant could restore more lane independence by giving each lane its own browser-read quota.
