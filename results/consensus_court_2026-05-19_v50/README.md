# Consensus Court

Search-first reTruth variation using cross-lane argument briefs and explicit adjudication before synthesis. Each lane must not only produce findings, but also state strongest case, biggest uncertainty, and likely conflict points for court-style review.

## Status

Complete v50 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, verification audit, and re-fan.
- Search-first requirement from user.
- Current best-practice patterns from multi-agent debate and judge-style agent systems: competing arguments, explicit uncertainty, adjudication over evidence quality, and structured consensus instead of flat averaging.

## Core drift

Consensus Court adds an adjudication layer after lane output. Lanes prepare argument briefs, not only findings. Orchestrator then conducts evidence-first court review: where lanes agree, where they conflict, what evidence is strongest, and what remains unresolved.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for contested, strategic, or ambiguous topics where disagreement matters and final answer should distinguish consensus, split verdicts, and open uncertainty.
