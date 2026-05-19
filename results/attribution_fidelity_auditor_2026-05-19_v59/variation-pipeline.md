# Attribution Fidelity Auditor — Variation Pipeline

## Status

Complete v59 variation package.

## Source basis

- Original reTruth architecture: isolated lanes, validation gates, post-spawn verification audit, retry semantics, and re-fan.
- Search-first user requirement: online/source retrieval comes before synthesis.
- Playwright-retrieved Attributed QA abstract: attributed question answering needs reproducible evaluation, human annotation standards, and suitable automatic metrics.
- Playwright-retrieved RAG attribution abstract: citation correctness and citation faithfulness differ; many current attributed answers show post-rationalization and lack trustworthy faithfulness.

## Core drift

Attribution Fidelity Auditor changes citation handling. Instead of treating a quote-backed source as sufficient, the system asks whether the cited source genuinely constrained, changed, or grounded the claim.

Each finding records:

- citation correctness
- citation faithfulness
- claim before source
- claim after source
- reliance delta
- alternate-source risk
- attribution status

## Why this variation

Search-first systems can still look more grounded than they are. A model may form a plausible claim, then attach a supporting source afterward. That produces correct-looking attribution without genuine source reliance. This variation makes reliance visible.

This should improve:

- attribution honesty
- source trustworthiness
- high-stakes answer auditability
- reduced post-rationalized support
- better acceptance thresholds for synthesis
- more precise attribution re-fan

## Package hierarchy

```text
results/attribution_fidelity_auditor_2026-05-19_v59/
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
  attribution-plan.md
  scholar.md
  community.md
  edge.md
  reliance-ledger.md
  verification.md
  synthesis.md
  re-fan.md
```

## Pipeline

### 1. Parse brief

Extract topic, lens, domain, answer type, effort level, exclusions, constraints, likely answer components, contested claims, high-attribution-risk areas, and domains needing stricter attribution.

Output: `brief.md`.

### 2. Build attribution plan

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

### 3. Bound attribution set

Use effort-dependent caps:

| Effort | Attribution targets | Alternate checks | Max active targets |
|---|---:|---:|---:|
| standard | 6 | 1 per high-risk target | 10 |
| high | 9 | 2 per high-risk target | 15 |

Drop or merge targets that are redundant, vague, or unlikely to change synthesis quality.

### 4. Route attribution targets

Write route plan:

| Target | Lane | Source route | Correctness test | Faithfulness test | Why this route |
|---|---|---|---|---|---|

Routing logic:

- Scholar: methods, empirical claims, reviews, replication, institutional guidance.
- Community: artifacts, repos, incidents, migration lessons, maintainer statements.
- Edge: analogies, inversions, archives, minority credentialed critique, non-English routes.
- Shared: only if correctness and faithfulness require different source classes.

### 5. Spawn lanes

Spawn scholar, community, and edge in parallel. Each lane receives attribution targets, reliance schema, route hints, and output paths.

### 6. Retrieve with reliance tracing

Each lane executes:

1. retrieve source first
2. extract quote
3. draft claim from source-backed material
4. record claim before source and claim after source
5. describe reliance delta
6. run alternate-source and post-rationalization check
7. assign attribution status

Route log:

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

### 7. Extract findings

Every finding binds to attribution state:

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

### 8. Validate output

Orchestrator validates:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | every finding has attribution target | request attribution binding |
| V3 | every finding has quote | mark unsupported |
| V4 | every finding has correctness and faithfulness | request reliance audit |
| V5 | accepted findings are not post-rationalized | quarantine or re-fan |
| V6 | high-risk targets have alternate-source check | request alternate check |

### 9. Verify evidence

Run URL liveness, quote match, claim-source alignment, source-route fit, and attribution-fit check. Attribution-fit asks whether the reliance delta proves real source dependence.

### 10. Synthesize by attribution status

Write synthesis around attribution outcomes:

- faithful claims
- correct-only claims
- weakly attributed claims
- post-rationalized claims quarantined
- unsupported claims dropped
- attribution gaps not worth more search
- cross-lane source dependence transfers
- highest-value next attribution audit

### 11. Re-fan only attribution gaps

Re-fan packet:

```markdown
### Re-fan A<n>
- Attribution target: A<n>
- Current status: <correct-only|weak|post-rationalized|unsupported>
- Missing attribution proof: <quote|specificity|reliance-delta|alternate-source check>
- Lane: <lane>
- Alternate source route: <route>
- Stop condition: <what ends retry>
```

Do not re-run whole lanes unless attribution design failed systemically.

## Expected behavior change

Compared with baseline reTruth, Attribution Fidelity Auditor should produce fewer cosmetically grounded but weakly sourced findings because accepted claims must show both support and genuine source reliance.
