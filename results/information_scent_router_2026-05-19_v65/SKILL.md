---
name: information-scent-router
---

# information-scent-router

Search-first gnosis variation based on information foraging. Search and reading behavior should follow strongest evidence scent, not equal treatment for all leads.

## Invocation

Use when topic is broad, search space is large, and best result depends on routing effort toward leads with strong cues and low extraction cost.

## Core drift

Original gnosis spreads effort across fixed lanes. This variant scores source leads by information scent, extraction cost, and corroboration potential before assigning lane effort.

## Pipeline

### Step 1 — Parse brief

Extract topic, lens, domain, risk, effort, and likely source classes.

### Step 2 — Search broad leads

Collect 12–20 candidates from multiple source classes.

### Step 3 — Browser-read candidate leads

Open each lead with `playwright-cli`. Capture final URL, page title, visible text, quote candidate, and extractability.

### Step 4 — Build `scent-ledger.md`

```markdown
### Lead S<n>: <title>
- Final URL:
- Source class:
- Browser status:
- Verbatim quote: "<≤25 words>"
- Scent cues: <label clarity, context, authority, prior familiarity>
- Extraction cost: low | medium | high
- Corroboration potential: low | medium | high
- Route hint: scholar | community | edge | discard
```

### Step 5 — Score leads

Use simple score:

`priority = scent strength + corroboration potential - extraction cost`

Do not use opaque math. Explain score briefly.

### Step 6 — Route by scent

- Scholar gets high-authority, high-corroboration, method-rich leads.
- Community gets high-action, high-clarity, implementation-rich leads.
- Edge gets weak-scent but high-upside leads: archives, odd terminology, critiques, adjacent fields.
- Discard low-scent/high-cost leads unless risk domain demands exhaustive review.

### Step 7 — Lane work

Each finding must cite scent-ledger id. Lanes may upgrade discarded leads only after browser re-check.

### Step 8 — Audit

Check:

1. Top-scent leads were actually used.
2. High-cost leads have justification.
3. Edge did not become random low-quality bucket.
4. Quotes exist in browser-read text.

### Step 9 — Synthesis

Return:

1. High-scent claims.
2. Expensive but worth-it claims.
3. False-scent leads dropped.
4. Low-scent/high-upside discoveries.
5. Search-route lessons for next run.

## Evidence used for this variation

Browser-read sources:

- NN/g information foraging: people weigh relevant information likely found against effort required.
- NN/g information scent: users choose links with strongest mix of label, context, and prior knowledge cues.
- Cochrane Chapter 4: searching/selecting studies is explicit systematic phase.
- PRESS article candidate was inspected as search-strategy quality lead.

## Why this variation

Search-first pipelines need better triage, not just more leads. Information Scent Router adds explicit effort allocation logic grounded in how people decide where to go next.
