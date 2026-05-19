---
name: rejection-flow-auditor
---

# rejection-flow-auditor

Search-first gnosis variation focused on rejected evidence. Every included source must survive browser-read screening; every rejected lead must be counted with reason.

## Invocation

Use when research risk is not lack of sources, but untracked filtering: cherry-picking, silent exclusions, snippet trust, or source laundering.

## Core drift

Original gnosis records passing findings. This variant treats rejected sources as first-class evidence. It adapts PRISMA-style flow accounting and SIFT-style source checking into multi-agent research.

## Pipeline

### Step 1 — Parse brief

Extract topic, lens, domain, risk domain, effort, and likely source classes.

### Step 2 — Search leads

Run broad searches. Store every candidate in `lead-register.md` before reading.

```markdown
### Lead R<n>: <title or search-result label>
- Search query:
- Candidate URL:
- Expected source class:
- Why inspect:
```

### Step 3 — Browser-read screening

Open each candidate with `playwright-cli`. Record final URL, page title, status, visible quote, and exclusion reason if rejected.

### Step 4 — Flow ledger

Build `screening-flow.md`:

| Stage | Count | Notes |
|---|---:|---|
| Identified | <n> | search leads |
| Opened in browser | <n> | final URLs captured |
| Excluded before reading | <n> | blocked/missing/irrelevant |
| Excluded after reading | <n> | weak evidence/bias/no quote |
| Included for lanes | <n> | routed sources |

### Step 5 — Spawn lanes

- Scholar: included method/academic sources plus academic exclusions.
- Community: included practice/process sources plus practitioner exclusions.
- Edge: included critique/adjacent/archive sources plus weird rejected sources.

### Step 6 — Lane outputs

Each lane must cite included lead id or rejected lead id. Rejected leads can support absence claims.

### Step 7 — Audit

Check math: identified = opened + not-opened; opened = included + excluded. Check every inclusion has quote and every exclusion has reason.

### Step 8 — Synthesis

Return:

1. Included evidence.
2. Rejected evidence patterns.
3. What exclusions imply.
4. Bias risks from unavailable or blocked sources.
5. Next searches to reduce exclusion skew.

## Evidence used for this variation

Browser-read sources:

- PRISMA flow diagram: maps records identified, included, excluded, and reasons for exclusions.
- Hapgood SIFT: Stop, investigate source, find better coverage, trace original context.
- University of Washington SIFT guide: source reputation and corroboration before trust.
- Cochrane Chapter 4: searching and selecting studies is explicit review work.

## Why this variation

Bad research often hides in what got dropped. Rejection Flow Auditor makes exclusions inspectable and turns failed source checks into useful signal.
