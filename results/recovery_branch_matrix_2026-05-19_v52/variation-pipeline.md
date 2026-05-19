# Variation Pipeline: Recovery Branch Matrix

## Status

Complete v52 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, validation gates, verification audit, anti-drift checkpoints, retries, and re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from agent workflow systems: explicit planner → execution → reflection → recovery structure, retry branching by failure type, and failure-aware orchestration instead of blind rerun.

## Core drift

Recovery Branch Matrix treats failure modes as first-class routing signals. Lanes still search first, but after each stage they classify what broke and choose targeted recovery branch. Orchestrator later compares branch patterns across lanes to decide re-fan.

## Pipeline

1. Parse brief into topic, lens, output goal, domain, effort, exclusions, likely failure modes, and likely fallback routes.
2. Create workspace with lane files, `recovery-matrix.md`, `branch-log.md`, `verification.md`, `synthesis.md`, and `re-fan.md`.
3. Write shared recovery matrix before lane search starts.
4. Spawn scholar, community, and edge lanes in parallel with recovery matrix attached.
5. Each lane performs query planning, candidate retrieval, source selection, and finding extraction.
6. After each lane stage, lane checks for failure types: query failure, basket failure, evidence weakness, redundancy overload, drift, verification failure, and for Edge also transfer failure.
7. When failure occurs, lane logs branch event and uses stage-specific recovery action.
8. Orchestrator validates lane output and branch logs.
9. Cross-lane recovery review identifies best branch patterns, repeated dead ends, and shared missing source baskets.
10. Verification audit checks URL liveness, quote match, and claim-source alignment; failures create final branch events.
11. Synthesis separates findings that succeeded cleanly from findings recovered after branch repair and from weak signals after failed recovery.
12. Re-fan targets repeated failure clusters and missing venue classes rather than generic weak lanes.

## Why this variation

Hard research runs rarely fail for one reason. Some fail because search terms are bad, others because source baskets are too narrow, others because evidence looks promising but collapses on inspection. Generic retries waste time by repeating same mistake. Recovery Branch Matrix makes recovery path depend on failure type, which should improve efficiency and produce better debugging signals for future runs.

## Expected strengths

- Better recovery on hard searches.
- Less wasted effort on blind reruns.
- Better visibility into recurring lane failure patterns.
- Stronger re-fan targeting.
- More reusable operational lessons from failed searches.

## Tradeoffs

- More process overhead.
- Risk of overengineering easy searches.
- Branch logs add artifact volume.
- Requires good failure classification prompts.

## Best use

Use for sparse, technical, or failure-prone domains where routes often dead-end and search repair strategy matters as much as initial query plan.
