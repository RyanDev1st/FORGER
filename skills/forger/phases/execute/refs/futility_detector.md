# Futility Detector — pre-retry escape hatch

A small check that runs inside `refs/tdd_micro_cycle.md` step 5
(failure retry policy), between retry 1 and retry 2. If retry 1
shows a stuck-loop signal, escalate immediately instead of running
retry 2.

Source: SWE-Bench Pro finding — *"a critical capability gap is the
lack of futility detection, where agents enter expensive,
repetitive loops when stuck"* (arXiv:2509.16941). Trajectory
analysis — *"failed trajectories are consistently longer and
exhibit higher variance than successful ones"* (arXiv:2511.00197).

---

## Two checks (cheap, no schema change)

### Check 1 — same diff twice

After retry 1 makes a code change, compute a structural diff hash
of the change (set of lines added/removed, function names changed,
identifier renames, normalized for whitespace). Compare against
hashes of all prior retry attempts on the same criterion within
this EXECUTE run.

If the diff hash matches a prior attempt:

- Skip retry 2.
- Write `escalation.md` with trigger `same-diff-twice`.
- Cite the matching prior attempt in the Evidence section.

### Check 2 — no progress two cycles

Read the last 2 lines for the current `criterion_id` from
`acceptance_results.jsonl`. If both lines have:

- same `passed: false`
- same `output_snippet` first 200 chars
- same exit code

Then escalate immediately:

- Skip retry 2.
- Write `escalation.md` with trigger `no-progress-two-cycles`.
- Cite the two matching acceptance lines in the Evidence section.

---

## Integration into TDD retry policy

Existing `refs/tdd_micro_cycle.md` step 5 retry policy:

```
retry 1 inline
retry 2 inline + web search if library-specific
retry 3 → escalate
```

After this MVP, step 5 becomes:

```
retry 1 inline
  ↓
[NEW] futility check (same-diff-twice OR no-progress-two-cycles)
  ↓ if stuck signal → escalate now (skip retry 2 and 3)
retry 2 inline + web search
retry 3 → escalate
```

The existing 3-retry escalate path is unchanged. The detector only
opens a faster escalation route when the signal is clear. Two new
escalation triggers join the existing list: `same-diff-twice` and
`no-progress-two-cycles`. They reuse the existing `escalation.md`
template.

## Mode-aware behavior

- **Quick.** Detector active. On stuck signal, log only; proceed
  with retry 2. Speed > early escalation in quick mode.
- **Standard.** Detector active. Stuck signal → early escalation.
- **Deep.** Detector active. Stuck signal → early escalation plus
  flag the criterion in `retro_note.failed_assumptions` for KB.

## Anti-patterns

- Running the detector before retry 1 has fired (need ≥1 data
  point).
- Comparing diff hashes across criteria (false positives — each
  criterion has its own hash namespace).
- Treating a hash collision on whitespace-only change as a real
  match (normalize before hashing).
- Skipping the futility check because "this retry will land for
  sure" — that prediction is the failure mode the check exists to
  catch.
