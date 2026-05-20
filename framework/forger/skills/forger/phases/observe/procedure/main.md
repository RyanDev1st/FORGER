# OBSERVE — main procedure

Seven steps, in order. Step 1 extracts the mechanism skeleton; step 2 is
the Feynman gate; steps 3-5 build and resolve the risk map; step 6
cleans up the blocked claims FIND left behind; step 7 is the exit check.

Read `SKILL.md` first (router, gates, self-audit checklist). Waiver
handling at step 5 lives in `procedure/waivers.md` and is loaded only
in standard/quick modes.

---

## 1. Mechanism extraction

Read `claim_ledger.yaml`. For every claim with
`entailment: directly_supported` or `weakly_supported`, ask:

- *what causal mechanism does this claim describe?*
- *under what conditions does that mechanism break?*

Write answers into `risk_map.yaml`:

- `mechanisms[]` — one entry per distinct causal process. Each has
  `id`, `name`, `description`, and `source_refs` pointing to the
  `src-*` ids in `source_ledger.yaml` that anchor it.
- `known_failure_modes[]` — one entry per failure mode the claims (or
  the DoW's `unacceptable_failure_modes[]`) call out. Each has `id`,
  `description`, `conditions` (when it triggers), and
  `detection_method` (how the artifact would notice).

Two claims that describe the same mechanism collapse to a single
`mechanisms[]` entry with both `src-*` ids in `source_refs`. Do not
duplicate.

## 2. Feynman gate

Write `ground_truth_brief.md` following `refs/feynman_gate_template.md`.
Explain the domain in plain language; define every jargon term
**inline** the first time it appears. Minimum 200 words.

The gate is internalization, not formatting. If you find yourself
reaching for a term you cannot define from memory in one sentence, you
have not internalized the material — go back, re-read the
`claim_ledger.yaml` entries that name that term, and try again. A brief
that passes the word count but leans on undefined jargon fails on a
re-read.

## 3. Risk mapping

For every **unverified assumption** in the workspace, add an entry to
`risk_map.yaml::assumptions[]`. "Unverified" means:

- every claim with `entailment` ∈ {weakly_supported, extrapolated,
  unverified, speculative}, **plus**
- every `dow.assumptions[]` entry with `status: unverified`.

Each entry carries `id`, `description`, `severity`, `evidence_refs`
(the originating `clm-*` ids), `resolution_required`, and `status`.

Assign `resolution_required` per severity (full algorithm in
`refs/risk_map_construction.md`):

| severity  | resolution_required          |
| --------- | ---------------------------- |
| trivial   | none                         |
| low       | source                       |
| medium    | source+reasoning             |
| high      | source+probe (or waiver)     |
| critical  | source+probe+acceptance_test (or waiver in standard/quick only) |

Initial `status` is `unresolved` for everything that needs a probe;
`verified` for trivial / low / medium rows you can clear by reasoning
over the existing ledger entries alone.

## 4. Probe loop

For each high/critical assumption with `resolution_required` ≥
`source+probe`:

- **Design the smallest test that can falsify the assumption.** Choose
  one of the six probe patterns in `refs/probe_design_patterns.md`
  (script / repo_clone / web_search / prototype_fn / benchmark /
  api_test). The pattern's `--cmd` shape and evidence-capture notes
  are the design contract. For `web_search` probes the `--cmd` must
  drive the `forger-real-search` skill (see
  `skills/real_search/SKILL.md`); never spawn `playwright-cli` directly.
- **Invoke `src/cli/probe.mjs`:**

  `node src/cli/probe.mjs --workspace <path> --assumption-id <id> --type <type> --cmd "<command>" [--timeout-ms <N>]`

  The tool runs the command in a per-assumption sandbox under
  `workspaces/{slug}/probe-sandbox/{id}/`, captures stdout/stderr, and
  appends one validated entry to `probe_results.jsonl`. Exit code 0 =
  pass, non-zero = fail.
- **Update the assumption.** On pass, set `status: probed_ok` and
  `probe_id: <pr-id from the appended jsonl entry>`. On fail, set
  `status: probed_fail` and treat the failure as evidence the
  assumption is wrong — escalate per step 5 if the downstream
  consequence is severe.

## 5. Waiver handling (conditional load)

If a probe is impossible or cost-prohibitive **and** `dow.meta.mode` is
`standard` or `quick`: stop following this file and load
`procedure/waivers.md`. Walk its procedure for the affected
assumptions, then resume this file at step 6.

If `dow.meta.mode == "deep"`: do not waive. Either find a way to probe
(may need to re-design the test per `refs/probe_design_patterns.md`) or
escalate to the user; deep mode gate 3 fails on any waived
high/critical assumption.

If no probe is impossible, skip this step entirely.

## 6. Blocked-claim sweep

For every claim in `claim_ledger.yaml` whose `status` is `blocked` at
entry to this step:

- Create a corresponding entry in `risk_map.yaml::assumptions[]` with
  the claim's `severity` (always `critical` per FIND gate 3) and
  `resolution_required: source+probe`. `evidence_refs` is `[<the
  blocked claim's id>]`.
- Run a probe via `src/cli/probe.mjs` per step 4.
- Update the **claim's** `status` based on the probe outcome:
  - probe passed → `status: probed_ok`, set `probe_id` on the claim;
  - probe failed → `status: probed_fail`, write the consequence to the
    claim's `mechanism` (or extend it) so RECOMBINE sees the
    falsification.
- If a probe fails repeatedly (3 retries exhausted) and the
  consequence is non-catastrophic, **downgrade the claim's severity**
  with a rationale appended to its `mechanism` field. If the
  consequence is catastrophic, **escalate to the user** instead of
  silently downgrading.

Gate 5 forbids leaving any `status: blocked` claim in the ledger at
exit; this step is what discharges that obligation.

## 7. Final check + telemetry

Re-validate `risk_map.yaml` via `src/lib/ledger.mjs::validateRiskMap`.
Confirm gates 1-5 from `SKILL.md` in order:

1. schema is valid;
2. every high/critical assumption has `status` ∈ {probed_ok, waived,
   verified};
3. if `dow.meta.mode == "deep"`, no waivers;
4. `ground_truth_brief.md` exists and is ≥ 200 words after
   markdown-strip;
5. no `claim_ledger.yaml` entry remains `status: blocked`.

If any check fails, fix the underlying defect (re-run a probe,
re-write the brief, downgrade or escalate a claim) and re-check. Do
not edit the schema or the validator to make the gate pass.

Walk the self-audit checklist from `SKILL.md` and append a telemetry
line to `workspaces/{slug}/telemetry.jsonl`:

```json
{
  "phase": "observe",
  "mode": "<mode>",
  "assumptions_total": "<N>",
  "probed_ok": "<N>",
  "probed_fail": "<N>",
  "waived": "<N>",
  "blocked_claims_resolved": "<N>",
  "self_audit": {
    "risk_map_validated": true,
    "high_critical_assumptions_resolved": true,
    "deep_mode_no_waivers": null,
    "feynman_brief_complete": true,
    "blocked_claims_cleared": true,
    "telemetry_appended": true
  },
  "ts": "<ISO8601>"
}
```

Use `null` for `deep_mode_no_waivers` when mode is not `deep`. Use
`false` for any failed checklist item — do not silently omit. Return
control to the orchestrator. The orchestrator routes to RECOMBINE.
