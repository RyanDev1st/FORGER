# Translation Engine — 2026-05-19 v22

Parent: ARCHITECTURE.md

## Status
Created v22 variation centered on cross-domain vocabulary mapping and false disagreement detection.

## Clean Hierarchy
```text
translation_engine_2026-05-19_v22/
├── README.md
├── SKILL.md
├── scholar-dive.md
├── community-search.md
├── edge-finder.md
└── variation-pipeline.md
```

## WHY
Original reTruth separates academic, practitioner, and edge lanes well, but each lane often speaks different language for overlapping concepts. Translation Engine drifts by treating terminology as evidence terrain: concepts can be equivalent, partially overlapping, renamed, regional, historical, or false friends.

Chosen because many apparent disagreements are vocabulary mismatches, and many hidden consensuses stay invisible because search terms never cross domain boundaries.

## Files
- `SKILL.md` — orchestrator that builds translation matrix before synthesis.
- `scholar-dive.md` — academic lane for formal constructs, measures, and disciplinary synonyms.
- `community-search.md` — practitioner lane for operational labels, tool aliases, and incident terminology.
- `edge-finder.md` — edge lane for old names, regional terms, adjacent analogues, and false friends.
- `variation-pipeline.md` — pipeline, expected gains, risks, and next variations.
