# Query Route Lattice — Variation Pipeline

## Status

Complete v55 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, post-spawn verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Agentic search best-practice patterns: decompose broad questions, route subquestions to suitable source types, retrieve iteratively from unresolved cells, and preserve evidence-to-question traceability.

## Core drift

Query Route Lattice changes the first orchestration move. Instead of sending the full brief to each lane and trusting lane mandates to search well, the orchestrator first decomposes the topic into answerable cells. Each cell gets an evidence need, source route, lane assignment, dependency, and success condition.

Lanes then search cell-by-cell. Findings must resolve explicit cells, not broad themes.

## Why this variation

Broad research often fails because the first query is too vague. Even strong lanes can duplicate effort, skip hidden subquestions, or return impressive but uneven evidence. Query Route Lattice makes the question structure visible before retrieval begins.

This should improve:

- coverage of multi-part topics
- source-route precision
- reduced duplicated lane searches
- clearer unresolved-gap reporting
- better targeted re-fan
- stronger synthesis traceability

## Package hierarchy

```text
results/query_route_lattice_2026-05-19_v55/
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

## Pipeline

### 1. Parse brief

Extract topic, lens, domain, answer type, effort level, exclusions, constraints, likely answer components, and contested claims.

Output: `brief.md`.

### 2. Build question lattice

Write `lattice.md` with answerable cells:

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

### 3. Bound lattice size

Use effort-dependent caps:

| Effort | Root cells | Follow-up cells | Max active cells |
|---|---:|---:|---:|
| standard | 6 | 4 | 10 |
| high | 9 | 6 | 15 |

Drop or merge cells that are redundant, unanswerable, or unlikely to affect synthesis.

### 4. Route cells

Write `route-plan.md`:

| Cell | Lane | Source route | Query shape | Why this route |
|---|---|---|---|---|

Routing logic:

- Scholar: method, empirical, institutional, benchmark, review, falsifiability.
- Community: implementation, artifact, dataset, repo, postmortem, maintainer, migration.
- Edge: analogy, inversion, historical-deprecated, non-English, minority credentialed, overlooked archive.
- Shared: only if different lanes search materially different source classes.

### 5. Spawn lanes

Spawn scholar, community, and edge in parallel. Each lane receives only relevant cells, plus lane mandate and route-plan excerpt.

This preserves context isolation while preventing each lane from independently inventing broad search scope.

### 6. Search by cell

Each lane logs every query against a cell:

```markdown
### Route <lane><n>
- Cell: Q<n>
- Query: <query string>
- Source route: <route>
- Candidate ids: <ids>
- Yield: <hit|weak-hit|miss>
- Next route: <continue|alternate|close>
```

A lane may alternate route once per high-risk cell before closing it as unresolved.

### 7. Extract findings

Every finding binds to a cell:

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

### 8. Validate output

Orchestrator validates:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has cell id | request cell binding |
| V3 | every active cell has route status | retry route closeout |
| V4 | every finding has quote | mark unsupported |
| V5 | unresolved high-risk cells listed | decide re-fan |

### 9. Verify evidence

Run URL liveness, quote match, claim-source alignment, and route-fit check. Route-fit asks whether the source type actually matches the cell evidence need.

### 10. Synthesize by cell

Write synthesis around resolved cells, not around lane summaries:

- resolved high-value cells
- conflicting cells
- unresolved high-risk cells
- weak cells not worth more search
- cross-lane transfers
- highest-value next cell

### 11. Re-fan only unresolved cells

Re-fan packet:

```markdown
### Re-fan Q<n>
- Cell: Q<n>
- Current status: <unresolved|conflicted|weak>
- Missing evidence type: <type>
- Lane: <lane>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

Do not re-run whole lanes unless lattice failure is systemic.

## Expected behavior change

Compared with baseline reTruth, Query Route Lattice should produce more complete coverage of broad questions, fewer duplicate findings across lanes, and more actionable re-fan prompts because gaps are attached to precise cells rather than vague topics.
