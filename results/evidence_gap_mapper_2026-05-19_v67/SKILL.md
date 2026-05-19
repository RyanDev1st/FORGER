---
name: evidence-gap-mapper
---

# evidence-gap-mapper

Search-first gnosis variation that maps evidence density and source absences before synthesis.

## Invocation

Use when topic is broad, unevenly sourced, or likely to hide blind spots behind a few strong-looking sources.

## Core drift

Original gnosis asks lanes to gather findings. This variant first builds an evidence map: where sources cluster, where they are absent, and which gaps matter enough to route.

## Evidence used for this variation

Browser-read sources:

- PRISMA Scoping Reviews page: visible text says scoping reviews synthesize evidence and assess scope of literature.
- Cornell Evidence Synthesis guide: visible text says scoping reviews or evidence maps identify research gaps and opportunities.
- Campbell Evidence Gap Maps candidate was opened with `playwright-cli`; page returned not found and became rejected-source evidence.
- EPPI candidate failed DNS resolution in browser and became blocked-source evidence.

## Pipeline

### Step 1 — Parse map axes

Extract topic, lens, likely source classes, stakeholder domains, time horizon, and risk domain.

### Step 2 — Search broad lead pool

Collect candidates across Scholar, Community, Edge, and rejected/blocked surfaces.

### Step 3 — Browser-read candidates

Open each candidate with `playwright-cli`. Capture final URL, page title, visible text, quote candidate, and failure status.

### Step 4 — Build `gap-map.md`

```markdown
### Cell G<n>: <axis intersection>
- Axis A: <method|practice|edge|artifact|failure|population|domain>
- Axis B: <source class|time window|venue type|geography>
- Leads opened:
- Included sources:
- Rejected/blocked sources:
- Verbatim quote: "<≤25 words>"
- Density: empty | sparse | moderate | dense
- Gap type: true gap | search gap | access gap | quality gap | lane gap
- Route hint: scholar | community | edge | re-search | synthesize
```

### Step 5 — Classify gaps

- True gap: credible search found little evidence.
- Search gap: terms or venue choice likely wrong.
- Access gap: blocked, paywalled, DNS, JS-only, or removed.
- Quality gap: many sources, weak claims.
- Lane gap: evidence exists but wrong lane would miss it.

### Step 6 — Route by gap type

- Scholar gets method gaps and systematic evidence clusters.
- Community gets artifact/failure gaps and practitioner-density cells.
- Edge gets lane gaps, nonstandard vocabulary, and adjacent-domain gaps.

### Step 7 — Lane work

Each finding must cite gap-map cell ID and state whether it fills or confirms a gap.

### Step 8 — Audit

Check:

1. Empty cells have searched evidence, not assumptions.
2. Blocked/dead sources are counted.
3. Dense cells do not dominate synthesis automatically.
4. Gap claims are distinguished from claim evidence.

### Step 9 — Synthesis

Return:

1. Evidence-dense claims.
2. Sparse but important claims.
3. True gaps.
4. Access/search gaps.
5. Recommended next searches.

## Why this variation

Strong synthesis needs both claims and absences. Evidence Gap Mapper prevents a few high-yield sources from hiding where the topic is under-sourced, inaccessible, or methodologically thin.
