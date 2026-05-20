# EXECUTE — main procedure (branch dispatch + shared exit)

This file dispatches to one of three artifact branches by
`dow.artifact.type`, then converges on the shared exit. The branches
share the same gates and the same telemetry contract; only the build
procedure differs.

Read `SKILL.md` first (router, gates, self-audit). Always read this
file second to learn which branch to load.

---

## D1. Read artifact type and dispatch

Load `dow.artifact.type`. Branch:

| `artifact.type`              | Load                                  |
| ---------------------------- | ------------------------------------- |
| `code` or `system`           | `procedure/branch_code.md`            |
| `research_report`            | `procedure/branch_research.md`        |
| `design`                     | `procedure/branch_design.md`          |
| `spec` or `other`            | `procedure/branch_code.md` as default |

Load only the matching branch file. Do not eagerly load all three.

## D2. Run the branch procedure

Follow the loaded branch procedure until its loop condition is met
(`src/gates/acceptance_test.mjs` exits 0 OR a fact-gap re-entry is
required OR the escalation protocol fires).

During the branch loop, if you diagnose a failure as a **missing
fact** (not a code/research/design bug), stop the branch and load
`procedure/fact_gap_re_entry.md`. Walk it, then resume the branch on
the same criterion that failed.

## D3. Re-run all gates before exit

After the branch loop indicates completion, re-run the four gates
from `SKILL.md` in order:

1. `src/gates/acceptance_test.mjs --workspace <path>` exit code 0;
2. every measurable criterion latest line `passed: true`;
3. every hard constraint latest line `passed: true`;
4. every failure mode detection-inverted line present and `passed: true`.

If any gate fails, the loop is not actually done — return to step D2
of the relevant branch.

## D4. Final completion check + telemetry

Before claiming the run complete, the Stop hook will check Done
Means Ran. Make sure your completion message reads cleanly to the
hook. Hook checklist:

- Latest line per criterion has `passed: true`.
- No `passed: false` in the most recent line for any required criterion.
- No criterion missing a line entirely.

Walk the self-audit checklist from `SKILL.md` and append a telemetry
line to `workspaces/{slug}/telemetry.jsonl`:

```json
{
  "phase": "execute",
  "mode": "<mode>",
  "artifact_type": "<code|system|research_report|design|spec|other>",
  "criteria_total": "<N>",
  "criteria_passing": "<N>",
  "re_entries_used": "<0|1|2>",
  "escalated": false,
  "self_audit": {
    "acceptance_test_exit_zero": true,
    "measurable_all_passing": true,
    "hard_constraints_all_passing": true,
    "failure_modes_undetected": true,
    "done_means_ran_not_blocking": true,
    "artifact_files_exist": true,
    "re_entries_within_cap": null,
    "telemetry_appended": true
  },
  "ts": "<ISO8601>"
}
```

Use `null` for `re_entries_within_cap` when zero re-entries fired.
Use `false` for any failed checklist item — do not silently omit.

Return control to the orchestrator. The orchestrator routes to
RETAIN. The Stop hook independently verifies Done Means Ran when the
user-facing turn ends.

---

## On escalation

If the branch escalates per `refs/escalation_protocol.md`, write
`workspaces/{slug}/escalation.md` and set `escalated: true` in the
telemetry line. The orchestrator surfaces the escalation in the final
summary. Do not edit a gate, a hook, the DoW, or
`acceptance_results.jsonl` by hand to coerce a green exit. The cure
for a stuck criterion is the escalation protocol, not a forged line.
