# CONTRACT — autonomous mode (no human in the loop)

**Load only when triggered.** Triggers when CONTRACT is invoked without
an interactive user — batch runs, hands-off scripts, scheduled jobs,
loop-mode resumes after a long pause. Do not load this procedure on a
standard interactive run.

The standard interactive procedure (`procedure/main.md`) relies on
user replies for steps 1–3 and 5.5. Without a user, asking is wasted —
this file replaces those steps with conservative inference plus
explicit `assumptions[]` entries so a later reviewer can audit the
trade-off.

---

## Procedure

### A1. Skip steps 1–3 of socratic questioning

Do not ask the user anything. You cannot — there is no user. Asking
nobody wastes the run.

### A2. Write the DoW with conservative assumptions

Every field that would ordinarily come from a user answer instead
comes from your best inference, **plus** an entry in `assumptions[]`
with:

- `description`: what you assumed and what answer you would want from
  a user;
- `severity`: `high` if a wrong guess would invalidate the artifact;
  `medium` otherwise;
- `status: unverified`.

Inference rules of thumb:

- **Artifact type**: pick the narrowest type that matches the verb in
  the user query (`build` → code; `analyze` → research_report;
  `mock up` → design; `spec out` → spec). Tie → code.
- **Audience**: default to "developer or operator with domain context"
  unless the query names a specific role.
- **Hard constraints**: include every constraint the user query
  literally states. Do not invent additional ones from "best
  practice."
- **Success criteria measurable**: every constraint must be reachable
  by at least one measurable criterion. If no measurable criterion is
  obvious, add a placeholder with `threshold: "TBD-needs-human"` and
  add an assumption pointing to it.

### A3. Reframe is still required

Produce at least one alternative framing in `reframe_memo.md`. Mark
`chosen_framing` as the original framing unless one alternative is
strictly safer (e.g., dropping a safety-critical failure mode that
the user query did not explicitly require). Log the choice in
`rationale`.

### A4. Mode defaults to `standard`

Set `meta.mode: standard` and `meta.mode_picked_by: auto`. Override to
`deep` only if the inferred DoW carries any safety-critical failure
mode or the domain is novel (no `knowledge/{slug}/` directory).

### A5. Skip scope confirmation (5.5)

There is no user to confirm with. Note this in `reframe_memo.md` under
a `confirmation_skipped` section: cite the reason (autonomous mode)
and list the three bullets that *would* have been confirmed. A later
human reviewer reads this to audit the trade-off.

### A6. Write DoW + telemetry

All schema gates from `SKILL.md` still apply. Autonomous mode is no
excuse to ship a DoW that fails validation. After writing, validate
via `src/lib/ledger.mjs::validateDoW`.

Append the telemetry line with `scope_confirmed: null`:

```json
{
  "phase": "contract",
  "mode": "<mode>",
  "autonomous": true,
  "self_audit": {
    "dow_validated": true,
    "hard_constraints_have_verification": true,
    "measurable_criteria_complete": true,
    "reframe_memo_written": true,
    "mode_and_picker_set": true,
    "scope_confirmed": null
  },
  "ts": "<ISO8601>"
}
```

Return control to the orchestrator.
