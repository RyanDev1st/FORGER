# evaluator-forge

Search-first orchestrator for reTruth with built-in retrieval evaluation. Each lane must score its search and extraction before synthesis. Goal: make poor retrieval visible before polished prose hides it.

## Invocation

- `/evaluator-forge <topic>` uses standard effort.
- `/evaluator-forge high <topic>` adds extra evaluation rounds and stricter re-fan thresholds.

## Core drift

Original reTruth validates outputs after lane completion. Evaluator Forge inserts evaluation before synthesis: lanes judge candidate recall, source diversity, quote strength, and claim usefulness using explicit metrics.

## Pipeline

### Step 1 — Parse brief

Extract:
- topic
- lens
- desired output
- domain
- effort: `standard|high`
- success criteria implied by user
- exclusion zones

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  metrics.md
  scholar.md
  community.md
  edge.md
  evaluation.md
  synthesis.md
  re-fan.md
```

### Step 3 — Define metrics

Write `metrics.md` before spawning lanes:

| Metric | Meaning |
|---|---|
| retrieval breadth | source basket covers likely search space |
| source precision | selected sources directly support brief |
| quote strength | quotes directly support claims |
| claim novelty | findings add non-obvious value |
| lane fit | evidence belongs in lane, not another lane |
| synthesis utility | finding helps final answer or decision |

Scoring: `0-3`, where `0 = absent`, `1 = weak`, `2 = usable`, `3 = strong`.

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- lane mandate
- metrics rubric
- output path
- effort

Each lane must run:
1. query planning
2. candidate retrieval
3. source selection
4. finding extraction
5. self-evaluation
6. repair pass if any metric average is below 2

### Step 5 — Validate outputs

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | file exists and non-empty | retry lane |
| V2 | at least 5 findings | repair pass or retry |
| V3 | every finding has quote | mark unsupported |
| V4 | evaluation table exists | retry evaluation only |
| V5 | average score >= 2 or under-sourced reason | re-fan weak metric |

### Step 6 — Cross-lane evaluation

Write `evaluation.md`:
- metric averages per lane
- strongest and weakest metric
- duplicate claims
- lane misclassifications
- unsupported but interesting claims
- recommended re-fan target

### Step 7 — Verification audit

Check URL liveness, quote match, and claim-source alignment. Add flags to `evaluation.md`.

### Step 8 — Synthesis

Synthesize only findings with:
- quote present
- source reachable or archived
- lane-fit score >= 2
- synthesis-utility score >= 2

Low-score findings go to appendix as weak signals.

### Step 9 — Re-fan

Re-fan a lane when:
- any required metric average < 2
- lane has fewer than 5 valid findings
- source diversity score is 0 or 1
- cross-lane synthesis has no decision-useful evidence

## Why this variation

Current RAG and agent best practices emphasize modular pipelines, reusable web-search components, retrieval evaluation, and prompt/program optimization against metrics. Evaluator Forge adapts those ideas into a no-code research skill: metrics become written gates, not runtime dependencies.
