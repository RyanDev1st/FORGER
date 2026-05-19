# Disconfirmation Engine

Search-first reTruth variation that makes every lane seek contradictory, ambiguous, noisy, and misinformation-risk evidence before accepting claims. It adapts corrective RAG and conflicting-evidence RAG patterns into a research orchestration pipeline.

## Status

Complete v56 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, quote-backed findings, verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved source content from arXiv:
  - Corrective Retrieval Augmented Generation: retrieval evaluator assesses retrieved document quality, triggers different retrieval actions, uses web search extension, and decomposes/recomposes retrieved documents to filter irrelevant information.
  - Retrieval-Augmented Generation with Conflicting Evidence: practical RAG must handle ambiguity, conflicting sources, misinformation, and noise jointly; multi-agent debate plus aggregation can collate valid answers while discarding misinformation/noise.

## Core drift

Baseline reTruth asks lanes to find strong evidence. Disconfirmation Engine asks lanes to first find support, then deliberately search against each claim before it can become synthesis material.

Each finding carries a disconfirmation state:

- `supported`
- `contradicted`
- `ambiguous`
- `noisy`
- `misinformation-risk`
- `route-mismatch`

The orchestrator then chooses a correction action:

- `accept`
- `weaken`
- `split-claim`
- `alternate-route`
- `quarantine`
- `drop`

## Package hierarchy

```text
results/disconfirmation_engine_2026-05-19_v56/
  README.md
  SKILL.md
  scholar-dive.md
  community-search.md
  edge-finder.md
  variation-pipeline.md
```

## Why this variation

Search-first research still fails when early retrieved evidence is plausible but wrong, one-sided, ambiguous, noisy, or source-route mismatched. Disconfirmation Engine treats contradiction search as part of retrieval rather than a late synthesis concern.

This should improve:

- robustness against first-hit bias
- clearer handling of disputed topics
- suppression of noisy or misinformation-prone sources
- better ambiguity reporting
- stronger synthesis confidence calibration
- more precise re-fan packets for contested claims
