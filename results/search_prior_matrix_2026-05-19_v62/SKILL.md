---
name: search-prior-matrix
---

# search-prior-matrix

Search-first gnosis variation. Replace fixed lane fan-out with prior-building pass, then route lanes by uncertainty type.

## Invocation

Use for research, brainstorming, or architecture exploration where first question is not "which lane should search?" but "what does open web already imply?"

## Core drift

Original gnosis isolates Scholar, Community, Edge from start. This variant delays identity. First pass builds a source-prior matrix. Lanes then attack cells with highest value of information.

## Pipeline

### Step 1 — Parse brief

Extract topic, lens, domain, decision type, risk domain, effort, and expected output.

### Step 2 — Search-prior pass

Run broad web search before spawning lanes. Build `prior-matrix.md` with rows:

| Cell | Claim seed | Source class | Source | Quote | Prior strength | Unknown | Lane target |
|---|---|---|---|---|---|---|---|

Source classes: academic, practitioner, archive, forum, dataset, official, critique, adjacent-field.

### Step 3 — Classify uncertainty

Tag each cell:

- `method-uncertain` — needs academic/method review.
- `practice-uncertain` — needs field evidence or deployment reality.
- `frame-uncertain` — needs analogies, hidden history, or contrarian check.
- `verification-uncertain` — source exists but quote/provenance weak.

### Step 4 — Spawn three lanes in parallel

- Scholar lane gets top `method-uncertain` cells.
- Community lane gets top `practice-uncertain` cells.
- Edge lane gets top `frame-uncertain` cells.

Each lane may steal one cell from another category only if it can explain why reassignment improves synthesis.

### Step 5 — Lane work

Each lane appends to own file. Each finding must cite prior cell id or create `new-cell` with reason prior pass missed it.

### Step 6 — Audit

Validate:

1. URL liveness.
2. Quote match.
3. Cell coverage: no high-priority cell ignored without reason.
4. New-cell legitimacy: not duplicate of prior cell.
5. Edge divergence: bigram overlap below threshold or structural novelty stated.

### Step 7 — Synthesis

Synthesize by uncertainty resolved:

1. Priors confirmed.
2. Priors weakened.
3. Priors reversed.
4. New cells discovered.
5. Still-unknown cells.
6. Next search queries.

## Workspace

```text
./reTruth/{slug}-{date}/
├── prior-matrix.md
├── scholar.md
├── community.md
├── edge.md
└── synthesis.md
```

## Stop conditions

- Stop prior pass when matrix has 12 good cells or search quality drops.
- Stop lanes when each resolves 5 cells or hits effort cap.
- Do not pad with low-value cells.

## Why this variation

Search-first prevents lane identity from shaping discovery too early. Matrix keeps divergence accountable: every lane either resolves known uncertainty or proves original search missed a meaningful source class.
