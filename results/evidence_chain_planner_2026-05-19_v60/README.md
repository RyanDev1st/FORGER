# Evidence Chain Planner

Search-first reTruth variation that plans and verifies multi-hop evidence chains instead of treating retrieval as mostly flat lookup. It decomposes complex questions into chained hops, retrieves each hop, prunes distractors, and only accepts claims with a complete supporting chain.

## Status

Complete v60 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, quote-backed findings, verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved HopRAG source content: semantic similarity alone misses logical relevance; graph-structured exploration plus retrieve-reason-prune improves multi-hop retrieval and answer quality.
- Playwright-retrieved PRISM source content: multi-hop QA benefits from question decomposition, selector/adder loops, high-precision context selection, recall completion, and compact but comprehensive supporting passages.

## Core drift

Baseline reTruth lets lanes gather findings around a topic. Evidence Chain Planner makes lanes build explicit evidence chains:

- hop 1: first fact or anchor
- hop 2: linked fact or entity
- hop 3+: dependent follow-up fact
- prune: drop distracting branch
- close: chain supports claim or fails

Claims become valid only when chain logic is visible.

## Package hierarchy

```text
results/evidence_chain_planner_2026-05-19_v60/
  README.md
  SKILL.md
  scholar-dive.md
  community-search.md
  edge-finder.md
  variation-pipeline.md
```

## Why this variation

Broad questions often require linked evidence, not single strong sources. Flat retrieval can find plausible passages but miss bridge facts, hidden dependencies, or distractors. Evidence Chain Planner makes multi-hop support explicit before synthesis.

This should improve:

- complex question coverage
- bridge-fact retrieval
- distractor pruning
- claim dependency visibility
- chain-level re-fan
- lower false confidence from isolated hits
