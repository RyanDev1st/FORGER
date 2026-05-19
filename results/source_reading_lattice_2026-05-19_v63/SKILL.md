---
name: source-reading-lattice
---

# source-reading-lattice

Search-first gnosis variation. No lane starts from snippets. Orchestrator must search, open sources in browser, extract page text, then route evidence.

## Invocation

Use for research, brainstorming, architecture variation, and source-heavy synthesis where source reading quality matters more than fast fan-out.

## Core drift

Original gnosis lets lanes search independently. This variant forces one shared source-reading gate first. Search results are only leads. Browser-read text is evidence.

## Pipeline

### Step 1 — Parse brief

Extract topic, lens, domain, desired output, risk domain, effort, and acceptable drift.

### Step 2 — Search leads

Run broad web searches for:

- Primary methods or standards.
- Evidence mapping / synthesis methods.
- Design or brainstorming process methods.
- Critiques and failure modes.
- Adjacent-field terms.

Do not treat search snippets as evidence.

### Step 3 — Browser-read sources

Open each candidate source with `playwright-cli`. Capture title, URL after redirects, visible body text, and exact quotes. Drop pages that are blocked, missing, irrelevant, or only search-result summaries.

### Step 4 — Build `source-ledger.md`

```markdown
### Source L<n>: <title>
- URL: <final URL>
- Source class: method | synthesis | design | critique | adjacent | archive
- Browser check: opened | blocked | missing | irrelevant
- Verbatim quote: "<≤25 words>"
- Useful claim: <claim supported by quote>
- Route hint: scholar | community | edge | audit
```

### Step 5 — Route lanes

Spawn lanes only after ledger has enough opened sources.

- Scholar reads method/synthesis sources.
- Community reads process/application sources.
- Edge reads critique/adjacent/archive sources.

### Step 6 — Lane outputs

Each finding must cite ledger id. New sources require browser-read mini-ledger entry before use.

### Step 7 — Audit

Validate final URL, quote presence in captured text, route coverage, and missing-source log.

### Step 8 — Synthesis

Synthesize from browser-read evidence:

1. What sources actually said.
2. What pipeline move follows from each quote.
3. Which original architecture assumption changes.
4. Which candidate sources were rejected.
5. Next search directions.

## Workspace

```text
./reTruth/{slug}-{date}/
├── source-ledger.md
├── rejected-sources.md
├── scholar.md
├── community.md
├── edge.md
└── synthesis.md
```

## Evidence used for this variation

Browser-read sources checked during design:

- Cochrane Handbook page exposed review planning, scope, inclusion criteria, and synthesis methods as explicit steps.
- Springer/Systematic Reviews evidence-map article states evidence mapping is an emerging systematic method and notes lack of authoritative recommendations.
- IxDF design-thinking page describes non-linear iterative process, reframing, brainstorming, prototyping, and testing.
- NN/g design-thinking page describes hands-on user-centric problem solving and phased design process.

## Why this variation

It enforces user rule: search first, then direct browser checks, then source reading, then writing. It reduces hallucinated best-practice claims and makes rejected pages visible.
