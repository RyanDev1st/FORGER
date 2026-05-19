Parent: ARCHITECTURE.md

# Gnosis — After-Action Learning Loop v78

## Status

v78. Search-first, browser-read, lessons-loop gated.

## Scope

This variation adds an after-action review loop to reTruth so every run compares intent, actual findings, drift, failures, and reusable process changes before the next iteration.

## Pipeline

### Step 1 — Search first

Search for sources, working examples, failures, and process guidance. Snippets are candidate leads only.

### Step 2 — Browser-read candidates

Open candidates directly with `playwright-cli`. Record final URL, visible title, browser status, and one verbatim quote.

### Step 3 — Build `aar-ledger.md`

```markdown
### Review A<n>: <action or decision>
- Final URL:
- Source class: evidence | process | artifact | failure | blocked
- Browser status: opened | blocked | dead | mismatch
- Verbatim quote: "<≤25 words>"
- Intended outcome:
- Actual outcome:
- Difference:
- Sustain:
- Improve or initiate:
- Next-iteration test:
- Route hint: scholar | community | edge | orchestrator | memory
```

### Step 4 — Intent capture

Before synthesis, log what each lane was expected to find, what source baskets were expected to cover, and what would count as enough evidence.

### Step 5 — Actual outcome capture

After lane return, log findings, absences, blocked sources, dead links, mismatches, drift, and rejected candidates.

### Step 6 — Difference analysis

Compare intended versus actual outcome. Classify difference as evidence gap, search gap, source-access gap, lane drift, false assumption, or successful surprise.

### Step 7 — Sustain / improve split

Preserve process choices that worked. Convert failures into concrete next-iteration changes, not vague lessons.

### Step 8 — Next-iteration test

Every improvement must define a test or observable behavior for the next run.

## Validation gates

- No lesson without intended versus actual comparison.
- No process change without evidence from the run.
- Successful surprises are preserved, not normalized away.
- Failed sources stay logged as access or quality lessons.
- Improvements require next-iteration tests.

## Closing

Return sustained practices, process fixes, source-access lessons, drift corrections, reusable surprises, and next-run tests.
