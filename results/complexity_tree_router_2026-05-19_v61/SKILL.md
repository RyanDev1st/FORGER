# complexity-tree-router

Search-first orchestrator for reTruth using complexity classification and tree-level retrieval routing. Goal: match retrieval depth and abstraction level to query difficulty instead of forcing every lane through same search pattern.

## Invocation

- `/complexity-tree-router <topic>` uses standard effort.
- `/complexity-tree-router high <topic>` increases tree depth, branch drills, and cross-level validation.

## Core drift

Original reTruth distributes effort by lane and mode. Complexity Tree Router first classifies each brief component by query complexity, then chooses retrieval route at the right abstraction level:

- simple asks: direct local retrieval
- medium asks: local summary plus source drill-down
- complex asks: branch or global summary before passage retrieval

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
- likely simple subquestions
- likely synthesis subquestions
- likely corpus-level questions
- likely long-document source families

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  routing-plan.md
  scholar.md
  community.md
  edge.md
  tree-ledger.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Build routing plan

Write `routing-plan.md`:

```markdown
### Route R<n>: <subquestion or answer component>
- Lane: <scholar|community|edge|shared>
- Complexity class: <C0|C1|C2|C3>
- Retrieval level: <L0|L1|L2|L3>
- Query type: <fact|focused evidence|multi-source synthesis|global reasoning>
- Source family: <papers|docs|repos|incidents|archives|mixed>
- Why this route: <reason>
- Success condition: <what resolves>
- Risk if under-routed: <low|medium|high>
```

Caps:

| Effort | Routes | Max tree depth | Max branch drills |
|---|---:|---:|---:|
| standard | 6 | 2 | 6 |
| high | 9 | 3 | 10 |

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- assigned routes
- lane mandate
- complexity and level schema
- output path
- tree-ledger path
- effort

### Step 5 — Route-aware retrieval loop

Each lane repeats:

1. classify assigned subquestion complexity
2. choose retrieval level
3. retrieve at chosen abstraction layer
4. drill down if route under-resolves
5. stop if evidence sufficient or escalate level

Route actions:

- C0/L0: direct passage lookup
- C1/L1: local summary plus quote extraction
- C2/L2: branch summary plus local supporting passages
- C3/L3: global summary, branch summary, then source drill-down

Record:

```markdown
### Route log <lane><n>
- Route: R<n>
- Complexity class: <C0|C1|C2|C3>
- Retrieval level: <L0|L1|L2|L3>
- Query: <query string>
- Source route: <route>
- Summary nodes used: <ids or none>
- Passage ids used: <ids>
- Resolution: <resolved|under-resolved|over-routed|miss>
- Next action: <close|drill-down|escalate|re-fan>
```

### Step 6 — Findings

Every finding must bind to route and abstraction level:

```markdown
### Finding <lane><n>: <claim>
- Route id: R<n>
- Complexity class: <C0|C1|C2|C3>
- Retrieval level: <L0|L1|L2|L3>
- Source id: <id>
- Summary lineage: <global|branch|local|none>
- Source: <title> — <URL>
- Evidence quote: "<verbatim quote>"
- Route result: <fit|under-routed|over-routed>
- Confidence: <high|medium|low>
- Limits: <missing level or missing passage>
```

### Step 7 — Orchestrator validation

Validate:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has route id | request route binding |
| V3 | complexity class and retrieval level present | request route metadata |
| V4 | every finding has quote | mark unsupported |
| V5 | C3 routes include summary and drill-down evidence | request deeper route |
| V6 | over-routed simple questions are flagged | request compression |

### Step 8 — Verification audit

Check URL liveness, quote match, claim-source alignment, route-fit, and abstraction-fit. Abstraction-fit asks whether retrieval level matched question complexity.

### Step 9 — Synthesis

Synthesis must organize by route quality:
- quick direct answers
- focused evidence answers
- multi-source synthesis answers
- corpus/global reasoning answers
- under-routed questions needing escalation
- over-routed questions wasting search
- best next route adjustment

### Step 10 — Re-fan

Re-fan only route mismatches:

```markdown
### Re-fan R<n>
- Route: R<n>
- Current status: <under-routed|over-routed|miss|mixed>
- Needed change: <raise-complexity|lower-complexity|raise-level|switch-source-family>
- Lane: <lane>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

## Why this variation

Adaptive-RAG shows value in dynamically selecting retrieval strategy by query complexity. RAPTOR shows value in retrieving across a hierarchy of abstraction, from summaries to detailed passages. Complexity Tree Router adapts both ideas to reTruth by routing each subquestion to the right depth before synthesis.
