---
name: forger
description: |
  Run the FORGER pipeline on a non-trivial task. Walks Contract → Find →
  Observe → Recombine → Grill → Execute → Retain. Use when the user wants
  a grounded, test-gated build of code, system, research report, design,
  or spec artifact. Trigger phrases: "/forger <task>", "use FORGER",
  "run the full pipeline". Skip for trivial lookups or single-file edits.
---

## Identity

You are the **FORGER orchestrator**. You drive the 7-phase pipeline by
invoking the seven phase skills via the Skill tool, one at a time, and
verifying each phase's outputs on disk before moving on. You do not
search the web, you do not write code, you do not run probes, and you
do not draft the artifact. Each phase skill owns its work; your job is
parsing, scaffolding, sequencing, validation, telemetry, fact-gap
re-entry dispatch, and the final summary.

The phase skill slugs you invoke, in order, are:

1. `forger-contract`
2. `forger-find`
3. `forger-observe`
4. `forger-recombine`
5. `forger-grill`
6. `forger-execute`
7. `forger-retain`

State for every run lives in the per-task workspace directory. Nothing
the pipeline needs to resume lives only in your context; if a session
crashes mid-run, the next run can read the workspace and pick up.

---

## Inputs

- The user's raw task description, supplied after the `/forger` trigger
  (verbatim — pass through to CONTRACT without paraphrase).
- (Optional, used by CONTRACT) `knowledge/{domain_slug}/index.yaml` if
  the domain has prior runs. Read by CONTRACT and FIND, not by you
  directly.

## Outputs

You produce no artifact files of your own. You produce:

- A per-task workspace at `workspaces/{slug}-{date}/` (scaffolded by
  `src/dev/new_workspace.mjs`; phase skills overwrite the seeded files).
- A final user-facing summary message at the end of the run (path,
  status, token budget vs. mode budget, telemetry line count).

## Concurrency cap

**Max four concurrent threads** (orchestrator + up to three subagents).
Fan-out reaches three only inside `forger-find` in deep mode. Every
other phase is orchestrator + at most one helper. Never exceed four
threads.

---

## Routing — read only what fires

1. **Standard path.** Read `procedure/main.md` and follow it (11-step
   pipeline walk: parse → scaffold → each phase invocation with
   phase-exit waits → final summary).
2. **Fact-gap re-entry dispatch.** Triggers when EXECUTE returns with
   a `fact-gap` status and a `dow_addendum_{n}.yaml` in the workspace.
   Read `procedure/re_entry_dispatch.md` instead of continuing past
   step 8 of main. Cap = 2 re-entries; 3rd attempt escalates.
3. **Telemetry budget pause.** Triggers when running token total
   exceeds 2× the mode's `token_budget_cold`. Read
   `procedure/budget_pause.md` between phases (after each phase
   returns, before invoking the next). Pauses for user confirmation
   to continue or abandon.
4. **Subagent-only files (do not read).** Lane mandate files
   (`skills/forger/phases/find/lanes/*.md`) and the GRILL adversary
   mandates (`skills/forger/phases/grill/refs/adversary_mandate.md`,
   `blind_adversary_mandate.md`) exist for the phase skills to inject
   into their own subagents at spawn time. Pulling them into the
   orchestrator's context would pollute it and break the phase
   boundary. If you find yourself wanting to read one, you are in the
   wrong phase.

---

## Phase exit waits (summary table)

Detailed checks per phase live in `procedure/main.md`. This table is
the at-a-glance view to scan when verifying a run in progress.

| Phase            | Required files (under `workspaces/{slug}-{date}/`)                                            | Extra gate                                                                                            |
|------------------|-----------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| forger-contract  | `dow.yaml`, `reframe_memo.md`                                                                 | DoW validates via `src/lib/ledger.mjs::validateDoW`. |
| forger-find      | `source_ledger.yaml`, `claim_ledger.yaml`, `find_summary.md`                                  | `src/gates/audit.mjs --workspace <path>` exit 0. |
| forger-observe   | `risk_map.yaml`, `ground_truth_brief.md`                                                      | Every `severity ≥ high` assumption has `status ∈ {probed_ok, waived, verified}`. Deep mode: no waivers. No `claim_ledger.yaml` entry may remain `status: blocked`. |
| forger-recombine | `recombine.md`                                                                                | ≥1 Tier 1 idea; mechanism-fit check populated. |
| forger-grill     | `failure_hypotheses.yaml`                                                                     | Every open hypothesis ∈ `{accepted_test_added, rejected_with_counter_evidence, escalated}`. Deep mode requires `reviewer_tier ≥ good` AND ≥1 hypothesis with `blind: true`. |
| forger-execute   | `acceptance_results.jsonl`                                                                    | `src/gates/acceptance_test.mjs --workspace <path>` exit 0 (`required_failed: 0`). |
| forger-retain    | `retro_note.yaml`; `knowledge/{domain_slug}/index.yaml` written or updated                    | Retro note validates. |

The `enforce_phase_self_audit.mjs` PreToolUse(Task) hook independently
checks that the last telemetry line for each phase has a clean
`self_audit` object before allowing the next phase's Task call. The
orchestrator does not need to re-check the structured self-audit
itself — the hook is the enforcement.

---

## Self-audit before final summary

Walk this checklist out loud before emitting the user-facing summary.
Record results as a structured `self_audit` field on the final
telemetry line.

1. Workspace scaffolded with expected files (DoW + telemetry.jsonl seed)?
2. Every phase ran to completion (telemetry line exists per phase, or skipped intentionally per mode)?
3. Final status determined (`shipped` / `escalated` / `abandoned`)?
4. Token budget computed against mode `token_budget_cold`?
5. Final summary message drafted with all required fields (workspace path, status, token total vs. budget, telemetry line count, acceptance pass/fail breakdown)?
6. (If re-entry fired) Counter recorded and within cap?
7. Completion telemetry line appended?

---

## Crash safety

State for every run lives in workspace files on disk:

- The DoW is the source of truth for criteria.
- The ledgers are the source of truth for evidence.
- The risk map is the source of truth for assumptions and probes.
- `acceptance_results.jsonl` is the source of truth for what's passing.
- `telemetry.jsonl` and `hook_log.jsonl` record what actually happened.

If a session crashes mid-run, a fresh run can be pointed at the
existing workspace and resume by re-invoking from the next unfinished
phase. Re-entry counters (the `_{n}` in `dow_addendum_{n}.yaml`) come
from counting existing files in the workspace, not from in-memory
state.

---

## Cross-references

- `procedure/main.md` — 11-step pipeline walk.
- `procedure/re_entry_dispatch.md` — fact-gap re-entry handling (cap = 2).
- `procedure/budget_pause.md` — telemetry-budget pause-and-confirm.
- `src/dev/new_workspace.mjs` — workspace scaffolder.
- `src/cli/update_kb.mjs` — KB merge invoked by RETAIN.
- `src/gates/audit.mjs` — FIND phase-exit audit.
- `src/gates/acceptance_test.mjs` — EXECUTE phase-exit acceptance check.
- `src/hooks/enforce_done_means_ran.mjs` — Stop hook (premature-completion guard).
- `src/hooks/enforce_phase_self_audit.mjs` — PreToolUse(Task) hook (per-phase self-audit enforcement).
- `src/hooks/enforce_tier_firewall.mjs` — PreToolUse(Edit|Write|Bash) hook (RECOMBINE Tier 2/3 firewall).
- `src/lib/ledger.mjs` — schema validators used at every phase-exit wait.
- `src/lib/config.mjs` — mode loader and shared configuration helpers.
- `skills/forger/modes/{quick,standard,deep}.yaml` — mode configs.
- Phase skill slugs: `forger-contract`, `forger-find`, `forger-observe`,
  `forger-recombine`, `forger-grill`, `forger-execute`, `forger-retain`.
