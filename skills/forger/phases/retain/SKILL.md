---
name: forger-retain
description: |
  Phase 6 of FORGER. Persist proven claims, failed assumptions, and
  working architectures to the per-domain knowledge base. Trigger
  self-evolution (KB shortcut eligibility). Output retro_note.yaml;
  mutate knowledge/{domain}.
tools: [Read, Write, Bash, Grep]
---

## Pre-flight checklist (mandatory before step 1)

- [ ] All prior-phase artifacts present: `dow.yaml`,
      `source_ledger.yaml`, `claim_ledger.yaml`, `risk_map.yaml`,
      `acceptance_results.jsonl`, `telemetry.jsonl`.
- [ ] `acceptance_results.jsonl` is non-empty AND
      `node src/gates/acceptance_test.mjs --workspace <path>` exits 0
      (otherwise EXECUTE did not actually finish — halt and surface).
- [ ] Orchestrator passed a final status string ∈
      `{shipped, escalated, abandoned}`. Without it, RETAIN cannot
      set KB counters correctly.
- [ ] `knowledge/{dow.meta.domain_slug}/` directory exists or
      `src/cli/update_kb.mjs` will create it; verify the script is
      invokable.
- [ ] `src/lib/ledger.mjs::validateRetroNote` smoke-tests on a
      trivial object.
- [ ] Schema `schemas/retro_note.schema.yaml` loads.


## Identity

You are the **RETAIN** phase of FORGER (the final R in the 7-phase
pipeline Contract → Find → Observe → Recombine → Grill → Execute →
Retain). Your job is to **persist what was learned** from this task
into the per-domain knowledge base so the next task in the same
domain starts smarter than this one. You write exactly one new
artifact in the workspace — `retro_note.yaml` — and you invoke
`src/cli/update_kb.mjs` once. The tool performs every mutation
against `knowledge/{domain}/`; you do not edit those files by hand.

RETAIN is the final phase. There is no phase after you. The
orchestrator routes the task to a terminal state as soon as your two
gates pass. Everything you write must be **portable to future
tasks**: only validated working knowledge, only assumptions worth
remembering, only architecture refs whose body is a real file on
disk.

You are a *skill* invoked by the orchestrator. The orchestrator hands
you a workspace path containing every artifact CONTRACT through
EXECUTE produced. You return `retro_note.yaml` plus a successful exit
from `src/cli/update_kb.mjs`.

---

## Inputs

- **Every workspace artifact.** `dow.yaml` (mode, domain slug,
  acceptance scope), `source_ledger.yaml`, `claim_ledger.yaml`
  (proven-claim candidates), `risk_map.yaml` (probed assumptions,
  failed ones in particular), `acceptance_results.jsonl` (which
  claims a passing criterion referenced), `telemetry.jsonl` (token
  totals, duration), and any architecture doc the task produced.
- **Final status.** Orchestrator passes
  `shipped` / `escalated` / `abandoned` based on EXECUTE's outcome.
  Status drives KB counters and the shortcut-eligibility check.
- Mode config — `skills/forger/modes/{mode}.yaml`. Mode label is
  carried into the retro for downstream analytics; RETAIN itself
  does not branch on mode.

## Outputs

- `workspaces/{slug}/retro_note.yaml` — single retro per task.
  Schema: `schemas/retro_note.schema.yaml`. Fields: `task_id`,
  `domain_slug`, `completed_at`, `mode_used`, `status`,
  `token_used`, `duration_ms`, `proven_claim_ids`,
  `failed_assumptions`, `working_architecture_ref`, `ttl_overrides`,
  `shortcut_eligible`.
- **Mutations to `knowledge/{domain_slug}/`** performed by
  `src/cli/update_kb.mjs`:
  - merges proven claims into the domain `claim_ledger.yaml` with
    `expires_at` stamp;
  - merges underlying sources into the domain `source_ledger.yaml`;
  - appends failed assumptions to `failure_memory.yaml`;
  - optionally appends a section to `working_architectures.md`;
  - increments the matching `index.yaml.tasks_*` counter;
  - checks last 3 task statuses → sets `shortcut_eligible: true` if
    all shipped, resets to `false` on broken streak;
  - appends one line to the domain's `telemetry.jsonl`.

RETAIN does not write any of those files directly.

---

## Routing — read only what fires

RETAIN is structurally smaller than the other phases — no conditional
procedure files. Always:

1. Read `procedure/main.md` and follow it (8-step procedure).
2. Load `refs/*.md` on-demand via `refs/_index.yaml`. Three refs
   (`kb_write_rules`, `ttl_defaults`, `shortcut_eligibility`) cover
   the calibration surface; load only entries whose `triggers` match.

---

## Gates (must pass before exit)

| # | Gate | Mechanism |
|---|------|-----------|
| 1 | `retro_note.yaml` schema validates | `src/lib/ledger.mjs::validateRetroNote` before invoking `update_kb.mjs` |
| 2 | `src/cli/update_kb.mjs --workspace <path>` exits 0 | non-zero = a KB write failed; KB may be partial. Resolve underlying error (often a missing source row referenced by a proven claim, or an unreadable architecture ref) |

---

## Exit checklist (mandatory; populates telemetry `self_audit`)

Walk this checklist out loud and emit a structured `self_audit` field
on the telemetry line. RETAIN is the last phase, so the
`enforce_phase_self_audit.mjs` PreToolUse(Task|Skill) hook may not
fire after this run — the Stop hook
(`enforce_done_means_ran.mjs`) is the final safety net. Treat the
self-audit as the load-bearing structural check, not the hook.

1. `validateRetroNote` returned `{ valid: true }`?
2. `src/cli/update_kb.mjs --workspace <path>` exit code 0?
3. `proven_claim_ids` includes every claim that backs a passing
   acceptance criterion?
4. `failed_assumptions` includes every risk_map assumption with
   `status: probed_fail` plus every invalidated DoW assumption?
5. `working_architecture_ref` set if the task produced an architecture
   doc (else explicitly `null`)?
6. Telemetry line appended?

If any answer is "no" or "unsure", loop back. Do not return until clean.

---

## Cross-references

- `procedure/main.md` — 8-step retro + KB write procedure.
- `refs/_index.yaml` — catalogue of calibration refs.
- `refs/kb_write_rules.md` — qualification rules for proven claims,
  failed assumptions, and working architectures; how each maps to a
  check inside `update_kb.mjs`.
- `refs/ttl_defaults.md` — default TTL (90 days), suggested overrides
  by claim category, worked examples.
- `refs/shortcut_eligibility.md` — how a domain becomes
  shortcut-eligible, how a single failure breaks the streak, how the
  flag interacts with the last-3 status check.
- `src/cli/update_kb.mjs` — performs every KB write; reads the retro,
  validates it, merges/appends/increments, returns exit 0 on success.
- `schemas/retro_note.schema.yaml` — authoritative shape of the retro.
- `src/lib/ledger.mjs` — exports `validateRetroNote` and helpers.
