# Architecture

The technical reference. Plugin filesystem, schemas, hook contracts, audit internals, KB structure.

For the high-level tour, read [How FORGER works](02-how-it-works.md) first.

---

## Plugin filesystem

```
~/.claude/plugins/cache/forger-local-marketplace/forger/0.1.0/
├── .claude-plugin/                  # CC standard plugin layout
│   ├── plugin.json
│   └── marketplace.json
├── SKILL.md                         # Progressive disclosure entry point
├── manifest.json                    # Plugin metadata, hook registration
│
├── agents/                          # Subagent definitions (lane agents, reviewer)
│   ├── forger-lane-production.md
│   ├── forger-lane-community.md
│   ├── forger-lane-edge.md
│   └── forger-reviewer.md
│
├── skills/                          # Per-phase skills
│   ├── forger-contract/SKILL.md
│   ├── forger-find/SKILL.md
│   ├── forger-observe/SKILL.md
│   ├── forger-recombine/SKILL.md
│   ├── forger-grill/SKILL.md
│   ├── forger-execute/SKILL.md
│   └── forger-retain/SKILL.md
│
├── modes/                           # Mode configurations
│   ├── quick.yaml
│   ├── standard.yaml
│   └── deep.yaml
│
├── src/                             # Implementation
│   ├── orchestrator.mjs             # Phase routing
│   ├── lib/
│   │   ├── reviewer_router.mjs      # Cross-family review dispatch
│   │   ├── ledger.mjs               # Source/claim ledger I/O
│   │   ├── kb.mjs                   # Knowledge base operations
│   │   └── telemetry.mjs            # Token accounting + budget gates
│   ├── adapters/
│   │   ├── anthropic.mjs            # Cross-account Anthropic
│   │   ├── openai.mjs               # OpenAI reviewer adapter
│   │   └── gemini.mjs               # Gemini reviewer adapter
│   ├── hooks/                       # Deterministic scripts
│   │   ├── filter.sh
│   │   ├── probe.sh
│   │   ├── audit.sh
│   │   ├── acceptance_test.sh
│   │   ├── post_code.sh
│   │   └── update_kb.sh
│   └── cli/
│       ├── run.mjs
│       ├── doctor.mjs
│       └── resume.mjs
│
└── templates/                       # Output schemas (JSON Schema + YAML)
    ├── definition_of_works.schema.json
    ├── source_ledger_entry.schema.json
    ├── claim_ledger_entry.schema.json
    ├── failure_hypothesis.schema.json
    ├── risk_map.schema.json
    ├── retro_note.schema.json
    └── ...
```

### Workspace-level layout

Created by `forger init` inside the user's project:

```
my-project/
└── .forger/
    ├── config.yaml
    ├── workspaces/<workspace-slug>/        # per-task
    └── knowledge/<domain-slug>/            # shared across tasks
```

See [Usage doc](05-usage.md) for the per-workspace file inventory.

---

## Schemas

Every output file has a JSON Schema in `templates/`. The schema gate runs before any LLM judgment proceeds.

### Definition of Works

```yaml
# templates/definition_of_works.schema.yaml (abridged)
type: object
required: [artifact, audience, hard_constraints, success_criteria, unacceptable_failure_modes, work_mode]
properties:
  artifact:
    type: object
    required: [type, description]
    properties:
      type: { enum: [code, report, design, mixed] }
      description: { type: string, minLength: 20 }

  hard_constraints:
    type: array
    minItems: 1
    items:
      required: [id, rule, verification]
      properties:
        id: { pattern: "^c\\d+$" }
        rule: { type: string }
        verification: { type: string, minLength: 10 }

  success_criteria:
    type: array
    minItems: 1
    items:
      required: [id, metric, threshold, test_method]
      properties:
        id: { pattern: "^s\\d+$" }
        metric: { type: string }
        threshold: { type: string }
        test_method: { type: string }

  unacceptable_failure_modes:
    type: array
    minItems: 1
    items:
      required: [id, rule]
      properties:
        id: { pattern: "^u\\d+$" }

  work_mode: { enum: [quick, standard, deep] }

  reframe:
    required: [alternative, status]
    properties:
      alternative: { type: string }
      status: { enum: [adopted, rejected] }
      reason: { type: string }
```

### Source ledger entry

```yaml
# templates/source_ledger_entry.schema.yaml
type: object
required: [id, lane, url, domain, fetched_at, authority, recency, reproducibility, independence, conflict_of_interest, relevance]
properties:
  id: { pattern: "^src-\\d+$" }
  lane: { enum: [production, community, edge] }
  url: { format: uri }
  domain: { type: string }
  fetched_at: { format: date-time }
  authority: { enum: [low, medium, high] }
  recency: { type: string }          # ISO date or "before-cutoff"
  reproducibility: { enum: [verified, claims_only, none] }
  independence: { enum: [original, derivative] }
  conflict_of_interest: { enum: [low, medium, high] }
  relevance:
    enum: [implementation_blueprint, benchmark_comparison, critical_gotcha, mechanism_explainer, background]
```

### Claim ledger entry

```yaml
# templates/claim_ledger_entry.schema.yaml
type: object
required: [id, source_id, quote, severity_for_dow, entailment]
properties:
  id: { pattern: "^cl-\\d+$" }
  source_id: { pattern: "^src-\\d+$" }
  quote:
    type: string
    minLength: 5
    maxLength: 250                   # forces verbatim, not paraphrase
  severity_for_dow: { enum: [trivial, low, medium, high, critical] }
  entailment: { enum: [directly_supported, weakly_supported, extrapolated, contradicted, unverified, speculative] }
  affects:                            # DoW ids this claim influences
    type: array
    items: { pattern: "^[cs]u?\\d+$" }
  notes: { type: string }
```

The audit hook enforces a rule that the schema cannot: critical claims with entailment `weakly_supported` or worse are blocked from EXECUTE.

### Failure hypothesis

```yaml
# templates/failure_hypothesis.schema.yaml
type: object
required: [id, claim, what_would_make_it_fail, evidence_required, severity_if_wrong, confidence, status]
properties:
  id: { pattern: "^fh-\\d+$" }
  claim: { type: string }
  what_would_make_it_fail: { type: string }
  evidence_required: { type: string }
  severity_if_wrong: { enum: [low, medium, high, critical] }
  confidence: { enum: [low, medium, medium-high, high] }
  status: { enum: [open, accepted, rejected, escalated] }
  resolution: { type: string }       # required when status != open
  new_test_id: { type: string }      # required when status == accepted
  counter_evidence: { type: string } # required when status == rejected
```

### Risk map

```yaml
# templates/risk_map.schema.yaml
type: object
required: [id, assumption, severity, resolution_required, status]
properties:
  id: { pattern: "^rm-\\d+$" }
  assumption: { type: string }
  severity: { enum: [trivial, low, medium, high, critical] }
  resolution_required:
    enum: [none, source, source+reasoning, probe, probe+acceptance]
  status: { enum: [open, resolved, waived] }
  resolution: { type: string }
  waiver_reason: { type: string }    # required when status == waived
```

### Retro note

```yaml
# templates/retro_note.schema.yaml
type: object
required: [workspace, domain, status, learnings]
properties:
  workspace: { type: string }
  domain: { type: string }
  status: { enum: [green, partial, failed] }
  learnings:
    type: array
    items:
      type: object
      required: [category, lesson]
      properties:
        category: { enum: [working_pattern, failed_assumption, source_quality, mechanism_transfer, tooling] }
        lesson: { type: string }
        affects_future_runs: { type: string }
```

---

## Hook contracts

Hooks are deterministic scripts. They do not embed LLM calls. Each has a single job, a defined input, and a defined output.

### `filter.sh`

```bash
# Inputs:
#   - source_candidates.jsonl  (raw URLs from lane subagents)
# Outputs:
#   - source_ledger.yaml       (only candidates that pass mechanical checks)
#   - rejected.jsonl           (with reason per row)
#
# Checks:
#   1. URL HEAD request returns 2xx/3xx
#   2. Domain not in blocklist (medium.com tracking redirects, ai-content farms)
#   3. Publication date extractable; within domain TTL
#   4. If repo: latest commit within recency cutoff, CI badge resolvable
```

### `probe.sh`

```bash
# Inputs:
#   - probe definition file (script + expected_pass_condition)
# Outputs:
#   - probe_results.jsonl (appended; one line per probe execution)
#
# Executes the probe in the target environment, captures:
#   - stdout / stderr
#   - exit code
#   - duration
#   - pass/fail per expected_pass_condition
```

### `audit.sh`

```bash
# Inputs:
#   - source_ledger.yaml
#   - claim_ledger.yaml
# Outputs:
#   - audit_report.md
#   - flagged.yaml (claims that failed audit; not deleted)
#
# Checks:
#   1. HEAD request every URL in source_ledger (parallel, rate-limited)
#   2. For each claim: curl the source URL (no JS), grep verbatim quote
#   3. Bigram overlap check on Edge-lane findings vs Production+Community
#   4. Rule check: zero critical claims at entailment <= weakly_supported
#
# Gate behaviour:
#   - Dead URLs: flag claim, do not delete (downgrade to weakly_supported)
#   - Missing quotes: flag (often JS-rendered), do not delete
#   - Critical+weakly_supported: GATE FAILURE, pipeline pauses
```

### `acceptance_test.sh`

```bash
# Inputs:
#   - definition_of_works.yaml
#   - failure_hypotheses.yaml (accepted ones contribute tests)
#   - regression tests from KB
# Outputs:
#   - acceptance_report.md
#   - acceptance_results.jsonl
#
# Runs every test, parses results, generates traceability matrix:
#   each test → which DoW id it satisfies
```

### `post_code.sh`

```bash
# Runs after every TDD micro-cycle inside EXECUTE.
# Inputs: workspace path
# Outputs: cycle_result.json (pass/fail, duration, coverage delta)
#
# Steps:
#   1. Run linter (per-language)
#   2. Run full test suite
#   3. Compute coverage delta vs prior cycle
#   4. Write cycle_result.json
#
# Exit code drives the EXECUTE micro-cycle decision (continue / retry / escalate)
```

### `update_kb.sh`

```bash
# Inputs:
#   - acceptance_report.md
#   - source_ledger.yaml
#   - failure_hypotheses.yaml
#   - risk_map.yaml
# Outputs:
#   - knowledge/<domain>/working_architectures.md (appended)
#   - knowledge/<domain>/failure_memory.yaml (appended)
#   - knowledge/<domain>/source_quality.yaml (merged)
#   - knowledge/<domain>/runs.jsonl (appended)
#   - knowledge/<domain>/index.yaml (updated, TTLs set)
```

---

## Reviewer router internals

```javascript
// src/lib/reviewer_router.mjs (excerpt)

const FAMILY_OF = {
  'claude-opus-4-7': 'anthropic',
  'claude-sonnet-4-6': 'anthropic',
  'gpt-5-pro': 'openai',
  'gpt-5-thinking': 'openai',
  'gemini-2.5-pro': 'google',
}

export async function pickReviewer(executorModel, config) {
  const executorFamily = FAMILY_OF[executorModel]
  if (!executorFamily) throw new Error(`Unknown executor family: ${executorModel}`)

  // Hard rule: never the same family
  const candidates = Object.entries(FAMILY_OF)
    .filter(([model, family]) => family !== executorFamily)
    .map(([model]) => model)

  for (const candidate of candidates) {
    const adapter = await loadAdapter(FAMILY_OF[candidate])
    if (await adapter.ping()) return { model: candidate, adapter }
  }

  // Fallback: same family, different model
  // Documented as weaker — flagged in acceptance_report
  if (config.allow_same_family_fallback) {
    return pickSameFamilyDifferentModel(executorModel)
  }

  throw new Error('No cross-family reviewer available')
}
```

Each adapter implements:

```typescript
interface ReviewerAdapter {
  ping(): Promise<boolean>
  review(input: {
    proposal: string,
    source_ledger: SourceLedger,
    claim_ledger: ClaimLedger,
    dow: DefinitionOfWorks,
    mode: 'standard' | 'blind'  // blind = sees only DoW
  }): Promise<FailureHypothesis[]>
}
```

The adapters convert the input into a model-specific prompt and parse the output into the `failure_hypothesis` schema. If the model returns unparseable output, the adapter retries once with a stricter format instruction, then escalates.

---

## Knowledge base structure

The KB is the durable state across runs. It grows monotonically except for TTL-based expirations.

### Per-domain layout

```
.forger/knowledge/<domain-slug>/
├── index.yaml                   # metadata, run count, shortcut eligibility
├── runs.jsonl                   # append-only log of every run
├── source_ledger.yaml           # surviving sources (with TTLs)
├── source_quality.yaml          # per-source authority/recency/repro scores
├── working_architectures.md     # patterns that delivered green acceptance
├── failure_memory.yaml          # assumptions that proved wrong
├── ground_truth_brief.md        # accumulated domain understanding
└── retro_notes/                 # per-run retro notes (for audit trail)
    ├── 2026-05-22-emotion-v1.md
    └── ...
```

### `index.yaml` example

```yaml
domain: ios-emotion-classification
created_at: 2026-05-22
total_runs: 1
green_runs: 1
shortcut_eligible: false        # requires green_runs >= 3
last_run: 2026-05-22T12:38:11Z
ttl_overrides:
  default: 6 months
  apple_official_docs: 18 months
related_domains:
  - ios-audio-classification   # adjacent; partial knowledge transfer
  - ml-mobile-deployment        # adjacent
```

### `runs.jsonl` example

```jsonl
{"ts":"2026-05-22T12:38:11Z","workspace":"emotion-2026-05-22","status":"green","acceptance":"15/15","tokens":712341,"phases_passed":["contract","find","observe","recombine","grill","execute","retain"]}
```

### Shortcut eligibility

After three green runs in a domain, `index.yaml.shortcut_eligible` flips to `true`. The next `forger run` in that domain auto-applies the Quick Forge optimisation:

| Phase | Normal behaviour | Quick Forge behaviour |
| --- | --- | --- |
| FIND | Run lanes via live browser | Read cached `source_ledger.yaml`, re-validate TTLs, only browse if cache miss |
| OBSERVE | Run all high/critical probes | Skip probes whose assumption hash is in `passed_probes_index.yaml` |
| RECOMBINE | Full Tier 1 generation | Seed with `working_architectures.md` |
| GRILL | Cross-model review | Cross-model review with prior failure hypotheses as starting attack vectors |
| EXECUTE | TDD from scratch | Seed acceptance suite with prior regression tests |
| RETAIN | Standard | Append to existing files |

The user can disable Quick Forge per-run with `--no-shortcut` if the task is genuinely novel within the domain.

---

## Telemetry and budgets

```javascript
// src/lib/telemetry.mjs (excerpt)

export class BudgetGate {
  constructor(workspaceConfig) {
    this.warn = workspaceConfig.budgets.cold_tokens_warn
    this.hard = workspaceConfig.budgets.cold_tokens_hard_cap
    this.spent = 0
  }

  charge(tokens, phase) {
    this.spent += tokens
    this.log({ phase, tokens, cumulative: this.spent })

    if (this.spent > this.hard) {
      throw new BudgetExceeded(phase, this.spent, this.hard)
    }
    if (this.spent > this.warn) {
      this.warn_once(phase, this.spent, this.warn)
    }
  }
}
```

The telemetry log lives at `<workspace>/telemetry.jsonl`. Every LLM call appends a row. Aggregate at the end of the run for the retro note.

Known gap: the telemetry rows currently omit the `tokens` field in some adapters, which makes budget_pause structurally unverifiable. Tracking: [FORGER_FLAWS #5](../framework/FORGER_FLAWS.md#flaw-5).

---

## Audit invariants

Every artifact FORGER produces traces back to its inputs. The audit chain:

```
artifact/  ────supports────▶  acceptance_report.md
                                       │
                              every test traces to ──▶ DoW id
                                                       │
DoW id   ────derived-from────▶ definition_of_works.yaml
                                       │
                              every constraint was ──▶ user input + reframe memo

claim    ────supports────▶  proposals/tier1.md
  │                                    │
source_id                     mechanism-fit passed
  │
source_ledger.yaml ──audit.sh verified URL + quote──▶ live page
```

Run `forger audit <workspace>` to walk this chain on a completed run. The command prints any broken links (claims orphaned from sources, tests orphaned from DoW ids, etc.) and exits non-zero if the chain is incomplete.

---

## Extension points

The framework is designed to be extended at four points:

| Extension | Where | What |
| --- | --- | --- |
| **New reviewer model** | `src/adapters/` | Implement `ReviewerAdapter` interface; register in `FAMILY_OF` |
| **New hook** | `src/hooks/` | Pure script; declared in `manifest.json` against a phase |
| **Domain-specific KB schemas** | `templates/` | Add a schema; reference it in the domain's `index.yaml` |
| **Per-domain phase overrides** | `modes/` | Add a mode YAML that tweaks budget/probe rules |

Hard rule: extensions cannot bypass invariants. A new hook cannot suppress the probe gate. A new mode cannot turn off cross-model review for `deep`. A new adapter cannot return same-family reviewers from a different-family request.

---

## Open known gaps

See [framework/FORGER_FLAWS.md](../framework/FORGER_FLAWS.md) for the full list. The eight blocking ones for v0.2:

1. npm install does not register the plugin with CC
2. Custom `manifest.json` instead of `.claude-plugin/{plugin,marketplace}.json` — fails `claude plugin validate`
3. Install copies to the wrong directory
4. Hook paths double-nest `forger`
5. Telemetry lines lack `tokens` field
6. Token budget figures are stale (cold runs are ~30× the documented budget)
7. FIND cannot spawn lane subagents from within a subagent (CC strips Task tool from subagent toolsets)
8. `reviewer_router` cross-model adapters (`openai.mjs`, `gemini.mjs`) are v0.1 stubs

Each has an open issue with a proposed fix. Contributions welcome.

---

## Next

- [Demos](04-examples.md) — the same architecture in motion
- [Phases](03-phases.md) — per-phase reference
- [Usage](05-usage.md) — install, run, troubleshoot
