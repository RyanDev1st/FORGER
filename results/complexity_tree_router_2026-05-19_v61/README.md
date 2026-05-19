# Complexity Tree Router

Search-first reTruth variation that routes queries by complexity and retrieves at different abstraction levels. It avoids using the same retrieval style for simple fact checks, medium synthesis asks, and complex multi-step corpus questions.

## Status

Complete v61 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, quote-backed findings, verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved Adaptive-RAG source content: not all queries need same retrieval depth; systems should dynamically choose among no-retrieval, single-step retrieval, and iterative retrieval based on query complexity.
- Playwright-retrieved RAPTOR source content: tree-organized retrieval over recursive summaries helps integrate long document context and supports complex multi-step reasoning at different abstraction levels.

## Core drift

Baseline reTruth gives lanes similar budget shapes per effort mode. Complexity Tree Router adds two new controls before lane execution:

- complexity routing
- abstraction-level routing

Each brief or subquestion is classified into:
- C0 direct fact / obvious lookup
- C1 focused evidence question
- C2 synthesis over multiple sources
- C3 multi-step or corpus-level reasoning

Then retrieval level is chosen:
- L0 raw passage only
- L1 local summary + passage
- L2 branch summary + passages
- L3 global summary + branch drill-down

## Package hierarchy

```text
results/complexity_tree_router_2026-05-19_v61/
  README.md
  SKILL.md
  scholar-dive.md
  community-search.md
  edge-finder.md
  variation-pipeline.md
```

## Why this variation

Search-first pipelines waste effort when every question gets same depth. Some asks need quick exact retrieval. Others need document-level or corpus-level summarization before drilling down. Complexity Tree Router makes route choice explicit.

This should improve:

- cost efficiency
- latency on simple asks
- abstraction matching
- long-document handling
- global-to-local retrieval
- cleaner re-fan targeting
