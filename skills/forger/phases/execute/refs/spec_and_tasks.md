# Subphase B2 — Spec and Tasks

Used when the DoW has 3+ measurable criteria, explicit dependencies,
or unresolved sequencing notes. Decomposes the existing DoW into a
sequenced task ledger before entering the TDD loop. Does **not**
re-author intent. Does **not** edit `dow.yaml`.

Sources: GitHub Spec Kit (`specify → plan → tasks` flow), AWS Kiro
(stories + design + tasks), BMAD (each story embeds PRD slice plus
architecture plus data contracts plus acceptance tests).

---

## Three artifacts produced (in order)

### 1. `workspaces/{slug}/spec.md` — sequenced view of DoW (≤120 lines)

Numbered restatement of DoW criteria with explicit ordering and
inter-criterion dependencies. Pulls in `recombine.md` Tier 1 ideas
as the chosen implementation approach. Not new intent — a sequenced
view of the existing DoW.

Shape:

```markdown
Parent: dow.yaml

# Spec — {task slug}

## Ordered criteria

1. meas-1 — {description from DoW}
   depends_on: none
   approach: {ref recombine.md idea-id}

2. meas-2 — {description}
   depends_on: meas-1
   approach: {ref recombine.md idea-id}

...

## Hard constraints (all must hold)

- hc-1: {description}
- hc-2: {description}

## Out of scope (from reframe_memo)

- {each alternative framing CONTRACT rejected}
```

### 2. `workspaces/{slug}/impl_plan.md` — design choices (≤150 lines)

Per-criterion technical decisions. Cites `recombine.md` and
`risk_map.yaml`. No new claims — only design choices that satisfy
existing grounded claims.

Shape:

```markdown
Parent: spec.md

# Implementation plan

## meas-1

- Files touched: {paths}
- Function signatures: {list}
- Data schemas: {inline or schema ref}
- Library choices: {name + version; cite source_ledger if external}
- Risk mitigations: {ref risk_map entries}

## meas-2
... (same shape)

## Open questions

If a question cannot be answered from existing artifacts, do not
guess. Trigger fact-gap re-entry per `procedure/fact_gap_re_entry.md`.
```

### 3. `workspaces/{slug}/tasks.yaml` — sequenced task ledger

Each task carries enough state for B1 to RED it.

Schema (informal, can harden later):

```yaml
- id: task-1
  criterion_ids: [meas-1]
  files_touched: [src/foo.js]
  depends_on: []
  verification_command: npm run test -- --grep meas-1
  done_when: acceptance_results.jsonl has passed:true for meas-1
  red_assertion: "{one-line description of failing test}"

- id: task-2
  criterion_ids: [meas-2]
  files_touched: [src/foo.js, src/bar.js]
  depends_on: [task-1]
  verification_command: npm run test -- --grep meas-2
  done_when: acceptance_results.jsonl has passed:true for meas-2
  red_assertion: "..."
```

---

## Gates (B2-specific, before entering B1 loop)

| # | Gate | Mechanism |
|---|------|-----------|
| 1 | `spec.md` exists, ≤120 lines | manual line count |
| 2 | Every `spec.md` criterion has `approach` referencing recombine.md | manual grep |
| 3 | `impl_plan.md` exists, ≤150 lines, has section per criterion | manual |
| 4 | `tasks.yaml` parses as YAML and lists ≥1 task | yaml parse |
| 5 | Every task `criterion_ids[]` entry exists in DoW | cross-check |
| 6 | `depends_on` graph has no cycles | DAG check |

If any gate fails, repair the artifact before entering the B1 loop.

## Handoff to B1

For each task in `tasks.yaml` topological order:

1. Set the current task as the "criterion of interest" for the TDD loop.
2. Enter `refs/tdd_micro_cycle.md` cycle with the task `done_when` as
   the exit condition.
3. On task green, commit (existing TDD step 6) and proceed to next task.
4. On task red after retry exhaustion, escalate per
   `refs/escalation_protocol.md`.

## Anti-patterns

- Re-authoring `dow.yaml` content as new intent in `spec.md`.
- Writing tasks that cross multiple criteria without `depends_on` linkage.
- Adding new library choices in `impl_plan.md` without entries in
  `source_ledger.yaml` (trigger fact-gap re-entry instead).
- Skipping `impl_plan.md` because "the code is obvious" — if obvious,
  the router should have picked B1, not B2.

## When NOT to use B2

- Single criterion or two criteria with no dependency (B1 is faster).
- Bugfix with a known failing test (B1).
- New component or integration (B3 first, then B1; B2 may follow B3
  for the inside-out task list).
