# evidence-graph-router

Search-first orchestrator for reTruth using evidence graphs before synthesis. Goal: preserve relationships between claims, entities, sources, methods, artifacts, contradictions, and analogies instead of flattening retrieval into lane summaries.

## Invocation

- `/evidence-graph-router <topic>` uses standard effort.
- `/evidence-graph-router high <topic>` increases graph expansion depth, community summaries, and contradiction-neighborhood checks.

## Core drift

Original reTruth fans out lanes and synthesizes lane files. Evidence Graph Router keeps isolated lanes but requires each lane to emit graph records. The orchestrator merges lane graphs, builds evidence neighborhoods, summarizes communities, and only then writes synthesis.

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
- likely entities
- likely relationship types
- likely global-sensemaking questions

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  graph-plan.md
  scholar.md
  community.md
  edge.md
  graph-ledger.md
  community-summaries.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Build graph plan

Write `graph-plan.md`:

```markdown
### Graph target G<n>: <target relationship or neighborhood>
- Root entity or claim: <entity|claim>
- Lane: <scholar|community|edge|shared>
- Node types: <claim|source|entity|method|artifact|failure|analogy|contradiction>
- Edge types: <supports|contradicts|depends-on|same-entity|adjacent-to|implements|critiques>
- Expansion route: <semantic seed|entity-neighborhood|citation-neighborhood|artifact-neighborhood|analogy-neighborhood>
- Community summary need: <yes|no>
- Success condition: <what graph relation resolves>
- Risk if missing: <low|medium|high>
```

Caps:

| Effort | Root targets | Expansion hops | Max graph targets |
|---|---:|---:|---:|
| standard | 6 | 1 | 10 |
| high | 9 | 2 | 15 |

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- assigned graph targets
- lane mandate
- node/edge schema
- output path
- graph-ledger path
- effort

### Step 5 — Graph-guided retrieval

Each lane retrieves seed sources, then expands by approved relationships:

1. retrieve semantic seed
2. extract nodes
3. extract edges
4. expand one approved neighborhood
5. summarize local community if needed
6. emit quote-backed findings plus graph records

Record:

```markdown
### Graph route <lane><n>
- Graph target: G<n>
- Seed query: <query string>
- Expansion route: <route>
- Nodes added: <ids>
- Edges added: <ids>
- Community summary: <yes|no>
- Yield: <local-hit|community-hit|weak-hit|miss>
- Next action: <expand|summarize|close|re-fan>
```

### Step 6 — Findings

Every finding must bind to graph nodes and edges:

```markdown
### Finding <lane><n>: <claim>
- Graph target: G<n>
- Source node: <Nsrc>
- Claim node: <Nclaim>
- Related nodes: <ids>
- Evidence edges: <ids>
- Source: <title> — <URL>
- Evidence quote: "<verbatim quote>"
- Graph role: <seed|expanded-neighbor|community-summary|bridge|contradiction>
- Confidence: <high|medium|low>
- Limits: <missing relation or weak edge>
```

### Step 7 — Orchestrator graph merge

Merge lane graph records into `graph-ledger.md`:

```markdown
### Node N<n>
- Type: <claim|source|entity|method|artifact|failure|analogy|contradiction>
- Label: <label>
- Lane: <scholar|community|edge|shared>
- Source ids: <ids>
- Confidence: <high|medium|low>

### Edge E<n>
- From: <node id>
- To: <node id>
- Type: <supports|contradicts|depends-on|same-entity|adjacent-to|implements|critiques>
- Evidence quote: "<verbatim quote>"
- Source id: <id>
- Confidence: <high|medium|low>
```

### Step 8 — Validate output

Validate:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has graph target | request graph binding |
| V3 | every finding has node and edge ids | request graph records |
| V4 | every edge has quote or source support | mark unsupported edge |
| V5 | high-risk graph targets have route status | retry route closeout |
| V6 | community summaries list member nodes | request member list |

### Step 9 — Verification audit

Check URL liveness, quote match, claim-source alignment, edge-source fit, and neighborhood fit. Neighborhood fit asks whether graph expansion followed an allowed relationship route.

### Step 10 — Synthesis

Synthesis must organize by graph structure:
- strongest local claim neighborhoods
- cross-lane bridge nodes
- contradiction neighborhoods
- source communities
- isolated but high-value nodes
- weak or unsupported edges
- highest-value next graph expansion

### Step 11 — Re-fan

Re-fan only graph gaps:

```markdown
### Re-fan G<n>
- Graph target: G<n>
- Current status: <missing-node|missing-edge|weak-community|contradiction-unresolved|isolated-claim>
- Missing relation: <edge or node type>
- Lane: <lane>
- Alternate expansion route: <route>
- Stop condition: <what ends retry>
```

## Why this variation

KG-guided retrieval shows value in expanding from semantic seed chunks through relationships and organizing retrieved content coherently. GraphRAG shows value in community summaries for global questions over a corpus. Evidence Graph Router adapts both ideas to reTruth by making evidence relationships first-class before synthesis.
