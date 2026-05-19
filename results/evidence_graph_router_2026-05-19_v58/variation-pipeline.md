# Evidence Graph Router — Variation Pipeline

## Status

Complete v58 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, post-spawn verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved KG-guided RAG abstract: existing RAG often retrieves isolated semantic chunks and ignores intrinsic relationships; KG-guided chunk expansion and organization improve diversity and coherence.
- Playwright-retrieved GraphRAG article: conventional RAG fails on global questions over a corpus; graph indexes can derive entity knowledge graphs, pregenerate community summaries, and improve comprehensiveness and diversity.

## Core drift

Evidence Graph Router changes the research artifact. Instead of lane files as flat finding lists, each lane emits graph records: nodes, edges, graph roles, expansion routes, and community summaries.

The orchestrator then synthesizes from:

- local claim neighborhoods
- source communities
- cross-lane bridge nodes
- contradiction neighborhoods
- isolated high-value nodes
- weak or unsupported edges

## Why this variation

Many broad briefs ask for structure: main themes, causal relationships, competing schools, implementation ecosystems, or hidden analogies. Flat retrieval can find facts but lose relationships. Evidence Graph Router keeps relationships visible before synthesis.

This should improve:

- global sensemaking questions
- relationship-heavy research
- source coherence
- contradiction localization
- cross-lane transfer
- targeted graph-gap re-fan

## Package hierarchy

```text
results/evidence_graph_router_2026-05-19_v58/
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

## Pipeline

### 1. Parse brief

Extract topic, lens, domain, answer type, effort level, exclusions, constraints, likely answer components, likely entities, likely relationship types, and likely global-sensemaking questions.

Output: `brief.md`.

### 2. Build graph plan

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

### 3. Bound graph size

Use effort-dependent caps:

| Effort | Root targets | Expansion hops | Max graph targets |
|---|---:|---:|---:|
| standard | 6 | 1 | 10 |
| high | 9 | 2 | 15 |

Drop or merge graph targets that are redundant, unanswerable, or unlikely to affect synthesis.

### 4. Route graph targets

Write route plan:

| Graph target | Lane | Node types | Edge types | Expansion route | Why this route |
|---|---|---|---|---|---|

Routing logic:

- Scholar: citation, method, benchmark, replication, institutional, contradiction neighborhoods.
- Community: artifact, issue, dataset, incident, maintainer, migration, benchmark neighborhoods.
- Edge: analogy, historical failure, inversion, regional exception, archive, minority critique, bridge neighborhoods.
- Shared: only when lanes search materially different relationship classes.

### 5. Spawn lanes

Spawn scholar, community, and edge in parallel. Each lane receives assigned graph targets, node/edge schema, route hints, and output paths.

### 6. Retrieve seeds and expand neighborhoods

Each lane executes:

1. retrieve semantic seed
2. extract source, claim, entity, method/artifact, contradiction, or analogy nodes
3. extract supported edges
4. expand one approved neighborhood
5. summarize community if requested
6. emit quote-backed findings and graph records

Route log:

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

### 7. Extract findings

Every finding binds to graph records:

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

### 8. Merge graph ledger

Orchestrator writes `graph-ledger.md`:

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

### 9. Validate output

Orchestrator validates:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has graph target | request graph binding |
| V3 | every finding has node and edge ids | request graph records |
| V4 | every edge has quote or source support | mark unsupported edge |
| V5 | high-risk graph targets have route status | retry route closeout |
| V6 | community summaries list member nodes | request member list |

### 10. Verify evidence

Run URL liveness, quote match, claim-source alignment, edge-source fit, and neighborhood-fit check. Neighborhood-fit asks whether graph expansion followed the assigned relationship route.

### 11. Synthesize by graph structure

Write synthesis around graph structure:

- strongest local claim neighborhoods
- source communities
- cross-lane bridge nodes
- contradiction neighborhoods
- isolated high-value nodes
- weak or unsupported edges
- graph gaps not worth more search
- highest-value next expansion

### 12. Re-fan only graph gaps

Re-fan packet:

```markdown
### Re-fan G<n>
- Graph target: G<n>
- Current status: <missing-node|missing-edge|weak-community|contradiction-unresolved|isolated-claim>
- Missing relation: <edge or node type>
- Lane: <lane>
- Alternate expansion route: <route>
- Stop condition: <what ends retry>
```

Do not re-run whole lanes unless graph schema failed systemically.

## Expected behavior change

Compared with baseline reTruth, Evidence Graph Router should better answer broad, relationship-heavy, or corpus-level questions because it preserves evidence neighborhoods and community structure before synthesis.
