# Evidence Budget Router

Search-first reTruth variation using adaptive evidence budgets and stop rules. Each lane gets an explicit search budget, spends it by evidence value, and must justify when to continue digging versus stop and synthesize.

## Status

Complete v54 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, verification audit, anti-drift, retries, and re-fan.
- Search-first requirement from user.
- Current best-practice patterns from adaptive retrieval and agentic research: value-aware evidence acquisition, stop criteria, and budgeted search rather than endless expansion.

## Core drift

Evidence Budget Router treats search attention as limited resource. Lanes plan budget by query family, spend more on high-value unresolved claims, stop low-yield digging early, and preserve unspent or exhausted budget state for orchestrator decisions.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for broad or expensive research where endless search causes drift and user needs disciplined stopping behavior.
