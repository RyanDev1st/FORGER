# Reflection Trigger Router

Search-first reTruth variation that makes retrieval adaptive instead of fixed. It uses reflection and low-confidence triggers to decide when a lane should retrieve more, critique a source, regenerate a query, or stop.

## Status

Complete v57 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, quote-backed findings, verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved Self-RAG source content: adaptive retrieval on demand, reflection on retrieved passages and generations, and controllable behavior via reflection tokens.
- Playwright-retrieved FLARE source content: active retrieval decides when and what to retrieve during long-form generation, using predicted upcoming content as retrieval queries when low-confidence tokens appear.

## Core drift

Baseline reTruth gives each lane a broad search budget and validates after output. Reflection Trigger Router turns retrieval into a gated loop:

1. predict next needed claim
2. check confidence and source sufficiency
3. retrieve only when trigger fires
4. reflect on retrieved passages
5. accept, revise, or re-query

## Package hierarchy

```text
results/reflection_trigger_router_2026-05-19_v57/
  README.md
  SKILL.md
  scholar-dive.md
  community-search.md
  edge-finder.md
  variation-pipeline.md
```

## Why this variation

Fixed retrieval can waste searches on easy claims and under-search hard claims. Reflection Trigger Router makes lanes retrieve when evidence gaps become visible, not because the initial budget says so.

This should improve:

- fewer unnecessary searches
- better long-answer coverage
- targeted retrieval for weak passages
- clearer source sufficiency decisions
- stronger query regeneration
- better stop conditions
