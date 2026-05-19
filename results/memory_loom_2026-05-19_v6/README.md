# Memory Loom — 2026-05-19 v6

Parent: ARCHITECTURE.md

## Status
Variation folder focused on persistent state, evidence lineage, and evolving synthesis.

## Scope
Contains rewritten:
- `SKILL.md`
- `scholar-dive.md`
- `community-search.md`
- `edge-finder.md`
- `variation-pipeline.md`

## WHY
Original architecture already mandates incremental files, but synthesis still behaves like one-shot report assembly. Memory Loom drifts toward a ledger-first system: every finding becomes a state transition, every synthesis claim traces back through lineage, and later runs can extend rather than restart. Chosen because reTruth mission needs cumulative knowledge growth, not isolated deep dives.

## Clean Hierarchy
```text
results/memory_loom_2026-05-19_v6/
├── SKILL.md
├── scholar-dive.md
├── community-search.md
├── edge-finder.md
└── variation-pipeline.md
```
