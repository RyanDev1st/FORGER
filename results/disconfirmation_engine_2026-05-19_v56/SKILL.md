# disconfirmation-engine

Search-first orchestrator for reTruth that requires support, contradiction, ambiguity, and noise checks before synthesis. Goal: make accepted claims survive adversarial retrieval rather than first-pass evidence.

## Invocation

- `/disconfirmation-engine <topic>` uses standard effort.
- `/disconfirmation-engine high <topic>` increases contradiction depth, ambiguity splitting, and re-fan breadth.

## Core drift

Original reTruth fans out by lane and validates that findings are sourced. Disconfirmation Engine adds a correction loop before synthesis: every important claim must be searched for opposing evidence, ambiguity, noisy-source risk, and route mismatch.

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
- claims likely to be contested
- likely ambiguity dimensions
- likely misinformation/noise risks

Write `brief.md`.

### Step 2 — Create workspace

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

### Step 3 — Build claim map

Write `claim-map.md` before lane retrieval:

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

Caps:

| Effort | Candidate claims | Disconfirmation alternates | Max active claims |
|---|---:|---:|---:|
| standard | 6 | 1 per high-risk claim | 10 |
| high | 9 | 2 per high-risk claim | 15 |

### Step 4 — Spawn lanes in parallel

Spawn scholar, community, and edge. Each lane receives:
- brief
- relevant candidate claims
- lane mandate
- support route
- disconfirmation route
- output path
- contradiction-log path
- effort

### Step 5 — Retrieval with disconfirmation

Every lane searches in two passes:

1. support pass: find the strongest source for the assigned claim
2. disconfirmation pass: search for contradiction, ambiguity, replication failure, operational failure, route mismatch, or noise

Every query must name a claim id.

Record:

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

### Step 6 — Findings

Every finding must include both support and disconfirmation state:

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

### Step 7 — Orchestrator validation

Validate:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has claim id | request claim binding |
| V3 | every accepted finding has disconfirmation state | request disconfirmation pass |
| V4 | every finding has quote | mark unsupported |
| V5 | contradiction-log covers all high-risk claims | re-fan or quarantine |
| V6 | noisy/misinformation-risk claims are not accepted | weaken, quarantine, or drop |

### Step 8 — Verification audit

Check URL liveness, quote match, claim-source alignment, route fit, and correction fit. A source can pass quote audit but fail correction fit if contradiction evidence requires weakening or splitting the claim.

### Step 9 — Synthesis

Synthesis must organize answer by correction outcome:
- accepted claims
- weakened claims
- split claims caused by ambiguity
- contradicted claims
- quarantined noisy or misinformation-risk claims
- unresolved high-risk claims
- highest-value next disconfirmation probe

### Step 10 — Re-fan

Re-fan only contested claims, not whole lanes:

```markdown
### Re-fan C<n>
- Claim id: C<n>
- Current status: <contradicted|ambiguous|noisy|route-mismatch|under-sourced>
- Missing evidence type: <support|contradiction|ambiguity resolution|noise audit|route-fit>
- Lane: <scholar|community|edge>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

## Why this variation

Corrective retrieval patterns show that retrieval quality must be evaluated and routed into different actions. Conflicting-evidence patterns show that ambiguity, misinformation, and noise interact rather than appearing separately. Disconfirmation Engine adapts both ideas to reTruth: it makes research lanes search against themselves before synthesis.
