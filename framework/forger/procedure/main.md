# FORGER orchestrator — main procedure

Eleven steps for the standard pipeline walk. Conditional handlers
(re-entry dispatch, budget pause) live in sibling files and load only
when their trigger fires.

Read `SKILL.md` first (router, phase-exit waits, self-audit, crash
safety).

---

## 1. Parse invocation

Receive the user's task description as the argument to `/forger`.
Compute:

- **`slug`** — kebab-case noun phrase summarising the task, lowercase,
  alphanumeric plus hyphen, ≤40 characters. Strip leading and trailing
  hyphens. The slugify rule lives in `src/dev/new_workspace.mjs`; the
  script re-slugifies whatever you pass, so you can be a little loose.
- **`date`** — local date in `YYYY-MM-DD`.

Preserve the user's task description verbatim — you will hand it to
CONTRACT as `meta.user_query_verbatim`.

## 2. Scaffold the workspace

Invoke the scaffolder:

```
node src/dev/new_workspace.mjs --slug <slug> --date <date> --query "<verbatim task>"
```

The script:

- Resolves `workspaces/{slug}-{date}/` under the framework root.
- On collision, appends `-v2`, `-v3`, etc., automatically. You do not
  manage this; the JSON the script prints back tells you the final
  path (`workspace` field).
- Seeds the empty / templated files every phase will overwrite or
  append to.

Record the returned `workspace` path. From here on, every phase skill
you invoke receives this path as its primary argument.

## 3. CONTRACT — `forger-contract`

Invoke `forger-contract` with the workspace path and the verbatim task
description. CONTRACT runs socratic clarification, reframe, mode pick,
scope confirmation, then writes `dow.yaml` and `reframe_memo.md`.

**Phase-exit waits.** Before moving on:

- `workspaces/{slug}-{date}/dow.yaml` exists.
- `workspaces/{slug}-{date}/reframe_memo.md` exists.
- DoW validates against `schemas/definition_of_works.schema.yaml` via
  `src/lib/ledger.mjs::validateDoW`. On validation failure, surface
  the AJV error path + message to the user and halt; do not silently
  patch.

Read `dow.yaml` once after CONTRACT exits and cache `meta.mode` and
`meta.domain_slug` in your scratch — every downstream phase consumes
them. Load the matching mode YAML via `src/lib/config.mjs::loadMode`
(if available) to obtain the mode's `token_budget_cold` (used by
`procedure/budget_pause.md` in step 11).

## 4. FIND — `forger-find`

Invoke `forger-find` with the workspace path. FIND reads `dow.yaml`,
loads the mode config, runs the KB shortcut check (conditional), and
(on a cold run) fans out 1, 2, or 3 research lanes in parallel inside
its own context. FIND itself handles the filesystem injection of its
lane mandate files into the lane subagents at spawn time — the
orchestrator does not read those mandate files. FIND is the only
phase that fans out beyond orchestrator + 1.

**Phase-exit waits.** Before moving on, confirm:

- `workspaces/{slug}-{date}/source_ledger.yaml` exists.
- `workspaces/{slug}-{date}/claim_ledger.yaml` exists.
- `workspaces/{slug}-{date}/find_summary.md` exists.
- Audit gate passes: run `src/gates/audit.mjs --workspace <path>` and
  require exit code 0.

If audit fails on a non-recoverable flag (e.g., schema errors), halt
with the error and the failing flag. `quote-not-found` and `link-dead`
on non-critical claims are recorded on the entries but not fatal — the
audit script's exit code is the authority.

## 5. OBSERVE — `forger-observe`

Invoke `forger-observe` with the workspace path. OBSERVE internalises
the claim ledger, builds the risk map, probes assumptions at the
severity threshold the mode requires, and writes the ground-truth
brief.

**Phase-exit waits.** Before moving on:

- `workspaces/{slug}-{date}/risk_map.yaml` exists and validates
  against the risk-map schema via `src/lib/ledger.mjs`.
- `workspaces/{slug}-{date}/ground_truth_brief.md` exists.
- Every assumption with `severity` ≥ `high` has `status` in
  `{probed_ok, waived, verified}`. Any assumption still `unverified`
  at this severity is a phase-exit failure: halt and surface which
  assumption is open.

## 6. RECOMBINE — `forger-recombine`

Invoke `forger-recombine` with the workspace path. RECOMBINE produces
Tier 1 ideas (anchored, mechanism-fitted) and, in `standard` or `deep`
modes, optionally Tier 2 speculation and (deep only) Tier 3 proposals.

**Phase-exit waits.** Before moving on:

- `workspaces/{slug}-{date}/recombine.md` exists with at least one
  Tier 1 idea. (Zero Tier 1 ideas is an escalation, not a pass.)
- Mechanism-fit check populated for every Tier 1 idea (grep for the
  section header; do not re-run the check).

## 7. GRILL — `forger-grill`

Invoke `forger-grill` with the workspace path. GRILL runs the
cross-model adversarial review against the chosen Tier 1 design.
GRILL handles the filesystem injection of the adversary mandates
into the reviewer subagents.

**Phase-exit waits.** Before moving on:

- `workspaces/{slug}-{date}/failure_hypotheses.yaml` exists.
- Every open hypothesis has been resolved to one of:
  `accepted_test_added`, `rejected_with_counter_evidence`, or
  `escalated`. Hypotheses still in `open` status are a phase-exit
  failure.
- In `deep` mode: GRILL must have produced **two** reviewer runs (one
  with `blind: true`). Check the metadata GRILL writes into
  `grill_report.md` / the hypothesis log; halt if only one reviewer
  ran.

## 8. EXECUTE — `forger-execute` (with fact-gap re-entry dispatch)

Invoke `forger-execute` with the workspace path. EXECUTE picks one of
three artifact branches by `dow.artifact.type`: TDD micro-cycle for
code/system, ledger-coverage for `research_report`, rubric +
screenshot for `design`. EXECUTE loops until every required acceptance
entry passes. The `src/hooks/enforce_done_means_ran.mjs` Stop hook
prevents claims of completion without acceptance file being populated.

**Fact-gap re-entry.** If EXECUTE returns with a `fact-gap` status and
writes `dow_addendum_{n}.yaml`: stop following this file and load
`procedure/re_entry_dispatch.md`. That procedure handles the FIND
re-invocation, the cap-of-2 check, and the resume into EXECUTE.

**Phase-exit waits** (after EXECUTE returns a clean status, not a
fact-gap):

- `workspaces/{slug}-{date}/acceptance_results.jsonl` shows every
  required acceptance criterion as a passing entry. Confirm via
  `src/gates/acceptance_test.mjs --workspace <path>`; require exit 0.

## 9. RETAIN — `forger-retain`

Invoke `forger-retain` with the workspace path. RETAIN writes the
retrospective note, then merges promotable claims and failed
assumptions into the per-domain knowledge base under
`knowledge/{domain_slug}/` via `src/cli/update_kb.mjs`.

**Phase-exit waits.** Before emitting the final summary:

- `workspaces/{slug}-{date}/retro_note.yaml` exists and validates via
  `src/lib/ledger.mjs::validateRetroNote`.
- `knowledge/{domain_slug}/index.yaml` exists or was updated. Check
  `mtime` against the start of the RETAIN invocation as a soft signal
  that the KB merge ran; the script itself returns success/failure
  that RETAIN surfaces.

## 10. Final summary

Emit a single user-facing message containing, at minimum:

- **Workspace path.** Absolute path to `workspaces/{slug}-{date}/`.
- **Status.** One of:
  - `shipped` — every required phase exited cleanly; acceptance passes.
  - `escalated` — a phase halted (over-quota, three fact-gaps, blocked
    safety-critical hypothesis, or a validation failure the
    orchestrator surfaced and stopped on).
  - `abandoned` — the user declined to continue at a confirmation
    prompt (see step 11).
- **Token budget used vs. mode budget.** Sum the `tokens` field across
  every line in `telemetry.jsonl`; compare against the mode's
  `token_budget_cold`.
- **Telemetry line count.** Lines in
  `workspaces/{slug}-{date}/telemetry.jsonl`.
- **Acceptance summary.** Line count of `acceptance_results.jsonl`
  with a pass / fail breakdown if useful.

Keep the summary tight; the user can open the workspace for detail.

## 11. Telemetry aggregation and budget pause

After each phase returns and before invoking the next, read the new
lines appended to `workspaces/{slug}-{date}/telemetry.jsonl`. Maintain
a running token total across the run.

If at any point the running total exceeds **2× the mode's
`token_budget_cold`**: stop following this file and load
`procedure/budget_pause.md`. That procedure handles the user
confirmation prompt and the pause/abandon decision.

Walk the self-audit checklist from `SKILL.md` before the final
summary. Append the completion telemetry line to
`workspaces/{slug}-{date}/telemetry.jsonl`:

```json
{
  "phase": "orchestrator_complete",
  "mode": "<mode>",
  "status": "<shipped|escalated|abandoned>",
  "token_total": "<N>",
  "token_budget": "<N>",
  "phases_completed": ["contract", "find", "observe", "recombine", "grill", "execute", "retain"],
  "re_entries_fired": "<0|1|2>",
  "budget_pauses": "<N>",
  "self_audit": {
    "workspace_scaffolded": true,
    "all_phases_ran_or_skipped_intentionally": true,
    "final_status_determined": true,
    "token_budget_computed": true,
    "summary_drafted": true,
    "re_entries_within_cap": null,
    "telemetry_appended": true
  },
  "ts": "<ISO8601>"
}
```

Use `null` for `re_entries_within_cap` when zero re-entries fired.
Use `false` for any failed checklist item — do not silently omit.
