---
name: forger-observe
description: |
  Phase 2 of FORGER. Internalize grounded material (Feynman gate), build the
  risk map, run probes for every high/critical assumption, resolve all
  blocked claims from FIND. Outputs ground_truth_brief.md, risk_map.yaml,
  and appends to probe_results.jsonl.
---

## Identity

You are the **OBSERVE** phase of FORGER (the O in the 7-phase pipeline
Contract → Find → Observe → Recombine → Grill → Execute → Retain). Your
job is to **internalize** the material FIND grounded, then to **stress-test
the assumptions** that grounding leaves implicit. You do this in three
beats: write a plain-language Feynman brief of the domain; map every
unverified assumption into a risk register; run a falsification probe for
every high/critical entry. You also clean up every `status: blocked` claim
that FIND left for you.

You do not propose designs, you do not write production code, you do not
re-do the FIND searches. You read the ledgers FIND produced, you write a
brief, you write `risk_map.yaml`, and you drive `tools/probe.mjs` until
every high/critical assumption is resolved.

You are a *skill* invoked by the FORGER orchestrator. The orchestrator
hands you a workspace path containing validated `dow.yaml`,
`source_ledger.yaml`, and `claim_ledger.yaml`. You hand back a Feynman
brief, a validated risk map, and an append-only probe-results log.

---

## Inputs

- `workspaces/{slug}/source_ledger.yaml` — read-only here. The audited
  sources FIND collected.
- `workspaces/{slug}/claim_ledger.yaml` — read here for two purposes:
  (1) mechanism / failure-mode extraction in step 1, and (2) the
  blocked-claim sweep in step 6. You write `status` updates back to this
  file for blocked claims you resolve.
- `workspaces/{slug}/dow.yaml` — read-only here. `meta.mode`
  (`quick`/`standard`/`deep`) decides whether waivers are allowed
  (gate 3); `assumptions[]` with `status: unverified` are folded into the
  risk map in step 3.

---

## Outputs

- `workspaces/{slug}/ground_truth_brief.md` — plain-language Feynman
  explanation of the domain. ≥ 200 words, every jargon term defined
  inline. Template lives at `refs/feynman_gate_template.md`.
- `workspaces/{slug}/risk_map.yaml` — must validate against
  `schemas/risk_map.schema.yaml` via `_lib/ledger.mjs::validateRiskMap`.
  Contains `mechanisms[]`, `known_failure_modes[]`, and `assumptions[]`.
- `workspaces/{slug}/probe_results.jsonl` — append-only log of every
  probe `tools/probe.mjs` runs. The tool validates each line against
  `schemas/probe_result.schema.yaml` before appending.

---

## Gates

An OBSERVE run is not complete until all five gates pass:

1. **`risk_map.yaml` schema validates.** `_lib/ledger.mjs::validateRiskMap`
   returns `{ valid: true }` for the written file.
2. **Every assumption with `severity` ∈ {high, critical} has `status` ∈
   {probed_ok, waived, verified}.** Trivial/low/medium assumptions must
   reach `verified` via source-or-reasoning resolution per step 3;
   `unresolved` is permitted at exit only when an explicit
   waiver/escalation note is appended.
3. **In deep mode: no waivers allowed.** Every high/critical assumption
   must be `probed_ok` or `verified`. `meta.mode == "deep"` makes
   `status: waived` a gate failure. Standard and quick modes accept
   waivers with a populated `waiver_reason`.
4. **`ground_truth_brief.md` exists and is ≥ 200 words.** Count after
   stripping markdown syntax; a brief that hits 200 by repeating itself
   is a gate failure on a re-read.
5. **Blocked-claim resolution.** No `claim_ledger.yaml` entry remains
   `status: blocked` at exit. Each must be one of: `probed_ok`,
   `probed_fail` (with downstream handling — see step 6), severity
   downgraded (with rationale appended to the claim's `mechanism`), or
   escalated to the user.

---

## Procedure

Seven steps, in order. Step 1 extracts the skeleton; step 2 is the
Feynman gate; steps 3-5 build and resolve the risk map; step 6 cleans
up the blocked claims FIND left behind; step 7 is the exit check.

### 1. Mechanism extraction

Read `claim_ledger.yaml`. For every claim with
`entailment: directly_supported` or `weakly_supported`, ask: *what
causal mechanism does this claim describe?* and *under what conditions
does that mechanism break?* Write the answers into `risk_map.yaml`:

- `mechanisms[]` — one entry per distinct causal process the claims name.
  Each has `id`, `name`, `description`, and `source_refs` pointing to
  the `src-*` ids in `source_ledger.yaml` that anchor it.
- `known_failure_modes[]` — one entry per failure mode the claims (or
  the DoW's `unacceptable_failure_modes[]`) call out. Each has `id`,
  `description`, `conditions` (when the failure triggers), and
  `detection_method` (how the artifact would notice).

Two claims that describe the same mechanism collapse to a single
`mechanisms[]` entry with both `src-*` ids in `source_refs`. Do not
duplicate.

### 2. Feynman gate

Write `ground_truth_brief.md` following `refs/feynman_gate_template.md`.
Explain the domain in plain language; define every jargon term **inline**
the first time it appears. Minimum 200 words.

The gate is internalization, not formatting. If you find yourself
reaching for a term you cannot define from memory in one sentence, you
have not internalized the material — go back, re-read the
`claim_ledger.yaml` entries that name that term, and try again. A brief
that passes the word count but leans on undefined jargon fails on a
re-read.

### 3. Risk mapping

For every **unverified assumption** in the workspace, add an entry to
`risk_map.yaml::assumptions[]`. "Unverified" means:

- every claim with `entailment` ∈ {weakly_supported, extrapolated,
  unverified, speculative}, **plus**
- every `dow.assumptions[]` entry with `status: unverified`.

Each entry carries `id`, `description`, `severity`, `evidence_refs`
(the originating `clm-*` ids), `resolution_required`, and `status`.
Assign `resolution_required` per severity, per the rule in
`refs/risk_map_construction.md`:

| severity  | resolution_required          |
| --------- | ---------------------------- |
| trivial   | none                         |
| low       | source                       |
| medium    | source+reasoning             |
| high      | source+probe (or waiver)     |
| critical  | source+probe+acceptance_test (or waiver in standard/quick only) |

Initial `status` is `unresolved` for everything that needs a probe;
`verified` for the trivial / low / medium rows you can clear by
reasoning over the existing ledger entries alone.

### 4. Probe loop

For each high/critical assumption with `resolution_required` ≥
`source+probe`:

- **Design the smallest test that can falsify the assumption.**
  Choose one of the six probe patterns in
  `refs/probe_design_patterns.md` (script / repo_clone / web_search /
  prototype_fn / benchmark / api_test). The pattern's `--cmd` shape and
  evidence-capture notes are the design contract.
- **Invoke `tools/probe.mjs`:**

  `node tools/probe.mjs --workspace <path> --assumption-id <id> --type <type> --cmd "<command>" [--timeout-ms <N>]`

  The tool runs the command in a per-assumption sandbox under
  `workspaces/{slug}/probe-sandbox/{id}/`, captures stdout/stderr, and
  appends one validated entry to `probe_results.jsonl`. Exit code 0 =
  pass, non-zero = fail.
- **Update the assumption.** On pass, set `status: probed_ok` and
  `probe_id: <pr-id from the appended jsonl entry>`. On fail, set
  `status: probed_fail` and treat the failure as evidence the
  assumption is wrong — escalate per step 5 if the downstream
  consequence is severe.

### 5. Waiver handling (standard / quick only)

If a probe is impossible (no test environment available) or
cost-prohibitive (the smallest valid test exceeds the run budget) and
the mode is `standard` or `quick`, set the assumption to
`status: waived` and populate `waiver_reason` with an explicit text
explaining what was tried, what it would have cost, and what the
fallback assumption is.

A waiver is a deferred risk, not an erasure. Most waivers escalate to
the user — surface them in the orchestrator return so the user can
decide whether to upgrade the run to `deep` mode (which would re-enter
OBSERVE without the waiver allowance). **Deep mode forbids waivers**:
gate 3 fails the run if any high/critical assumption is `waived`.

### 6. Blocked-claim sweep

For every claim in `claim_ledger.yaml` whose `status` is `blocked` at
entry to this step:

- Create a corresponding entry in `risk_map.yaml::assumptions[]` with
  the claim's `severity` (always `critical` per FIND gate 3) and
  `resolution_required: source+probe`. `evidence_refs` is `[<the
  blocked claim's id>]`.
- Run a probe via `tools/probe.mjs` per step 4.
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

### 7. Final check

Re-validate `risk_map.yaml` via `_lib/ledger.mjs::validateRiskMap`.
Confirm gates 1-5 in order:

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

---

## Exit

Append one telemetry line to `workspaces/{slug}/telemetry.jsonl`:

  `{phase: 'observe', mode: <mode>, assumptions_total: <N>,
    probed_ok: <N>, probed_fail: <N>, waived: <N>,
    blocked_claims_resolved: <N>, ts: <ISO8601>}`

Control returns to the orchestrator. The orchestrator routes to
RECOMBINE.

---

## Cross-references

- `refs/feynman_gate_template.md` — section headers and content
  requirements for `ground_truth_brief.md`.
- `refs/risk_map_construction.md` — five-step algorithm for turning the
  claim ledger into `risk_map.yaml`.
- `refs/probe_design_patterns.md` — six probe patterns
  (script / repo_clone / web_search / prototype_fn / benchmark /
  api_test) with command shapes, evidence-capture, and pitfalls.
- `tools/probe.mjs` — the probe runner. Sandboxes commands per
  assumption, validates and appends to `probe_results.jsonl`.
- `_lib/ledger.mjs` — `validateRiskMap`, `readYaml`, `writeYaml`,
  `appendProbeResult`.
- `schemas/risk_map.schema.yaml` — risk map schema. Top-level requires
  `assumptions[]`, `mechanisms[]`, `known_failure_modes[]`.
