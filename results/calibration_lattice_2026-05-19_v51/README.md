# Calibration Lattice

Search-first reTruth variation using explicit uncertainty calibration and evidence attribution per finding. Each lane must not only state claims, but quantify confidence basis, attribution strength, and what evidence would move the claim up or down.

## Status

Complete v51 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, verification audit, and re-fan.
- Search-first requirement from user.
- Current best-practice patterns from agentic RAG and retrieval-quality research: citation grounding, uncertainty estimation, attribution strength, and calibrated confidence tied to evidence quality rather than style.

## Core drift

Calibration Lattice adds explicit confidence structure around every finding. Instead of plain `high|medium|low`, lanes must explain why confidence sits there, what evidence supports it, what weakens it, and what missing evidence would change it.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for ambiguous, fast-moving, or evidence-fragile topics where user needs not only answer, but calibrated confidence and movement conditions.
