# coverage-map-planner

Search-first orchestrator for reTruth using explicit coverage maps and gap-driven search. Goal: show which parts of topic space were covered, missed, or weakly sampled before synthesis.

## Invocation

- `/coverage-map-planner <topic>` uses standard effort.
- `/coverage-map-planner high <topic>` expands coverage slice count and gap-follow-up budget.

## Core drift

Original reTruth searches in deterministic steps and reacts to low finding count. Coverage Map Planner adds pre-search map design and live coverage status. Lanes do not only hunt findings; they prove they looked across relevant slices of the space.

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
- likely subtopics
- likely source classes
- likely decision angles

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  coverage-map.md
  scholar.md
  community.md
  edge.md
  coverage-log.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Write shared coverage schema

Write `coverage-map.md`:

```markdown
## Coverage schema
| Axis | Example values |
|---|---|
| subtopic | methods, risks, history, adoption |
| source class | paper, postmortem, repo, archive, benchmark |
| time slice | legacy, recent, current |
| stance | supports, critiques, alternatives, failures |
```

Each lane picks its own cells from this schema before search.

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- lane mandate
- coverage schema
- output path
- coverage log path
- effort

Each lane must run:
1. build lane-specific coverage grid
2. query planning by grid cell
3. candidate retrieval
4. update coverage status after each query batch
5. source selection
6. finding extraction
7. gap review before close

### Step 5 — Lane coverage log schema

Every lane must append coverage events:

```markdown
### Coverage <lane><n>
- Cell: <subtopic / source class / time slice / stance>
- Query ids: <ids>
- Status: hit | weak-hit | miss
- Evidence found: <source ids or none>
- Gap reason: <none|no results|low quality|redundant|off-scope>
- Next move: <expand|pivot|close>
```

### Step 6 — Orchestrator validation

Validate in order:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | at least 5 findings | allow gap-driven follow-up first |
| V3 | every finding has quote | mark unsupported |
| V4 | coverage log exists | retry coverage closeout |
| V5 | uncovered high-value cells called out | route to re-fan |

### Step 7 — Cross-lane coverage merge

Write `coverage-log.md`:
- cells covered well
- cells covered weakly
- cells missed across all lanes
- repeated low-quality zones
- source class imbalance
- re-fan targets from highest-value gaps

### Step 8 — Verification audit

Check URL liveness, quote match, and claim-source alignment. Verification failures can downgrade a `hit` cell to `weak-hit`.

### Step 9 — Synthesis

Synthesis must include:
- strongest findings
- coverage confidence: what space was actually sampled
- important misses and why they matter
- source-class imbalance warnings
- unanswered high-value gaps

### Step 10 — Re-fan

Re-fan when:
- high-value cells remain `miss`
- all lanes overconcentrate on same source class
- central decision angle has only weak-hit coverage
- missed cell could materially change answer

## Why this variation

Search-first systems often feel thorough while actually exploring only a narrow band of topic space. Coverage Map Planner makes search geometry explicit. Instead of asking only “did we get enough findings,” it asks “which cells of the space did we inspect, and which remain weak or untouched.” That should reduce hidden blind spots and improve re-fan quality.
