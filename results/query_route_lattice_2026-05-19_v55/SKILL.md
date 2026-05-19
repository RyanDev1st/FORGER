# query-route-lattice

Search-first orchestrator for reTruth using explicit query decomposition and source-route mapping. Goal: turn broad briefs into answerable research cells before any lane searches.

## Invocation

- `/query-route-lattice <topic>` uses standard effort.
- `/query-route-lattice high <topic>` increases lattice cells, route alternates, and re-fan depth.

## Core drift

Original reTruth fans out by lane. Query Route Lattice fans out by decomposed research cell, then routes each cell to the lane best suited to resolve it. This reduces duplicate lane effort and makes gaps visible before synthesis.

## Pipeline

### Step 1 — Parse brief

Extract:
- topic
- desired answer type
- domain
- lens
- effort: `standard|high`
- exclusions
- known constraints
- likely answer components
- likely contested claims

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  lattice.md
  route-plan.md
  scholar.md
  community.md
  edge.md
  route-log.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Build question lattice

Write `lattice.md` using:

```markdown
### Cell Q<n>: <answerable subquestion>
- Parent question: <root or Q id>
- Evidence need: <mechanism|effect|history|implementation|failure|counterexample|analogy>
- Best lane: <scholar|community|edge|shared>
- Source route: <venue or artifact class>
- Dependency: <none or Q id>
- Success condition: <what evidence resolves cell>
- Risk if unanswered: <low|medium|high>
```

Cell counts:

| Effort | Root cells | Follow-up cells | Max active cells |
|---|---:|---:|---:|
| standard | 6 | 4 | 10 |
| high | 9 | 6 | 15 |

### Step 4 — Route cells

Write `route-plan.md`:

| Cell | Lane | Source route | Query shape | Why this route |
|---|---|---|---|---|

Routing rules:
- Scholar gets method, empirical, institutional, review, benchmark, and falsifiability cells.
- Community gets implementation, dataset, repo, postmortem, debate, maintainer, and migration cells.
- Edge gets analogy, inversion, historical-deprecated, minority credentialed, and overlooked-language cells.
- Shared cells are duplicated only when source types differ materially.

### Step 5 — Spawn lanes in parallel

Each lane receives:
- brief
- relevant cells only
- lane mandate
- route-plan excerpt
- output path
- route-log path
- effort

### Step 6 — Lane retrieval

Each lane searches by cell, not by broad topic. Every query must name a cell id.

Record:

```markdown
### Route <lane><n>
- Cell: Q<n>
- Query: <query string>
- Source route: <route>
- Candidate ids: <ids>
- Yield: <hit|weak-hit|miss>
- Next route: <continue|alternate|close>
```

### Step 7 — Findings

Every finding must bind to a lattice cell:

```markdown
### Finding <lane><n>: <claim>
- Cell: Q<n>
- Source id: <id>
- Source: <title> — <URL>
- Evidence quote: "<verbatim quote>"
- Cell resolution: <resolved|partially-resolved|unresolved>
- Confidence: <high|medium|low>
- Limits: <what remains unanswered>
```

### Step 8 — Orchestrator validation

Validate:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has cell id | request cell binding |
| V3 | every active cell has route status | retry route closeout |
| V4 | every finding has quote | mark unsupported |
| V5 | unresolved high-risk cells listed | re-fan decision |

### Step 9 — Verification audit

Check URL liveness, quote match, claim-source alignment, and cell-source fit. A finding can pass quote audit but fail route fit if source type does not match cell evidence need.

### Step 10 — Synthesis

Synthesis must organize answer by resolved cells:
- resolved high-value cells
- conflicting cells
- unresolved high-risk cells
- weak cells not worth more search
- cross-lane transfers
- highest-value next cell if more budget exists

### Step 11 — Re-fan

Re-fan only cells, not whole lanes. A re-fan packet includes:

```markdown
### Re-fan Q<n>
- Cell: Q<n>
- Current status: <unresolved|conflicted|weak>
- Missing evidence type: <type>
- Lane: <lane>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

## Why this variation

Broad search often fails from poor question shape, not lack of sources. A query lattice forces decomposition before retrieval, routes each subquestion to source classes, and gives synthesis a traceable map from evidence to answered question.
