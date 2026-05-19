# evidence-chain-planner

Search-first orchestrator for reTruth using explicit multi-hop evidence chains. Goal: answer complex questions by retrieving, reasoning over, and pruning linked evidence steps rather than relying on isolated strong passages.

## Invocation

- `/evidence-chain-planner <topic>` uses standard effort.
- `/evidence-chain-planner high <topic>` increases hop depth, chain alternates, and distractor-prune passes.

## Core drift

Original reTruth fans out isolated lanes and synthesizes findings. Evidence Chain Planner keeps isolated lanes but makes each lane operate on hop chains: decompose question, retrieve anchor evidence, follow bridge facts, prune distractors, and close only complete chains.

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
- likely bridge entities
- likely dependency steps
- likely distractor patterns

Write `brief.md`.

### Step 2 — Create workspace

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

### Step 3 — Build chain plan

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

Caps:

| Effort | Root chains | Max hops per chain | Max active chains |
|---|---:|---:|---:|
| standard | 6 | 3 | 10 |
| high | 9 | 4 | 15 |

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- assigned chains
- lane mandate
- hop schema
- output path
- chain-log path
- effort

### Step 5 — Multi-hop retrieval loop

Each lane repeats for each chain:

1. decompose chain into anchor and bridge needs
2. retrieve anchor passage
3. reason about next hop
4. retrieve linked passage
5. prune distractors
6. stop when end condition reached or chain fails

Record:

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

### Step 6 — Findings

Every finding must bind to a completed or partial chain:

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

### Step 7 — Orchestrator validation

Validate:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has chain id | request chain binding |
| V3 | every complete chain has ordered hop log | request hop closeout |
| V4 | every finding has quote | mark unsupported |
| V5 | broken high-risk chains listed | decide re-fan |
| V6 | distractor-prune actions logged | request prune log |

### Step 8 — Verification audit

Check URL liveness, quote match, claim-source alignment, hop order, and bridge-fit. Bridge-fit asks whether each hop actually supports the next hop rather than merely co-occurring.

### Step 9 — Synthesis

Synthesis must organize by chain outcomes:
- complete high-value chains
- partial but useful chains
- broken chains with missing bridge fact
- distractor-heavy chains not worth more search
- cross-lane bridge transfers
- highest-value next hop

### Step 10 — Re-fan

Re-fan only missing or broken hops:

```markdown
### Re-fan H<n>
- Chain: H<n>
- Current status: <partial|broken|distractor-heavy|under-sourced>
- Missing hop: <anchor|bridge|close>
- Lane: <lane>
- Alternate route: <route>
- Stop condition: <what ends retry>
```

## Why this variation

HopRAG shows value in exploring logical neighbors and pruning irrelevant passages. PRISM shows value in decomposition plus selector/adder loops for compact but comprehensive evidence. Evidence Chain Planner adapts both to reTruth by making multi-hop support an explicit retrieval object.
