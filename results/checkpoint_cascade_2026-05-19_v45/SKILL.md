# checkpoint-cascade

Stateful search-first orchestrator for reTruth. Same three-lane fan-out, but each lane emits checkpoints after each research node. Goal: make long research recoverable, auditable, and retryable without rerunning good work.

## Invocation

- `/checkpoint-cascade <topic>` uses standard effort.
- `/checkpoint-cascade high <topic>` expands search budgets and requires negative-search checkpoint detail.

## Core idea

Original reTruth appends findings incrementally. Checkpoint Cascade expands that into named phase checkpoints:

1. `C0_brief`
2. `C1_query_plan`
3. `C2_source_candidates`
4. `C3_selected_sources`
5. `C4_findings`
6. `C5_verification_notes`
7. `C6_closing`

If one phase fails, retry from last good checkpoint instead of restarting lane.

## Pipeline

### Step 1 — Parse brief

Extract:
- topic
- lens
- desired decision or output
- domain
- effort: `standard|high`
- risk flags
- explicit exclusions

Write `brief.md`.

### Step 2 — Create workspace

Path: `./reTruth/{slug}-{YYYY-MM-DD}/`

```text
brief.md
checkpoints/
  scholar.jsonl
  community.jsonl
  edge.jsonl
scholar.md
community.md
edge.md
verification.md
synthesis.md
retry-log.md
```

### Step 3 — Spawn search-plan node

Spawn all three lanes in parallel. Each must append checkpoint `C1_query_plan` before any browsing. Query plan includes broad, narrow, failure, and re-fan queries.

### Step 4 — Spawn retrieval node

Each lane runs search from query plan. Each appends:
- `C2_source_candidates`: all plausible sources
- `C3_selected_sources`: chosen sources with reason
- negative searches and why they failed

### Step 5 — Spawn extraction node

Each lane extracts findings from selected sources only unless gap search is required. Each finding must include source node, quote, claim, confidence, and checkpoint id.

### Step 6 — Validate checkpoints

For each lane:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | all C0-C6 checkpoints present | retry missing phase |
| V2 | query plan exists before source selection | invalidate lane if reversed |
| V3 | findings cite source ids from selected sources | mark orphan findings |
| V4 | every quote has source URL | mark unsupported |
| V5 | closing lists unresolved gaps | accept with warning |

### Step 7 — Verification audit

Write `verification.md`:
- URL status per source id
- quote match result
- checkpoint continuity
- orphan claims
- duplicate source nodes

### Step 8 — Synthesis

Write `synthesis.md` from verified findings. Include:

1. answer
2. checkpoint health
3. strongest supported claims
4. unresolved gaps
5. retry targets
6. what changed since last checkpoint if resumed

### Step 9 — Retry / re-fan

Retry only failed phase. Re-fan when:
- C2 has weak source diversity
- C4 findings below floor
- verification flags more than 30% unsupported quotes
- closing gap blocks user decision

## Why this variation

Current agent-orchestration guidance emphasizes durable execution, checkpointing, retry policies, and source-node citations. Checkpoint Cascade ports those ideas into reTruth without adding runtime dependencies: markdown and JSONL files become checkpoint state. Search remains first because query planning must precede browsing.
