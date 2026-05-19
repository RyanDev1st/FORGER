---
name: query-berrypicking-router
---

# query-berrypicking-router

Search-first gnosis variation based on berrypicking: search evolves by following found evidence, not by exhausting a fixed query list.

## Invocation

Use when topic language is unstable, source classes are uncertain, or early evidence reveals better terms than original brief.

## Core drift

Original gnosis fans out fixed lanes after parsing brief. This variant starts with seed queries, browser-reads promising sources, then mutates queries from source text, citations, named artifacts, and contradiction terms.

## Evidence used for this variation

Browser-read sources:

- Bates berrypicking candidate was opened with `playwright-cli`; page title exposed "The Design of Browsing and Berrypicking Techniques" but usable quote extraction was weak.
- NN/g information foraging page was opened with `playwright-cli`; visible text says users weigh relevant information against extraction effort.
- Cochrane Chapter 4 was opened with `playwright-cli`; visible text shows searching and selecting studies as an explicit systematic-review phase.
- Library citation-searching candidate was opened with `playwright-cli`; extraction was weak and treated as a search-surface caution.

## Pipeline

### Step 1 — Parse seed brief

Extract:

- topic
- lens
- source classes
- seed vocabulary
- likely synonym families
- failure vocabulary

### Step 2 — Search seed pool

Run broad searches. Record leads before opening.

### Step 3 — Browser-read leads

Open each lead with `playwright-cli`. Capture final URL, title, visible quote candidate, extractability, and discovered terms.

### Step 4 — Build `berry-ledger.md`

```markdown
### Berry B<n>: <lead title>
- Final URL:
- Source class:
- Browser status:
- Verbatim quote: "<≤25 words>"
- Seed query:
- Discovered terms:
- Citation/artifact hooks:
- Contradiction hooks:
- Extraction cost: low | medium | high
- Route hint: scholar | community | edge | mutate | discard
```

### Step 5 — Mutate queries

Create new query branches only from browser-read evidence:

- quote terms
- cited author or named method
- artifact or repo names
- disagreement language
- failure vocabulary
- adjacent-domain analogues

### Step 6 — Route by query branch

- Scholar gets citation/method branches.
- Community gets artifact/failure/practitioner branches.
- Edge gets analogy/dissent/old-term branches.

### Step 7 — Lane work

Each finding must cite berry-ledger ID and query branch.

### Step 8 — Audit

Check:

1. No mutated query came from search snippets alone.
2. Every branch has browser-read parent evidence.
3. Dead branches are logged, not silently dropped.
4. High-yield terms are preserved for next run.

### Step 9 — Synthesis

Return:

1. Claims found by seed queries.
2. Claims found by mutated queries.
3. Branches that died.
4. Vocabulary upgrades.
5. Next-run query map.

## Why this variation

Broad research often improves after the first good source changes vocabulary. Query Berrypicking Router makes that shift explicit and auditable instead of relying on hidden agent intuition.
