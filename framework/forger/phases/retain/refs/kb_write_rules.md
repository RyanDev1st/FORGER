# KB write rules (RETAIN phase)

Only validated, working knowledge enters the KB:
  - proven_claim_ids must reference claims that:
    1. have status ∈ {verified, probed_ok}
    2. are referenced by a passing acceptance_results line
    3. survived gates/audit.mjs without unresolved flags
  - failed_assumptions includes any risk_map assumption with status: probed_fail
    OR DoW.assumption that turned out invalid
  - working_architecture_ref points to a written file in the workspace if a
    novel architecture shipped
  - failed assumptions are valuable; do NOT omit them — they're future probes

---

## Why each criterion matters

### proven_claim_ids — three-criterion conjunction

A claim is **only** worth persisting to the domain KB if all three
criteria above hold simultaneously. The conjunction is conservative on
purpose, because the KB is the input to every future task in the
domain: a single bad claim in `knowledge/{domain}/claim_ledger.yaml`
poisons every downstream task's CONTRACT and FIND phases until someone
notices and removes it.

**Criterion 1 — `status` ∈ {verified, probed_ok}.** A claim that is
still `open` was never closed by OBSERVE; it might still be wrong. A
claim with `status: probed_fail` is known to be wrong and belongs in
`failure_memory.yaml`, not `claim_ledger.yaml`. The two acceptable
statuses correspond to "cleared without a probe needed" and "probe
confirmed". Anything else is not yet KB-grade.

**Criterion 2 — referenced by a passing acceptance line.** A claim
that never showed up in the artifact, or showed up but in a test that
failed, has no shipped evidence behind it. The
`acceptance_results.jsonl` reference is the audit trail: it says "this
claim influenced a passing test in this build of this artifact". The
grep for the reference is straightforward — `claim_text` mentions a
`clm-*` id, or the test commit message names it. If neither holds, the
claim contributed nothing to the build and persisting it would inflate
the KB with unused theory.

**Criterion 3 — survived `gates/audit.mjs` without unresolved flags.**
Audit checks evidence integrity: every `clm-*` reference resolves,
every quoted snippet matches the ledger's `verbatim_quote`, every cited
URL HEAD-responds. A claim whose source URL stopped responding mid-
task should not enter the KB with that URL still attached — either the
source must be refreshed (and the claim re-audited), or the claim is
demoted out of the proven list. An unresolved audit flag is the most
common reason a claim that "felt right" should not be persisted.

### failed_assumptions — what to include and why

Two sources contribute:

- **`risk_map.yaml` assumptions with `status: probed_fail`.** These
  are assumptions OBSERVE tried to confirm with `tools/probe.mjs` and
  the probe came back negative. The failed probe is the cheapest
  diagnostic the next task in the domain can inherit: it tells the
  next CONTRACT to either probe again (if the assumption is load-
  bearing for the new task) or design around the failure mode.
- **DoW assumptions that turned out invalid.** Sometimes an
  assumption is encoded in the DoW (a hard constraint, an unacceptable
  failure mode, or a `success_criteria_measurable` threshold) and the
  EXECUTE phase discovers during testing that the assumption was
  wrong — the threshold was unreachable, the constraint was self-
  contradictory, the failure mode could not be detected with the
  declared method. These do not appear in the risk map (they were
  never probed; they were assumed away in CONTRACT) but they are
  exactly the kind of mistake the KB exists to prevent on repeat.

### working_architecture_ref — when to set, when to omit

Set the ref only when a **novel** architecture shipped — a pattern
that's worth carrying forward to the next task in the domain and was
not already documented in
`knowledge/{domain}/working_architectures.md`. The body of the file
the ref points to gets appended verbatim under a new `## {task_id}`
header. If the architecture is identical to a prior one already in the
KB, omit the ref; appending a duplicate adds noise and dilutes the
"working" signal of the architectures file.

### failed assumptions are valuable

The most common omission is to skip the failed-assumptions section on
a `shipped` task, on the reasoning that "we shipped, so what went
wrong is moot". The opposite is true: a task that shipped despite a
probe coming back negative carries the most useful lesson — the
probe-fail did not block the build, which means either the assumption
was less critical than the risk map rated it (re-rate next time) or
the path around the failure is now part of the working architecture.
Either lesson is worth a future task knowing.

---

## Common mistakes

- **Including `open` or `probed_fail` claims in `proven_claim_ids`.**
  Both fail criterion 1. The tool will merge them and stamp them with
  `expires_at`, but the next task's FIND phase will treat them as
  proven and skip re-grounding — silently transferring uncertainty
  forward.
- **Citing a claim that was discussed in `recombine.md` but never
  referenced by an acceptance test.** Fails criterion 2. The claim
  influenced the proposal, not the artifact; the artifact is what the
  KB tracks.
- **Setting `working_architecture_ref` to a non-existent path.** The
  tool silently skips the architecture append (it only writes if the
  path exists), so the failure mode is "the architecture you thought
  you persisted didn't make it". Verify the file exists at the
  resolved path before invoking the tool.
- **Marking a DoW assumption as "failed" when EXECUTE merely worked
  around it without proof.** A workaround in code is not a proof that
  the original assumption was wrong. If you didn't run a probe and
  didn't observe the failure mode in tests, the assumption is still
  open — note it in the retro's freeform notes, do not put it in
  `failed_assumptions` where the next task will treat it as a known
  failure.

---

## Edge case — probed_ok claims whose acceptance line later failed

A subtle situation: OBSERVE probes an assumption, the probe comes back
positive (`status: probed_ok`), the claim derived from that assumption
goes into the build, the acceptance test referencing the claim runs
once and passes, then a later cycle's retry of the same acceptance
test fails because of a different defect (perhaps a fixture changed,
perhaps a downstream constraint moved).

Per criterion 2, "referenced by a passing acceptance_results line" is
read as: **the latest line for that `criterion_id` is `passed: true`**.
If the latest line is `passed: false`, the criterion is currently red
and the claim is not yet KB-grade — even if an earlier line for the
same id was green. EXECUTE would not have exited successfully in that
state anyway (Done Means Ran blocks on it), so in practice RETAIN
only ever sees a workspace where every required criterion's latest
line is green. The rule still matters for thinking about partial
runs: if RETAIN ever runs on a workspace with mixed latest-line
states, only claims whose latest-line acceptance is green qualify.

---

## How each rule maps to `tools/update_kb.mjs`

`tools/update_kb.mjs` re-validates the retro on its way in, then:

- For each `proven_claim_ids` entry, it looks up the matching row in
  the workspace `claim_ledger.yaml`. If the row is missing, the merge
  is silently skipped for that id (this is the tool defending itself
  against a typo in the retro). The implication for the retro author:
  every id in `proven_claim_ids` must exist in the workspace's claim
  ledger; the tool will not invent rows.
- For each merged claim, the underlying source row is looked up in
  the workspace `source_ledger.yaml` and merged into the domain
  source ledger. A claim whose `source_id` is unknown to the
  workspace will land in the domain claim ledger without an
  accompanying source row — a degenerate state to avoid. Confirm the
  source row exists before persisting the claim.
- Failed assumptions are appended verbatim; the tool does not check
  for duplicates. Repeated runs of RETAIN with the same retro would
  double-append; the gate against that is "RETAIN runs once per
  task".
- `working_architecture_ref` is resolved relative to the workspace
  (or treated as absolute if absolute). A missing file is skipped
  silently. Verify the file exists before invoking the tool.
- `tasks_*` counters and the last-3 shortcut check fire
  unconditionally on every run — see `refs/shortcut_eligibility.md`
  for what triggers a flip.
