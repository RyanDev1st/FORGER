# Evidence Graph Router

Search-first reTruth variation that turns retrieved evidence into a relationship graph before synthesis. It uses graph-guided expansion, chunk organization, entity neighborhoods, and community summaries to answer corpus-level or relationship-heavy briefs.

## Status

Complete v58 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, quote-backed findings, verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved KG-guided RAG source content: semantic retrieval of isolated chunks ignores intrinsic relationships; KG-guided chunk expansion and KG-based organization improve diversity, coherence, response quality, and retrieval quality.
- Playwright-retrieved GraphRAG source content: conventional RAG fails on global corpus questions; graph indexes derive entity knowledge graphs, pregenerate community summaries, and improve comprehensiveness and diversity for global sensemaking questions.

## Core drift

Baseline reTruth writes findings as lane-local lists. Evidence Graph Router makes each lane emit nodes and edges:

- claim nodes
- source nodes
- entity nodes
- method/artifact nodes
- contradiction nodes
- analogy nodes
- support / contradict / depends-on / same-entity / adjacent-to edges

The orchestrator synthesizes from graph neighborhoods and communities rather than flat lane summaries.

## Package hierarchy

```text
results/evidence_graph_router_2026-05-19_v58/
  README.md
  SKILL.md
  scholar-dive.md
  community-search.md
  edge-finder.md
  variation-pipeline.md
```

## Why this variation

Many research questions are relationship questions, not isolated-fact questions. Flat retrieval can miss how sources, methods, artifacts, and contradictions connect. Evidence Graph Router makes relationships first-class so synthesis can answer both local claim questions and global sensemaking questions.

This should improve:

- global topic coverage
- evidence coherence
- cross-source relationship tracing
- contradiction localization
- cross-lane transfer
- community-level synthesis
