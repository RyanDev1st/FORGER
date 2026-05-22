# GRILL — main procedure

Seven steps for the standard (non-blind) reviewer path. The blind
reviewer pass (deep mode only) lives in `procedure/blind_reviewer.md`
and is invoked after step 4 here.

Read `SKILL.md` first (router, gates, self-audit, resolution
outcomes). If `mode.grill_required: false` (quick mode), skip this
phase entirely — do not load this file.

---

## 1. Re-run the audit

Run `src/gates/audit.mjs --workspace <path>` to confirm the artifacts
the reviewer is about to see still pass mechanical checks (HEAD
request, quote-grep, schema, lineage). If the audit emits new errors,
fix them **before** invoking the reviewer — never ask a reviewer to
evaluate a proposal that fails its own grounding gate.

## 2. Compose the adversary prompt

Read `refs/adversary_mandate.md` verbatim. Concatenate it with the
contents of every workspace artifact listed under Inputs in
`SKILL.md` (DoW, source ledger, claim ledger, risk map, recombine.md).
The mandate is the *system prompt*; the artifacts are the *user
prompt*. Do not rewrite the mandate; do not summarize the artifacts.

## 3. Invoke the reviewer (non-blind)

Call
`src/lib/reviewer_router.mjs::invokeReviewer(systemPrompt, userPrompt, {blind: false})`.
Capture `{tier, response, reviewer_meta}`.

The router picks the highest-priority provider whose API key is
present and whose family differs from the current session. If none is
reachable, it falls back to a same-family subagent and tags the tier
`acceptable` or `weak` per the table in the reviewer-router source.

## 4. Parse non-blind response

Parse the reviewer's YAML list response into failure_hypothesis
entries. For each entry:

- Assign a stable `id` (`fh-<short-slug>` derived from `hypothesis`).
- Copy `hypothesis`, `what_disproves`, `minimal_test`,
  `severity_if_wrong`, and `confidence` verbatim.
- Tag with `reviewer_provider: reviewer_meta.provider`,
  `reviewer_model: reviewer_meta.model`, `reviewer_tier: tier`, and
  `blind: false`.
- Set `status: open` (the resolution loop in step 6 closes it).

Append the parsed entries to
`workspaces/{slug}/failure_hypotheses.yaml` (create the file as `[]`
first if it does not yet exist).

## 5. Blind reviewer pass (deep-mode conditional)

If `mode == deep` (equivalently, `mode.grill_blind_reviewer == true`):
stop following this file and load `procedure/blind_reviewer.md`.
Return here after the blind entries are appended.

In quick/standard mode, skip — there is no blind reviewer.

## 6. Resolution loop

For each failure_hypothesis with `status: open`:

- Read it. Decide:
  - **Accept** → add a probe or acceptance test that addresses it;
    set `status: accepted_test_added`; set `resolution_test_id` to
    the id of the added probe or acceptance test.
  - **Reject** → cite specific claim_ids that contradict the
    hypothesis; set `status: rejected_with_counter_evidence`;
    populate `counter_evidence_refs` with those claim_ids.
  - **Escalate** → mark `status: escalated`; emit a one-line summary
    to the user.
- No `status: open` may remain at exit.

Order: walk the file high-severity-first. High- and critical-severity
entries (gate 2) must close; low/medium entries should also close.

## 7. Write `grill_report.md`

Summarize the resolution outcomes in three sections:

- **Accepted tests added.** One bullet per `accepted_test_added`,
  citing the hypothesis `id`, the chosen `resolution_test_id`, and
  one sentence on why the test settles the hypothesis.
- **Rejected with counter-evidence.** One bullet per
  `rejected_with_counter_evidence`, citing the hypothesis `id`, the
  `counter_evidence_refs`, and one sentence on the contradicting
  evidence.
- **Escalated to user.** One bullet per `escalated`, citing the
  hypothesis `id` and the reason the executor could neither test
  nor refute it.

The report is the human-readable counterpart to the YAML; it does not
duplicate the schema, only the decisions.

## 8. Exit + telemetry

Re-confirm gates 1-4 from `SKILL.md` in order:

1. `validateFailureHypothesis` returns `{ valid: true }` for every entry;
2. zero high-/critical-severity entries with `status: open`;
3. `src/gates/audit.mjs --workspace <path>` exits 0;
4. every entry has `reviewer_tier` set; mode-required tier floor met
   (deep also requires ≥1 entry with `blind: true`).

If any gate fails, fix the underlying defect — re-run the resolution
loop on a stale `open` entry, replace a low-tier reviewer entry by
re-invoking the router with `FORGER_REVIEWER_PROVIDER` set explicitly,
correct a broken URL the audit flagged — and re-check. Do not edit
the schema or the gates to make the check pass.

Walk the self-audit checklist from `SKILL.md` and append a telemetry
line to `workspaces/{slug}/telemetry.jsonl`:

```json
{
  "phase": "grill",
  "mode": "<mode>",
  "hypotheses_total": "<N>",
  "accepted_test_added": "<N>",
  "rejected_with_counter_evidence": "<N>",
  "escalated": "<N>",
  "reviewer_tiers": ["<tier>", "..."],
  "self_audit": {
    "ajv_validation_passed": true,
    "no_open_high_critical": true,
    "audit_gate_passed": true,
    "reviewer_tier_met": true,
    "blind_reviewer_present": null,
    "grill_report_complete": true,
    "telemetry_appended": true
  },
  "ts": "<ISO8601>"
}
```

Use `null` for `blind_reviewer_present` in non-deep modes. Use `false`
for any failed checklist item — do not silently omit. Return control
to the orchestrator. The orchestrator routes to EXECUTE, which
inherits the accepted resolution tests as additional acceptance
criteria.
