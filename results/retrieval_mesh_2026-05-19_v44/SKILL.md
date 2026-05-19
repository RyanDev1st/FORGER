# retrieval-mesh

Search-first orchestrator for reTruth. Build source map before synthesis. Goal: reduce premature convergence by making each lane expose what it searched, what it skipped, and which claims remain unsupported.

## Invocation

- `/retrieval-mesh <topic>` uses standard effort.
- `/retrieval-mesh high <topic>` expands budgets and asks lanes to include negative searches.

## Pipeline

### Step 1 — Parse brief

Extract:
- topic
- user lens
- decision needed
- domain
- effort: `standard|high`
- exclusion zones: safety, legal, medical, private data, or out-of-scope areas

Write `brief.md` in workspace.

### Step 2 — Create workspace

Path: `./reTruth/{slug}-{YYYY-MM-DD}/` with:

```text
brief.md
source-map.md
scholar.md
community.md
edge.md
verification.md
synthesis.md
```

### Step 3 — Search map pass

Before any deep reading, spawn three lanes in parallel. Each lane must return:

1. Query ledger: broad queries, narrow queries, failed queries.
2. Source basket: candidate URLs grouped by type.
3. Coverage estimate: what current basket can answer.
4. Missing zones: what no query found.

Lanes append to their own files. Orchestrator copies candidate URLs into `source-map.md` grouped by lane.

### Step 4 — Deep read pass

Re-spawn same three lanes with:
- original brief
- lane mandate
- `source-map.md`
- lane candidate list
- instruction: prioritize evidence already mapped, then run gap-filling search only when needed

### Step 5 — Validation gate

For each lane:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | file exists and non-empty | retry lane once |
| V2 | at least 5 findings or declared under-sourced | retry with gap query |
| V3 | every finding has claim, source, quote, confidence | mark invalid findings |
| V4 | query ledger present | retry metadata only |
| V5 | missing zones present | accept with warning |

### Step 6 — Verification audit

Write `verification.md`:
- HEAD status per cited URL
- quote match status
- duplicate URL / duplicate claim clusters
- unsupported claims

Do not delete failed evidence. Flag it.

### Step 7 — Synthesis

Write `synthesis.md` with:

1. answer
2. source coverage map
3. high-confidence claims
4. live disagreements
5. missing evidence
6. next search moves

### Step 8 — Re-fan trigger

Re-fan only if synthesis has one of:
- no lane reaches 5 valid findings
- key decision has zero direct evidence
- two lanes conflict and no arbiter source exists
- user asked for high effort and missing zones remain

## Why this variation

Original fan-out values independent cognition. Retrieval Mesh keeps that but moves search breadth before deep reading. It follows current deep-research best practice: plan, delegate isolated research, start broad, assess after each search, narrow only to fill gaps, preserve citations, and verify output.
