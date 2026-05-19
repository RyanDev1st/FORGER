# critique-revision-loop

Search-first orchestrator for reTruth with lane-local critic and revision passes. Goal: make each lane attack its own evidence before synthesis, not after.

## Invocation

- `/critique-revision-loop <topic>` uses standard effort.
- `/critique-revision-loop high <topic>` expands critique depth and revision budget.

## Core drift

Original reTruth validates lane outputs after completion. Critique Revision Loop makes critique part of lane production: search, extract, criticize, revise, then return. The orchestrator receives both revised findings and critique residue.

## Pipeline

### Step 1 — Parse brief

Extract:
- topic
- lens
- desired output
- domain
- effort: `standard|high`
- success criteria
- exclusion zones
- risk level
- likely false-positive traps

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  critique-rubric.md
  scholar.md
  community.md
  edge.md
  critiques/
    scholar-critique.md
    community-critique.md
    edge-critique.md
  revisions.md
  verification.md
  synthesis.md
```

### Step 3 — Write critique rubric

Write `critique-rubric.md` before lanes start:

| Critique question | Failure signal |
|---|---|
| Does quote directly support claim? | quote says weaker/different thing |
| Could source be misclassified? | belongs in another lane |
| Is claim obvious or redundant? | repeats known consensus without added value |
| Is evidence too narrow? | single author, single venue, single anecdote |
| Is source incentive-distorted? | vendor, advocacy, crank, or hype signal |
| Would synthesis change without it? | no decision or explanation value |
| What would falsify this? | no clear disconfirming evidence path |

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- lane mandate
- critique rubric
- output path
- critique path
- effort

Each lane must run:
1. query planning
2. candidate retrieval
3. source selection
4. finding extraction
5. critique pass
6. revision pass
7. final closing

### Step 5 — Lane critique requirements

Every finding must have one critique entry:

```markdown
### Critique <lane><n>
- Finding id: <id>
- Strongest attack: <best reason finding may fail>
- Evidence weakness: <quote/source/method/transfer weakness>
- Misclassification risk: <none|low|medium|high>
- Redundancy risk: <none|low|medium|high>
- Revision action: keep | revise | demote | drop
- Revision note: <what changed or why retained>
```

### Step 6 — Orchestrator validation

Validate in order:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | at least 5 findings | repair or mark under-sourced |
| V3 | every finding has quote | mark unsupported |
| V4 | every finding has critique | retry critique only |
| V5 | revision action recorded | retry revision only |
| V6 | dropped/demoted findings excluded from robust synthesis | fix synthesis filter |

### Step 7 — Revision ledger

Write `revisions.md`:
- kept findings and why
- revised findings and what changed
- demoted weak signals
- dropped findings
- repeated critique patterns
- re-fan targets

### Step 8 — Verification audit

Check URL liveness, quote match, and claim-source alignment. Add flags to `verification.md` and update robust/weak tiers.

### Step 9 — Synthesis

Use only findings with:
- quote present
- critique action `keep` or `revise`
- source reachable or archived
- no fatal verification flag
- synthesis utility survives critique

Add appendix:
- demoted but interesting signals
- dropped claims with reason
- critique patterns that shaped answer

### Step 10 — Re-fan

Re-fan when:
- repeated critique pattern affects more than 30% of findings
- lane drops below 5 robust findings after critique
- high-value claim is demoted for source weakness
- falsification path remains unknown for central claim

## Why this variation

Critic/verifier loops catch polished weak evidence before final synthesis. reTruth already audits quotes and links after return; this variation adds semantic critique inside each lane, where source context is freshest. It should reduce overconfident synthesis and preserve useful rejected ideas.
