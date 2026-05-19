# handoff-guardrail-swarm

Search-first orchestrator for reTruth using explicit handoff packets and sequential guardrails. Each lane receives context, search routes, and pass/fail checks before work starts. Failed checks return targeted retry feedback to the same lane.

## Invocation

- `/handoff-guardrail-swarm <topic>` uses standard effort.
- `/handoff-guardrail-swarm high <topic>` increases query breadth and retry budget.

## Core drift

Original reTruth validates after lane completion. Handoff Guardrail Swarm validates as a chain: plan handoff, search, extract, run guardrails, retry exact failure, then synthesize. This borrows planner-led handoffs and guardrail retry patterns without adding runtime dependencies.

## Pipeline

### Step 1 — Parse brief

Extract:
- topic
- lens
- desired output
- domain
- effort: `standard|high`
- success criteria
- exclusion zones
- likely lane boundaries

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  handoffs.md
  guardrails.md
  scholar.md
  community.md
  edge.md
  validation.md
  synthesis.md
  retry-log.md
```

### Step 3 — Plan lane handoffs

Write `handoffs.md` before spawning lanes:

```markdown
## Handoff: <lane>
- Target lane: <scholar|community|edge>
- Context summary: <brief-specific context>
- Search routes: <route list>
- Required source types: <source types>
- Output contract: <finding format and floor>
- Guardrails: <checks to pass>
- Retry budget: <1|2>
```

### Step 4 — Define guardrails

Write `guardrails.md`:

| Guardrail | Pass rule | Failure feedback |
|---|---|---|
| G1 format | required sections exist | rewrite missing section only |
| G2 search ledger | query ids and candidate list present | add ledger before findings |
| G3 source fit | selected sources match lane | replace misfit sources |
| G4 quote support | every finding has verbatim quote | add quote or drop finding |
| G5 lane boundary | finding belongs to lane | reclassify or remove |
| G6 novelty | not duplicate of another lane | sharpen claim or mark duplicate |
| G7 synthesis utility | finding affects final answer | demote weak signal |

### Step 5 — Spawn lanes in parallel

Each lane receives:
- brief
- handoff packet
- guardrail chain
- output path
- effort

Each lane must run:
1. query planning
2. candidate retrieval
3. source selection
4. finding extraction
5. self-check against guardrails
6. targeted repair when guardrail fails

### Step 6 — Sequential validation

Validate lane output in guardrail order. Stop at first failure and return feedback to same lane.

Retry policy:
- `standard`: 1 targeted retry per lane.
- `high`: 2 targeted retries per lane.
- after retry budget, mark failing section `under-sourced` or `guardrail-failed`.

### Step 7 — Cross-lane handoff review

Write `validation.md`:
- each lane pass/fail table
- retry feedback issued
- duplicate claims
- lane-boundary conflicts
- unsupported useful signals
- recommended re-fan target

### Step 8 — Verification audit

Check URL liveness, quote match, and claim-source alignment. Add flags to `validation.md`. Do not delete failed findings; mark them.

### Step 9 — Synthesis

Use only findings that pass:
- G3 source fit
- G4 quote support
- G5 lane boundary
- G7 synthesis utility
- verification not fatal

Append rejected or weak findings under `Weak signals and failed guardrails`.

### Step 10 — Re-fan

Re-fan when:
- any lane has fewer than 5 valid findings
- same guardrail fails twice
- cross-lane synthesis has no decision-useful evidence
- critical domain route remains uncovered

## Why this variation

Planner-led multi-agent systems improve coordination by making target, context, and completion criteria explicit. Sequential guardrails improve recovery because they fail early with specific feedback instead of forcing full reruns. Handoff Guardrail Swarm adapts both into reTruth’s search-first, file-based workflow.
