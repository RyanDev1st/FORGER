# FIND — main procedure

Eleven steps, in order. Steps 1-2 are bookkeeping; step 4 is the parallel
fan-out; steps 5-9 are validation, retry, and audit; step 10 is the
human-readable summary; step 11 is exit.

Read `SKILL.md` first (router, gates, self-audit checklist). This file is
the standard cold-run path. If you are in re-entry mode, read
`procedure/re_entry.md` instead.

---

## 1. Load DoW and mode

Load `workspaces/{slug}/dow.yaml`. Read `meta.mode`. Load
`skills/forger/modes/{mode}.yaml` to get the `lanes` list (this is the set
of lanes you will spawn unless the KB shortcut fires).

## 2. KB shortcut check (conditional)

Check whether `knowledge/{dow.meta.domain_slug}/index.yaml` exists with
`shortcut_eligible: true`. If so, **stop following this file** and load
`procedure/kb_shortcut.md` — that procedure decides whether to serve from
cache or fall through to step 3 here.

If the KB directory does not exist or shortcut is not eligible, continue
to step 3 below. Do not load the shortcut procedure in that case.

## 3. Compose lane brief

Compose a one-paragraph lane brief from the DoW. Include:
`artifact.type` + `artifact.description`; `audience.who`;
the full lists of `hard_constraints[]`, `success_criteria_measurable[]`,
and `unacceptable_failure_modes[]` (verbatim ids and descriptions). This
paragraph is what each lane subagent reads as context. Save to a transient
brief file or pass inline at spawn time — lane subagents do not read the
DoW directly.

## 4. Spawn lanes (parallel, same turn) — Task tool with lane agents

For each lane in the `lanes` list from step 1, issue **one Task call** in
the same turn. The Task call uses the agent's registered subagent_type:

| Mode lane name | Task `subagent_type`        |
| -------------- | --------------------------- |
| `production`   | `forger-lane-production`    |
| `community`    | `forger-lane-community`     |
| `frontier`     | `forger-lane-frontier`      |

The lane mandate is the agent's own system prompt (registered via the
agent file under `lanes/{lane}.md`). FIND does **not** filesystem-inject
the mandate at spawn time anymore — the agent definition carries it.
The prompt FIND passes in each Task call must contain:

- the DoW path (`workspaces/{slug}/dow.yaml`)
- the workspace path (`workspaces/{slug}/`)
- the output ledger paths (`workspaces/{slug}/source_ledger.yaml`,
  `workspaces/{slug}/claim_ledger.yaml`)
- the mode (verbatim from `dow.meta.mode`)
- the effort budget from `skills/forger/modes/{mode}.yaml`
  (`token_budget_cold`)
- the lane brief composed in step 3

**Concurrent thread cap.** FIND itself counts as 1 of the orchestrator's
4 threads; lanes claim 1-3 of the remaining 3. Never fan out beyond
3 lanes in a single FIND turn. The mode file decides which lanes run;
quick=1, standard=2, deep=3.

Issue all lane Task calls in a single assistant turn so they run in
parallel; otherwise the harness will serialise them.

## 5. Wait for all lane Tasks to return

Wait until every Task call from step 4 has returned. Then **read the ledger
files from disk**. The chat summary a lane returns is not authoritative —
the ledger files are.

## 6. Validate per lane

For each lane that ran, in order, run these validations. The first failure
triggers the retry policy in step 7.

- **V1.** Ledger files exist and are non-empty for the lane's entries
  (`source_ledger.yaml` and `claim_ledger.yaml` both contain at least
  one entry whose `lane` field matches the lane name).
- **V2.** The lane's claim count ≥ floor (production=5, community=5,
  edge=3). **Edge leniency:** if the edge lane returns 0 claims after
  honest search and writes a closing block with `under_sourced: true,
  reason: "no contrarian or analogue sources surfaced for this topic"`,
  treat that as a clean exit. Do not pivot, do not retry. Continue to
  the next lane. (Production and community get the standard retry +
  pivot path on floor miss.)
- **V3.** No refusal content in the lane summary returned by the Task call
  (e.g., "I cannot do this", "I refuse to search").
- **V4.** Every claim from this lane has `verbatim_quote`, `entailment`,
  `severity`, and `dow_criterion_refs` populated. (AJV will catch missing
  required fields; this check is a fast pre-AJV sanity pass.)
- **V5.** AJV schema validation passes for every entry the lane wrote.
  Call `validateSourceEntry` and `validateClaimEntry` from
  `src/lib/ledger.mjs`.
- **V6.** The closing block is present at the bottom of `source_ledger.yaml`
  for this lane (the `# ---LANE_SUMMARY---` ... `# ---END---` comment block
  described in each lane mandate's step 7).

## 7. Retry policy per failing lane

If V1, V2, V3, V5, or V6 fails for a lane, retry. The retry budget is
**three attempts** total (the original spawn counts as attempt 0; in
practice you have one inline retry and two scheduled retries).

- **Attempt 1** (inline, same turn). Re-spawn the lane with the same brief
  plus a one-sentence note: *"Previous attempt failed V<i>. Floor is {N}.
  If the topic is genuinely under-sourced, load `refs/pivot_procedure.md`
  and apply the pivot."* Wait for return. Re-run step 6 validations.
- **Attempt 2** (delayed). Schedule the re-spawn via `ScheduleWakeup
  (delaySeconds=300)` in /loop mode, or `CronCreate` one-shot if /loop is
  not active. Persist the retry counter at
  `workspaces/{slug}/.retry-{lane}` so the wake-up handler knows it is
  attempt 2 of 3.
- **Attempt 3** (delayed, same mechanism as attempt 2).
- After 3 fails: mark the lane `under-sourced` in `find_summary.md`,
  continue to the next lane / next step. **Do not block the phase** — an
  under-sourced lane is a partial-result outcome the orchestrator handles
  downstream.

V4 alone (per-claim missing field) is usually resolved by re-spawning with
the explicit complaint; do not promote to scheduled retry without going
through attempt 1 first.

**Edge lane exception.** Skip the retry policy entirely for the edge lane
when V2 trips with 0 claims and the lane wrote the "no findings" closing
block per step 6. Edge is a probe for novelty, not a coverage requirement.

## 8. Run the audit gate

Run `src/gates/audit.mjs --workspace <path>`. The audit performs:

- HEAD-request every URL in `source_ledger.yaml`; flag `link-dead` on any
  source whose URL does not return 2xx/3xx within 5 seconds.
- For every claim, `curl -s <url>` (no JS render) and grep the
  `verbatim_quote` literally against the page text. Flag `quote-not-found`
  on miss.
- If ≥2 lanes ran: bigram anti-redundancy between edge claims and
  production+community claims. Overlap ≥ 30% → flag
  `redundant-with-other-lane`.
- Lineage: every `claim.source_id` must exist in `source_ledger.yaml`.
  Flag `orphan-claim` on miss.
- Independence: every `severity: critical` claim should have ≥2 sources
  with `quality_scores.independence ≥ 4`. Flagged as a *warning*, not an
  error.

The audit writes flag updates back into the ledger files. The audit's
exit code is 0 if no schema errors and no critical missing fields; 1
otherwise.

## 9. Blocked-claim tagging

After the audit, for every `severity: critical` claim whose `entailment`
is in `{weakly_supported, extrapolated, contradicted, unverified,
speculative}`:

- Mark `status: blocked`.
- Do **not** block FIND exit. The OBSERVE phase is responsible for
  resolving every blocked claim via probes.

A `directly_supported` critical claim does not need tagging — it is clean
input to the next phase.

## 10. Write `find_summary.md`

Write `workspaces/{slug}/find_summary.md`. Required sections:

- **Cross-lane agreements** — claims where two or more lanes converge on
  the same proposition (different sources, same mechanism). High signal
  for RECOMBINE.
- **Lane-unique contributions** — claims that only one lane found. Most
  edge claims live here.
- **Tensions** — claims that disagree across lanes (e.g., production says
  X, community war-stories say "X but with this caveat"). Input to GRILL.
- **Audit-flagged counts** — total number of `link-dead`,
  `quote-not-found`, `orphan-claim`, `redundant-with-other-lane` flags;
  total `low-independence` warnings.
- **Under-sourced lanes** — list any lane whose closing block has
  `under_sourced: true`, with the reason. Includes the edge "no findings"
  case from step 6.
- **Frontier seeds** (deep mode only) — list of `intended_use: tier2_seed`
  claims that OBSERVE should consider as probe candidates.

## 11. Exit

Walk the self-audit checklist from `SKILL.md` (six items) **and** record
the outcome of each item as a structured `self_audit` field in the
telemetry line. The `enforce_phase_self_audit.mjs` hook reads this
field and blocks the next phase if any item is `false` or the field is
absent — the structured emit is not optional.

Append one telemetry line to `workspaces/{slug}/telemetry.jsonl`:

```json
{
  "phase": "find",
  "mode": "<mode>",
  "lanes_ran": ["..."],
  "claims_total": "<N>",
  "blocked_critical": "<N>",
  "under_sourced_lanes": ["..."],
  "audit_passed": true,
  "self_audit": {
    "audit_gate_passed": true,
    "lanes_reached_floor_or_pivoted": true,
    "find_summary_complete": true,
    "ledgers_ajv_valid": true,
    "telemetry_appended": true,
    "re_entry_tags_present": null
  },
  "ts": "<ISO8601>"
}
```

Sub-fields use `true` when the checklist item passed, `false` when it
failed (do not silently omit — `false` triggers the hook with a precise
error message naming the item). Use `null` for items that do not apply
to this run (e.g., `re_entry_tags_present` is `null` on cold runs).

After the line is appended, return control to the orchestrator. The
orchestrator routes to OBSERVE (if any blocked critical claims exist or
mode requires probes) or to RECOMBINE (otherwise, in quick mode with a
clean audit).
