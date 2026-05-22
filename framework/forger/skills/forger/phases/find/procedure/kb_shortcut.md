# FIND — KB shortcut path

**Load only when triggered.** Triggers when, after step 1 of `main.md`,
`knowledge/{dow.meta.domain_slug}/index.yaml` exists with
`shortcut_eligible: true`. If that file does not exist or the flag is
false, do not load this procedure — fall through to step 3 of `main.md`.

The KB shortcut serves a fresh DoW from cached, audited ledgers when the
domain has been shipped to recently enough that re-grounding would be
wasted effort.

---

## Procedure

### S1. Load cached ledgers

Load the cached `source_ledger.yaml` and `claim_ledger.yaml` from
`knowledge/{domain_slug}/`.

### S2. Prune expired entries

Prune entries where `expires_at < now` using
`src/lib/kb.mjs::pruneExpired`. Both ledgers are pruned in place in your
working copy (do not write back to the KB directory — that is RETAIN's
job).

### S3. Compute coverage

Compute coverage: the fraction of `dow.hard_constraints[].id` +
`dow.success_criteria_measurable[].id` +
`dow.unacceptable_failure_modes[].id` referenced by at least one
non-expired claim. Use `src/lib/kb.mjs::computeCoverage`.

### S4. Decide: serve or fall through

- **If coverage ≥ 0.80:** copy the cached entries into the workspace
  ledgers, tag each with `re_entry: 0`, mark the run as `kb-served` in
  `find_summary.md`. **Skip steps 3-7 of `main.md`.** Jump directly to
  step 8 (`src/gates/audit.mjs`) and step 10 (write `find_summary.md`).
  Step 11 (exit + telemetry) closes the run as usual; include
  `kb_served: true` in the telemetry payload.
- **If coverage < 0.80:** fall through to step 3 of `main.md`. The cached
  ledgers do not seed the workspace ledgers in this case — the lanes
  produce fresh entries from scratch. (Reuse-with-augmentation is a v0.2
  candidate; v0.1 keeps the boundary clean.)

---

## Why 0.80

Below 0.80, the gap between what the cache covers and what the DoW asks
for is wide enough that piecemeal fan-out (one or two lanes covering only
the gap) under-performs a clean cold run for almost every observed task.
Above 0.80, the audit gate catches stale citations cheaply and the
recombine surface is functionally complete. The threshold is conservative
on purpose; revise only with evidence from ≥10 real runs.

## Stop conditions specific to this path

If the cached ledgers do not AJV-validate (the schemas may have evolved
since they were written), do not serve. Fall through to step 3 of
`main.md`. The KB merge in RETAIN is the right place to upgrade stale
schemas; FIND will not silently rewrite them.
