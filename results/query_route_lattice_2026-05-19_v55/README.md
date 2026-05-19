# Query Route Lattice

Search-first reTruth variation using explicit question decomposition and source-route mapping before lane retrieval. The system builds a lattice of research cells, assigns each cell to the lane most likely to resolve it, and prevents lanes from searching broad vague queries.

## Status

Complete v55 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, verification audit, anti-drift, retries, and re-fan.
- Search-first requirement from user.
- Current best-practice patterns from agentic search: query decomposition, multi-hop retrieval planning, route selection, evidence-first answering, and iterative retrieval from unresolved cells.

## Core drift

Baseline reTruth sends each lane a brief and lets lane mandates shape search. Query Route Lattice inserts a shared decomposition layer first: the orchestrator breaks the topic into answerable question cells, classifies each cell by evidence type, and assigns lane/source routes before retrieval starts.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for broad, ambiguous, or multi-hop topics where naive lane search risks duplicated queries, missed subquestions, or weak synthesis from uneven coverage.
