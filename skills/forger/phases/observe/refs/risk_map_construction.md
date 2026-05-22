# Risk Map Construction (OBSERVE phase)

This file specifies the algorithm for turning a validated
`claim_ledger.yaml` (plus the DoW's assumptions) into a populated
`risk_map.yaml` that satisfies all five OBSERVE gates. The procedure is
five numbered steps; run them in order, do not skip.

The shape of the output file is fixed by `schemas/risk_map.schema.yaml`:

  - `mechanisms[]` — required
  - `known_failure_modes[]` — required
  - `assumptions[]` — required (the load-bearing array)

You write all three arrays in the same file. The five steps below build
them in the order the schema lists.

---

## Step 1 — Extract mechanisms from the claim ledger

Walk `claim_ledger.yaml` and pull out every distinct **causal mechanism**
the claims name. A mechanism is a process: an *if X happens, Y follows*
description that the artifact will either rely on or have to defend
against. Most mechanisms come from `entailment: directly_supported` and
`weakly_supported` claims; speculative claims rarely contribute clean
mechanisms.

Each mechanism becomes one entry in `mechanisms[]`:

  - `id` — `mech-<short-slug>` (kebab-case noun phrase).
  - `name` — short human-readable label.
  - `description` — one-sentence prose of the *if-then* shape.
  - `source_refs` — the `src-*` ids in `source_ledger.yaml` that anchor
    this mechanism. A mechanism with zero source refs is a bug; if you
    cannot point to a source, the mechanism is your inference, not a
    grounded process — promote it to `assumptions[]` instead.

If two claims describe the same mechanism, collapse them: one
`mechanisms[]` entry with both `src-*` ids in `source_refs`. Do not
duplicate mechanisms by phrasing.

## Step 2 — Extract known failure modes

Walk two sources in parallel:

  - `claim_ledger.yaml` — any claim whose `claim_text` describes a
    failure (whether the entailment is directly_supported or merely
    extrapolated). War stories from the community lane are the densest
    source here.
  - `dow.yaml::unacceptable_failure_modes[]` — every entry, because the
    DoW's failure modes are the contract the artifact must respect.

Each unique failure becomes one entry in `known_failure_modes[]`:

  - `id` — `fm-<short-slug>`.
  - `description` — one sentence naming the failure.
  - `conditions` — what trips it (load, configuration, edge input,
    environmental).
  - `detection_method` — how the artifact would notice. *"User report"*
    is allowed only when no programmatic signal exists; prefer
    metric-or-log-shaped detection where possible.

A failure that has no plausible detection method is itself a risk —
record it anyway, set `detection_method: 'no programmatic detection
available — must be reproduced manually'`, and add a corresponding
high-severity entry to `assumptions[]` in step 3.

## Step 3 — Enumerate unverified assumptions

For every **unverified assumption** in the workspace, write one entry
to `assumptions[]`. Unverified means one of:

  - a claim in `claim_ledger.yaml` with `entailment` ∈
    {weakly_supported, extrapolated, unverified, speculative};
  - a `dow.assumptions[]` entry with `status: unverified` (typically
    autonomous-mode DoWs);
  - a failure mode from step 2 whose `detection_method` is
    "no programmatic detection available";
  - any **mechanism** from step 1 whose `source_refs` list a single
    source (independence < 2 — see FIND audit gate).

Each entry carries:

  - `id` — `asm-<short-slug>`.
  - `description` — what would have to be true for the artifact to
    work as designed.
  - `severity` — inherited from the originating claim, or assigned per
    the FIND severity calibration table when the source is a
    `dow.assumptions[]` entry.
  - `evidence_refs` — `[<the originating clm-* or dow assumption id>,
    ...]`. Multiple refs allowed when the same assumption is named by
    several claims.
  - `resolution_required` — assigned in step 4.
  - `status` — `unresolved` initially for anything needing a probe;
    `verified` only when the assumption is already discharged by
    multiple strong sources in the existing ledgers (typical for
    `severity: trivial` and `severity: low`).

## Step 4 — Assign `resolution_required` per severity

Apply the table verbatim. `resolution_required` is the **minimum**
resolution; you may go beyond it (e.g., probe a `medium` assumption)
but you may not fall short:

| severity  | resolution_required                              |
| --------- | ------------------------------------------------ |
| trivial   | none                                             |
| low       | source                                           |
| medium    | source+reasoning                                 |
| high      | source+probe (or waiver)                         |
| critical  | source+probe+acceptance_test (or waiver in standard/quick only) |

Notes on the table:

- **`source`** means at least one `src-*` already in
  `source_ledger.yaml` covers the assumption. Mark `verified` once you
  have confirmed the existing source actually addresses it; do not mark
  `verified` by association.
- **`source+reasoning`** means the source exists *and* you can write
  a one-paragraph argument tying the source to the assumption. The
  argument lives in the `description` field — extend it if needed.
- **`source+probe`** means SKILL step 4 runs an executable falsification
  test via `src/cli/probe.mjs`. The probe pattern comes from
  `refs/probe_design_patterns.md`.
- **`source+probe+acceptance_test`** means the probe is preserved as a
  reusable acceptance test the EXECUTE phase will re-run before
  shipping. The probe command is the acceptance test by construction;
  the difference is that EXECUTE inherits responsibility for it.
- **Waiver eligibility** depends on `dow.meta.mode`. Standard and quick
  allow waivers with a populated `waiver_reason`. Deep mode forbids
  them; gate 3 fails the run.

## Step 5 — Validate the file before exit

Write `risk_map.yaml` with all three arrays populated. Then validate:

```js
import { readYaml, validateRiskMap } from '../../src/lib/ledger.mjs';
const map = readYaml('workspaces/<slug>/risk_map.yaml');
const r = validateRiskMap(map);
if (!r.valid) { /* surface the AJV path + message and halt */ }
```

A schema failure here means a required field is missing or an enum
value is misspelled. Fix the YAML; do not edit the schema.

After schema validation passes, walk `assumptions[]` one more time and
confirm gate 2: every entry with `severity` ∈ {high, critical} has
`status` ∈ {probed_ok, waived, verified}. Anything that still says
`unresolved` at this point is a phase failure — finish the probe
loop (SKILL step 4) before exit.
