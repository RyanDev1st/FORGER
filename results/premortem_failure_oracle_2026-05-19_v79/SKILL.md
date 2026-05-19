Parent: ARCHITECTURE.md

# Gnosis — Premortem Failure Oracle v79

## Status

v79. Search-first, browser-read, failure-anticipation gated.

## Scope

This variation adds a premortem before synthesis. Each lane must imagine the final answer failed, identify why, and search for evidence that confirms or weakens those failure modes.

## Pipeline

### Step 1 — Search first

Search for evidence, working examples, failure reports, risks, dissent, and weak assumptions. Search snippets only seed candidates.

### Step 2 — Browser-read candidates

Open every candidate directly with `playwright-cli`. Record final URL, visible title, browser status, and one verbatim quote.

### Step 3 — Build `premortem-ledger.md`

```markdown
### Failure P<n>: <failure mode>
- Final URL:
- Source class: evidence | failure | dissent | risk | artifact | blocked
- Browser status: opened | blocked | dead | mismatch
- Verbatim quote: "<≤25 words>"
- Assumed final answer:
- Imagined failure:
- Failure cause: false need | stale source | non-working artifact | missing stakeholder | bad metric | implementation gap | bias | unknown
- Evidence that supports risk:
- Evidence that weakens risk:
- Mitigation or search action:
- Route hint: scholar | community | edge | re-search | reject
```

### Step 4 — Failure imagination

Before convergence, orchestrator asks: if this synthesis wastes the user’s time, why? Generate failure modes without judging them yet.

### Step 5 — Evidence search

Search and browser-read sources for each high-impact failure mode. Treat dissent and blocked sources as signals, not annoyances.

### Step 6 — Lane routing

Scholar tests methodological and evidence failure. Community tests working-artifact and implementation failure. Edge tests blind spots, neglected dissent, and weird failure paths.

### Step 7 — Mitigation gate

Robust synthesis requires either mitigation, downgraded confidence, or explicit rejection for high-impact failure modes.

## Validation gates

- No robust claim with unresolved high-impact failure mode.
- No failure mode without evidence search attempt.
- Dissent is read directly before downgrade or dismissal.
- Failure causes must be specific, not generic risk language.
- Mitigations must change search, synthesis, or test plan.

## Closing

Return top failure modes, evidence found, downgraded claims, rejected options, mitigations, and remaining risks.
