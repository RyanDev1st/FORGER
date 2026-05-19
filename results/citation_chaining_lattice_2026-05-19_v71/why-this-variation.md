Parent: ARCHITECTURE.md

# Why This Variation — Citation Chaining Lattice v71

## Status

v71. Search-first, browser-read, anchor-following.

## Scope

This variation extends v70 by turning readable seed sources into structured citation anchors instead of treating chaining as optional follow-up.

## Evidence

- Cochrane Chapter 4 indexed text said review authors should check reference lists of included studies and relevant systematic reviews.
- Cochrane Chapter 4 indexed text said to use citation searching on key articles in addition to a database search.
- Cochrane Chapter 4 indexed text said search development is iterative and exploratory, with stopping rules tied to whether new relevant records appear.
- PMC candidate opened with `playwright-cli` but hit reCAPTCHA, so it served as access-friction evidence rather than content evidence.
- MIT guide DNS failure and Wisconsin guide 404 showed soft guidance pages around snowballing are often less reliable than direct anchor sources.

## Rationale

Search-first systems still overdepend on query wording. Citation chaining reduces wording fragility by letting strong sources reveal their own evidence neighborhood. Backward, forward, and sibling chains create more grounded expansion than repeated synonym guessing, especially when domain language is unstable or sparse.

## Tradeoff

Better anchor-based discovery and clearer stop rules, but more bookkeeping and higher risk of local clustering around one evidence family if anti-drift checks fail.

## Next

1. Pair with triangulation confidence tiers for chain outputs from mixed source classes.
2. Add chain-diversity caps to prevent one anchor from dominating synthesis.
3. Test whether blocked chain nodes should trigger alternate venue routing automatically.
