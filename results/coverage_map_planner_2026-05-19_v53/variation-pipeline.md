# Variation Pipeline: Coverage Map Planner

## Status

Complete v53 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, validation gates, verification audit, anti-drift, retries, and re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from retrieval planning and agentic RAG: query decomposition, coverage tracking, source diversity, and gap-driven retrieval.

## Core drift

Coverage Map Planner reframes research as explicit coverage problem. Before search deepens, each lane defines cells across subtopic, source class, time slice, and stance. Search progress updates those cells, exposing blind spots while there is still time to correct.

## Pipeline

1. Parse brief into topic, lens, output goal, domain, effort, exclusions, likely subtopics, source classes, and decision angles.
2. Create workspace with lane files, `coverage-map.md`, `coverage-log.md`, `verification.md`, `synthesis.md`, and `re-fan.md`.
3. Write shared coverage schema before spawning lanes.
4. Spawn scholar, community, and edge lanes in parallel with coverage schema attached.
5. Each lane designs lane-specific coverage grid before full search.
6. Query planning happens per coverage cell, not only by generic search step.
7. Candidate retrieval logs which cell each source targets.
8. After each query batch, lane updates cell status: `hit`, `weak-hit`, or `miss`.
9. If search clusters too heavily in already-hit cells, lane must force uncovered-cell query next.
10. Orchestrator validates lane outputs and coverage logs.
11. Cross-lane coverage merge identifies well-covered zones, weakly covered zones, missed high-value cells, and source-class imbalance.
12. Verification audit can downgrade a cell from `hit` to `weak-hit` if support collapses.
13. Synthesis reports not only findings, but also coverage confidence and important misses.
14. Re-fan targets highest-value missed or weak-hit cells that could change final answer.

## Why this variation

Many research systems mistake repeated success in one slice of the space for overall thoroughness. Coverage Map Planner forces each lane to prove it sampled the topic geometry more deliberately. This should reduce silent blind spots, improve gap-targeted follow-up, and give user a clearer view of where answer is strong versus thin.

## Expected strengths

- Better resistance to premature convergence.
- Better source diversity.
- Stronger visibility into blind spots.
- Better re-fan targeting from concrete gaps.
- More honest final synthesis about coverage limits.

## Tradeoffs

- More setup overhead before findings.
- Coverage maps can become bureaucratic if too granular.
- Hard topics may produce many misses.
- Requires judgment about which cells matter most.

## Best use

Use for broad, ambiguous, or interdisciplinary topics where thoroughness matters and narrow search success would be misleading.
