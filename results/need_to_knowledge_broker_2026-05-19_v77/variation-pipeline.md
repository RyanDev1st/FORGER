Parent: ARCHITECTURE.md

# Variation Pipeline — Need-to-Knowledge Broker v77

## Status

v77. Search-first, browser-read, knowledge-broker gated.

## Scope

This variation adds a need-to-knowledge broker before lane synthesis so reTruth does not invent technical answers without a source-backed need, existing-knowledge scan, stakeholder map, and transfer path.

## Pipeline

1. Search broad lead pool for needs, publications, patents, repositories, datasets, prototypes, stakeholder evidence, implementation paths, and market/practice signals.
2. Open candidates directly with `playwright-cli`; record final URL, visible title, and quote.
3. Build `ntk-ledger.md` with source class, browser status, quote, NtK phase, need statement, existing-knowledge status, stakeholders, transfer mechanism, gate decision, and route hint.
4. Gate 1 — Need: reject supply-push ideas where technical answers are searching for a question.
5. Gate 2 — Existing knowledge: search publications, patents, repositories, datasets, and prototypes before new invention.
6. Gate 3 — Stakeholders: identify users, maintainers, approvers, funders, harmed groups, and adoption bottlenecks.
7. Gate 4 — Transfer: classify route into knowledge translation, technology transfer, commercial transaction, community adoption, or unknown.
8. Gate 5 — Impact: synthesize only candidates with need fit, knowledge status, stakeholder path, and transfer mechanism.

## Audit checks

- Need-free novelty is rejected or re-searched.
- Existing valid knowledge is adapted before inventing.
- Conflicting or absent knowledge becomes a research gap.
- Stakeholder unknowns remain visible.
- Transfer mechanism must be explicit for robust tier.

## Evidence

- RAMESES Project page was opened with `playwright-cli`; visible title confirmed the source.
- RAMESES page text said it contains publication/reporting standards, quality standards, resources, and training materials.
- Implementation Science Need to Knowledge article was opened with `playwright-cli`; visible title confirmed the source.
- Need to Knowledge text warned of supply-push models where technical answers are in search of a market question.
- Need to Knowledge text said projects may first look to existing knowledge such as publication databases and patent repositories.
- Need to Knowledge text said valid and reliable existing knowledge can save time and money.
- Need to Knowledge text said research may be needed to reconcile conflicting findings or fill knowledge gaps.
- Need to Knowledge text referenced six key stakeholder groups and mechanisms including knowledge translation, technology transfer, and commercial transaction.
- PMC mirror candidate opened to reCAPTCHA and was treated as access-friction evidence.

## Next

1. Test on a product-like research topic where many technical solutions exist without clear user need.
2. Pair with Double Diamond Grounding so Need gate feeds Discover/Define phases.
3. Pair with Citation Chaining Lattice to search patents and prior implementations from reusable artifacts.
