# reflection-trigger-router

Search-first orchestrator for reTruth using adaptive retrieval triggers and reflection checks. Goal: retrieve when a claim, source, or next synthesis step shows uncertainty rather than spending a fixed search budget up front.

## Invocation

- `/reflection-trigger-router <topic>` uses standard effort.
- `/reflection-trigger-router high <topic>` increases trigger sensitivity, reflection passes, and regeneration depth.

## Core drift

Original reTruth fans out lanes with mode budgets. Reflection Trigger Router keeps isolated lanes but replaces static retrieval cadence with trigger-driven retrieval: each lane predicts the next evidence need, checks confidence, retrieves on demand, reflects on retrieved content, then either accepts, revises, or re-queries.

## Pipeline

### Step 1 — Parse brief

Extract:
- topic
- desired answer type
- domain
- lens
- effort: `standard|high`
- exclusions
- constraints
- likely answer components
- likely contested claims
- likely long-form sections
- likely low-confidence zones

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  trigger-map.md
  scholar.md
  community.md
  edge.md
  reflection-log.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Build trigger map

Write `trigger-map.md`:

```markdown
### Trigger T<n>: <retrieval trigger>
- Target: <claim|section|source|gap>
- Lane: <scholar|community|edge|shared>
- Trigger type: <low-confidence|missing-source|conflict|stale-source|weak-route|next-section>
- Predicted next need: <what evidence is needed next>
- Query seed: <query shape or source route>
- Reflection check: <what must be judged after retrieval>
- Stop condition: <what makes more retrieval unnecessary>
- Risk if skipped: <low|medium|high>
```

Caps:

| Effort | Initial triggers | Regenerated triggers | Max active triggers |
|---|---:|---:|---:|
| standard | 6 | 4 | 10 |
| high | 9 | 6 | 15 |

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- relevant triggers
- lane mandate
- route hints
- output path
- reflection-log path
- effort

### Step 5 — Triggered retrieval loop

Each lane repeats:

1. predict next evidence need
2. check trigger condition
3. retrieve if triggered
4. extract quote-backed candidate
5. reflect on source relevance and claim fit
6. decide action

Record:

```markdown
### Reflection <lane><n>
- Trigger: T<n>
- Predicted next need: <need>
- Trigger fired: <yes|no>
- Query: <query string or none>
- Source route: <route>
- Retrieved ids: <ids>
- Reflection result: <sufficient|weak|conflicting|irrelevant|needs-regeneration>
- Action: <accept|revise-query|retrieve-again|stop|re-fan>
```

### Step 6 — Findings

Every finding must bind to a trigger and reflection result:

```markdown
### Finding <lane><n>: <claim>
- Trigger id: T<n>
- Source id: <id>
- Source: <title> — <URL>
- Evidence quote: "<verbatim quote>"
- Trigger type: <low-confidence|missing-source|conflict|stale-source|weak-route|next-section>
- Reflection result: <sufficient|weak|conflicting|irrelevant|needs-regeneration>
- Retrieval action: <on-demand|regenerated|skipped-as-sufficient>
- Confidence: <high|medium|low>
- Limits: <what remains unresolved>
```

### Step 7 — Orchestrator validation

Validate:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has trigger id | request trigger binding |
| V3 | every high-risk trigger has reflection status | request reflection closeout |
| V4 | every finding has quote | mark unsupported |
| V5 | regenerated triggers have stop conditions | request stop condition |
| V6 | skipped retrieval has sufficiency reason | request sufficiency note |

### Step 8 — Verification audit

Check URL liveness, quote match, claim-source alignment, route fit, and reflection-fit. Reflection-fit asks whether the retrieved source actually resolves the trigger that fired.

### Step 9 — Synthesis

Synthesis must organize by trigger outcomes:
- triggers resolved without extra retrieval
- triggers resolved by on-demand retrieval
- triggers resolved by regenerated query
- triggers still weak or conflicting
- skipped triggers and sufficiency reasons
- highest-value next trigger

### Step 10 — Re-fan

Re-fan only unresolved triggers:

```markdown
### Re-fan T<n>
- Trigger: T<n>
- Current status: <weak|conflicting|irrelevant|needs-regeneration>
- Missing evidence type: <type>
- Lane: <lane>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

## Why this variation

Self-reflective retrieval shows value in adaptive retrieval and critique of retrieved passages. Active retrieval shows value in deciding when and what to retrieve as generation unfolds. Reflection Trigger Router adapts both to reTruth: lanes retrieve only when a clear trigger fires, then must reflect on whether the evidence actually resolves the trigger.
