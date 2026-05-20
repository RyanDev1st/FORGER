# RETAIN — main procedure

Eight steps, in order. Steps 1-6 compute the retro fields; step 7
invokes the KB writer tool; step 8 is the exit.

Read `SKILL.md` first (router, gates, self-audit checklist, output
shape).

---

## 1. Compute task identity fields

- `task_id` = `slug-date` (matches the workspace directory name).
- `domain_slug` = `dow.meta.domain_slug`.
- `completed_at` = current ISO8601 timestamp.
- `mode_used` = `dow.meta.mode`.
- `status` = the orchestrator-supplied status (`shipped` /
  `escalated` / `abandoned`).
- `token_used` = sum of `tokens` field across every line in
  `telemetry.jsonl`.
- `duration_ms` = time from first telemetry line `ts` to current
  timestamp.

## 2. Collect `proven_claim_ids`

Walk `claim_ledger.yaml`. A claim qualifies as proven if:

- `status` is `verified` or `probed_ok`, **AND**
- it is referenced (by `claim_id`) from a passing line in
  `acceptance_results.jsonl` (the latest line per `criterion_id` has
  `passed: true`).

Both conditions are necessary. A verified claim that no acceptance
criterion exercised is not "proven by this task" — it is just
verified. The KB write rule lives in `refs/kb_write_rules.md`.

## 3. Collect `failed_assumptions`

Walk `risk_map.yaml::assumptions[]`. Include every entry with
`status: probed_fail`. Then walk `dow.assumptions[]` — include any
that turned out invalid (CONTRACT's autonomous-mode entries that
later got refuted by a probe).

Format each entry:

```
- assumption_id: <id from risk_map or dow>
  description: <verbatim>
  refuted_by: [<probe_id>, ...]   # the probe(s) that disproved it
  consequence_observed: <prose>   # what happened in EXECUTE because of this
```

Failed assumptions become the next task's `failure_memory.yaml`
seed; they help future CONTRACT runs avoid the same mistakes.

## 4. Identify `working_architecture_ref` (if applicable)

If the task produced an architecture document (e.g.
`workspaces/{slug}/architecture.md`, or a top-level diagram, or a
module-layout doc), set `working_architecture_ref` to its
workspace-relative path. The KB writer copies the body into
`knowledge/{domain}/working_architectures.md` keyed by
`completed_at`.

If no architecture doc exists, set `working_architecture_ref: null`.
Do not invent one; the KB grows by accumulation, not by fabrication.

## 5. Set `ttl_overrides` (if any)

Default TTL for proven claims is 90 days. Override per-claim when:

- the source is a fast-moving library or product (suggested TTL: 30d);
- the source is an algorithmic constant / mathematical result
  (suggested TTL: 365d);
- the source is internal docs you control (suggested TTL: 180d).

Format:

```
ttl_overrides:
  - claim_id: clm-1234
    ttl_days: 30
    reason: "library X cuts a breaking release roughly every 6 weeks"
```

Full table of suggested overrides in `refs/ttl_defaults.md`.

## 6. Write `retro_note.yaml`

Combine the fields from steps 1-5 plus `shortcut_eligible` (left at
its current value; the KB writer computes the next value based on
the last-3-status rule):

```yaml
task_id: <slug-date>
domain_slug: <slug>
completed_at: <ISO8601>
mode_used: <quick|standard|deep>
status: <shipped|escalated|abandoned>
token_used: <N>
duration_ms: <N>
proven_claim_ids: [<clm-id>, ...]
failed_assumptions: [...]
working_architecture_ref: <path|null>
ttl_overrides: [...]
shortcut_eligible: <current_value>   # KB writer updates
```

Validate via `src/lib/ledger.mjs::validateRetroNote`. If validation
fails, fix the field that's wrong — do not patch the schema.

## 7. Invoke `src/cli/update_kb.mjs`

```
node src/cli/update_kb.mjs --workspace <path>
```

The tool:

- merges proven claims into `knowledge/{domain}/claim_ledger.yaml`
  with `expires_at` stamp;
- merges underlying sources into `knowledge/{domain}/source_ledger.yaml`;
- appends failed assumptions to `knowledge/{domain}/failure_memory.yaml`;
- updates `working_architectures.md` if `working_architecture_ref`
  is set;
- increments `knowledge/{domain}/index.yaml.tasks_*` counter for the
  status (`tasks_shipped`, `tasks_escalated`, `tasks_abandoned`);
- checks last 3 task statuses on the domain: if all `shipped`, sets
  `index.yaml.shortcut_eligible: true`; if any non-shipped in the
  last 3, sets `false` (symmetric reset);
- appends one line to `knowledge/{domain}/telemetry.jsonl`.

Capture the tool's exit code. Exit 0 = success. Non-zero = a write
failed and the KB may be partial. Diagnose (most often a missing
source row referenced by a proven claim, or an unreadable
architecture ref) and resolve before re-running.

## 8. Exit + telemetry

Walk the self-audit checklist from `SKILL.md`. Append a telemetry
line to `workspaces/{slug}/telemetry.jsonl`:

```json
{
  "phase": "retain",
  "mode": "<mode>",
  "status": "<shipped|escalated|abandoned>",
  "proven_claims_promoted": "<N>",
  "failed_assumptions_recorded": "<N>",
  "shortcut_eligible_after": "<bool>",
  "self_audit": {
    "retro_validated": true,
    "update_kb_exit_zero": true,
    "proven_claims_complete": true,
    "failed_assumptions_complete": true,
    "architecture_ref_set_or_null": true,
    "telemetry_appended": true
  },
  "ts": "<ISO8601>"
}
```

Use `false` for any failed checklist item — do not silently omit.

Return control to the orchestrator. The orchestrator considers the
task terminal as soon as `update_kb.mjs` exits 0 and the retro
validates. The next task in the same domain reads the freshly
updated `knowledge/{domain_slug}/index.yaml` during its CONTRACT
phase and may benefit from `shortcut_eligible: true` if this RETAIN
flipped the flag.
