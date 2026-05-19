# Coverage Map Planner

Search-first reTruth variation using explicit coverage maps before and during lane search. Each lane plans which slices of the topic space it must cover, tracks hit/miss status live, then uses coverage gaps to drive follow-up queries and re-fan.

## Status

Complete v53 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, verification audit, anti-drift, retries, and re-fan.
- Search-first requirement from user.
- Current best-practice patterns from retrieval planning and agentic RAG: query decomposition, source diversity, coverage tracking, and gap-driven retrieval instead of ad hoc search wandering.

## Core drift

Coverage Map Planner treats research as space coverage problem. Before extracting findings, each lane defines topic slices, source classes, and decision angles it must touch. Search then updates a live coverage map, making holes visible early and routing effort toward uncovered zones.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for broad or messy topics where premature convergence is likely and user needs confidence that search space was actually covered.
