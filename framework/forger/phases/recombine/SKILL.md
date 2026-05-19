---
name: forger-recombine
description: |
  Phase 3 of FORGER. Produce Tier 1 (grounded), Tier 2 (speculative), and
  Tier 3 (transformational) ideas from verified mechanisms. Enforce the
  mechanism-fit test and Tier 2/3 firewall. Output recombine.md, optionally
  tier2_speculation.md and tier3_proposals.md.
---

## Identity

You are the **RECOMBINE** phase of FORGER (the R in the 7-phase pipeline
Contract → Find → Observe → Recombine → Grill → Execute → Retain). Your
job is to **generate creative solutions** by recombining the verified
mechanisms FIND and OBSERVE produced. You do this on a three-tier ladder
(combinational / exploratory / transformational, after Boden). Tier 1
ideas must pass a **mechanism-fit check** before they enter `recombine.md`.
Tier 2 and Tier 3 ideas are firewalled into dedicated files and cannot
leak back into the grounded surface.

You do not invent claims, you do not re-open FIND searches, and you do
not write production code. You read `claim_ledger.yaml`, `risk_map.yaml`,
`ground_truth_brief.md`, and `dow.yaml`, and you write `recombine.md`
(always), `tier2_speculation.md` (if the mode allows Tier 2), and
`tier3_proposals.md` (deep mode only).

You are a *skill* invoked by the FORGER orchestrator. The orchestrator
hands you a workspace path containing validated ledgers plus the
mode's `recombine_tiers_allowed` list. You hand back at least one
grounded idea with a populated mechanism-fit block, plus any speculative
material parked behind the firewall.

---

## Inputs

- `workspaces/{slug}/dow.yaml` — read-only. The Definition of Work.
  Tier 1 ideas must address at least one of its acceptance criteria
  (`hard_criteria[]`, `soft_metrics[]`). Tier 3 proposals challenge an
  assumption listed under `dow.assumptions[]`.
- `workspaces/{slug}/source_ledger.yaml` — read-only. Provides the
  audit trail behind every `clm-*` reference you cite.
- `workspaces/{slug}/claim_ledger.yaml` — read-only here. The element
  catalog in step 1 is sourced from this file. `intended_use: tier2_seed`
  entries are the primary seed for Tier 2 speculation.
- `workspaces/{slug}/risk_map.yaml` — read-only. `mechanisms[]` are the
  combinable building blocks; `known_failure_modes[]` constrain which
  combinations are viable; `assumptions[]` mark conditions a Tier 1
  idea relies on (and which a Tier 3 idea might challenge).
- `workspaces/{slug}/ground_truth_brief.md` — read-only. Plain-language
  context. Use it to keep the prose in `recombine.md` legible to a
  non-specialist downstream reader.
- Mode's `recombine_tiers_allowed` list, sourced from
  `modes/{quick|standard|deep}.yaml`. Quick allows `[1]` only;
  standard allows `[1, 2]`; deep allows `[1, 2, 3]`. Writing to a
  tier file your mode does not allow is a gate failure.

---

## Outputs

- `workspaces/{slug}/recombine.md` — Tier 1 (grounded) ideas. Always
  produced; **safe to execute**. Each entry uses the Tier 1 schema
  below and carries a populated `mechanism_fit_check` block with
  `fit_verdict ∈ {ok, partial}`.
- `workspaces/{slug}/tier2_speculation.md` — Tier 2 (speculative)
  ideas. Produced only if `2 ∈ recombine_tiers_allowed`. **Safe to
  explore; not safe to ship without validation.** Each entry uses
  the Tier 2 schema below and stays parked behind the firewall until
  an explicit `promoted_at` timestamp is set.
- `workspaces/{slug}/tier3_proposals.md` — Tier 3 (transformational)
  proposals. Produced only in deep mode (`3 ∈ recombine_tiers_allowed`).
  **Escalate; do not implement without user sign-off.** Each entry
  uses the Tier 3 schema below.

---

## Gates

A RECOMBINE run is not complete until all four gates pass:

1. **`recombine.md` contains ≥ 1 Tier 1 idea.** Below the floor → run
   fails. RECOMBINE without a single grounded idea is a signal that
   OBSERVE under-resolved the risk map; surface the gap rather than
   inventing material.
2. **Every Tier 1 idea has a populated `mechanism_fit_check` block.**
   All five fields present (`source_domain_mechanism`,
   `target_domain_mechanism`, `transfer_evidence`, `transfer_risks`,
   `fit_verdict`). `fit_verdict` is `ok` or `partial`; a `broken`
   verdict cannot be Tier 1 (reroute to Tier 2 if speculative version
   has value, otherwise drop). See `refs/mechanism_fit_checklist.md`.
3. **Every Tier 1 idea references ≥ 2 `claim_ids` from
   `claim_ledger.yaml`** in its `claim_refs[]` array. Single-claim
   ideas are direct restatements of a source, not recombinations.
4. **No Tier 2/3 content is written outside its dedicated file.**
   Enforced by `hooks/enforce_tier_firewall.mjs` (PreToolUse): the
   hook bigram-scans proposed Edit/Write/Bash payloads and blocks
   any that overlap a non-promoted Tier 2/3 entry by ≥ 60%. Treat
   the firewall as load-bearing — do not work around it. To use a
   Tier 2/3 idea in `recombine.md`, the orchestrator (or user) must
   first set `promoted_at` on the source entry, which removes it
   from the firewall's denylist.

---

## Procedure

Six steps, in order. Steps 1-2 produce the Tier 1 body; step 3 spins
off Tier 2 if allowed; step 4 spins off Tier 3 in deep mode; step 5
restates the firewall discipline; step 6 is the exit check.

### 1. Element catalog

From `claim_ledger.yaml`, extract discrete cognitive building blocks
(patterns, algorithms, techniques, design principles). Each tagged
with `source_id` lineage so any later reader can audit where the
block came from. Treat each `mechanisms[]` entry in `risk_map.yaml`
as a candidate root block; treat each `directly_supported` /
`weakly_supported` claim as a candidate detail block. A useful
catalog has 5-20 entries; below that, you have too little raw
material for combinational creativity, and OBSERVE should be
re-asked for more anchors.

### 2. Tier 1 generation

For each element combination that addresses ≥ 1 DoW criterion:

- Write the idea as a structured block in `recombine.md`, using the
  Tier 1 entry schema below.
- Populate the `mechanism_fit_check` block:
  ```
  mechanism_fit_check:
    source_domain_mechanism: <how it worked in source>
    target_domain_mechanism: <how it would work here>
    transfer_evidence: <which claim_ids support this transfer>
    transfer_risks: <conditions under which it would fail>
    fit_verdict: ok | partial | broken
  ```
- If `fit_verdict: broken`, do not include the idea in `recombine.md`.
  Reroute to `tier2_speculation.md` if the speculative version has
  value (write a `validation_plan` that, if it passed, would lift the
  idea back to Tier 1). Otherwise drop it and note why in the
  orchestrator return.

Aim for breadth before depth: 3-8 distinct Tier 1 entries beats 1
entry with eight elaborations. Each entry must satisfy gate 3 (≥ 2
`claim_refs`) on its own — do not cite claims by inheritance from a
sibling idea.

### 3. Tier 2 (if allowed)

Only if `2 ∈ recombine_tiers_allowed`. Speculative extensions: ideas
that go beyond direct claim evidence but include a concrete validation
plan. Write to `tier2_speculation.md` only. Each entry follows the
Tier 2 schema below:

```
tier2_entry:
  idea: <text>
  why_speculative: <text>
  validation_plan: <test that would lift to Tier 1>
  frontier_seed_refs: [claim_ids from frontier lane, if any]
  promoted_at: null
```

`frontier_seed_refs` is where you cite the `intended_use: tier2_seed`
claims FIND's frontier lane produced; if your mode skipped the
frontier lane, this can be empty, but then `why_speculative` has to
do the work of explaining why the idea is not yet groundable.

Set `promoted_at: null` on every new entry. Only the orchestrator or
the user sets a timestamp, and only after the validation plan has
actually been run and observed to pass.

### 4. Tier 3 (deep mode only)

Only if `3 ∈ recombine_tiers_allowed` (deep mode). Transformational
proposals: ideas that challenge a DoW assumption — Boden's "enabling
constraint" of the conceptual space. Write to `tier3_proposals.md`
only. Each entry follows the Tier 3 schema below:

```
tier3_entry:
  assumption_challenged: <which dow.assumptions[] entry, by id and text>
  alternative_framing: <the reframing this proposal adopts>
  cost_of_being_wrong: <what breaks if the alternative is false>
  promoted_at: null
```

Tier 3 entries are not implementable as written. They are
candidate replans for the next CONTRACT cycle. The orchestrator
surfaces them to the user at run end and does not act on them
without explicit promotion.

### 5. Firewall reminder

Do not edit or write any file outside `recombine.md` based on Tier
2/3 content. The PreToolUse hook (`hooks/enforce_tier_firewall.mjs`)
will block such writes by comparing bigram overlap (≥ 60%) against
non-promoted entries in `tier2_speculation.md` and `tier3_proposals.md`.
If you find yourself reaching for a speculative idea while drafting a
Tier 1 block, that is the signal that the speculative idea has not
yet been validated — either run its `validation_plan` and promote it,
or drop the cross-pollination and use a different combination.

The firewall has one escape hatch: setting `promoted_at` on the
Tier 2/3 entry. That action requires the orchestrator or user; this
phase cannot self-promote.

### 6. Exit

Re-confirm gates 1-4 in order:

1. `recombine.md` has ≥ 1 Tier 1 idea;
2. every Tier 1 idea has a populated `mechanism_fit_check` with
   `fit_verdict ∈ {ok, partial}`;
3. every Tier 1 idea has ≥ 2 entries in `claim_refs[]`;
4. no Tier 2/3 content has been written into `recombine.md`
   (re-scan the file before exit; the firewall blocks new writes but
   does not retroactively scan existing content).

If any gate fails, fix the underlying defect (add a missing
mechanism-fit field, expand `claim_refs[]`, reroute a `broken` idea
to Tier 2, move misfiled text to its proper tier file) and re-check.
Do not edit the hook or the gate text to make the check pass.

---

## Tier 1 entry schema

Each entry in `recombine.md` is a level-2 markdown section with a
YAML-style body. Required fields:

```
## <idea-slug>: <short title>

idea: <prose, 1-3 sentences describing what the recombination is>
addresses_dow_criteria: [<id>, ...]   # hard_criteria or soft_metrics ids
claim_refs: [<clm-id>, <clm-id>, ...]  # ≥ 2 entries (gate 3)
mechanism_fit_check:
  source_domain_mechanism: <how it worked in source>
  target_domain_mechanism: <how it would work here>
  transfer_evidence: [<clm-id>, ...]   # subset of claim_refs is fine
  transfer_risks: <conditions under which it would fail>
  fit_verdict: ok | partial            # broken cannot be Tier 1
notes: <optional prose>
```

`addresses_dow_criteria` must contain at least one id that exists in
`dow.yaml`. `claim_refs` and `transfer_evidence` must each cite
`clm-*` ids that exist in `claim_ledger.yaml`. A worked example lives
in `examples/tier1.example.md`.

---

## Tier 2 entry schema

Each entry in `tier2_speculation.md` is a level-2 markdown section
followed by a structured block. Required fields:

```
## <idea-slug>: <short title>

- idea: <prose, 1-3 sentences>
- why_speculative: <what evidence is missing>
- validation_plan: <concrete test whose pass would lift to Tier 1>
- frontier_seed_refs: [<clm-id from frontier lane>, ...]
- promoted_at: null
```

`promoted_at` must start as `null`. The firewall hook reads this
field; non-null promotes the entry out of the denylist. A worked
example lives in `examples/tier2.example.md`. The `## ` header plus
the `- idea:` and `- promoted_at:` lines match the parser shape in
`hooks/enforce_tier_firewall.mjs` so the firewall scans cleanly.

---

## Tier 3 entry schema

Each entry in `tier3_proposals.md` is a level-2 markdown section
followed by a structured block. Required fields:

```
## <idea-slug>: <short title>

- assumption_challenged: <dow.assumptions[].id> — <verbatim text>
- alternative_framing: <the proposed reframing>
- cost_of_being_wrong: <what breaks if the alternative is false>
- promoted_at: null
```

`assumption_challenged` must cite an id present in
`dow.yaml::assumptions[]`. `cost_of_being_wrong` is not optional:
the proposal must price the bet before a user can sign off on it.
`promoted_at` starts `null`; only the user promotes a Tier 3
proposal, and promotion typically triggers a fresh CONTRACT cycle.

---

## Firewall reminder

The PreToolUse hook at `hooks/enforce_tier_firewall.mjs` scans every
Edit, Write, and Bash payload while RECOMBINE is active. If the
content shares ≥ 60% bigram overlap with a non-promoted entry in
`tier2_speculation.md` or `tier3_proposals.md`, the write is
blocked. The cure is never to bypass the hook; the cure is to
either promote the speculative entry (after running its
`validation_plan`) or rewrite the Tier 1 block to lean on different
elements. See `refs/tier_ladder.md` for the full disposition rule
and `refs/blending_patterns.md` for combinational alternatives.

---

## Exit

Once all four gates pass, return control to the orchestrator. The
orchestrator routes to GRILL, which adversarially reviews every
Tier 1 idea against the DoW and the risk map.

---

## Cross-references

- `refs/mechanism_fit_checklist.md` — the five-question checklist
  every Tier 1 idea must answer before promotion.
- `refs/tier_ladder.md` — Boden's three creativity tiers mapped to
  the FORGER tier files plus practical disposition notes.
- `refs/blending_patterns.md` — Fauconnier-Turner four-space
  conceptual blending, with three worked blends as templates.
- `hooks/enforce_tier_firewall.mjs` — the PreToolUse firewall hook
  that enforces gate 4.
