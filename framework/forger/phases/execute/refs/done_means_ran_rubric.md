# Done Means Ran — Completion Rubric (EXECUTE phase)

Done Means Ran is invariant 1 of FORGER. It states the only acceptable
basis for claiming completion is **observable, recorded execution of
every required check** — not a coherent-sounding narrative, not a
green test run that did not write to `acceptance_results.jsonl`, not
"all the obvious bits work". The rubric below is what the executor
walks before declaring done, and what `hooks/enforce_done_means_ran.mjs`
mirrors at the Stop hook.

If the rubric does not pass, the Stop hook **will** block. The hook is
registered in `hooks/settings.hooks.json` and reads
`workspaces/{slug}/acceptance_results.jsonl` directly; there is no way
to bypass it short of fixing the underlying defect.

---

## Verbatim checklist

```
For code/system artifacts:
  - acceptance_results.jsonl has a passing line for every
    success_criteria_measurable, hard_constraint, and unacceptable_failure_mode
  - artifact files exist at their target paths
  - linter passed for every touched source file

For research_report:
  - every claim in the report references a claim_ledger entry
  - no critical claim is at entailment < directly_supported
  - audit.mjs passes when run against the report

For design:
  - rubric score meets DoW threshold
  - screenshots / mockups exist for every required surface
  - user-flow review documented in workspace
```

The block above is the **load-bearing** description. Hooks and tests
reference it; do not paraphrase it elsewhere.

---

## How `hooks/enforce_done_means_ran.mjs` enforces this

The Stop hook fires whenever the agent emits a completion-shaped
message (regex match on `done|complete|completed|finished|shipped|
ready`, `all tests pass`, or check-mark glyphs). On match, it:

1. **Resolves the workspace.** Reads `FORGER_WORKSPACE` from the
   environment and checks that it exists. No workspace → no block
   (the hook is a no-op in non-FORGER sessions).
2. **Loads the DoW.** Reads `workspaces/{slug}/dow.yaml`. Missing
   DoW *with* a completion claim is itself a block reason:
   "Completion claimed but no Definition of Works in workspace."
3. **Builds the required-criterion set.** All
   `success_criteria_measurable.id`, all `hard_constraints.id`, and
   all `unacceptable_failure_modes.id` are required. Subjective
   criteria are *not* required for the Done Means Ran block — they
   are surfaced separately by the orchestrator.
4. **Reads `acceptance_results.jsonl`.** Builds a map of
   `criterion_id → latest line`. "Latest" because the executor may
   have written multiple lines per criterion during the cycle;
   only the most recent counts.
5. **Computes missing criteria.** Any required criterion whose
   latest line has `passed !== true` (or no line at all) is
   missing. The hook exits non-zero with a structured stderr
   payload listing every missing `{type}:{id}` pair, plus a
   `suggested_action` of "Run gates/acceptance_test.mjs and fix any
   failing criteria before claiming completion."

Two consequences worth keeping in mind:

- **Latest line wins.** A passing run followed by a failing run on
  the same `criterion_id` is blocking. Re-run
  `gates/acceptance_test.mjs` after every fix; do not rely on an
  earlier green to carry forward.
- **Missing line is missing.** A criterion the executor "knows"
  passes but never invoked the gate on is treated identically to a
  failing line. The hook's contract is checked-not-claimed.

### Mapping each rubric row to the hook

| Rubric row (branch) | Enforced by |
| --- | --- |
| `acceptance_results.jsonl` has a passing line for every measurable / hard_constraint / failure_mode | Hook step 5 — listed in `missing` if missing |
| Artifact files exist at their target paths | DoW `hard_constraint` with a `verification_method` checking file presence (e.g. `test -f <path>`); hook then enforces via step 5 |
| Linter passed for every touched source file | DoW `hard_constraint` referencing the linter (e.g. `npm run lint`); hook enforces via step 5 |
| Every claim in the report references a `claim_ledger` entry | DoW `hard_constraint` invoking `gates/audit.mjs --workspace <path>` (audit greps section claims against the ledger); hook enforces via step 5 |
| No critical claim at entailment < `directly_supported` | DoW `hard_constraint` invoking the audit's entailment check; hook enforces via step 5 |
| `gates/audit.mjs` passes when run against the report | Same `hard_constraint` row as above |
| Rubric score meets DoW threshold | DoW `success_criteria_measurable` with the rubric command as `test_method`; hook enforces via step 5 |
| Screenshots / mockups exist for every required surface | DoW `hard_constraint` with a directory listing verification per surface; hook enforces via step 5 |
| User-flow review documented in workspace | DoW `hard_constraint` checking the document exists at the agreed path; hook enforces via step 5 |

The pattern is: every rubric row resolves to a DoW criterion with a
mechanical verification, and the hook enforces "the criterion's line
in `acceptance_results.jsonl` is `passed: true`". Rubric rows that
do not have a corresponding DoW criterion fall back to executor
discipline only — and become a Done Means Ran gap. CONTRACT is
responsible for translating every rubric row into a criterion with a
runnable verification before EXECUTE starts.

---

## Pre-completion self-check

Before emitting any message that contains a completion claim, the
executor walks the rubric one last time:

1. Does the artifact actually exist at the path declared in the DoW?
2. Did `gates/acceptance_test.mjs` exit 0 in this same session,
   *after* the most recent code change?
3. For each required `criterion_id`, does the latest line in
   `acceptance_results.jsonl` have `passed: true`?
4. For research_report: did `gates/audit.mjs` exit 0 in this same
   session, after the last edit to the report?
5. For design: do all required surface assets exist on disk and is
   the rubric-score line a passing line?

If any answer is "no" or "not sure", re-run the gate before claiming
done. The hook is the safety net, not the design tool — the design
tool is this self-check.
