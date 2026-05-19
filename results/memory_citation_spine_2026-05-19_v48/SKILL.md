# memory-citation-spine

Search-first orchestrator for reTruth using lane-local retrieval memory and citation-node synthesis. Goal: preserve search trail and source judgments separately from final findings, then synthesize from small auditable citation nodes.

## Invocation

- `/memory-citation-spine <topic>` uses standard effort.
- `/memory-citation-spine high <topic>` expands memory ledger depth and citation-node count.

## Core drift

Original reTruth appends lane findings directly. Memory Citation Spine adds two layers before synthesis:
1. retrieval memory ledger: what was searched, found, rejected, absent, and why;
2. citation spine: claim-sized nodes with quote, source, lane, and utility tags.

This makes long research runs easier to resume, audit, and re-fan.

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
- memory keys likely useful later

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  memory/
    scholar-memory.md
    community-memory.md
    edge-memory.md
  spine/
    scholar-nodes.md
    community-nodes.md
    edge-nodes.md
    merged-citation-spine.md
  scholar.md
  community.md
  edge.md
  audit.md
  synthesis.md
  re-fan.md
```

### Step 3 — Define memory schema

Write top of each lane memory file:

```markdown
## Memory schema
| Key | Meaning |
|---|---|
| query | search string or route |
| candidate | source considered |
| rejection | source dropped and why |
| absence | searched zone with no useful result |
| pattern | reusable source-selection observation |
| gap | unresolved search need |
```

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- lane mandate
- memory schema
- citation-node schema
- output paths
- effort

Each lane must run:
1. query planning
2. candidate retrieval
3. memory ledger append
4. source selection
5. finding extraction
6. citation-node emission
7. closing gap report

### Step 5 — Lane memory validation

Validate each lane memory before reading findings:

| Check | Pass rule | Fail action |
|---|---|---|
| M1 | at least 6 query/candidate entries | retry search ledger |
| M2 | rejected sources include reasons | retry source selection notes |
| M3 | absences logged for empty routes | retry missing route notes |
| M4 | gaps named explicitly | carry to re-fan |

### Step 6 — Citation spine validation

Each node must follow:

```markdown
### Node <lane><n>
- Claim: <atomic claim>
- Lane: <scholar|community|edge>
- Source id: <id>
- Source: <title> — <URL>
- Quote: "<verbatim quote>"
- Support type: <method|artifact|analogy|postmortem|standard|dataset>
- Utility tag: <decision|risk|mechanism|counterexample|weak-signal>
- Confidence: <high|medium|low>
```

Pass rules:
- one claim per node
- quote present
- URL present
- support type present
- utility tag present
- confidence present

### Step 7 — Merge citation spine

Write `spine/merged-citation-spine.md`:
- group nodes by utility tag
- preserve lane source
- preserve consensus counts
- flag duplicates
- flag unsupported weak signals
- link nodes back to lane memory keys

### Step 8 — Verification audit

Run cheap audit against citation nodes:
- URL liveness
- quote match
- node claim-source alignment
- Edge redundancy against Scholar+Community nodes

Write flags to `audit.md`.

### Step 9 — Synthesis

Synthesize only from nodes with:
- quote present
- source reachable or archived
- support type appropriate to lane
- confidence not lower than task risk permits
- utility tag not `weak-signal` unless appendix

Use memory ledgers to explain search coverage and missing zones.

### Step 10 — Re-fan

Re-fan by memory gap, not generic lane failure:
- missing source basket
- repeated rejected-source reason
- high-value absence
- weak citation support
- duplicate-heavy node cluster

## Why this variation

Stateful agent systems benefit from searchable memory, while citation-based RAG benefits from granular source nodes before synthesis. Memory Citation Spine adapts both: lane memory preserves search process; citation nodes preserve evidence units. This reduces lost context, improves re-fan targeting, and makes synthesis more auditable.
