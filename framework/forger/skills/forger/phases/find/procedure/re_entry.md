# FIND — re-entry mode

**Load only when triggered.** Triggers when the orchestrator calls FIND
with a workspace that contains `dow_addendum_{n}.yaml` (the file EXECUTE
writes when a probe surfaces a fact gap). Do not load this procedure on a
cold run.

Re-entry is intentionally narrow: one lane, a small target, no pivot to
adjacent topics, no frontier exploration. The goal is to close the gap
EXECUTE surfaced, not to re-do the original grounding.

---

## Inputs (re-entry-specific)

- `workspaces/{slug}/dow_addendum_{n}.yaml` — read this **instead of**
  `dow.yaml`. The addendum carries only the new criteria EXECUTE
  surfaced. The DoW itself is immutable inside a run.
- `workspaces/{slug}/source_ledger.yaml`, `workspaces/{slug}/claim_ledger.yaml`
  — append-only. Do not rewrite existing entries.

## Procedure

### R1. Read the addendum

Load `workspaces/{slug}/dow_addendum_{n}.yaml`. The addendum is a
mini-DoW carrying only the new `hard_constraints[]`,
`success_criteria_measurable[]`, or `unacceptable_failure_modes[]` that
need grounding. Verify it AJV-validates against the same DoW schema
(`src/lib/ledger.mjs::validateDoW`).

### R2. Spawn the production lane only

Spawn **one** lane subagent: production. No community, no edge. The lane
brief contains only the addendum's criteria (do not re-feed the full
original DoW). The lane mandate (`lanes/production.md`) is unchanged from
cold-run usage; pass the addendum path in place of the DoW path.

Mode override for this spawn: `target=3`, `ceiling=5`. Floor stays at 5 —
unless the lane writes `under_sourced: true` after a pivot attempt, in
which case treat the result as partial-coverage and continue.

### R3. Skip the KB shortcut check

Re-entry is by definition a gap in what was previously grounded; the
shortcut is not eligible here. Do not load `procedure/kb_shortcut.md`.

### R4. Append, do not overwrite

Append new entries to the existing `source_ledger.yaml` and
`claim_ledger.yaml`. Every new entry must carry `re_entry: {n}` where
`{n}` matches the addendum's filename suffix. This field is on both
schemas. Do not modify or delete entries written by the cold run or by
earlier re-entries.

### R5. Audit and tag

Run `src/gates/audit.mjs --workspace <path>` exactly as in the cold-run
step 8. The audit covers the full ledger files, not just the new
entries — which is intentional, since a re-entry may surface a stale URL
in an earlier entry.

Apply the same blocked-claim tagging (cold-run step 9) to any new
`severity: critical` claim whose entailment is weaker than
`directly_supported`.

### R6. Update `find_summary.md`

Append a new section to the existing `find_summary.md`:

```
## Re-entry {n}

- **Addendum criteria:** [ids]
- **Claims added:** [ids]
- **Audit flags:** [counts since last entry]
- **Blocked-critical claims surfaced:** [ids]
```

Do not rewrite the original `find_summary.md` content; append only.

### R7. Exit

Append a telemetry line to `workspaces/{slug}/telemetry.jsonl`:

  `{phase: 'find', mode: <mode>, re_entry: <n>, lanes_ran: ['production'],
    claims_added: <N>, blocked_critical_added: <N>, audit_passed: <bool>,
    ts: <ISO8601>}`

Walk the self-audit checklist from `SKILL.md`. The re-entry-specific item
(item 6) is the load-bearing one: every new entry must carry the
`re_entry: {n}` tag.

Return control to the orchestrator. The orchestrator re-invokes EXECUTE,
which retries the loop with the augmented ledgers.
