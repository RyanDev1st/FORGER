# Critique Revision Loop

Search-first reTruth variation using lane-local critic passes before orchestrator synthesis. Each lane must challenge its own findings with explicit failure questions, then revise weak evidence before final handoff.

## Status

Complete v49 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, verification audit, validation gates, anti-drift checkpoints, and re-fan.
- Search-first requirement from user.
- Current best-practice patterns from agentic research: retrieval before answer generation, verifier/critic loops, reflection over evidence quality, and revise-after-critique workflows.

## Core drift

Critique Revision Loop inserts a critic pass inside each lane after search and extraction but before orchestrator validation. Lanes do not merely self-score; they must attack each claim, record failure modes, and revise or demote findings before synthesis.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for high-stakes research where plausible-but-weak findings are dangerous and evidence should survive adversarial review before synthesis.
