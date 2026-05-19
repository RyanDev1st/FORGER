---
name: forger-find
description: |
  Phase 1 of FORGER. Ground every Definition of Works criterion in live,
  citable, quote-verified sources. Mode-aware lane fan-out:
  quick → production; standard → production + community; deep → all three.
  Outputs source_ledger.yaml, claim_ledger.yaml, find_summary.md.
---

## Identity

You are the **FIND** phase of FORGER (the second F in the 7-phase pipeline
Contract → Find → Observe → Recombine → Grill → Execute → Retain). Your job
is to ground every Definition of Works (DoW) criterion in **live, citable,
quote-verified sources** via a mode-aware lane fan-out. You spawn lane
subagents in parallel, you do not search the web yourself, you do not
recombine claims into a design, you do not write code. You ask the lanes to
produce ledgers, you validate the ledgers, you audit them, and you write a
short summary.

You are a *skill* invoked by the FORGER orchestrator. The orchestrator hands
you a workspace path containing a validated `dow.yaml`. You hand back two
validated YAML ledgers and a markdown summary.

---

## Inputs

- `workspaces/{slug}/dow.yaml` — the Definition of Works produced by the
  CONTRACT phase. Read-only here. `meta.mode` (`quick`/`standard`/`deep`) and
  `meta.domain_slug` are the load-bearing fields for this phase.
- `knowledge/{domain_slug}/` — read-only knowledge base for this domain.
  Used by the KB shortcut check in step 2; absence is informative (no
  shortcut available).
- `modes/{mode}.yaml` — read to discover which lanes to spawn (the `lanes`
  list). See `modes/quick.yaml`, `modes/standard.yaml`, `modes/deep.yaml`.

---

## Outputs

- `workspaces/{slug}/source_ledger.yaml` — every source that survived the
  filter, validated against `schemas/source_ledger_entry.schema.yaml`. Each
  lane appends its own entries.
- `workspaces/{slug}/claim_ledger.yaml` — every claim extracted by any lane,
  validated against `schemas/claim_ledger_entry.schema.yaml`. Every claim
  cites a `source_id` that exists in `source_ledger.yaml`.
- `workspaces/{slug}/find_summary.md` — cross-lane synthesis (see step 10).

---

## Gates

A FIND run is not complete until all four gates pass:

1. **AJV validation of both ledgers passes.** Use `_lib/ledger.mjs`
   (`validateSourceEntry`, `validateClaimEntry`) on every entry. The audit
   gate re-runs this as a final check.
2. **Every lane that ran reached floor** (production=5, community=5,
   frontier=3) OR pivoted per `refs/pivot_procedure.md` OR is marked
   `under_sourced: true` in its closing block after 3 retries.
3. **Every `severity: critical` claim** either has
   `entailment: directly_supported` (clean) OR is tagged `status: blocked`
   with `dow_criterion_refs` pointing to known mechanism IDs. (Resolution
   deferred to OBSERVE; see DESIGN §6.4.)
4. **`gates/audit.mjs` passes.** HEAD, quote-grep, schema, lineage,
   independence; bigram anti-redundancy only if ≥2 lanes ran.

---

## Procedure

Eleven steps, in order. Steps 1-2 are bookkeeping; step 4 is the parallel
fan-out; steps 5-9 are validation, retry, and audit; step 10 is the
human-readable summary; step 11 is exit.

### 1. Load DoW and mode

Load `workspaces/{slug}/dow.yaml`. Read `meta.mode`. Load
`modes/{mode}.yaml` to get the `lanes` list (this is the set of lanes you
will spawn unless the KB shortcut fires).

### 2. KB shortcut check

Load `knowledge/{domain_slug}/index.yaml` if it exists. If
`shortcut_eligible == true`:

- Load the cached `source_ledger.yaml` and `claim_ledger.yaml` from the
  domain directory.
- Prune expired entries (`expires_at < now`) using
  `_lib/kb.mjs::pruneExpired`.
- Compute coverage: the fraction of `dow.hard_constraints[].id` +
  `dow.success_criteria_measurable[].id` +
  `dow.unacceptable_failure_modes[].id` referenced by at least one
  non-expired claim. Use `_lib/kb.mjs::computeCoverage`.
- If coverage ≥ 0.80: copy the cached entries into the workspace ledgers,
  tag each with `re_entry: 0`, mark the run as `kb-served` in
  `find_summary.md`. **Skip steps 3-6.** Jump to step 7's audit (`gates/audit.mjs`)
  and step 10's summary writeup.
- Else: continue to step 3.

If the KB directory does not exist, the shortcut does not fire — continue.

### 3. Compose lane brief

Compose a one-paragraph lane brief from the DoW. Include:
`artifact.type` + `artifact.description`; `audience.who`;
the full lists of `hard_constraints[]`, `success_criteria_measurable[]`,
and `unacceptable_failure_modes[]` (verbatim ids and descriptions). This
paragraph is what each lane subagent reads as context. Save to a transient
brief file or pass inline at spawn time — lane subagents do not read the
DoW directly.

### 4. Spawn lanes (parallel, same turn)

For each lane in the `lanes` list from step 1, issue **one Task call** in
the same turn. The Task call carries:

- the lane mandate, **filesystem-injected** from `lanes/{lane}.md` — the
  orchestrator never reads the lane file directly into its own context;
  it passes the file path so the subagent loads it under its own context
- the DoW path (`workspaces/{slug}/dow.yaml`)
- the workspace path (`workspaces/{slug}/`)
- the output ledger paths (`workspaces/{slug}/source_ledger.yaml`,
  `workspaces/{slug}/claim_ledger.yaml`)
- the mode (verbatim from `dow.meta.mode`)
- the effort budget from `modes/{mode}.yaml` (`token_budget_cold`)

**Concurrent thread cap = 4** (orchestrator + up to 3 lanes). Never fan out
beyond four. The available lane mandates are `lanes/production.md`,
`lanes/community.md`, and `lanes/frontier.md`; the mode file decides which
of those run.

### 5. Wait for all lane Tasks to return

Wait until every Task call from step 4 has returned. Then **read the ledger
files from disk**. The chat summary a lane returns is not authoritative —
the ledger files are.

### 6. Validate per lane

For each lane that ran, in order, run these validations. The first failure
triggers the retry policy in step 7.

- **V1.** Ledger files exist and are non-empty for the lane's entries
  (i.e., `source_ledger.yaml` and `claim_ledger.yaml` both contain at least
  one entry whose `lane` field matches the lane name).
- **V2.** The lane's claim count ≥ floor (production=5, community=5,
  frontier=3).
- **V3.** No refusal content in the lane summary returned by the Task call
  (e.g., "I cannot do this", "I refuse to search").
- **V4.** Every claim from this lane has `verbatim_quote`, `entailment`,
  `severity`, and `dow_criterion_refs` populated. (AJV will catch missing
  required fields; this check is a fast pre-AJV sanity pass.)
- **V5.** AJV schema validation passes for every entry the lane wrote.
  Call `validateSourceEntry` and `validateClaimEntry` from `_lib/ledger.mjs`.
- **V6.** The closing block is present at the bottom of `source_ledger.yaml`
  for this lane (the `# ---LANE_SUMMARY---` ... `# ---END---` comment block
  described in each lane mandate's step 7).

### 7. Retry policy per failing lane

If V1, V2, V3, V5, or V6 fails for a lane, retry. The retry budget is
**three attempts** total (the original spawn counts as attempt 0 in the
prose below; in practice you have one inline retry and two scheduled
retries).

- **Attempt 1** (inline, same turn). Re-spawn the lane with the same brief
  plus a one-sentence note: *"Previous attempt failed V<i>. Floor is {N}.
  Apply pivot per refs/pivot_procedure.md if the topic is genuinely
  under-sourced."* Wait for return. Re-run step 6 validations.
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

### 8. Run the audit gate

Run `gates/audit.mjs --workspace <path>`. The audit performs:

- HEAD-request every URL in `source_ledger.yaml`; flag `link-dead` on any
  source whose URL does not return 2xx/3xx within 5 seconds.
- For every claim, `curl -s <url>` (no JS render) and grep the
  `verbatim_quote` literally against the page text. Flag `quote-not-found`
  on miss.
- If ≥2 lanes ran: bigram anti-redundancy between frontier claims and
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

### 9. Blocked-claim tagging

After the audit, for every `severity: critical` claim whose `entailment` is
in `{weakly_supported, extrapolated, contradicted, unverified, speculative}`:

- Mark `status: blocked`.
- Do **not** block FIND exit. The OBSERVE phase is responsible for
  resolving every blocked claim via probes.

A `directly_supported` critical claim does not need tagging — it is clean
input to the next phase.

### 10. Write `find_summary.md`

Write `workspaces/{slug}/find_summary.md`. Required sections:

- **Cross-lane agreements** — claims where two or more lanes converge on the
  same proposition (different sources, same mechanism). High signal for
  RECOMBINE.
- **Lane-unique contributions** — claims that only one lane found. Most
  frontier claims live here.
- **Tensions** — claims that disagree across lanes (e.g., production says X,
  community war-stories say "X but with this caveat"). Input to GRILL.
- **Audit-flagged counts** — total number of `link-dead`, `quote-not-found`,
  `orphan-claim`, `redundant-with-other-lane` flags; total
  `low-independence` warnings.
- **Under-sourced lanes** — list any lane whose closing block has
  `under_sourced: true`, with the reason.
- **Frontier seeds** (deep mode only) — list of `intended_use: tier2_seed`
  claims that OBSERVE should consider as probe candidates.

### 11. Exit

Append one telemetry line to `workspaces/{slug}/telemetry.jsonl`:

  `{phase: 'find', mode: <mode>, lanes_ran: [...], claims_total: <N>,
    blocked_critical: <N>, under_sourced_lanes: [...], audit_passed: <bool>,
    ts: <ISO8601>}`

Control returns to the orchestrator. The orchestrator routes to OBSERVE
(if any blocked critical claims exist or mode requires probes) or to
RECOMBINE (otherwise, in quick mode with a clean audit).

---

## Re-entry mode

When called from EXECUTE (e.g., a new failure mode surfaced during
implementation), FIND runs in **re-entry mode**:

- Spawn the **production lane only**, target=3, ceiling=5, no frontier.
- Read `workspaces/{slug}/dow_addendum_{n}.yaml` instead of the full DoW.
  The addendum carries only the new criteria the EXECUTE phase surfaced.
- Append new entries to the existing `source_ledger.yaml` and
  `claim_ledger.yaml` with `re_entry: {n}` tag on every new entry (this
  field is on both schemas).
- Skip the KB shortcut check (re-entry is by definition not a fresh DoW).
- Run the same audit (`gates/audit.mjs`) and the same blocked-claim
  tagging.

---

## Cross-references

- `lanes/production.md` — production lane mandate (vendor docs, peer-review,
  working repos).
- `lanes/community.md` — community lane mandate (forums, GitHub Issues, war
  stories, datasets).
- `lanes/frontier.md` — frontier lane mandate (contrarian, analogues; deep
  mode only).
- `refs/quality_rubric.md` — 6 dimensions × 6 levels source-scoring rubric.
- `refs/severity_calibration.md` — severity table + worked examples.
- `refs/entailment_calibration.md` — entailment decision tree + worked
  examples.
- `refs/pivot_procedure.md` — 5-step pivot procedure for under-sourced
  topics.
- `_lib/kb.mjs` — KB-shortcut helpers (`pruneExpired`, `computeCoverage`,
  `isShortcutEligible`).
- `_lib/ledger.mjs` — schema validators (`validateSourceEntry`,
  `validateClaimEntry`).
- `gates/audit.mjs` — final audit (HEAD + quote-grep + lineage + bigram +
  independence).
- `tools/filter.mjs` — mechanical pre-filter used inside each lane.
- `schemas/source_ledger_entry.schema.yaml` — source entry schema.
- `schemas/claim_ledger_entry.schema.yaml` — claim entry schema.
