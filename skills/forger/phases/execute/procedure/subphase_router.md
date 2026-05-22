# Subphase Router — code/system branch

Called from `procedure/branch_code.md` once before the per-criterion
loop. Reads DoW and risk_map. Chooses B1, B2, or B3. Emits one
telemetry field. Single decision; no loop.

---

## Inputs

- `workspaces/{slug}/dow.yaml` — `success_criteria_measurable[]` plus
  ordering hints (any `depends_on` field, any natural ordering in
  task descriptions).
- `workspaces/{slug}/risk_map.yaml` — entries with tags. Tags that
  signal walking-skeleton scope: `new_component`, `new_integration`,
  `no_prior_calibration`.
- `dow.meta.mode` — lite and quick disable B2 and B3.

## Decision

```
if dow.meta.mode in {"lite", "quick"}:
  → B1 direct TDD

if any risk_map entry has tag ∈ {new_component, new_integration, no_prior_calibration}:
  → B3 walking skeleton  (then B1 per component criterion)

if (dow.success_criteria_measurable.length >= 3
    OR any criterion has depends_on
    OR dow.assumptions has unresolved sequencing notes):
  → B2 spec-and-tasks  (then B1 per task)

else:
  → B1 direct TDD
```

## Output

Append two extra fields to the EXECUTE telemetry line:

```json
{
  "subphase_chosen": "B1|B2|B3",
  "router_reason": "<short canonical string>"
}
```

Router reasons (canonical strings):

- `single_criterion` — 1 measurable, no ordering, no new-tag risk.
- `lite_or_quick_mode_forced_B1` — lite/quick mode bypass.
- `multi_criterion_ordered` — 3+ criteria or `depends_on` present.
- `new_component_or_integration` — risk_map flagged new scope.
- `ref_load_failed` — referenced subphase ref could not load; default B1.

## Handoff

- **B1.** Continue into existing `branch_code.md` per-criterion loop
  using `refs/tdd_micro_cycle.md`. No new workspace files written.
- **B2.** Load `refs/spec_and_tasks.md`. Produce `spec.md`,
  `impl_plan.md`, `tasks.yaml`. Then loop B1 per task in topo order.
- **B3.** Load `refs/walking_skeleton.md`. Produce thinnest-slice
  integration test, build/deploy mechanics, and acceptance line.
  Then loop B1 per component.

## Non-negotiables

1. Router runs **once** per EXECUTE invocation. Never re-evaluated mid-loop.
2. Router does **not** edit `dow.yaml`.
3. Router does **not** spawn subagents. It is a procedure file only.
4. Failure to load a referenced ref (file missing, schema invalid)
   defaults to B1 with `router_reason: ref_load_failed`.
5. If `risk_map.yaml` is absent (e.g. lite mode or quick mode with no OBSERVE
   output), B3 is unavailable; the router considers B1 or B2 only.

## When NOT to use router

- `branch_research.md` and `branch_design.md` do not call this router.
  Their per-claim and per-surface flows handle ordering directly.
- Fact-gap re-entry path (`procedure/fact_gap_re_entry.md`) does not
  re-run the router; the original subphase choice persists across
  re-entry attempts.
