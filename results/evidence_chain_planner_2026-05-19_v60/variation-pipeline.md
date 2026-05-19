# Evidence Chain Planner — Variation Pipeline

## Status

Complete v60 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, post-spawn verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved HopRAG abstract: multi-hop retrieval should expand by logical relevance rather than plain similarity and use retrieve-reason-prune to improve answer quality.
- Playwright-retrieved PRISM abstract: multi-hop QA improves when a question is decomposed into sub-questions and retrieval alternates between precise selection and adding missing evidence.

## Core drift

Evidence Chain Planner changes support shape. Instead of accepting isolated findings, it requires explicit evidence chains with ordered hops, bridge entities, prune actions, and close conditions.

## Why this variation

Complex topics often need linked support: one source gives anchor fact, another gives bridge relation, another closes answer. Flat retrieval can miss missing links and overvalue isolated passages. This variation makes dependency path visible.

This should improve:

- multi-step question handling
- retrieval over logical bridges
- distractor suppression
- dependency-aware synthesis
- chain-level uncertainty reporting
- more precise re-fan on broken hops

## Package hierarchy

```text
results/evidence_chain_planner_2026-05-19_v60/
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
  chain-plan.md
  scholar.md
  community.md
  edge.md
  chain-log.md
  verification.md
  synthesis.md
  re-fan.md
```

## Pipeline

### 1. Parse brief

Extract topic, lens, domain, answer type, effort level, exclusions, constraints, likely answer components, likely bridge entities, likely dependency steps, and likely distractor patterns.

Output: `brief.md`.

### 2. Build chain plan

Write `chain-plan.md`:

```markdown
### Chain H<n>: <claim or subquestion>
- Root question: <root or chain id>
- Lane: <scholar|community|edge|shared>
- Anchor need: <first fact needed>
- Bridge need: <linking fact or entity>
- End condition: <what closes chain>
- Prune rule: <what counts as distractor>
- Max hops: <2|3|4>
- Risk if incomplete: <low|medium|high>
```

### 3. Bound chain set

Use effort-dependent caps:

| Effort | Root chains | Max hops per chain | Max active chains |
|---|---:|---:|---:|
| standard | 6 | 3 | 10 |
| high | 9 | 4 | 15 |

Drop or merge chains that are redundant, too shallow, or unlikely to affect synthesis.

### 4. Route chains

Write route plan:

| Chain | Lane | Anchor need | Bridge need | Prune rule | Why this route |
|---|---|---|---|---|---|

Routing logic:

- Scholar: method bridges, replication links, benchmark deltas, institutional exceptions, contradiction bridges.
- Community: repo-to-issue, incident-to-root-cause, migration-to-outcome, maintainer-to-artifact, benchmark-to-constraint bridges.
- Edge: analogy-to-transfer, historical-failure-to-present parallel, inversion-to-limit, archive-to-resolution bridges.
- Shared: only when different lanes can chase materially different bridge facts.

### 5. Spawn lanes

Spawn scholar, community, and edge in parallel. Each lane receives assigned chains, hop schema, route hints, and output paths.

### 6. Run multi-hop retrieval

Each lane executes:

1. decompose chain into anchor and bridge needs
2. retrieve anchor passage
3. reason about next hop
4. retrieve linked passage
5. prune distractors
6. continue until end condition reached or chain breaks

Route log:

```markdown
### Hop <lane><n>
- Chain: H<n>
- Hop number: <1|2|3|4>
- Need: <anchor|bridge|close>
- Query: <query string>
- Source route: <route>
- Candidate ids: <ids>
- Selected id: <id or none>
- Yield: <hit|weak-hit|distractor|miss>
- Next action: <next-hop|prune|alternate|close>
```

### 7. Extract findings

Every finding binds to chain state:

```markdown
### Finding <lane><n>: <claim>
- Chain id: H<n>
- Hop count: <n>
- Source ids: <ordered ids>
- Bridge entities: <entities or links>
- Source: <primary title> — <URL>
- Evidence quote: "<verbatim quote>"
- Chain status: <complete|partial|broken>
- Prune result: <clean|distractor-removed|alternate-used>
- Confidence: <high|medium|low>
- Limits: <missing hop or weak bridge>
```

### 8. Validate output

Orchestrator validates:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has chain id | request chain binding |
| V3 | every complete chain has ordered hop log | request hop closeout |
| V4 | every finding has quote | mark unsupported |
| V5 | broken high-risk chains listed | decide re-fan |
| V6 | distractor-prune actions logged | request prune log |

### 9. Verify evidence

Run URL liveness, quote match, claim-source alignment, hop-order check, and bridge-fit check. Bridge-fit asks whether each hop genuinely advances chain logic.

### 10. Synthesize by chain outcome

Write synthesis around chain outcomes:

- complete high-value chains
- partial but useful chains
- broken chains with missing bridge fact
- distractor-heavy chains not worth more search
- cross-lane bridge transfers
- highest-value next hop

### 11. Re-fan only broken hops

Re-fan packet:

```markdown
### Re-fan H<n>
- Chain: H<n>
- Current status: <partial|broken|distractor-heavy|under-sourced>
- Missing hop: <anchor|bridge|close>
- Lane: <lane>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

Do not re-run whole lanes unless chain design failed systemically.

## Expected behavior change

Compared with baseline reTruth, Evidence Chain Planner should better answer multi-step questions and reduce false confidence from isolated passages because accepted claims require visible bridge logic across ordered retrieval hops.
