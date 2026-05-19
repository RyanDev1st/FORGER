# Recovery Branch Matrix

Search-first reTruth variation using explicit failure branches and recovery plans at each lane stage. Each lane must know not only how to search, but how to recover when source baskets fail, evidence collapses, or route quality degrades.

## Status

Complete v52 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, verification audit, anti-drift, and re-fan.
- Search-first requirement from user.
- Current best-practice patterns from agent workflow systems: planner → execution → reflection → recovery, explicit retry branches, and failure-aware orchestration rather than blind reruns.

## Core drift

Recovery Branch Matrix turns error handling into primary structure. Instead of treating retries as generic fallbacks, it defines lane-stage-specific recovery branches: query failure, low-yield search, weak evidence, redundancy overload, and verification failure each route to different repair actions.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for difficult research domains where dead ends are common and generic retry loops waste time.
