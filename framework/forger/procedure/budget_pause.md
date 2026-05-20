# Orchestrator — telemetry budget pause-and-confirm

**Load only when triggered.** Triggers in step 11 of
`procedure/main.md` when the running token total exceeds **2× the
mode's `token_budget_cold`**. Do not load on every phase boundary —
only when the threshold is crossed.

The pause exists to give the user agency before the run consumes
substantially more budget than the mode advertised. Most runs never
trip it; deep mode tasks on novel domains trip it most often.

---

## Procedure

### B1. Confirm the threshold was crossed

Sum the `tokens` field across every line in
`workspaces/{slug}-{date}/telemetry.jsonl`. Compare against the
mode's `token_budget_cold`:

| Mode     | `token_budget_cold` | Threshold (2×) |
|----------|---------------------|----------------|
| quick    | 6000                | 12000          |
| standard | 22000               | 44000          |
| deep     | 35000               | 70000          |

If the running total has NOT crossed the threshold, do not load this
file (return to `procedure/main.md` step 11). The trigger was a
false positive — keep walking.

### B2. Emit the confirmation prompt

Emit a single user-facing message:

```
FORGER pipeline approaching 2× token budget.

- Mode:           <quick|standard|deep>
- Budget (cold):  <token_budget_cold>
- Current total:  <running_total>
- Next phase:     <forger-find|forger-observe|forger-recombine|...>
- Workspace:      <abs path>

Continue, or abandon and emit early summary?

  [continue]  invoke the next phase
  [abandon]   stop the pipeline; emit `status: abandoned` summary
```

The phrasing matters. Show concrete numbers and the next phase. The
user is being asked to authorize the next budget chunk, not a vague
"keep going" decision.

### B3. Wait for user assent

Block on user input. Acceptable affirmative replies: "continue",
"keep going", "yes", "proceed". Acceptable abandon replies:
"abandon", "stop", "no", "abort".

On affirmative: return to `procedure/main.md` step 11 and invoke
the next phase. Append one telemetry line:

```json
{
  "phase": "orchestrator_budget_pause",
  "decision": "continue",
  "running_total": <N>,
  "threshold": <2×budget>,
  "next_phase": "<phase>",
  "ts": "<ISO8601>"
}
```

On abandon: skip to `procedure/main.md` step 10 and emit the final
summary with `status: abandoned`. Append:

```json
{
  "phase": "orchestrator_budget_pause",
  "decision": "abandon",
  "running_total": <N>,
  "threshold": <2×budget>,
  "next_phase": "<phase>",
  "ts": "<ISO8601>"
}
```

### B4. After resume

A single run can trip the pause multiple times — every threshold
crossing fires a new pause. Each pause records its decision; the
final summary cites the total count of pauses (`budget_pauses` in
the completion telemetry).

---

## What this pause is not

- **Not a per-phase confirmation.** The orchestrator does not ask the
  user to confirm each phase. Phase exits are gated by the
  phase-exit waits and the `enforce_phase_self_audit.mjs` hook, not
  by user clicks.
- **Not a hard stop.** Continuing past 2× is supported; the pause
  just makes the budget growth visible. A run that trips 3× without
  abandoning is unusual but not blocked.
- **Not the CONTRACT clarification dialogue.** CONTRACT's socratic
  questions happen inside that phase; this pause is purely about
  budget visibility between phases.
