# EXECUTE — fact-gap re-entry to FIND

**Load only when triggered.** Triggers when
`src/gates/acceptance_test.mjs` fails AND you diagnose the failure
as a **missing fact** rather than a bug. Typical diagnostic: a
documented behavior doesn't match runtime reality, or a required
threshold was never sourced.

Re-entry cap: **2 per task.** A 3rd attempt escalates.

---

## Procedure

### F1. Confirm the gap is real (optional but recommended)

Run a probe to confirm the gap is not a transient flake or fixture
defect:

```
node src/cli/probe.mjs --workspace <path> --assumption-id <id> \
  --type web_search --cmd "<query>"
```

The `web_search` probe command must drive the `forger-real-search`
skill (see `skills/real_search/SKILL.md`). Never spawn
`playwright-cli` directly from this phase.

If the probe shows the fact actually IS in the source ledger but the
implementation missed it, you do not have a fact gap — you have an
implementation bug. Go back to the branch retry loop.

### F2. Compute the re-entry counter

Count existing `dow_addendum_*.yaml` files in the workspace. The
next addendum is `dow_addendum_{n}.yaml` where `n` = existing count
+ 1.

If `n > 2`: do not write another addendum. Escalate per
`refs/escalation_protocol.md`. Write `escalation.md` and return to
`procedure/main.md` step "On escalation".

### F3. Write the addendum

Write `workspaces/{slug}/dow_addendum_{n}.yaml` — a single narrowed
`success_criterion_measurable` (or `hard_constraint` /
`unacceptable_failure_mode`) covering only the missing fact. The
addendum is a mini-DoW; it must validate against the same DoW
schema via `src/lib/ledger.mjs::validateDoW`.

Required fields:

- `meta`: copy `id`, `created_at`, `user_query_verbatim`, `mode`,
  `domain_slug` from the parent DoW. Add `re_entry: {n}`.
- `success_criteria_measurable[]` (or `hard_constraints[]` or
  `unacceptable_failure_modes[]`): one entry, narrowed.
- All other top-level fields are inherited from the parent DoW;
  the addendum need not repeat them.

### F4. Re-invoke `forger-find` in re-entry mode

The orchestrator handles the re-invocation (you exit and return; the
orchestrator detects the new `dow_addendum_{n}.yaml` and re-spawns
FIND). FIND's re-entry mode lives at
`framework/forger/skills/forger/phases/find/procedure/re_entry.md`
and runs the production lane only with target=3, no frontier, no KB
shortcut, and appends new entries with `re_entry: {n}` tags.

### F5. Resume EXECUTE on the failing criterion

When the orchestrator returns control after FIND re-entry, resume
the branch procedure on the **same criterion that failed**, not the
next one. The ledgers now have new entries supporting the missing
fact; the criterion's test should now have evidence to pass.

If the criterion still fails after FIND re-entry: this is suggestive
that the gap was actually a code/research/design bug all along, or
that the missing fact is harder to source than expected. Retry the
branch loop (2 more inline retries) before escalating.

### F6. Deep-mode constraint

Deep mode forbids waiving the gap with a probe. The re-entry path
is mandatory in deep — you cannot mark the criterion `passed: true`
on the basis of "probe ran ok" without ledger evidence. If two
re-entries plus retries do not close the gap in deep mode, escalate
rather than waive.

In standard and quick modes, after 2 re-entries you may consider
filing the criterion as `subjective_pending` for user review,
provided the failure mode is documented and the user can decide
whether the gap matters. Discuss in `escalation.md`.
