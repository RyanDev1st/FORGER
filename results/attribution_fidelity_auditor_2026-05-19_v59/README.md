# Attribution Fidelity Auditor

Search-first reTruth variation that separates source correctness from source faithfulness. It checks not only whether a cited source can support a claim, but whether the claim genuinely depends on that source rather than being post-rationalized after generation.

## Status

Complete v59 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, quote-backed findings, verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved attribution source content: attributed QA is crucial for information-seeking systems, needs reproducible evaluation, human annotation standards, and automatic metrics for attribution.
- Playwright-retrieved RAG attribution source content: citation correctness is insufficient; citation faithfulness checks whether reliance on cited documents is genuine rather than post-rationalized, and many current attributed answers lack faithfulness.

## Core drift

Baseline reTruth requires a verbatim quote per finding. Attribution Fidelity Auditor adds a stricter question: did this source actually cause or constrain the claim?

Each finding now carries:

- citation correctness
- citation faithfulness
- reliance trace
- attribution risk
- post-rationalization check

## Package hierarchy

```text
results/attribution_fidelity_auditor_2026-05-19_v59/
  README.md
  SKILL.md
  scholar-dive.md
  community-search.md
  edge-finder.md
  variation-pipeline.md
```

## Why this variation

Quote-backed claims can still be misleading when the quote is attached after the model already formed the claim. This variation turns attribution into an audit target, not formatting requirement.

This should improve:

- source trustworthiness
- citation honesty
- claim-source dependency tracing
- reduced post-rationalized evidence
- stronger synthesis confidence
- better auditability for high-stakes topics
