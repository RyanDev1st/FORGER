# Disconfirmation Engine — Variation Pipeline

## Status

Complete v56 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, post-spawn verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved CRAG abstract: retrieval quality can be evaluated, confidence can trigger different retrieval actions, web search can extend weak static retrieval, and decompose/recompose filtering can remove irrelevant information.
- Playwright-retrieved conflicting-evidence RAG abstract: robust RAG must handle ambiguity, conflicting information, misinformation, and noise jointly; multi-agent debate and aggregation can collate valid answers while discarding misinformation and noise.

## Core drift

Disconfirmation Engine changes the acceptance rule. Instead of accepting quote-backed findings once a lane finds credible support, every high-value claim must pass a support plus disconfirmation loop.

Lanes search for:

1. support
2. contradiction
3. ambiguity
4. noise or misinformation risk
5. route fit

Synthesis uses correction outcomes, not raw lane confidence.

## Why this variation

Broad research often sounds confident because each lane brings back its best evidence. That still leaves first-hit bias, one-sided retrieval, ambiguous entities, noisy documents, and plausible misinformation. Disconfirmation Engine makes opposing evidence a required retrieval product.

This should improve:

- resistance to first credible source bias
- better disputed-topic handling
- clearer ambiguity splits
- explicit noise suppression
- safer confidence calibration
- stronger claim-level re-fan

## Package hierarchy

```text
results/disconfirmation_engine_2026-05-19_v56/
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
  claim-map.md
  scholar.md
  community.md
  edge.md
  contradiction-log.md
  correction-table.md
  verification.md
  synthesis.md
  re-fan.md
```

## Pipeline

### 1. Parse brief

Extract topic, lens, domain, answer type, effort level, exclusions, constraints, likely answer components, contested claims, ambiguity dimensions, and likely noise risks.

Output: `brief.md`.

### 2. Build claim map

Write `claim-map.md` with candidate claims:

```markdown
### Claim C<n>: <candidate answer claim>
- Parent question: <root or claim id>
- Evidence need: <mechanism|effect|history|implementation|failure|counterexample|analogy>
- Primary lane: <scholar|community|edge|shared>
- Support route: <source type>
- Disconfirmation route: <source type>
- Ambiguity risk: <low|medium|high>
- Noise risk: <low|medium|high>
- Success condition: <what would support, weaken, or split the claim>
```

### 3. Bound claim set

Use effort-dependent caps:

| Effort | Candidate claims | Disconfirmation alternates | Max active claims |
|---|---:|---:|---:|
| standard | 6 | 1 per high-risk claim | 10 |
| high | 9 | 2 per high-risk claim | 15 |

Drop or merge claims that are redundant, unanswerable, or unlikely to affect synthesis.

### 4. Route support and disconfirmation

Write route plan in `claim-map.md` or `correction-table.md`:

| Claim | Lane | Support route | Disconfirmation route | Ambiguity probe | Noise probe |
|---|---|---|---|---|---|

Routing logic:

- Scholar: method, empirical, institutional, replication, review, benchmark, falsifiability.
- Community: implementation, dataset, repo, incident, postmortem, maintainer, migration, benchmark regression.
- Edge: analogy, inversion, historical failure, non-English exception, minority credentialed critique, overlooked archive.
- Shared: only if support and contradiction require materially different source classes.

### 5. Spawn lanes

Spawn scholar, community, and edge in parallel. Each lane receives assigned claims, lane mandate, support routes, disconfirmation routes, and output paths.

### 6. Search with probes

Each lane logs every query against a claim:

```markdown
### Probe <lane><n>
- Claim: C<n>
- Query: <query string>
- Probe type: <support|contradiction|ambiguity|noise|route-fit>
- Source route: <route>
- Candidate ids: <ids>
- Yield: <hit|weak-hit|miss>
- Next action: <continue|alternate|close>
```

A lane may alternate route once per high-risk claim before closing as unresolved.

### 7. Extract corrected findings

Every finding binds to a claim and correction state:

```markdown
### Finding <lane><n>: <claim>
- Claim id: C<n>
- Source id: <id>
- Source: <title> — <URL>
- Evidence quote: "<verbatim quote>"
- Support state: <supported|partially-supported|unsupported>
- Disconfirmation state: <none-found|contradicted|ambiguous|noisy|misinformation-risk|route-mismatch>
- Correction action: <accept|weaken|split-claim|alternate-route|quarantine|drop>
- Confidence: <high|medium|low>
- Limits: <what remains unresolved>
```

### 8. Validate output

Orchestrator validates:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has claim id | request claim binding |
| V3 | every accepted finding has disconfirmation state | request disconfirmation pass |
| V4 | every finding has quote | mark unsupported |
| V5 | contradiction-log covers all high-risk claims | decide re-fan |
| V6 | noisy or misinformation-risk claims are not accepted | weaken, quarantine, or drop |

### 9. Verify evidence

Run URL liveness, quote match, claim-source alignment, route-fit check, and correction-fit check. Correction-fit asks whether the disconfirmation evidence actually justifies the selected correction action.

### 10. Synthesize by correction outcome

Write synthesis around corrected claims:

- accepted claims
- weakened claims
- split claims caused by ambiguity
- contradicted claims
- quarantined noisy or misinformation-risk claims
- unresolved high-risk claims
- cross-lane correction transfers
- highest-value next disconfirmation probe

### 11. Re-fan only contested claims

Re-fan packet:

```markdown
### Re-fan C<n>
- Claim id: C<n>
- Current status: <contradicted|ambiguous|noisy|route-mismatch|under-sourced>
- Missing evidence type: <support|contradiction|ambiguity resolution|noise audit|route-fit>
- Lane: <scholar|community|edge>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

Do not re-run whole lanes unless disconfirmation coverage failed systemically.

## Expected behavior change

Compared with baseline reTruth, Disconfirmation Engine should produce fewer brittle conclusions, better disputed-topic reporting, and more honest confidence levels because each accepted claim has survived an explicit search for contradiction, ambiguity, route mismatch, and noise.
