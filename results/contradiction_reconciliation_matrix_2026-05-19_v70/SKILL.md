---
name: contradiction-reconciliation-matrix
---

# contradiction-reconciliation-matrix

Search-first gnosis variation that treats disagreement as first-class structure instead of synthesis residue.

## Invocation

Use when topic is contested, claims are likely to conflict across lanes, or premature consensus would hide real uncertainty.

## Core drift

Original gnosis logs tensions in closing sections. This variant builds a contradiction matrix before final synthesis so conflicting claims are grouped, reconciled, or preserved as unresolved.

## Evidence used for this variation

Browser-read sources:

- Cochrane Chapter 15 page: visible text concerns interpreting results, confidence intervals, statistical significance, certainty of evidence, and drawing conclusions.
- PRISMA checklist candidate was opened with `playwright-cli`; page resolved but extraction was thin, so it serves only as reporting-structure cue.
- ODAF candidate failed DNS resolution and became blocked-source evidence.
- Existing gnosis mandates already require explicit tensions/disagreements and forbid silently picking one side of conflicting findings.

## Pipeline

### Step 1 — Parse contradiction risk

Extract topic, likely conflict axes, harm domain, and expected disagreement classes.

### Step 2 — Search broad lead pool

Collect supportive, critical, null, failure, and edge-analogue leads.

### Step 3 — Browser-read candidates

Open each lead with `playwright-cli`. Capture final URL, title, quote candidate, claim direction, and source context.

### Step 4 — Build `contradiction-matrix.md`

```markdown
### Conflict X<n>: <claim question>
- Claim A:
- Claim B:
- Competing source ids:
- Verbatim quote: "<≤25 words>"
- Conflict axis: method | population | timeframe | metric | context | interpretation | source quality
- Conflict status: reconciled | partially reconciled | unresolved | false conflict
- Why conflict happens:
- Better-supported side: A | B | neither | depends
- Route hint: scholar | community | edge | re-check | preserve
```

### Step 5 — Reconcile conflicts

Test whether conflict comes from:

- different populations or contexts
- different metrics or thresholds
- study-quality gap
- timeframe/version drift
- first-hand versus second-hand retelling
- true unresolved disagreement

### Step 6 — Route by conflict type

- Scholar gets method, statistical, and evidence-quality conflicts.
- Community gets implementation, migration, tool-version, and practitioner disputes.
- Edge gets paradigm, analogy, and contrarian conflicts that remain grounded.

### Step 7 — Lane work

Each finding must cite contradiction-matrix ID and conflict status.

### Step 8 — Audit

Check:

1. No conflict is collapsed without explanation.
2. Unresolved conflicts survive synthesis.
3. False conflicts are marked when wording differs but claim substance matches.
4. Better-supported side is justified, not implied.

### Step 9 — Synthesis

Return:

1. Reconciled claims.
2. Context-dependent claims.
3. Unresolved contradictions.
4. False conflicts removed.
5. Search lessons from disagreement.

## Why this variation

Search-first pipelines often over-reward agreement. Contradiction Reconciliation Matrix preserves real uncertainty and explains whether disagreement comes from context, quality, or genuine conflict.
