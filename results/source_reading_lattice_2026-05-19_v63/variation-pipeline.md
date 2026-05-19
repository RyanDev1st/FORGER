# Variation Pipeline — Source Reading Lattice v63

Parent: ARCHITECTURE.md

## Status

Generated variation v63 after correcting workflow: search first, then direct `playwright-cli` source checks, then write.

## Scope

Rewrites gnosis so source reading is an orchestrator gate before lane fan-out.

## Evidence

Browser-checked sources:

1. Cochrane Handbook page opened via `playwright-cli`; visible text lists planning, scope, inclusion criteria, searching, collecting data, risk of bias, synthesis, and reporting chapters.
2. Springer/Systematic Reviews evidence-map article opened via `playwright-cli`; visible text says need for systematic evidence-review methods is increasing and evidence mapping is emerging.
3. IxDF design-thinking article opened via `playwright-cli`; visible text describes non-linear iterative process, reframing, brainstorming, prototyping, and testing.
4. NN/g design-thinking article opened via `playwright-cli`; visible text describes hands-on user-centric problem solving and phased design thinking.
5. Google search page was blocked by anti-bot page; logged as rejected search surface.
6. Two candidate Cochrane/Campbell URLs returned page-not-found; logged as rejected leads.

## Pipeline

1. Parse brief.
2. Search for candidate leads.
3. Open candidate sources in browser with `playwright-cli`.
4. Extract title, final URL, visible text, and quote.
5. Build `source-ledger.md`.
6. Route opened sources to Scholar, Community, Edge.
7. Require lane findings to cite ledger ids.
8. Audit final URL and quote against captured page text.
9. Synthesize source-read claims and rejected leads.

## Why this drift might work

It stops source laundering. Search only proposes leads; browser-read source ledger decides what counts. This fits user preference for actual source reading and strengthens quote audit.

## Risks

- Slower upfront.
- Some pages block automation.
- Shared ledger may reduce lane independence.

## Mitigations

- Keep rejected-source log.
- Allow lanes to add new ledger entries after browser-read checks.
- Preserve edge lane for non-obvious sources, but enforce direct page reading.

## Next

1. Add exact `playwright-cli --raw eval "document.body.innerText"` command template to orchestrator.
2. Add source-ledger minimum: 5 opened, 2 rejected, 1 critique before lane spawn.
3. Compare against v62 for evidence quality.
