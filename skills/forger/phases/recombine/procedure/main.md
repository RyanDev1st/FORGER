# RECOMBINE — main procedure (Tier 1 always)

Steps for the always-on Tier 1 path. Tier 2 (standard/deep) and Tier 3
(deep only) live in `procedure/tier2.md` and `procedure/tier3.md` and
load only on mode trigger.

Read `SKILL.md` first (router, gates, self-audit, Tier 1 schema,
firewall reminder).

---

## 1. Element catalog

From `claim_ledger.yaml`, extract discrete cognitive building blocks
(patterns, algorithms, techniques, design principles). Each tagged
with `source_id` lineage so any later reader can audit where the block
came from. Treat each `mechanisms[]` entry in `risk_map.yaml` as a
candidate root block; treat each `directly_supported` /
`weakly_supported` claim as a candidate detail block.

A useful catalog has 5-20 entries. Below that, you have too little raw
material for combinational creativity, and OBSERVE should be re-asked
for more anchors (escalate rather than fabricate).

## 2. Tier 1 generation

For each element combination that addresses ≥1 DoW criterion, write a
structured block in `recombine.md` using the Tier 1 schema from
`SKILL.md`. Populate the `mechanism_fit_check` block:

```
mechanism_fit_check:
  source_domain_mechanism: <how it worked in source>
  target_domain_mechanism: <how it would work here>
  transfer_evidence: <which claim_ids support this transfer>
  transfer_risks: <conditions under which it would fail>
  fit_verdict: ok | partial | broken
```

If `fit_verdict: broken`, do not include the idea in `recombine.md`.
Reroute to `tier2_speculation.md` if the speculative version has value
(write a `validation_plan` that, if it passed, would lift the idea back
to Tier 1). Otherwise drop and note why in the orchestrator return.

Aim for breadth before depth: 3-8 distinct Tier 1 entries beats 1
entry with eight elaborations. Each entry must satisfy gate 3 (≥2
`claim_refs`) on its own — do not cite claims by inheritance from a
sibling idea.

## 3. Tier 2 (mode-conditional)

If `2 ∈ recombine_tiers_allowed` (standard or deep): stop following
this file and load `procedure/tier2.md`. Return here after Tier 2 is
written.

In quick mode, skip — quick allows Tier 1 only.

## 4. Tier 3 (deep-conditional)

If `3 ∈ recombine_tiers_allowed` (deep only): stop following this file
and load `procedure/tier3.md`. Return here after Tier 3 is written.

In quick/standard mode, skip.

## 5. Firewall discipline

Do not edit or write any file outside `recombine.md` based on Tier 2/3
content. The PreToolUse hook (`src/hooks/enforce_tier_firewall.mjs`)
blocks writes with ≥60% bigram overlap to non-promoted Tier 2/3
entries. If you find yourself reaching for a speculative idea while
drafting a Tier 1 block, that is the signal that the speculative idea
has not yet been validated — either run its `validation_plan` and
promote it (orchestrator/user action), or drop the cross-pollination
and use a different combination.

## 6. Exit + telemetry

Re-confirm gates 1-4 from `SKILL.md`:

1. `recombine.md` has ≥1 Tier 1 idea;
2. every Tier 1 idea has populated `mechanism_fit_check` with verdict
   `ok` or `partial`;
3. every Tier 1 idea has ≥2 entries in `claim_refs[]`;
4. no Tier 2/3 content is in `recombine.md` (re-scan before exit; the
   firewall blocks new writes but does not retroactively scan existing
   content).

If any gate fails, fix the underlying defect (add a missing
mechanism-fit field, expand `claim_refs[]`, reroute a `broken` idea to
Tier 2, move misfiled text to its proper tier file) and re-check. Do
not edit the hook or the gate text to make the check pass.

Walk the self-audit checklist from `SKILL.md` and append a telemetry
line to `workspaces/{slug}/telemetry.jsonl`:

```json
{
  "phase": "recombine",
  "mode": "<mode>",
  "tier1_count": "<N>",
  "tier2_count": "<N|null>",
  "tier3_count": "<N|null>",
  "self_audit": {
    "tier1_floor_met": true,
    "mechanism_fit_complete": true,
    "claim_refs_minimum_met": true,
    "tier_firewall_clean": true,
    "tier2_written_if_allowed": null,
    "tier3_written_if_deep": null,
    "telemetry_appended": true
  },
  "ts": "<ISO8601>"
}
```

Use `null` for tier2/tier3 checklist items in modes where the tier is
not allowed. Use `false` for any failed checklist item — do not
silently omit. Return control to the orchestrator. The orchestrator
routes to GRILL.
