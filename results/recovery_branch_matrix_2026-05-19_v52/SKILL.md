# recovery-branch-matrix

Search-first orchestrator for reTruth using explicit recovery branches per lane stage. Goal: make failure handling targeted, visible, and reusable instead of generic retry.

## Invocation

- `/recovery-branch-matrix <topic>` uses standard effort.
- `/recovery-branch-matrix high <topic>` expands recovery branch budget and alternate-route depth.

## Core drift

Original reTruth has retries and re-fan. Recovery Branch Matrix inserts structured branch logic inside each lane and at orchestrator level. Each failure type maps to specific repair path, not blind rerun.

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
- likely failure modes
- likely fallback routes

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  recovery-matrix.md
  scholar.md
  community.md
  edge.md
  branch-log.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Write recovery matrix

Write `recovery-matrix.md` before spawning lanes:

| Failure type | Trigger | Recovery branch |
|---|---|---|
| query failure | search returns low-quality or zero results | rewrite query family |
| basket failure | source basket too narrow | widen venue class |
| evidence weakness | findings lack direct quote or support | replace with stronger source |
| redundancy overload | findings collapse into same claim | force route diversification |
| drift | out-of-scope or echo chamber | prune and reset route |
| verification failure | link dead or quote missing | archive source or demote finding |

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- lane mandate
- recovery matrix
- output path
- effort

Each lane must run:
1. query planning
2. candidate retrieval
3. source selection
4. finding extraction
5. recovery check after each stage
6. closing with branch log

### Step 5 — Lane branch log schema

Every lane must append branch events:

```markdown
### Branch <lane><n>
- Stage: <query|retrieval|selection|finding|verification>
- Failure type: <type>
- Trigger observed: <what happened>
- Recovery branch used: <action>
- Outcome: <improved|unchanged|worse>
- Next move: <continue|branch again|mark under-sourced>
```

### Step 6 — Orchestrator validation

Validate in order:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | at least 5 findings | allow branch recovery first |
| V3 | every finding has quote | mark unsupported |
| V4 | branch log exists when failures occurred | retry closeout only |
| V5 | repeated failure types surfaced | route to re-fan |

### Step 7 — Cross-lane recovery review

Write `branch-log.md`:
- failure types by lane
- recovery branches used
- best recovery pattern
- repeated dead-end pattern
- unresolved source basket gaps
- re-fan targets from failure clusters

### Step 8 — Verification audit

Check URL liveness, quote match, and claim-source alignment. Verification failures create final branch events before synthesis.

### Step 9 — Synthesis

Use strongest recovered findings first. Surface:
- robust findings with no branch needed
- recovered findings that survived repair
- weak signals after failed recovery
- important dead ends and what they imply

### Step 10 — Re-fan

Re-fan when:
- same failure type repeats across two lanes
- central claim still under-sourced after branch recovery
- basket failure suggests missing venue class
- verification failure removes too many central findings

## Why this variation

Agent systems often waste effort by retrying same failing action. Better systems branch based on failure type. Recovery Branch Matrix adapts that principle into reTruth: every lane can recover differently depending on what broke. This should improve efficiency in hard searches and make failure patterns more reusable over time.
