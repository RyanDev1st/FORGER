---
name: citation-chaining-lattice
---

# citation-chaining-lattice

Search-first gnosis variation that treats citation paths as expansion structure rather than one-off supplements.

## Invocation

Use when search results produce few high-value anchors, terminology is unstable, or discovery improves by following reference chains from browser-read seed sources.

## Core drift

Original gnosis fans out after parsing brief. This variation inserts a citation-chaining lattice before lane synthesis so anchor sources generate backward, forward, and sibling expansion routes.

## Evidence used for this variation

Browser-read sources:

- Cochrane Chapter 4 page: visible indexed text said authors should check reference lists of included studies and relevant systematic reviews.
- Cochrane Chapter 4 indexed text also said to use citation searching on key articles in addition to a database search.
- Cochrane Chapter 4 indexed text said search development is iterative and exploratory, with stopping rules tied to retrieval of new relevant records.
- PMC candidate opened with `playwright-cli` but hit reCAPTCHA, so it serves as access-friction evidence rather than content evidence.
- Failed guide candidates (MIT DNS, Wisconsin 404) reinforced need to treat citation-chasing support pages as unstable and rely on direct readable anchors.

## Pipeline

### Step 1 — Parse anchor potential

Extract topic, domain, likely seed-paper types, terminology instability, and whether citation chaining is likely to outperform flat query expansion.

### Step 2 — Search broad lead pool

Collect initial leads across supportive, critical, null, failure, and edge-analogue directions.

### Step 3 — Browser-read anchor candidates

Open leads with `playwright-cli`. Capture final URL, title, quote candidate, source class, and whether source is strong enough to serve as citation anchor.

### Step 4 — Build `citation-lattice.md`

```markdown
### Anchor A<n>: <seed source or claim cluster>
- Final URL:
- Source class:
- Browser status:
- Verbatim quote: "<≤25 words>"
- Why anchor matters:
- Backward chain targets:
- Forward chain targets:
- Sibling chain terms:
- Chain yield: low | medium | high
- Stop signal: exhausted | redundant | blocked | still-yielding
- Route hint: scholar | community | edge | expand | stop
```

### Step 5 — Expand by chain type

For each strong anchor, expand through:

- backward chaining: references and prior cited work
- forward chaining: newer work citing anchor
- sibling chaining: nearby terms, adjacent venues, named authors, and related reviews discovered from anchor text

### Step 6 — Log chain yield

Track whether each chain produces:

- novel findings
- only redundancy
- blocked access
- terminology mutations worth re-searching
- lane-specific leads

### Step 7 — Route by chain behavior

- Scholar gets citation-rich methods, trials, reviews, and evidence-synthesis anchors.
- Community gets implementation histories, maintainer posts, repo references, benchmark writeups, and concrete case studies discovered from anchors.
- Edge gets adjacent-domain anchors, dissenting citations, and grounded contrarian chains with named provenance.

### Step 8 — Stop by diminishing yield

Stop expanding when anchor chains produce no new relevant records, only redundant material, or repeated blocked sources.

### Step 9 — Synthesis

Return:

1. High-yield anchors.
2. Productive chain directions.
3. Dead-end or blocked chains.
4. Query mutations learned from anchor traversal.
5. Findings preserved by lane after chain expansion.

## Why this variation

Search-first systems often treat citation chasing as optional cleanup. This variation makes chaining first-class structure so discovery follows proven anchors instead of relying only on query wording.
