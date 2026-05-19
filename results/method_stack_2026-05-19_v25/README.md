# Method Stack — 2026-05-19 v25

Parent: ARCHITECTURE.md

## Status
Created v25 variation centered on method-separated evidence synthesis.

## Clean Hierarchy
```text
method_stack_2026-05-19_v25/
├── README.md
├── SKILL.md
├── scholar-dive.md
├── community-search.md
├── edge-finder.md
└── variation-pipeline.md
```

## WHY
Original reTruth separates source lanes, but evidence methods can still collapse during synthesis. A benchmark, incident report, randomized trial, expert claim, and archive trace should not carry same inference shape. Method Stack drifts by grouping evidence by how knowledge was produced before merging claims.

Chosen because many wrong conclusions come from method transfer errors: benchmark results become field advice, observational findings become causal claims, or anecdotal incidents become general laws.

## Files
- `SKILL.md` — orchestrator that builds method stack before synthesis.
- `scholar-dive.md` — academic lane for experimental, quasi-experimental, observational, review, and model evidence.
- `community-search.md` — practitioner lane for benchmarks, incidents, repos, maintainer claims, and field reports.
- `edge-finder.md` — edge lane for neglected methods, archival traces, analogues, and method blindspots.
- `variation-pipeline.md` — pipeline, expected gains, risks, and next variations.
