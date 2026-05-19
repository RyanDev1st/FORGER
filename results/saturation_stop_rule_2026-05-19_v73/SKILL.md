---
name: saturation-stop-rule
---

# saturation-stop-rule

Search-first gnosis variation that makes stopping conditions explicit instead of letting search end by fatigue or arbitrary quota.

## Invocation

Use when topic could sprawl, source yield is uneven, or search completeness matters more than raw volume.

## Core drift

Original gnosis enforces finding floors and ceilings. This variation adds a saturation ledger that records marginal yield, precision collapse, scarcity caution, and missed-source risk before stopping.

## Evidence used for this variation

Browser-read and indexed sources:

- Cochrane Chapter 4 was opened with `playwright-cli`; visible page title confirmed "Searching for and selecting studies".
- Cochrane Chapter 4 indexed text said search development is iterative and exploratory.
- Cochrane Chapter 4 indexed text said stopping rules may depend on no new relevant records or precision falling below a cutoff.
- Cochrane Chapter 4 indexed text said scarce evidence requires more caution before stopping.
- Cochrane Chapter 4 indexed text mentioned capture-recapture and relative recall as techniques for assessing search performance.
- Qualitative saturation PMC candidate returned 404 and CERQual candidate returned 403, so both became access-limit evidence rather than content evidence.

## Pipeline

### Step 1 — Parse stopping risk

Extract topic breadth, harm domain, expected source density, terminology instability, and how costly missed evidence would be.

### Step 2 — Search broad lead pool

Run initial searches across supportive, critical, null, failure, and edge-analogue directions.

### Step 3 — Browser-read candidates

Open each candidate with `playwright-cli`. Capture final URL, title, quote, source class, and inclusion/exclusion decision.

### Step 4 — Build `saturation-ledger.md`

```markdown
### Round R<n>: <search route or expansion round>
- Query or route:
- Sources opened:
- Included findings:
- New relevant records:
- Redundant records:
- Blocked/dead records:
- Precision signal: improving | stable | falling | collapsed
- Scarcity caution: low | medium | high
- Missed-source risk: low | medium | high | unknown
- Stop decision: continue | pivot | stop | preserve gap
- Reason:
```

### Step 5 — Evaluate marginal yield

After each search round, compare:

- new relevant records versus redundancy
- quality of new records
- access failures
- lane coverage gained
- contradiction or gap reduction

### Step 6 — Apply stop rules

Stop only when one applies:

- repeated rounds produce no new relevant records
- precision collapses below useful level
- new records are redundant with existing findings
- blocked access prevents further direct reading and alternate routes fail
- lane ceiling reached with no unresolved high-risk gap

### Step 7 — Scarcity override

If evidence is scarce, contested, or high-harm, require extra caution before stopping. Preserve gap explicitly if search cannot continue productively.

### Step 8 — Route saturation state

- Scholar gets method/evidence scarcity, recall, and missed-study risk.
- Community gets stale docs, benchmark exhaustion, issue-thread redundancy, and environment-specific dead ends.
- Edge gets low-yield but structurally divergent routes, adjacent-domain scarcity, and crank-filter stop decisions.

### Step 9 — Synthesis

Return:

1. Findings.
2. Search rounds attempted.
3. Stop/pivot decisions.
4. Remaining missed-source risks.
5. Gaps preserved because saturation was not reached.

## Why this variation

Search-first systems need more than volume contracts. Saturation Stop Rule forces explicit evidence that continuing search is no longer productive, while preserving uncertainty when stopping is caused by access limits or scarcity.
