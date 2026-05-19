---
name: lateral-verification-loop
---

# lateral-verification-loop

Search-first gnosis variation that inserts lateral verification before lane synthesis.

## Invocation

Use when source authority, claim provenance, or online misinformation risk matters more than raw finding volume.

## Core drift

Original gnosis verifies after lanes return. This variant verifies source context before claims mature: each promising lead must pass a lateral check loop before lane routing.

## Evidence used for this variation

Browser-read sources:

- Stanford Civic Online Reasoning page: visible text asks who is behind information, what evidence exists, and what other sources say.
- Hapgood SIFT page: visible text lists four moves: Stop, Investigate the source, find better coverage, trace original context.
- University of Washington SIFT guide: visible text emphasizes reputation, trustworthiness, corroboration, and tracing original sources.
- NN/g confirmation-bias candidate returned 404 and was logged as hallucinated/dead URL caution.

## Pipeline

### Step 1 — Parse verification risk

Extract topic, claim sensitivity, likely source classes, misinformation risk, and source-authority requirements.

### Step 2 — Search broad lead pool

Collect candidates across academic, practitioner, and edge surfaces.

### Step 3 — Browser-read candidates

Open each lead with `playwright-cli`. Capture final URL, title, visible text, quote candidate, and source producer.

### Step 4 — Build `lateral-ledger.md`

```markdown
### Lead L<n>: <title>
- Final URL:
- Source class:
- Browser status:
- Verbatim quote: "<≤25 words>"
- Who is behind it:
- Evidence offered:
- Other sources checked:
- Original context traced:
- Lateral verdict: pass | fragile | fail | blocked
- Route hint: scholar | community | edge | re-check | discard
```

### Step 5 — Lateral verification loop

For each promising lead:

1. Stop: check purpose and emotional pull.
2. Investigate: identify author, organization, venue, funding, or track record.
3. Find better coverage: compare against more trusted or independent sources.
4. Trace: locate original claim, data, quote, paper, repo, or artifact.

### Step 6 — Route by lateral verdict

- Pass: lane can use as evidence.
- Fragile: lane can use only as flagged/low-confidence or as search lead.
- Fail: discard from claims but preserve as false-scent lesson.
- Blocked: classify as access gap.

### Step 7 — Lane work

Each finding must cite lateral-ledger ID and verdict.

### Step 8 — Audit

Check:

1. Claims use pass or explicitly flagged fragile leads.
2. Source identity appears for every claim source.
3. Trace field names original context or states why blocked.
4. Dead/hallucinated URLs are counted.

### Step 9 — Synthesis

Return:

1. Verified claims.
2. Fragile claims worth keeping.
3. Failed high-scent leads.
4. Access/trace gaps.
5. Lateral search lessons.

## Why this variation

Search-first systems can amplify plausible pages too early. Lateral Verification Loop slows claim formation until source identity, corroboration, and original context are checked.
