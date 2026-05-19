---
name: search-provenance-spine
---

# search-provenance-spine

Search-first gnosis variation that treats search decisions as auditable evidence objects, not disposable setup.

## Invocation

Use when topic is contested, search breadth matters, or later readers need to understand exactly how search paths, interfaces, and exclusions shaped findings.

## Core drift

Original gnosis logs queries and outputs. This variation builds a provenance spine before lane synthesis so every meaningful search action, source route, and exclusion is recoverable.

## Evidence used for this variation

Browser-read and indexed sources:

- Cochrane Chapter 4 indexed text said search strategies should be copied and pasted exactly as run and in full, with search set numbers and total records retrieved.
- Cochrane Chapter 4 indexed text said interface used for other sources should be specified where possible.
- Cochrane Chapter 4 indexed text said record keeping during search is necessary because post hoc recreation can be nearly impossible.
- Cochrane Chapter 4 indexed text said review authors should check reference lists of included studies and relevant systematic reviews.
- Cochrane technical supplement page was opened with `playwright-cli`; extraction on-page was thin, so it supports supplement-structure signal more than detailed method claims.
- PRISMA-S candidate fetched but resolved to unrelated PMC content, so it became source-mismatch evidence rather than substantive support.

## Pipeline

### Step 1 — Parse provenance sensitivity

Extract topic, harm domain, likely audit pressure, expected source classes, and whether reproduction of search path will matter to trust.

### Step 2 — Search broad lead pool

Collect supportive, critical, null, failure, and edge-analogue leads.

### Step 3 — Browser-read candidates

Open each candidate with `playwright-cli`. Capture final URL, title, visible quote, source class, interface notes, and whether lead was included, excluded, or blocked.

### Step 4 — Build `provenance-spine.md`

```markdown
### Step P<n>: <meaningful search or routing action>
- Action type: query | open | mutate | chain | exclude | block | route
- Input:
- Output:
- Final URL or venue:
- Interface/context:
- Verbatim quote: "<≤25 words>"
- Decision: keep | drop | retry | reroute
- Why this decision happened:
- Affected lanes:
- Repro note:
```

### Step 5 — Preserve decision path

Log not only sources kept, but also:

- failed or mismatched candidates
- interface constraints
- query mutations
- route changes caused by evidence quality
- blocked or dead sources

### Step 6 — Route by provenance shape

- Scholar gets provenance steps tied to studies, reviews, methods papers, and evidence-quality routing.
- Community gets provenance steps tied to docs, repos, issues, benchmarks, maintainer posts, and environment context.
- Edge gets provenance steps tied to adjacent domains, contrarian paths, archive trails, and provenance anomalies.

### Step 7 — Audit reproducibility

Check whether another agent could reconstruct:

- what was searched
- what was opened
- what was excluded
- what changed route
- what remained unresolved

### Step 8 — Synthesis

Return:

1. Findings.
2. Search path that produced them.
3. Exclusions and failures that shaped evidence.
4. Route changes triggered by provenance facts.
5. Remaining reproducibility gaps.

## Why this variation

Search-first systems often hide search path behind polished synthesis. Provenance Spine keeps search behavior visible so trust includes how knowledge was reached, not only what survived.
