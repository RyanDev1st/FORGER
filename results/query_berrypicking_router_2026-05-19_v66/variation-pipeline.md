# Variation Pipeline — Query Berrypicking Router v66

Parent: ARCHITECTURE.md

## Status

Generated variation v66 with search-first, browser-read, query-mutation routing.

## Scope

Adds an auditable query-evolution layer before lane work. Search terms mutate only from browser-read source text, not snippets or agent intuition.

## Evidence

Browser-checked sources:

1. Bates berrypicking candidate: page title exposed "The Design of Browsing and Berrypicking Techniques"; quote extraction was weak, so it is treated as inspiration not claim evidence.
2. NN/g Information Foraging page: visible text says people weigh likely relevant information against extraction effort.
3. Cochrane Handbook Chapter 4 page: visible text places searching and selecting studies inside systematic-review process.
4. Library citation-searching candidate: opened with `playwright-cli`, but extraction was weak; logged as caution against relying on search-surface promise.

## Pipeline

1. Parse brief into seed vocabulary and likely source classes.
2. Search broad seed pool.
3. Register every lead before opening.
4. Open each candidate with `playwright-cli`.
5. Build `berry-ledger.md` with quote, discovered terms, hooks, extraction cost, and route hint.
6. Mutate queries from browser-read evidence only.
7. Route branches: method/citation to Scholar, artifact/failure to Community, odd-term/dissent/analogue to Edge.
8. Lanes cite berry-ledger IDs and query branches in every finding.
9. Audit branch provenance: no snippet-only mutations, no orphan branch, no silent dead branch.
10. Synthesize seed-query claims, mutated-query claims, dead branches, vocabulary upgrades, and next-run query map.

## Why this drift might work

Many strong sources are found only after vocabulary improves. This variation makes query evolution explicit, preserving the path from seed language to better terms.

## Risks

- Branch explosion if every term becomes a query.
- Early weak sources can steer vocabulary badly.
- Quote extraction failures can make promising leads unusable.

## Mitigations

- Only browser-read terms can mutate queries.
- Each branch must cite parent berry ID.
- Dead branches are logged and capped.
- Edge gets odd-term branches but must pass crank and traceability gates.

## Next

1. Add branch-budget table by mode.
2. Add query-branch graph output.
3. Compare v66 against v65: does query mutation beat scent scoring for sparse or unfamiliar topics?
