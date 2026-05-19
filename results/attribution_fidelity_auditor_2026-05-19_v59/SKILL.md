# attribution-fidelity-auditor

Search-first orchestrator for reTruth that audits attribution faithfulness, not only citation correctness. Goal: prevent post-rationalized citations from entering synthesis as robust evidence.

## Invocation

- `/attribution-fidelity-auditor <topic>` uses standard effort.
- `/attribution-fidelity-auditor high <topic>` increases reliance-trace depth, alternate-source checks, and attribution-risk auditing.

## Core drift

Original reTruth requires quote-backed findings and verifies quote presence. Attribution Fidelity Auditor keeps that baseline but adds a source-reliance audit: every claim must explain how the cited source changed, constrained, or grounded the claim.

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
- likely contested claims
- likely high-attribution-risk areas
- high-stakes domains needing stricter attribution

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  attribution-plan.md
  scholar.md
  community.md
  edge.md
  reliance-ledger.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Build attribution plan

Write `attribution-plan.md`:

```markdown
### Attribution target A<n>: <claim area>
- Claim area: <area>
- Lane: <scholar|community|edge|shared>
- Source route: <source type>
- Attribution risk: <low|medium|high>
- Correctness test: <what quote must support>
- Faithfulness test: <what reliance must prove>
- Alternate-source risk: <could many sources support this generically?>
- Post-rationalization risk: <low|medium|high>
- Stop condition: <what makes attribution sufficient>
```

Caps:

| Effort | Attribution targets | Alternate checks | Max active targets |
|---|---:|---:|---:|
| standard | 6 | 1 per high-risk target | 10 |
| high | 9 | 2 per high-risk target | 15 |

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- attribution targets
- lane mandate
- source routes
- reliance schema
- output path
- reliance-ledger path
- effort

### Step 5 — Search with reliance tracing

Each lane must retrieve before claiming. For each finding:

1. retrieve source
2. extract quote
3. draft claim only from source-backed content
4. record what source changed or constrained
5. run alternate-source/post-rationalization check
6. assign attribution status

Record:

```markdown
### Reliance <lane><n>
- Attribution target: A<n>
- Query: <query string>
- Source route: <route>
- Source id: <id>
- Quote: "<verbatim quote>"
- Claim before source: <none|drafted-from-brief|prior-lane-transfer>
- Claim after source: <claim>
- Reliance delta: <what changed because of source>
- Alternate-source check: <generic|specific|unique|failed>
- Attribution status: <faithful|correct-only|weak|post-rationalized|unsupported>
```

### Step 6 — Findings

Every finding must include correctness and faithfulness:

```markdown
### Finding <lane><n>: <claim>
- Attribution target: A<n>
- Source id: <id>
- Source: <title> — <URL>
- Evidence quote: "<verbatim quote>"
- Citation correctness: <supports|partially-supports|does-not-support>
- Citation faithfulness: <faithful|correct-only|weak|post-rationalized|unsupported>
- Reliance delta: <what source changed, constrained, or grounded>
- Alternate-source risk: <low|medium|high>
- Confidence: <high|medium|low>
- Limits: <what remains unattributed>
```

### Step 7 — Orchestrator validation

Validate:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has attribution target | request attribution binding |
| V3 | every finding has quote | mark unsupported |
| V4 | every finding has correctness and faithfulness | request reliance audit |
| V5 | accepted findings are not post-rationalized | quarantine or re-fan |
| V6 | high-risk targets have alternate-source check | request alternate check |

### Step 8 — Verification audit

Check URL liveness, quote match, claim-source alignment, source-route fit, and attribution-fit. Attribution-fit asks whether the reliance delta proves the source genuinely shaped the claim.

### Step 9 — Synthesis

Synthesis must organize by attribution status:
- faithful claims
- correct-only claims
- weakly attributed claims
- post-rationalized claims quarantined
- unsupported claims dropped
- high-attribution-risk gaps
- highest-value next attribution audit

### Step 10 — Re-fan

Re-fan only attribution gaps:

```markdown
### Re-fan A<n>
- Attribution target: A<n>
- Current status: <correct-only|weak|post-rationalized|unsupported>
- Missing attribution proof: <quote|specificity|reliance-delta|alternate-source check>
- Lane: <lane>
- Alternate source route: <route>
- Stop condition: <what ends retry>
```

## Why this variation

Attribution research shows that correctness and faithfulness differ: a cited source can support a statement while not being the real basis for it. Attribution Fidelity Auditor adapts this to reTruth by requiring a reliance trace for each finding before synthesis.
