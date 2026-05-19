# Evidence Budget Router — Variation Pipeline

## Status

Complete v54 variation package.

## Source basis

- Original reTruth architecture: isolated scholar, community, and edge lanes; validation gates; verification audit; synthesis; re-fan.
- Search-first requirement from user: retrieve before synthesis, and preserve evidence trail.
- Current agentic research patterns: adaptive retrieval, evidence acquisition, value-aware search, uncertainty reduction, and explicit stopping criteria.

## Core drift

Evidence Budget Router treats search as a limited resource rather than an unlimited expansion loop. Each lane receives a fixed budget of retrieval units, allocates those units across query families, reviews yield after each unit, rebalances toward unresolved high-value claims, and stops when marginal evidence no longer changes the answer.

## Why this variation

Original reTruth is strong at avoiding premature convergence, but broad search can drift into equal-effort retrieval across unequal questions. Budget routing adds discipline: spend more where uncertainty drops, stop where results repeat, and expose exactly where an additional search unit would matter.

This should improve:

- search efficiency on broad topics
- auditability of why retrieval continued or stopped
- resistance to low-yield source chasing
- clearer synthesis of unresolved claims
- better re-fan decisions after verification failures

## Package hierarchy

```text
results/evidence_budget_router_2026-05-19_v54/
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
  budget-plan.md
  scholar.md
  community.md
  edge.md
  budget-log.md
  verification.md
  synthesis.md
  re-fan.md
```

## Pipeline

### 1. Parse brief

Extract topic, lens, desired output, domain, effort level, success criteria, exclusion zones, likely high-value unknowns, and likely low-yield zones.

Output: `brief.md`.

### 2. Create budget plan

Define the shared budget schema before any lane search starts:

- budget unit: one query family pass or follow-up bundle
- planned budget: initial units per lane
- yield: useful findings per unit
- uncertainty reduction: how much claim ambiguity dropped
- stop rule: condition to stop spending
- rebalance rule: when to move units elsewhere

Default budgets:

| Effort | Units per lane | Findings floor | Extra units allowed |
|---|---:|---:|---:|
| standard | 8 | 5 | 1 |
| high | 12 | 7 | 2 |

### 3. Spawn three lanes

Run scholar, community, and edge lanes in parallel. Each receives:

- brief
- lane mandate
- budget schema
- output path
- budget log path
- effort level

### 4. Allocate lane budgets

Each lane splits units across route families.

Scholar examples:

- review / survey
- method / experiment
- replication / limitation
- dataset / benchmark
- critique / disagreement
- institutional / standards

Community examples:

- implementation / deployment
- incident / postmortem
- discussion / debate
- repo / dataset / artifact
- maintainer / standard / authority
- migration / adoption lessons

Edge examples:

- historical / deprecated term
- adjacent domain
- critique / failure
- non-English
- archive / forum / mailing list
- inversion
- minority but credentialed view

### 5. Run budget units

For each unit, lane records:

```markdown
### Budget <lane><n>
- Unit: <n>
- Query family: <family>
- Spend reason: <why this unit>
- Yield: <high|medium|low|zero>
- Uncertainty reduction: <high|medium|low|none>
- Rebalance action: <keep|shift|stop>
- Notes: <what changed>
```

### 6. Rebalance during retrieval

Lane shifts away from:

- repeated low-yield queries
- abstract-only or quote-free hits
- vendor-heavy noise
- fake novelty
- redundant sources
- crank-risk routes

Lane invests extra only when:

- central uncertainty remains unresolved
- source quality is high enough
- expected uncertainty reduction is high
- finding would transfer into final synthesis

### 7. Select sources

Sources must have:

- extractable quote
- clear authorship or authority signal
- direct relevance or strong transfer mechanism
- low overlap with already selected evidence
- usable audit trail

Drop sources that are predatory, anonymous certainty, quote-free, stale tutorials, AI SEO pages, brochure marketing, conspiracy framing, or miracle claims.

### 8. Apply stop rules

Lane stops when any condition holds:

- two consecutive zero-yield units in same route family
- central claims are already triangulated
- next unit is unlikely to change answer
- only low-value marginal findings remain
- budget is exhausted without compelling rebalance case

### 9. Validate lane outputs

Orchestrator checks:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | at least 5 findings or justified stop | allow under-sourced flag |
| V3 | every finding has quote | mark unsupported |
| V4 | budget log exists | retry budget closeout |
| V5 | stop reason recorded | retry closeout only |

### 10. Merge budget logs

Write `budget-log.md` with:

- best-yield query families
- wasted units and why
- strongest uncertainty reduction per lane
- where extra budget would matter most
- where search should have stopped earlier

### 11. Verify evidence

Run URL liveness, quote match, and claim-source alignment checks. Failed verification can retroactively mark spend as low-value.

### 12. Synthesize

Synthesis must include:

- strongest findings
- where budget was well spent
- unresolved claims due to budget limits
- zones intentionally stopped early
- highest-value next search if more budget is granted

### 13. Re-fan selectively

Re-fan only when:

- central claim remains unresolved
- one lane shows high expected value for an extra unit
- all lanes exhausted budget without triangulation
- verification erased too much value from spent units
- wasted spend pattern reveals bad routing

## Expected behavior change

Compared with baseline reTruth, this variation should produce fewer repetitive findings, clearer stop reasons, and a better account of why one unresolved question deserves more retrieval while another does not.
