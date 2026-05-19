---
name: triangulation-confidence-matrix
---

# triangulation-confidence-matrix

Search-first gnosis variation that routes evidence by corroboration pattern and confidence tier.

## Invocation

Use when claims may come from mixed source types and synthesis must distinguish robust consensus from isolated but useful signals.

## Core drift

Original gnosis records triangulation inside lanes, then synthesizes cross-lane agreement. This variant builds a shared confidence matrix before synthesis so each claim class is routed by source diversity, independence, and risk.

## Evidence used for this variation

Browser-read sources:

- BetterEvaluation triangulation candidates were opened with `playwright-cli`; extraction was weak and treated as a caution about source-surface promise.
- NCBI Bookshelf bias source was opened with `playwright-cli`; visible title concerned risk of bias and confounding in observational studies.
- Cochrane Chapter 24 was opened with `playwright-cli`; visible text concerned including non-randomized studies and risk-of-bias-related handbook chapters.
- Existing gnosis mandates require triangulation, isolated-claim caps, cross-source corroboration, and robust-tier exclusion for flagged findings.

## Pipeline

### Step 1 — Parse confidence needs

Extract topic, claim types, harm domain, acceptable source classes, and minimum confidence bar.

### Step 2 — Search broad lead pool

Collect academic, practitioner, edge, and corroboration candidates.

### Step 3 — Browser-read candidates

Open each lead with `playwright-cli`. Capture final URL, title, quote candidate, source type, and claim type.

### Step 4 — Build `confidence-matrix.md`

```markdown
### Claim M<n>: <claim candidate>
- Claim text:
- Source ids:
- Verbatim quote: "<≤25 words>"
- Source diversity: single | same-class | cross-class | cross-lane
- Independence: same-author | same-network | independent | unknown
- Evidence type: original | firsthand | secondhand | synthesis | analogue
- Bias risk: low | medium | high | unknown
- Confidence tier: robust | supported | fragile | exploratory | drop
- Route hint: scholar | community | edge | corroborate | discard
```

### Step 5 — Classify confidence

- Robust: independent cross-class support and low bias risk.
- Supported: multiple same-class sources or one high-authority synthesis.
- Fragile: single source or isolated claim with clear quote.
- Exploratory: useful but analogical, edge, or weakly corroborated.
- Drop: untraceable, biased, contradicted, or quote-missing.

### Step 6 — Route by claim confidence

- Scholar gets method/synthesis claims and confidence downgrades.
- Community gets firsthand/practice claims and corroboration checks.
- Edge gets exploratory analogues but must not promote them to robust claims.

### Step 7 — Lane work

Each finding must cite confidence-matrix ID and tier.

### Step 8 — Audit

Check:

1. Robust claims have independent or cross-class support.
2. Fragile claims stay capped and labeled.
3. Edge exploratory claims are not merged into consensus tier.
4. Bias risk appears for every claim.

### Step 9 — Synthesis

Return:

1. Robust claims.
2. Supported claims.
3. Fragile but useful leads.
4. Exploratory edge signals.
5. Dropped/contradicted claims.

## Why this variation

Multi-agent research benefits from agreement counts, but not all agreement is equal. Triangulation Confidence Matrix makes source independence and confidence tier explicit before synthesis.
