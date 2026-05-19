---
name: evidence-freshness-clock
---

# evidence-freshness-clock

Search-first gnosis variation that tracks whether evidence is current enough for the decision context.

## Invocation

Use when topic changes quickly, methods or tools evolve, older findings may mislead, or user needs current versus stable evidence separated.

## Core drift

Original gnosis checks currency inside lane gates. This variation promotes freshness to a shared clock before synthesis, so claims carry recency, update signal, method drift, and relevance-to-current-practice status.

## Evidence used for this variation

Browser-read and indexed sources:

- Cochrane Chapter IV was opened with `playwright-cli`; visible page title confirmed focus on updating a review.
- Cochrane Chapter IV indexed text said out-of-date reviews that omit available evidence risk misleading decision makers.
- Cochrane Chapter IV indexed text said new studies, new data, new methods, or new analyses can change review findings.
- Cochrane Chapter IV indexed text said some fields evolve rapidly while others are more stable.
- Cochrane Chapter IV indexed text said update decisions may use surveillance searches, expert contact, and quantitative or qualitative assessments.
- Cochrane Chapter IV indexed text said updates can reconsider PICO, eligibility criteria, comparisons, and outcomes.
- BMJ living evidence candidate returned 403, so it became access-limit evidence rather than content evidence.

## Pipeline

### Step 1 — Parse freshness sensitivity

Extract topic pace, tool/version exposure, policy/practice stakes, harm domain, and likely decay modes.

### Step 2 — Search broad lead pool

Collect supportive, critical, null, failure, and edge-analogue leads across time windows.

### Step 3 — Browser-read candidates

Open candidates with `playwright-cli`. Capture final URL, title, visible quote, publication/update date when visible, source class, and current-practice relevance.

### Step 4 — Build `freshness-clock.md`

```markdown
### Claim F<n>: <claim or source cluster>
- Final URL:
- Source class:
- Browser status:
- Verbatim quote: "<≤25 words>"
- Source date:
- Last updated:
- Topic pace: fast | moderate | slow | stable | unknown
- Freshness status: current | aging | stale | historical | unknown
- Update signal: new data | new method | new tool/version | new policy | none visible
- Decay risk: low | medium | high | unknown
- Route hint: scholar | community | edge | re-search | preserve-history
```

### Step 5 — Separate age from value

Classify older sources as:

- still-current foundation
- historical context
- stale operational guidance
- superseded method or tool claim
- unresolved due to missing update evidence

### Step 6 — Route by freshness problem

- Scholar gets new studies, new methods, updated reviews, obsolete evidence, and certainty changes.
- Community gets tool-version drift, deprecations, maintainer updates, stale benchmarks, and current deployment practice.
- Edge gets older adjacent-field analogues, revived ideas, forgotten precursors, and claims whose age changes interpretation.

### Step 7 — Refresh if needed

If high-impact claim is aging/stale and topic pace is fast, re-search with recent-date and update terms before synthesis.

### Step 8 — Synthesis

Return:

1. Current claims.
2. Aging claims needing caution.
3. Historical claims preserved as context.
4. Stale claims dropped or downgraded.
5. Update gaps that may change conclusions.

## Why this variation

Search-first pipelines can overvalue old high-authority sources or recent weak sources. Evidence Freshness Clock separates authority from currentness and forces update signals into claim weighting.
