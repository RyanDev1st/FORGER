# FORGER orchestrator — main procedure

Twelve steps for the standard pipeline walk (step 0 is the bootstrap
precondition; steps 1-11 are the pipeline). Conditional handlers
(re-entry dispatch, budget pause) live in sibling files and load only
when their trigger fires.

Read `SKILL.md` first (anti-mimicry HALT rules, bootstrap precondition,
phase invocation mechanic, phase-exit waits, evidence discipline,
self-audit, crash safety). This file is the step-by-step walk; the
hard rules live in SKILL.md.

---

## 0. Bootstrap precondition (mandatory)

Before parsing the user's task description, verify the framework is
installed in the current session. Inspect the available-**agents**
list (Task tool subagent_type values) for all 10 required slugs and
the available-skills list for `forger-real-search`:

```
Agents (10):
  forger-contract  forger-find  forger-observe  forger-recombine
  forger-grill     forger-execute  forger-retain
  forger-lane-production  forger-lane-community  forger-lane-frontier

Skills (1):
  forger-real-search
```

If **any** slug is missing, HALT per `SKILL.md` → "Bootstrap
precondition". Emit `status: aborted_phase_unavailable` and stop. Do
not scaffold the workspace. Do not write any artifact yourself. Do
not "do FORGER manually" — that is the canonical failure mode.

If all 11 are present, paste the confirmation into chat
(e.g., "FORGER agents available: forger-contract, … 10 total;
forger-real-search skill available.") and walk the orchestrator
pre-flight checklist (`SKILL.md` → "Pre-flight checklist") before
proceeding to step 1.

## 1. Parse invocation

Receive the user's task description as the argument to `/forger`.
Compute:

- **`slug`** — kebab-case noun phrase summarising the task,
  lowercase, alphanumeric plus hyphen, ≤40 characters. Strip leading
  and trailing hyphens. The slugify rule lives in
  `src/dev/new_workspace.mjs`; the script re-slugifies whatever you
  pass, so you can be a little loose.
- **`date`** — local date in `YYYY-MM-DD`.

Preserve the user's task description verbatim — you will hand it to
CONTRACT as `meta.user_query_verbatim`.

## 2. Scaffold the workspace (mandatory; evidence required)

Invoke the scaffolder via Bash:

```
node src/dev/new_workspace.mjs --slug <slug> --date <date> --query "<verbatim task>"
```

The script:

- Resolves `workspaces/{slug}-{date}/` under the framework root.
- On collision, appends `-v2`, `-v3`, etc., automatically. You do
  not manage this; the JSON the script prints back tells you the
  final path (`workspace` field).
- Seeds the empty / templated files every phase will overwrite or
  append to.

**Evidence requirement.** Paste the JSON return into chat verbatim.
You must quote at minimum the `workspace` field. **Do not** create
the workspace directory or its files by hand (`mkdir`, `Write`,
`New-Item -ItemType Directory`) — that violates `SKILL.md` →
"Anti-mimicry" rule 3 and skips the seed files every phase relies
on. If the scaffolder errors, halt and surface the error verbatim.

Record the returned `workspace` path. From here on, every phase
invocation receives this path as its primary argument.

## 3. CONTRACT — `forger-contract`

Invoke via Task tool with `subagent_type: forger-contract`. Pass
the workspace path and the verbatim task description in the prompt.
CONTRACT runs socratic clarification, reframe, mode pick, scope
confirmation, then writes `dow.yaml` and `reframe_memo.md`.

**Evidence requirement.** Paste the phase return summary into chat.

**Phase-exit waits.** Before moving on:

- `workspaces/{slug}-{date}/dow.yaml` exists (verify with
  `Test-Path` or `ls`; paste the result).
- `workspaces/{slug}-{date}/reframe_memo.md` exists.
- DoW validates against `schemas/definition_of_works.schema.yaml`
  via `src/lib/ledger.mjs::validateDoW`. Run the validator (e.g.,
  via a small Node one-liner that imports the function); on
  validation failure, surface the AJV error path + message to the
  user and halt; do not silently patch.

Read `dow.yaml` once after CONTRACT exits and cache `meta.mode` and
`meta.domain_slug` in your scratch — every downstream phase
consumes them. Load the matching mode YAML via
`src/lib/config.mjs::loadMode` (if available) to obtain the mode's
`token_budget_cold` (used by `procedure/budget_pause.md` in
step 11).

## 4. FIND — `forger-find`

Invoke via Task tool with `subagent_type: forger-find`. Pass the
workspace path in the prompt. FIND reads
`dow.yaml`, loads the mode config, runs the KB shortcut check
(conditional), and (on a cold run) fans out 1, 2, or 3 research
lanes in parallel inside its own context. Each lane is its own
registered agent (`forger-lane-production`, `forger-lane-community`,
`forger-lane-frontier`); FIND issues one Task call per active lane.
The orchestrator does not spawn lanes itself and does not read lane
mandate files. FIND is the only phase that fans out beyond
orchestrator + 1.

**Evidence requirement.** Paste the phase return summary into chat.

**Phase-exit waits.** Before moving on, confirm:

- `workspaces/{slug}-{date}/source_ledger.yaml` exists.
- `workspaces/{slug}-{date}/claim_ledger.yaml` exists.
- `workspaces/{slug}-{date}/find_summary.md` exists.
- Audit gate passes: run `node src/gates/audit.mjs --workspace
  <path>` via Bash and **paste the final exit line**. Require
  exit code 0.

If audit fails on a non-recoverable flag (e.g., schema errors),
halt with the error and the failing flag. `quote-not-found` and
`link-dead` on non-critical claims are recorded on the entries
but not fatal — the audit script's exit code is the authority.

## 5. OBSERVE — `forger-observe`

Invoke via Task tool with `subagent_type: forger-observe`. Pass the
workspace path in the prompt. OBSERVE
internalises the claim ledger, builds the risk map, probes
assumptions at the severity threshold the mode requires, and
writes the ground-truth brief.

**Evidence requirement.** Paste the phase return summary.

**Phase-exit waits.** Before moving on:

- `workspaces/{slug}-{date}/risk_map.yaml` exists and validates
  against the risk-map schema via `src/lib/ledger.mjs`.
- `workspaces/{slug}-{date}/ground_truth_brief.md` exists.
- Every assumption with `severity` ≥ `high` has `status` in
  `{probed_ok, waived, verified}`. Any assumption still
  `unverified` at this severity is a phase-exit failure: halt and
  surface which assumption is open.
- Zero `claim_ledger.yaml` entries remain `status: blocked`.

## 6. RECOMBINE — `forger-recombine`

Invoke via Task tool with `subagent_type: forger-recombine`. Pass
the workspace path in the prompt. RECOMBINE
produces Tier 1 ideas (anchored, mechanism-fitted) and, in
`standard` or `deep` modes, optionally Tier 2 speculation and
(deep only) Tier 3 proposals.

**Evidence requirement.** Paste the phase return summary.

**Phase-exit waits.** Before moving on:

- `workspaces/{slug}-{date}/recombine.md` exists with at least
  one Tier 1 idea. (Zero Tier 1 ideas is an escalation, not a
  pass.)
- Mechanism-fit check populated for every Tier 1 idea (grep for
  the section header; do not re-run the check).

## 7. GRILL — `forger-grill`

If `mode.grill_required: false` (quick-mode default), record the
intentional skip in telemetry and proceed to step 8. Otherwise
invoke via Task tool with `subagent_type: forger-grill`. Pass the
workspace path in the prompt. GRILL runs the
cross-model adversarial review against the chosen Tier 1 design
and handles the filesystem injection of the adversary mandates
into the reviewer subagents.

**Evidence requirement.** Paste the phase return summary.

**Phase-exit waits.** Before moving on:

- `workspaces/{slug}-{date}/failure_hypotheses.yaml` exists.
- Every open hypothesis has been resolved to one of:
  `accepted_test_added`, `rejected_with_counter_evidence`, or
  `escalated`. Hypotheses still in `open` status are a
  phase-exit failure.
- In `deep` mode: GRILL must have produced **two** reviewer runs
  (one with `blind: true`). Check the metadata GRILL writes into
  `grill_report.md` / the hypothesis log; halt if only one
  reviewer ran.

## 8. EXECUTE — `forger-execute` (with fact-gap re-entry dispatch)

Invoke via Task tool with `subagent_type: forger-execute`. Pass the
workspace path in the prompt. EXECUTE picks
one of three artifact branches by `dow.artifact.type`: TDD
micro-cycle for code/system, ledger-coverage for
`research_report`, rubric + screenshot for `design`. EXECUTE
loops until every required acceptance entry passes. The
`src/hooks/enforce_done_means_ran.mjs` Stop hook prevents claims
of completion without `acceptance_results.jsonl` being populated.

**Evidence requirement.** Paste the phase return summary.

**Fact-gap re-entry.** If EXECUTE returns with a `fact-gap`
status and writes `dow_addendum_{n}.yaml`: stop following this
file and load `procedure/re_entry_dispatch.md`. That procedure
handles the FIND re-invocation, the cap-of-2 check, and the
resume into EXECUTE.

**Phase-exit waits** (after EXECUTE returns a clean status, not a
fact-gap):

- `workspaces/{slug}-{date}/acceptance_results.jsonl` shows
  every required acceptance criterion as a passing entry.
  Confirm via `node src/gates/acceptance_test.mjs --workspace
  <path>` via Bash; **paste the final exit line**. Require exit
  code 0 and `required_failed: 0`.

## 9. RETAIN — `forger-retain`

Invoke via Task tool with `subagent_type: forger-retain`. Pass the
workspace path and the final status string
(`shipped`/`escalated`/`abandoned`) in the prompt. RETAIN writes
the retrospective note, then merges promotable claims and failed
assumptions into the per-domain knowledge base under
`knowledge/{domain_slug}/` via `src/cli/update_kb.mjs`.

**Evidence requirement.** Paste the phase return summary.

**Phase-exit waits.** Before emitting the final summary:

- `workspaces/{slug}-{date}/retro_note.yaml` exists and validates
  via `src/lib/ledger.mjs::validateRetroNote`.
- `knowledge/{domain_slug}/index.yaml` exists or was updated.
  Check `mtime` against the start of the RETAIN invocation as a
  soft signal that the KB merge ran; the script itself returns
  success/failure that RETAIN surfaces.

## 10. Final summary

Emit a single user-facing message containing, at minimum:

- **Workspace path.** Absolute path to `workspaces/{slug}-{date}/`.
- **Status.** One of:
  - `shipped` — every required phase exited cleanly; acceptance
    passes.
  - `escalated` — a phase halted (over-quota, three fact-gaps,
    blocked safety-critical hypothesis, or a validation failure
    the orchestrator surfaced and stopped on).
  - `abandoned` — the user declined to continue at a
    confirmation prompt (see step 11).
  - `aborted_phase_unavailable` — bootstrap precondition halted
    the run because the framework was not installed.
- **Token budget used vs. mode budget.** Sum the `tokens` field
  across every line in `telemetry.jsonl`; compare against the
  mode's `token_budget_cold`.
- **Telemetry line count.** Lines in
  `workspaces/{slug}-{date}/telemetry.jsonl`.
- **Acceptance summary.** Line count of
  `acceptance_results.jsonl` with a pass / fail breakdown if
  useful.

Keep the summary tight; the user can open the workspace for
detail.

## 11. Telemetry aggregation and budget pause

After each phase returns and before invoking the next, read the
new lines appended to `workspaces/{slug}-{date}/telemetry.jsonl`.
Maintain a running token total across the run.

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
  "status": "<shipped|escalated|abandoned|aborted_phase_unavailable>",
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
