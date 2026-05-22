# Escalation Protocol (EXECUTE phase)

Escalation is the named exit when the executor cannot land the
artifact within the discipline of the cycle. It is **not** a graceful
"give up"; it is a structured handoff that puts the user in position
to decide between three options: amend the DoW, upgrade the mode, or
accept the open risk. The protocol below defines when escalation is
mandatory, how to write the workspace artifact that documents it,
and how the rest of the pipeline responds.

---

## Verbatim trigger list

```
Escalate to user when:
  - 3rd retry attempt fails on the same criterion
  - 3rd re-entry to FIND fails to close a fact gap
  - A failure_hypothesis with severity_if_wrong: critical cannot be resolved
  - A reframe is required during EXECUTE (DoW would change)
  - Deep mode probe is impossible (no waivers in deep)
  - Total tokens exceed 2× mode budget

How to escalate:
  - Write workspaces/{slug}/escalation.md with: reason, evidence,
    options, recommended next step.
  - Set retro_note.status = escalated when RETAIN runs.
  - Do NOT claim completion. The Stop hook will block premature done.
```

The block above is the **load-bearing** description. SKILL.md and
RETAIN reference it; do not paraphrase it elsewhere.

---

## Trigger-by-trigger guidance

### 3rd retry attempt fails on the same criterion

The TDD cycle's retry policy allows two inline retries (the second
with a targeted web search if the error is library-specific). A
third consecutive failure on the same `criterion_id` means the
diagnosis is wrong, not that a fourth retry will land. Stop the
cycle and escalate.

If — and only if — the diagnosis is "missing fact, not code bug",
prefer **fact-gap re-entry** to FIND before escalation. The two
paths are not exclusive: re-entry that fails on its own retries
escalates per the next trigger.

### 3rd re-entry to FIND fails to close a fact gap

The fact-gap re-entry path caps at 2 re-entries per task. A 3rd
attempt to close the same gap escalates. The escalation document
must enumerate the queries already tried (each appears as a
`re_entry: {n}` block in the ledgers) so the user can decide
whether the gap is real or whether the search strategy is wrong.

### A failure_hypothesis with severity_if_wrong: critical cannot be resolved

GRILL's resolution loop requires every high/critical hypothesis to
exit at `accepted_test_added`, `rejected_with_counter_evidence`, or
`escalated`. An entry that lands at `escalated` from GRILL becomes
the executor's problem in EXECUTE only if the user instructed
EXECUTE to proceed despite the escalation. If the hypothesis
still cannot be settled inside EXECUTE — the minimal test costs
more than the artifact, the counter-evidence search exhausts the
re-entry budget — escalate again with the new evidence.

### A reframe is required during EXECUTE (DoW would change)

The DoW is immutable inside the run by design (invariant 9). If
the build is exposing a flaw in the criterion itself — the
threshold is unmeasurable in practice, two criteria are mutually
exclusive, the artifact_type is wrong for the underlying goal —
stop and escalate. Do **not** edit `dow.yaml` directly. RETAIN
writes `dow.v2.yaml` *after* the user confirms; EXECUTE only
documents the proposed change.

### Deep mode probe is impossible (no waivers in deep)

Deep mode forbids waiving a fact gap with a probe; the re-entry
path is mandatory. If the gap cannot be closed even with the full
re-entry budget, deep mode requires escalation rather than
silent acceptance. (Quick and standard modes allow probe-waivers
where deep does not; the escalation document should record which
mode applied.)

### Total tokens exceed 2× mode budget

Each mode declares a token budget. Sustained burn at 2× budget is
the signal that the task has slipped out of the bracket the user
chose at CONTRACT time. Escalate with a token-spend summary so
the user can decide between upgrading the mode (which re-runs
from CONTRACT with a higher budget) and accepting the partial
result.

---

## `escalation.md` template

Write the file at `workspaces/{slug}/escalation.md`. The template
below is the minimum body; add subsections only when the situation
demands them (a multi-criterion escalation might include a
"Per-criterion summary" table, for instance).

```markdown
Parent: dow.yaml

# Escalation: {one-line summary of why}

## Status

escalated_during: execute
escalation_trigger: {3rd_retry | 3rd_re_entry | unresolved_critical_hypothesis | reframe_required | deep_probe_impossible | budget_overrun}
date: YYYY-MM-DDTHH:MM:SSZ
workspace: {slug}
mode: {quick | standard | deep}

## Reason

One paragraph. Plain language. What was the executor trying to do,
what blocked it, why does the block warrant user attention rather
than another inline retry. No log dumps; cite the relevant artifact
paths instead.

## Evidence

Bulleted list of artifact references. One bullet per piece of
evidence the user needs to make the decision.

- `workspaces/{slug}/acceptance_results.jsonl` lines for
  `criterion_id={...}` (latest result, exit code, output_snippet).
- `workspaces/{slug}/failure_hypotheses.yaml` entry id
  `fh-{...}` (if the trigger is an unresolved critical hypothesis).
- `workspaces/{slug}/dow_addendum_{n}.yaml` (if the trigger is a
  3rd fact-gap re-entry attempt; include every attempt's
  addendum).
- Telemetry summary (if the trigger is budget overrun): tokens
  used, mode budget, ratio.

## Options

Numbered list, three to five entries. Each option states:

1. What the user does (e.g. "Amend the DoW threshold from 100 ms
   to 250 ms").
2. What happens next in the pipeline (e.g. "EXECUTE resumes from
   the same cycle with the updated criterion; no FIND re-run
   required").
3. What the trade-off is (e.g. "Latency budget loosens, satisfies
   the documented hardware floor").

Always include "Accept the open risk and ship without this
criterion" as one option, with the explicit caveat that
acceptance_results.jsonl will still show the criterion as failing
and the Stop hook will still block until the criterion is
manually removed from the DoW in a documented amendment.

## Recommended next step

One option from the list above, chosen by the executor based on
the evidence. Phrase as a single sentence; the user is the one who
decides, but they decide faster with a recommendation.
```

---

## After-escalation pipeline behavior

- **EXECUTE.** Stops looping. Does *not* claim completion. The Stop
  hook continues to block on any completion-shaped message until the
  user resolves the escalation.
- **RETAIN.** When invoked on this task, sets
  `retro_note.status = escalated`. The KB update still happens
  (proven claims, failed assumptions, telemetry) so the knowledge
  base learns from the partial run, but the task is not credited as
  shipped.
- **User response paths.**
  - *Amend DoW.* User edits the criterion (or accepts the proposed
    `dow.v2.yaml`). Orchestrator re-enters CONTRACT for ratification,
    then routes to the latest unfinished phase.
  - *Upgrade mode.* Re-run the task with a higher mode (e.g. quick
    → standard → deep). Quick → deep upgrade re-runs from CONTRACT;
    inside-pipeline upgrade is not supported.
  - *Accept open risk.* User documents the acceptance in an
    amendment to the DoW (`hard_constraints` entry removed, or
    `success_criteria_measurable` entry struck through with a
    rationale). EXECUTE re-runs the gate and exits when the
    remaining criteria pass.

The protocol's job is to make all three responses cheap. The
`escalation.md` template, the `retro_note.status = escalated`
linkage, and the Stop hook together convert an unresolved cycle
into a structured decision point rather than an unbounded retry
loop.
