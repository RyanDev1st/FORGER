# Reflection Trigger Router — Variation Pipeline

## Status

Complete v57 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, post-spawn verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved Self-RAG abstract: indiscriminate fixed retrieval can hurt usefulness; Self-RAG adaptively retrieves on demand and reflects on retrieved passages and generations.
- Playwright-retrieved FLARE abstract: active retrieval decides when and what to retrieve across long-form generation, using predicted upcoming sentences and low-confidence tokens to trigger retrieval.

## Core drift

Reflection Trigger Router changes retrieval cadence. Instead of spending each lane's budget in a fixed search pass, the orchestrator and lanes maintain explicit retrieval triggers. A lane searches only when a trigger fires, then reflects on whether the retrieved content resolved the trigger.

## Why this variation

Research fails when retrieval is too early, too broad, or too uniform. Easy claims get over-searched while hard claims remain under-specified. Reflection Trigger Router makes retrieval responsive to uncertainty, source sufficiency, and the next answer section.

This should improve:

- adaptive retrieval depth
- lower duplicated lane effort
- better long-form answer coverage
- more precise query regeneration
- cleaner stop conditions
- stronger traceability from uncertainty to source

## Package hierarchy

```text
results/reflection_trigger_router_2026-05-19_v57/
  README.md
  SKILL.md
  scholar-dive.md
  community-search.md
  edge-finder.md
  variation-pipeline.md
```

## Runtime workspace hierarchy

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

## Pipeline

### 1. Parse brief

Extract topic, lens, domain, answer type, effort level, exclusions, constraints, likely answer components, contested claims, long-form sections, and likely low-confidence zones.

Output: `brief.md`.

### 2. Build trigger map

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

### 3. Bound trigger set

Use effort-dependent caps:

| Effort | Initial triggers | Regenerated triggers | Max active triggers |
|---|---:|---:|---:|
| standard | 6 | 4 | 10 |
| high | 9 | 6 | 15 |

Drop or merge triggers that are redundant, too vague, or unlikely to change synthesis.

### 4. Route triggers

Write route plan in `trigger-map.md`:

| Trigger | Lane | Trigger type | Query seed | Reflection check | Stop condition |
|---|---|---|---|---|---|

Routing logic:

- Scholar: low-confidence method, missing academic support, conflict between studies, stale standard, weak scholarly route.
- Community: missing artifact, weak implementation transfer, stale docs, practitioner conflict, operational next section.
- Edge: premature convergence, hidden analogue, inversion case, anomaly, weak transfer path, divergent next section.
- Shared: only if lanes use materially different reflection checks.

### 5. Spawn lanes

Spawn scholar, community, and edge in parallel. Each lane receives relevant triggers, lane mandate, route hints, and output paths.

### 6. Run triggered retrieval loop

Each lane repeats:

1. predict next evidence need
2. evaluate whether trigger fires
3. search only if trigger fires
4. extract quote-backed candidate
5. reflect on relevance, sufficiency, and route fit
6. accept, regenerate query, retrieve again, stop, or re-fan

Route log:

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

### 7. Extract findings

Every finding binds to a trigger:

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

### 8. Validate output

Orchestrator validates:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has trigger id | request trigger binding |
| V3 | every high-risk trigger has reflection status | request reflection closeout |
| V4 | every finding has quote | mark unsupported |
| V5 | regenerated triggers have stop conditions | request stop condition |
| V6 | skipped retrieval has sufficiency reason | request sufficiency note |

### 9. Verify evidence

Run URL liveness, quote match, claim-source alignment, route-fit check, and reflection-fit check. Reflection-fit asks whether the source resolves the trigger that justified retrieval.

### 10. Synthesize by trigger outcome

Write synthesis around trigger outcomes:

- resolved without extra retrieval
- resolved by on-demand retrieval
- resolved by regenerated query
- weak triggers not worth more search
- conflicting triggers requiring re-fan
- skipped triggers and sufficiency reasons
- cross-lane reflection transfers
- highest-value next trigger

### 11. Re-fan only unresolved triggers

Re-fan packet:

```markdown
### Re-fan T<n>
- Trigger: T<n>
- Current status: <weak|conflicting|irrelevant|needs-regeneration>
- Missing evidence type: <type>
- Lane: <lane>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

Do not re-run whole lanes unless trigger design failed systemically.

## Expected behavior change

Compared with baseline reTruth, Reflection Trigger Router should reduce wasteful fixed-budget retrieval and produce more targeted evidence because searches are tied to explicit low-confidence, missing-source, conflict, stale-source, weak-route, or next-section triggers.
