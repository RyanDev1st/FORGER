Parent: ../FORGER.md

# FORGER v0.1 — Design Spec (Source of Truth)

**Status:** Draft. Awaiting user review before plan + implementation.
**Date:** 2026-05-19
**Author:** Co-authored by user + Claude (Opus 4.7).
**Supersedes:** none (first spec).

---

## 0. How to read this document

`FORGER.md` (sibling, one level up) is condensed research findings. This document is the **buildable specification** — every schema, hook contract, skill procedure, and gate is fully defined here. Where this document and `FORGER.md` disagree, this document wins.

If you are reading this to start implementation: jump to §13 (Implementation order).

---

## 1. Why FORGER exists

LLMs produce internally coherent explanations that diverge from reality. Sartori (2026) called this the Bidirectional Coherence Paradox: coherent explanations and successful actions are not the same thing. An agent can write a plausible architecture, cite real sources, reason confidently, and still fail when built — because mechanisms don't transfer, APIs have moved, or the source described a different problem.

FORGER answers this with three things, in order:

1. A **pipeline** that mirrors the human creative process (Wallas 1926, extended by Boden's combinational/exploratory/transformational taxonomy).
2. A **harness** that enforces grounding through live web research, runtime probes, schema-validated ledgers, cross-model review, and execution-gated completion.
3. A **knowledge base** that accumulates verified claims across tasks and gets faster with use.

Three legs are non-negotiable, all from Sartori's Epistemic Triangle:

- **Coherence** — does the explanation hold together?
- **Grounding** — does it correspond to physical reality?
- **Proper Basing** — does the explanation actually link to the action taken?

Every gate in FORGER traces back to at least one of these.

---

## 2. Decisions captured before this spec

These were settled in the brainstorming session that produced this document.

| # | Decision | Choice |
|---|----------|--------|
| D1 | v0 scope | Scaffold + all skills + stub hooks. Full plugin shape, runnable end-to-end, hooks fleshed out phase-by-phase. |
| D2 | Hook runtime | Node.js (`.mjs`). Cross-platform, native JSON, npm YAML libs, matches Claude Code plugin ecosystem. |
| D3 | GRILL cross-model reviewer | Priority gate router. `.env` lists API keys; router picks highest-tier provider different from current session. Fallback chain: different provider → same provider different model → spawn subagent with different model in same family. Output tagged with `reviewer_tier`. |
| D4 | reTruth gnosis fate | Revamp into FORGER FIND. Keep good frame (3-lane fan-out, verbatim quotes, audit hooks, volume contract, retry policy). Replace markdown findings with YAML ledgers. Add 6-dim source scoring, 5-level severity tied to DoW, 6-level entailment. |
| D5 | Skill file line cap | Skill files (SKILL.md, lane mandates, phase mandates) exempt from CLAUDE.md's 200-line cap. Quality > brevity for agent-instruction markdown. |
| D6 | Terminology | Three categories: **hooks** = harness-invoked (settings.json, always fire). **gates** = agent-invoked phase-exit validators (block on failure). **tools** = agent-invoked utilities (return data, never block). |
| D7 | Lane fan-out by mode | quick=production only; standard=production+community; deep=production+community+frontier. Frontier exclusively deep. |
| D8 | Mode selection | User answers a plain-language socratic question in CONTRACT. "You choose" defers to auto-rule. |

---

## 3. Pipeline architecture

```
User invokes /forger <task>
        │
        ▼
┌──────────────────────────────────────────────────────────────────────┐
│ SKILL.md (orchestrator) — single agent loop, single context lineage   │
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ CONTRACT │─▶│   FIND   │─▶│ OBSERVE  │─▶│RECOMBINE │─▶│  GRILL  │ │
│  │ Clarify  │  │ Ground   │  │Internal- │  │  Create  │  │ Falsify │ │
│  │ + Mode   │  │ (mode-   │  │ ize +    │  │ (tiered  │  │ (cross- │ │
│  │ pick     │  │  aware   │  │ Probe    │  │ blending)│  │  model) │ │
│  │          │  │  lanes)  │  │          │  │          │  │         │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                                  │   │
│           ┌──────────────────────────────────────────────────────┘   │
│           ▼                                                          │
│  ┌──────────┐  ┌──────────┐                                          │
│  │ RETAIN   │◀─│ EXECUTE  │   (re-entry to FIND on fact-gap probe   │
│  │ Persist  │  │ Build /  │    failure, capped at 2 re-entries)     │
│  └──────────┘  │ Run /    │                                          │
│                │ Prove    │                                          │
│                └──────────┘                                          │
└──────────────────────────────────────────────────────────────────────┘

State held in workspaces/{slug}-{date}/ files. Orchestrator only tracks
current_phase + workspace_path between phase invocations. Crash-safe:
killed session resumes by reading workspace YAMLs.
```

### Phase ↔ Wallas ↔ Epistemic Triangle

| Wallas stage | FORGER phase | Epistemic leg |
|---|---|---|
| Preparation | CONTRACT + FIND | Grounding |
| Incubation | OBSERVE | Grounding + Proper Basing |
| Illumination | RECOMBINE | Coherence (+ Grounding via mechanism-fit) |
| Verification | GRILL + EXECUTE | Coherence + Grounding + Proper Basing |
| (extended) | RETAIN | All three over time |

### Mandate injection rule

Orchestrator never reads lane mandates, grill adversary mandate, or any subagent-only instruction file. They live on the filesystem and are injected at spawn time:

```js
const mandate = fs.readFileSync('phases/find/lanes/production.md', 'utf8');
spawnSubagent({ prompt: `You are the Production Lane subagent...\n\n${mandate}\n\n...`, ... });
```

Preserves orchestrator context budget. Subagent gets full instruction once, in isolated context.

---

## 4. Filesystem layout

```
framework/forger/                          # dev = ship layout (copy to ~/.claude/plugins/forger/)
├── DESIGN.md                              # this document, source of truth
├── README.md                              # install + usage (human-facing)
├── manifest.json                          # Claude Code plugin metadata
├── package.json                           # npm deps (ajv, js-yaml, dotenv)
├── .env.example                           # reviewer key gate template
├── .gitignore                             # blocks .env, workspaces, node_modules
│
├── SKILL.md                               # orchestrator entry, drives pipeline
│
├── modes/
│   ├── quick.yaml                         # production lane only, ~6k tokens 
│   ├── standard.yaml                      # +community lane, ~22k, single reviewer
│   └── deep.yaml                          # +frontier, dual reviewer, ~35k
│                                         
├── phases/
│   ├── contract/
│   │   ├── SKILL.md                       # socratic clarification + mode pick
│   │   ├── refs/
│   │   │   ├── vagueness_detectors.md
│   │   │   ├── socratic_patterns.md
│   │   │   ├── reframe_examples.md
│   │   │   └── mode_select_heuristic.md   # for "You choose"
│   │   └── examples/
│   │       ├── dow.familiar-domain.yaml
│   │       └── dow.novel-domain.yaml
│   │
│   ├── find/
│   │   ├── SKILL.md
│   │   ├── lanes/
│   │   │   ├── production.md              # official docs, papers, working repos
│   │   │   ├── community.md               # forums, issues, war stories, datasets
│   │   │   └── frontier.md                # contrarian, analogues, deep-only
│   │   ├── refs/
│   │   │   ├── quality_rubric.md          # 6-dim scoring calibration
│   │   │   ├── severity_calibration.md
│   │   │   ├── entailment_calibration.md
│   │   │   └── pivot_procedure.md
│   │   └── examples/
│   │       ├── source_ledger.example.yaml
│   │       └── claim_ledger.example.yaml
│   │
│   ├── observe/
│   │   ├── SKILL.md
│   │   ├── refs/
│   │   │   ├── feynman_gate_template.md
│   │   │   ├── risk_map_construction.md
│   │   │   └── probe_design_patterns.md
│   │   └── examples/
│   │       └── risk_map.example.yaml
│   │
│   ├── recombine/
│   │   ├── SKILL.md
│   │   ├── refs/
│   │   │   ├── mechanism_fit_checklist.md
│   │   │   ├── tier_ladder.md
│   │   │   └── blending_patterns.md
│   │   └── examples/
│   │       ├── tier1.example.md
│   │       └── tier2.example.md
│   │
│   ├── grill/
│   │   ├── SKILL.md
│   │   ├── refs/
│   │   │   ├── adversary_mandate.md       # injected to reviewer
│   │   │   ├── blind_adversary_mandate.md # deep mode only
│   │   │   └── failure_hypothesis_template.md
│   │   └── examples/
│   │       └── failure_hypotheses.example.yaml
│   │
│   ├── execute/
│   │   ├── SKILL.md
│   │   ├── refs/
│   │   │   ├── tdd_micro_cycle.md
│   │   │   ├── done_means_ran_rubric.md
│   │   │   └── escalation_protocol.md
│   │   └── examples/
│   │       └── acceptance_results.example.jsonl
│   │
│   └── retain/
│       ├── SKILL.md
│       ├── refs/
│       │   ├── kb_write_rules.md
│       │   ├── ttl_defaults.md
│       │   └── shortcut_eligibility.md
│       └── examples/
│           └── retro_note.example.yaml
│
├── schemas/                               # JSON Schema in YAML, AJV-validated
│   ├── definition_of_works.schema.yaml
│   ├── source_ledger_entry.schema.yaml
│   ├── claim_ledger_entry.schema.yaml
│   ├── risk_map.schema.yaml
│   ├── failure_hypothesis.schema.yaml
│   ├── probe_result.schema.yaml
│   └── retro_note.schema.yaml
│
├── templates/                             # blank fill-in files matching schemas
│   ├── dow.template.yaml
│   ├── source_ledger.template.yaml
│   ├── claim_ledger.template.yaml
│   ├── risk_map.template.yaml
│   ├── failure_hypotheses.template.yaml
│   └── retro_note.template.yaml
│
├── hooks/                                 # HARNESS-invoked (settings.json)
│   ├── settings.hooks.json                # installer merges this into ~/.claude/settings.json
│   ├── post_code.mjs                      # PostToolUse: Edit/Write/NotebookEdit
│   ├── enforce_tier_firewall.mjs          # PreToolUse: Edit/Write/Bash
│   └── enforce_done_means_ran.mjs         # Stop
│
├── gates/                                 # AGENT-invoked, block phase exit on failure
│   ├── audit.mjs                          # ends FIND + GRILL phases
│   └── acceptance_test.mjs                # ends EXECUTE phase
│
├── tools/                                 # AGENT-invoked utilities, never block
│   ├── filter.mjs                         # used by FIND lanes
│   ├── probe.mjs                          # used by OBSERVE and EXECUTE
│   └── update_kb.mjs                      # used by RETAIN
│
├── _lib/                                  # shared helpers
│   ├── config.mjs                         # mode + .env loader
│   ├── ledger.mjs                         # AJV validators + YAML I/O
│   ├── reviewer_router.mjs                # priority-gate router for GRILL
│   ├── playwright.mjs                     # cloakbrowser wrapper
│   ├── kb.mjs                             # KB I/O + TTL + shortcut triggers
│   └── adapters/                          # reviewer adapters
│       ├── openai.mjs
│       ├── gemini.mjs
│       ├── anthropic.mjs
│       ├── xai.mjs
│       ├── mistral.mjs
│       ├── qwen.mjs
│       ├── glm.mjs
│       ├── kimi.mjs
│       ├── deepseek.mjs
│       ├── codex_cli.mjs                  # shells to `codex` if installed
│       └── subagent_fallback.mjs          # spawns Claude Code subagent
│
├── knowledge/                             # persistent, git-tracked, per-domain KB
│   └── {domain-slug}/
│       ├── index.yaml                     # domain meta + shortcut eligibility
│       ├── ground_truth_brief.md
│       ├── source_ledger.yaml             # accumulated, TTL-tagged
│       ├── claim_ledger.yaml              # proven claims, TTL-tagged
│       ├── working_architectures.md
│       ├── failure_memory.yaml
│       └── telemetry.jsonl                # one line per task
│
├── workspaces/                            # per-task scratch, .gitignored
│   └── {task-slug}-{YYYY-MM-DD}/
│       ├── dow.yaml                       # immutable after CONTRACT
│       ├── reframe_memo.md
│       ├── ground_truth_brief.md
│       ├── source_ledger.yaml             # appended by FIND lanes
│       ├── claim_ledger.yaml              # appended by FIND lanes
│       ├── find_summary.md                # written at FIND exit
│       ├── risk_map.yaml                  # written by OBSERVE
│       ├── probe_results.jsonl            # appended by tools/probe.mjs
│       ├── recombine.md                   # Tier 1 ideas
│       ├── tier2_speculation.md           # firewalled from execution
│       ├── tier3_proposals.md             # firewalled, needs user promote
│       ├── failure_hypotheses.yaml        # written by GRILL reviewer
│       ├── grill_report.md
│       ├── acceptance_results.jsonl       # appended by gates/acceptance_test.mjs
│       ├── retro_note.yaml                # written by RETAIN
│       ├── telemetry.jsonl                # one line per phase exit
│       └── hook_log.jsonl                 # every hook/gate/tool invocation
│
└── dev/                                   # NOT shipped to plugin install
    ├── tests/                             # vitest
    │   ├── schemas.test.mjs               # AJV self-validation per schema
    │   ├── ledger.test.mjs                # _lib/ledger.mjs unit tests
    │   ├── reviewer_router.test.mjs       # priority gate logic tests
    │   ├── kb.test.mjs                    # TTL + shortcut detection
    │   ├── gates_audit.test.mjs           # audit gate end-to-end
    │   └── hooks_firewall.test.mjs        # tier firewall logic
    ├── fixtures/
    │   ├── sample_dow.yaml
    │   ├── sample_source_ledger.yaml
    │   └── sample_failed_acceptance.jsonl
    └── scripts/
        ├── install.mjs                    # symlink or copy to ~/.claude/plugins/forger
        ├── validate_all_schemas.mjs       # AJV-validates every schema + every template
        └── new_workspace.mjs              # scaffolds a per-task workspace

# Adjacent (not inside framework/forger/):
reTruth/_archive/gnosis-v1/                # old gnosis, frozen for reference
```

**Lifecycle separation:**

- `workspaces/{slug}/` = ephemeral, per-task, `.gitignore`'d
- `knowledge/{domain}/` = persistent, per-domain, git-tracked
- Everything else = code, schemas, skills, templates — all version-controlled

---

## 5. Schemas (full)

All schemas are JSON Schema draft-07 written as YAML. AJV (with `ajv-formats`) validates at every read and every write. Validation errors halt phase exit; the offending key + schema path go to stderr.

### 5.1 `definition_of_works.schema.yaml`

```yaml
$schema: 'http://json-schema.org/draft-07/schema#'
$id: 'forger://schemas/definition_of_works'
type: object
required:
  - meta
  - artifact
  - audience
  - hard_constraints
  - success_criteria_measurable
  - unacceptable_failure_modes
  - reframe_memo
properties:
  meta:
    type: object
    required: [id, created_at, user_query_verbatim, mode, domain_slug]
    properties:
      id:                  { type: string, pattern: '^[a-z0-9-]+$' }
      created_at:          { type: string, format: 'date-time' }
      user_query_verbatim: { type: string, minLength: 1 }
      mode:                { enum: [quick, standard, deep] }
      domain_slug:         { type: string, pattern: '^[a-z0-9-]+$' }
      mode_picked_by:      { enum: [user, auto] }
  artifact:
    type: object
    required: [type, description]
    properties:
      type:        { enum: [code, system, research_report, design, spec, other] }
      format:      { type: string }
      description: { type: string }
  audience:
    type: object
    required: [who, use_case]
    properties:
      who:      { type: string }
      use_case: { type: string }
  hard_constraints:
    type: array
    items:
      type: object
      required: [id, description, verification_method]
      properties:
        id:                  { type: string }
        description:         { type: string }
        verification_method: { type: string }
        threshold:           { type: string }
  success_criteria_measurable:
    type: array
    items:
      type: object
      required: [id, metric, threshold, test_method]
      properties:
        id:          { type: string }
        metric:      { type: string }
        threshold:   { type: string }
        test_method: { type: string }
  success_criteria_subjective:
    type: array
    items:
      type: object
      required: [id, criterion, measurement_protocol]
      properties:
        id:                   { type: string }
        criterion:            { type: string }
        measurement_protocol: { type: string }
  unacceptable_failure_modes:
    type: array
    items:
      type: object
      required: [id, description, detection_method]
      properties:
        id:                { type: string }
        description:       { type: string }
        detection_method:  { type: string }
        safety_critical:   { type: boolean, default: false }
  reframe_memo:
    type: object
    required: [original_framing, alternative_framings, chosen_framing, rationale]
    properties:
      original_framing:     { type: string }
      alternative_framings: { type: array, items: { type: string }, minItems: 1 }
      chosen_framing:       { type: string }
      rationale:            { type: string }
  assumptions:
    type: array
    items:
      type: object
      required: [id, description, severity, status]
      properties:
        id:          { type: string }
        description: { type: string }
        severity:    { enum: [trivial, low, medium, high, critical] }
        status:      { enum: [unverified, verified, waived, invalid] }
```

### 5.2 `source_ledger_entry.schema.yaml`

```yaml
$schema: 'http://json-schema.org/draft-07/schema#'
$id: 'forger://schemas/source_ledger_entry'
type: object
required: [id, url, lane, accessed_at, ttl_days, quality_scores]
properties:
  id:          { type: string, pattern: '^src-[a-z0-9-]+$' }
  url:         { type: string, format: uri }
  title:       { type: string }
  lane:        { enum: [production, community, frontier] }
  accessed_at: { type: string, format: 'date-time' }
  ttl_days:    { type: integer, minimum: 1, default: 90 }
  expires_at:  { type: string, format: 'date-time' }
  quality_scores:
    type: object
    additionalProperties: false
    required:
      - authority
      - recency
      - reproducibility
      - implementation_relevance
      - independence
      - conflict_of_interest
    properties:
      authority:                { type: integer, minimum: 0, maximum: 5 }
      recency:                  { type: integer, minimum: 0, maximum: 5 }
      reproducibility:          { type: integer, minimum: 0, maximum: 5 }
      implementation_relevance: { type: integer, minimum: 0, maximum: 5 }
      independence:             { type: integer, minimum: 0, maximum: 5 }
      conflict_of_interest:     { type: integer, minimum: 0, maximum: 5 }
  composite_score: { type: number, minimum: 0, maximum: 5 }
  flags:
    type: array
    items:
      enum:
        - link-dead
        - quote-not-found
        - redundant-with-other-lane
        - domain-blocked
        - paywall
        - orphan-claim
  notes: { type: string }
  re_entry: { type: integer, minimum: 1 }
```

### 5.3 `claim_ledger_entry.schema.yaml`

```yaml
$schema: 'http://json-schema.org/draft-07/schema#'
$id: 'forger://schemas/claim_ledger_entry'
type: object
required:
  - id
  - source_id
  - claim_text
  - verbatim_quote
  - severity
  - entailment
  - status
  - dow_criterion_refs
properties:
  id:             { type: string, pattern: '^clm-[a-z0-9-]+$' }
  source_id:      { type: string, pattern: '^src-[a-z0-9-]+$' }
  lane:           { enum: [production, community, frontier] }
  claim_text:     { type: string, minLength: 1 }
  verbatim_quote: { type: string, minLength: 1, maxLength: 200 }
  severity:       { enum: [trivial, low, medium, high, critical] }
  dow_criterion_refs:
    type: array
    minItems: 1
    items: { type: string }
  entailment:
    enum:
      - directly_supported
      - weakly_supported
      - extrapolated
      - contradicted
      - unverified
      - speculative
  mechanism: { type: string }
  probe_id:  { type: string }
  intended_use: { enum: [primary, tier2_seed, tier3_seed], default: primary }
  status:
    enum:
      - open
      - probed_ok
      - probed_fail
      - waived
      - verified
      - invalid
      - blocked
  re_entry: { type: integer, minimum: 1 }
```

### 5.4 `risk_map.schema.yaml`

```yaml
$schema: 'http://json-schema.org/draft-07/schema#'
$id: 'forger://schemas/risk_map'
type: object
required: [assumptions, mechanisms, known_failure_modes]
properties:
  assumptions:
    type: array
    items:
      type: object
      required: [id, description, severity, resolution_required, status]
      properties:
        id:                  { type: string }
        description:         { type: string }
        severity:            { enum: [trivial, low, medium, high, critical] }
        evidence_refs:       { type: array, items: { type: string } }
        resolution_required:
          enum:
            - none
            - source
            - source+reasoning
            - source+probe
            - source+probe+acceptance_test
        status:
          enum:
            - unresolved
            - probed_ok
            - probed_fail
            - waived
            - verified
        probe_id:      { type: string }
        waiver_reason: { type: string }
  mechanisms:
    type: array
    items:
      type: object
      required: [id, name, description, source_refs]
      properties:
        id:          { type: string }
        name:        { type: string }
        description: { type: string }
        source_refs: { type: array, items: { type: string } }
  known_failure_modes:
    type: array
    items:
      type: object
      required: [id, description, conditions, detection_method]
      properties:
        id:               { type: string }
        description:      { type: string }
        conditions:       { type: string }
        detection_method: { type: string }
```

### 5.5 `failure_hypothesis.schema.yaml`

```yaml
$schema: 'http://json-schema.org/draft-07/schema#'
$id: 'forger://schemas/failure_hypothesis'
type: object
required:
  - id
  - hypothesis
  - what_disproves
  - minimal_test
  - severity_if_wrong
  - confidence
  - status
properties:
  id:                { type: string }
  hypothesis:        { type: string }
  what_disproves:    { type: string }
  minimal_test:      { type: string }
  severity_if_wrong: { enum: [low, medium, high, critical] }
  confidence:        { type: integer, minimum: 0, maximum: 5 }
  reviewer_provider: { type: string }
  reviewer_model:    { type: string }
  reviewer_tier:     { enum: [best, good, acceptable, weak] }
  blind:             { type: boolean, default: false }
  status:
    enum:
      - open
      - accepted_test_added
      - rejected_with_counter_evidence
      - escalated
  counter_evidence_refs: { type: array, items: { type: string } }
  resolution_test_id:    { type: string }
```

### 5.6 `probe_result.schema.yaml`

```yaml
$schema: 'http://json-schema.org/draft-07/schema#'
$id: 'forger://schemas/probe_result'
type: object
required: [id, assumption_ref, probe_type, ran_at, passed]
properties:
  id:                { type: string }
  assumption_ref:    { type: string }
  probe_type:
    enum:
      - script
      - repo_clone
      - web_search
      - prototype_fn
      - benchmark
      - api_test
  command_or_code:   { type: string }
  expected:          { type: string }
  actual:            { type: string }
  passed:            { type: boolean }
  duration_ms:       { type: integer, minimum: 0 }
  ran_at:            { type: string, format: 'date-time' }
  environment_notes: { type: string }
  evidence:          { type: string, maxLength: 8000 }
```

### 5.7 `retro_note.schema.yaml`

```yaml
$schema: 'http://json-schema.org/draft-07/schema#'
$id: 'forger://schemas/retro_note'
type: object
required: [task_id, completed_at, mode_used, status]
properties:
  task_id:      { type: string }
  domain_slug:  { type: string }
  completed_at: { type: string, format: 'date-time' }
  mode_used:    { enum: [quick, standard, deep] }
  status:       { enum: [shipped, escalated, abandoned] }
  token_used:   { type: integer, minimum: 0 }
  duration_ms:  { type: integer, minimum: 0 }
  proven_claim_ids: { type: array, items: { type: string } }
  failed_assumptions:
    type: array
    items:
      type: object
      required: [id, description, lesson_learned]
      properties:
        id:             { type: string }
        description:    { type: string }
        lesson_learned: { type: string }
        scope:          { enum: [task-specific, domain-wide], default: task-specific }
  working_architecture_ref: { type: string }
  ttl_overrides:
    type: object
    additionalProperties: { type: integer, minimum: 1 }
  shortcut_eligible: { type: boolean }
```

---

## 6. Phase skills

Every phase skill is a `SKILL.md` with frontmatter, an Identity section, Inputs/Outputs declarations, Gates, Procedure, and Exit condition. Length is unconstrained.

### 6.1 Orchestrator (`SKILL.md`)

```yaml
name: forger
description: |
  Run the FORGER pipeline on a task. Walks Contract → Find → Observe → Recombine →
  Grill → Execute → Retain. Use when the user wants a grounded, test-gated build
  of a non-trivial artifact (code, system, research report, design, or spec). Skip
  for trivial lookups or single-file edits.
```

Procedure:

1. Parse `/forger <task description>`. Compute `slug` (kebab-case, ≤40 chars) and `date` (local YYYY-MM-DD).
2. Resolve workspace path: `framework/forger/workspaces/{slug}-{date}/` (append `-v2`, `-v3` on collision).
3. Invoke `forger-contract` skill. Wait for `dow.yaml` to exist and pass schema validation.
4. Invoke `forger-find` skill. Pass workspace path. Wait for `source_ledger.yaml`, `claim_ledger.yaml`, `find_summary.md` to exist and pass `gates/audit.mjs`.
5. Invoke `forger-observe`. Pass workspace path. Wait for `risk_map.yaml` to exist; every assumption with severity ≥ high must have status ∈ {probed_ok, waived, verified}.
6. Invoke `forger-recombine`. Pass workspace path. Wait for `recombine.md` to exist with ≥1 Tier 1 idea; mechanism-fit check populated.
7. Invoke `forger-grill`. Pass workspace path. Wait for `failure_hypotheses.yaml` to exist; all open hypotheses must resolve to `accepted_test_added`, `rejected_with_counter_evidence`, or `escalated`. In deep mode require two reviewer runs (one with blind=true).
8. Invoke `forger-execute`. Pass workspace path. Skill loops TDD micro-cycles until `acceptance_results.jsonl` shows all required entries passing. On fact-gap probe failure: write `dow_addendum_{n}.yaml`, re-invoke `forger-find` in single-lane mode (production only, target=3, no frontier), up to 2 re-entries; 3rd escalates.
9. Invoke `forger-retain`. Pass workspace path. Wait for `retro_note.yaml` to exist and pass schema validation; `tools/update_kb.mjs` merges into KB.
10. Emit final summary to user: workspace path, status (shipped/escalated/abandoned), token budget used vs. mode budget, telemetry line count.

Cap: 4 concurrent threads (orchestrator + max 3 subagents during FIND deep mode). No other phase fans out beyond orchestrator + 1.

### 6.2 CONTRACT (`phases/contract/SKILL.md`)

Purpose: turn a user query into a machine-readable Definition of Works. Surface vagueness via socratic elements (maieutics, elenchus, aporia, dialectic). Produce reframe memo. Pick mode.

Inputs:
- User's raw task description.
- (Optional) KB index for the inferred domain.

Outputs:
- `workspaces/{slug}/dow.yaml` (schema-validated).
- `workspaces/{slug}/reframe_memo.md`.

Gates:
1. DoW schema validates.
2. Every entry in `hard_constraints` has a `verification_method`.
3. Every entry in `success_criteria_measurable` has a `threshold` AND a `test_method`.
4. `reframe_memo.alternative_framings` has ≥1 entry.
5. `meta.mode` set; `meta.mode_picked_by` set.

Procedure:

1. **Vagueness detection.** Scan user input for: unclear artifact type, missing success criteria, ambiguous constraints, unstated assumptions, mixed goals. Use `refs/vagueness_detectors.md`.
2. **Socratic elicitation.** For each vagueness, generate 1–3 targeted questions using `refs/socratic_patterns.md` (maieutics / elenchus / aporia / dialectic). Ask the user one at a time. Update internal draft DoW after each answer.
3. **Reframe.** Generate ≥1 alternative problem framing. Ask: "what would have to be true for the simplest possible solution to work?" Present original + alternative to user briefly; user picks or sticks with original. Write `reframe_memo.md`.
4. **Domain slug.** Compute `domain_slug` (kebab-case noun phrase, ≤40 chars). Check `knowledge/{domain_slug}/index.yaml` exists.
5. **Mode question (last).** Ask plain-language question:

   > Last thing — how careful should I be on this one?
   >
   > • **Fast** — Quick pass. I lean on what I already know about this area. Good for small tweaks in familiar territory.
   >
   > • **Normal** — Full check. I pull official docs and community sources, then a second AI reviews my work. Default for most things.
   >
   > • **Thorough** — Everything Normal does, plus a contrarian sweep and a stricter second opinion. Slower. Use when getting it wrong is expensive.
   >
   > • **You choose** — I'll pick based on what you described.

   Map and write to DoW:
     - Fast → `meta.mode = quick`, `meta.mode_picked_by = user`
     - Normal → `meta.mode = standard`, `meta.mode_picked_by = user`
     - Thorough → `meta.mode = deep`, `meta.mode_picked_by = user`
     - You choose → apply auto-rule below, `meta.mode_picked_by = auto`

   Auto rule (`refs/mode_select_heuristic.md`):
   - shortcut_eligible domain AND no safety-critical failure modes → quick
   - ≥1 safety-critical failure mode OR novel domain (no `knowledge/{slug}/` dir) → deep
   - else → standard

6. **Write DoW.** Use `templates/dow.template.yaml`. Validate. Halt if validation fails; surface error to user.

Exit: control returns to orchestrator when both files exist and DoW schema validates.

Autonomous mode (no human): skip socratic questions; write DoW with conservative assumptions; every unverified field tagged with risk level in `assumptions`; mode defaults to `standard`.

### 6.3 FIND (`phases/find/SKILL.md`)

Purpose: ground every DoW criterion in live, citable, quote-verified sources. Mode-aware lane fan-out.

Inputs:
- `workspaces/{slug}/dow.yaml`
- `knowledge/{domain_slug}/` (read-only; possibly used for shortcut)

Outputs:
- `workspaces/{slug}/source_ledger.yaml`
- `workspaces/{slug}/claim_ledger.yaml`
- `workspaces/{slug}/find_summary.md`

Gates:
1. AJV validation of both ledgers passes.
2. Every lane that ran reached floor (production=5, community=5, frontier=3) OR pivoted OR is marked `under-sourced` after 3 retries.
3. Every `severity: critical` claim either has `entailment: directly_supported` (clean) OR is tagged `status: blocked` with `dow_criterion_refs` pointing to known mechanism IDs. (Resolution deferred to OBSERVE — see §6.4.)
4. `gates/audit.mjs` passes (HEAD, quote-grep, schema, lineage, independence; bigram only if ≥2 lanes ran).

Procedure (full text in `phases/find/SKILL.md`):

1. Load DoW. Read `meta.mode`. Load `modes/{mode}.yaml` to get `lanes` list.
2. **KB shortcut check:**
   - Load `knowledge/{domain_slug}/index.yaml` if exists.
   - If `shortcut_eligible == true`: load cached `source_ledger.yaml` and `claim_ledger.yaml`, prune expired entries (`expires_at < now`).
   - Compute coverage: fraction of `dow.hard_constraints` + `dow.success_criteria_measurable` + `dow.unacceptable_failure_modes` IDs referenced by at least one non-expired claim.
   - If coverage ≥ 0.80: copy cached entries into workspace ledgers, tag with `re_entry: 0`, mark as `kb-served` in `find_summary.md`. Skip steps 3–6.
   - Else: continue.
3. Compose lane brief from DoW (one paragraph, includes artifact + audience + hard_constraints + success_criteria_measurable + unacceptable_failure_modes).
4. Spawn lanes per `lanes` list, one Task call each, same turn (parallel):
   - Each spawn carries: lane mandate (filesystem-injected from `lanes/{lane}.md`), DoW path, workspace path, output ledger paths, mode, effort.
   - Concurrent thread cap = 4 (orchestrator + up to 3 lanes).
5. Wait until all lane Tasks return. Read ledger files (chat summary is not authoritative).
6. Validate per lane (in order):
   - V1: both ledger files exist and non-empty
   - V2: lane's claim count ≥ floor
   - V3: no top-level refusal content in lane summary
   - V4: every claim has `verbatim_quote`, `entailment`, `severity`, `dow_criterion_refs`
   - V5: AJV schema validation passes for every entry
   - V6: closing block (lane summary comment) present in `source_ledger.yaml`
7. **Retry policy per failing lane** (V1/V2/V3/V5/V6 fail):
   - Attempt 1: inline re-spawn same turn, with note `Previous attempt failed V<i>. Floor is {N}. Apply pivot if topic is genuinely under-sourced.`
   - Attempt 2: schedule via `ScheduleWakeup(delaySeconds=300)` in /loop mode, else `CronCreate` one-shot. Persist retry counter at `workspaces/{slug}/.retry-{lane}`.
   - Attempt 3: same as 2.
   - After 3 fails: mark lane `under-sourced` in `find_summary.md`, continue.
8. Run `gates/audit.mjs --workspace <path>`:
   - HEAD-request every URL; flag `link-dead` if not 2xx/3xx within 5s.
   - For every claim, `curl -s <url>` (no JS render) → grep `verbatim_quote` literally; flag `quote-not-found` if miss.
   - If ≥2 lanes ran: bigram anti-redundancy for frontier lane vs production+community; overlap ≥30% → flag `redundant-with-other-lane`.
   - Lineage: every claim's `source_id` must exist in source_ledger; flag `orphan-claim` if not.
   - Independence: every critical claim should have ≥2 sources with `independence ≥ 4`; flag (not block) if absent.
9. **Blocked-claim tagging** (after audit):
   - For each `severity: critical` claim with `entailment ∈ {weakly_supported, extrapolated, contradicted, unverified, speculative}`:
     - Mark `status: blocked`.
     - Do NOT block FIND exit. OBSERVE is responsible for resolving every blocked claim (probe, downgrade with rationale, or escalate). OBSERVE gate enforces this.
10. Write `find_summary.md`:
    - Cross-lane agreements (claims appearing in ≥2 lanes with same severity).
    - Lane-unique contributions.
    - Tensions (contradicted entailment between lanes).
    - Audit-flagged counts.
    - Under-sourced lanes (if any).
    - Frontier seeds (`intended_use: tier2_seed`), deep mode only.
11. Exit. Append phase telemetry line.

Re-entry mode (called from EXECUTE): single-lane (production), target=3, no frontier. Reads `dow_addendum_{n}.yaml` instead of full DoW. Appends to existing ledgers with `re_entry: {n}` tag.

#### Lane mandate format

Each `lanes/{lane}.md` is a complete subagent instruction file. See §7 for the production lane mandate as worked example; community and frontier follow the same template with different source criteria and search strategies.

### 6.4 OBSERVE (`phases/observe/SKILL.md`)

Purpose: internalize the grounded material, write the Feynman gate, build the risk map, run probes for every high/critical assumption.

Inputs:
- `workspaces/{slug}/source_ledger.yaml`
- `workspaces/{slug}/claim_ledger.yaml`
- `workspaces/{slug}/dow.yaml`

Outputs:
- `workspaces/{slug}/ground_truth_brief.md` (Feynman explanation)
- `workspaces/{slug}/risk_map.yaml`
- Appends to `workspaces/{slug}/probe_results.jsonl` (via `tools/probe.mjs`)

Gates:
1. `risk_map.yaml` schema validates.
2. Every assumption with `severity` ∈ {high, critical} has `status` ∈ {probed_ok, waived, verified}.
3. In deep mode: no waivers allowed (every high/critical must be `probed_ok` or `verified`).
4. `ground_truth_brief.md` exists and is ≥ 200 words.
5. **Blocked-claim resolution.** No claim_ledger entry remains `status: blocked` at exit. Each must be one of: `probed_ok`, `probed_fail` (with downstream handling), severity downgraded (with rationale appended to `notes`), or escalated to user.

Procedure:

1. **Mechanism extraction.** From claim ledger, extract core mechanisms (causal processes) + domain constraints + known failure modes. Write to `risk_map.yaml` under `mechanisms` and `known_failure_modes`.
2. **Feynman gate.** Write `ground_truth_brief.md`: explain the domain in plain language with every jargon term defined inline. ≥ 200 words. If you can't write it without jargon, internalization is incomplete; re-read claim ledger and try again.
3. **Risk mapping.** For every unverified assumption (claims with `entailment` ∈ {weakly_supported, extrapolated, unverified, speculative}, plus DoW.assumptions with `status: unverified`):
   - Assign `resolution_required` per severity:
     - trivial → none
     - low → source
     - medium → source+reasoning
     - high → source+probe (or waiver)
     - critical → source+probe+acceptance_test (or waiver in standard/quick only)
4. **Probe loop.** For each high/critical assumption with `resolution_required` ≥ source+probe:
   - Design smallest test that can falsify (see `refs/probe_design_patterns.md`).
   - Invoke `tools/probe.mjs --workspace <path> --assumption-id <id> --type <script|repo_clone|web_search|prototype_fn|benchmark|api_test> --cmd <...>` with timeout.
   - Tool appends to `probe_results.jsonl`. Update assumption `status` from probe result: pass → `probed_ok`; fail → `probed_fail`.
5. **Waiver handling** (standard/quick only): if probe is impossible or cost-prohibitive, set `status: waived` and `waiver_reason: "<explicit text>"`. Probably escalates to user. Deep mode forbids waivers.
6. **Blocked-claim sweep.** For every claim with `status: blocked` from FIND: create a corresponding risk_map assumption with `resolution_required: source+probe`, run the probe via `tools/probe.mjs`, update the claim's `status` to `probed_ok`/`probed_fail`. If probe fails repeatedly, downgrade claim severity with rationale or escalate.
7. Final check: re-validate `risk_map.yaml`. Every high/critical assumption resolved. No `status: blocked` claims remain. Exit.

### 6.5 RECOMBINE (`phases/recombine/SKILL.md`)

Purpose: produce creative solutions by recombining grounded elements. Three tiers, with the Tier 2/3 firewall.

Inputs:
- DoW, source_ledger, claim_ledger, risk_map, ground_truth_brief
- Mode's `recombine_tiers_allowed` list

Outputs:
- `workspaces/{slug}/recombine.md` (Tier 1 ideas; safe to execute)
- `workspaces/{slug}/tier2_speculation.md` (if mode allows; firewalled)
- `workspaces/{slug}/tier3_proposals.md` (deep mode only; firewalled; needs user promotion)

Gates:
1. ≥1 Tier 1 idea exists.
2. Every Tier 1 idea has populated `mechanism_fit_check` block (see template).
3. Every Tier 1 idea references ≥2 claim_ids from claim_ledger.
4. No Tier 2/3 content is written outside its dedicated file (enforced by `enforce_tier_firewall.mjs` hook).

Procedure:

1. **Element catalog.** From claim_ledger, extract discrete cognitive building blocks (patterns, algorithms, techniques, design principles). Each tagged with `source_id` lineage.
2. **Tier 1 generation.** For each element combination that addresses ≥1 DoW criterion:
   - Write the idea as a structured block in `recombine.md`.
   - Include `mechanism_fit_check`:
     ```
     mechanism_fit_check:
       source_domain_mechanism: <how it worked in source>
       target_domain_mechanism: <how it would work here>
       transfer_evidence: <which claim_ids support this transfer>
       transfer_risks: <conditions under which it would fail>
       fit_verdict: ok | partial | broken
     ```
   - If `fit_verdict: broken`, do not include the idea. Reroute to Tier 2 if speculative version exists.
3. **Tier 2 (if allowed).** Speculative extensions: ideas that go beyond direct claim evidence but include a concrete validation plan. Write to `tier2_speculation.md` only. Each entry includes:
   ```
   tier2_entry:
     idea: <text>
     why_speculative: <text>
     validation_plan: <test that would lift to Tier 1>
     frontier_seed_refs: [claim_ids from frontier lane, if any]
     promoted_at: null
   ```
   Frontier lane claims with `intended_use: tier2_seed` are the primary seed source.
4. **Tier 3 (deep mode only).** Transformational proposals: ideas that challenge a DoW assumption. Write to `tier3_proposals.md` only. Each entry includes the assumption challenged + the alternative framing + the cost of being wrong.
5. **Firewall reminder.** Do not edit or write any file outside `recombine.md` based on Tier 2/3 content. The PreToolUse hook will block such writes.
6. Exit when Tier 1 has ≥1 idea and all gates pass.

### 6.6 GRILL (`phases/grill/SKILL.md`)

Purpose: cross-model adversarial review. Try to kill the proposal.

Inputs:
- All workspace artifacts produced so far.
- Mode config (single vs. dual reviewer).

Outputs:
- `workspaces/{slug}/failure_hypotheses.yaml`
- `workspaces/{slug}/grill_report.md`

Gates:
1. AJV validates `failure_hypotheses.yaml`.
2. Every hypothesis with `severity_if_wrong` ∈ {high, critical} has `status` ∈ {accepted_test_added, rejected_with_counter_evidence, escalated}.
3. `gates/audit.mjs` re-runs on all artifacts; no new audit failures.
4. `reviewer_tier` recorded in every failure_hypothesis entry; mode-required tier met:
   - quick: any tier (or skipped entirely if `mode.grill_required: false`)
   - standard: ≥ acceptable
   - deep: ≥ good; AND at least one hypothesis from a blind reviewer

Procedure:

1. Re-run `gates/audit.mjs --workspace <path>` to confirm artifacts still pass mechanical checks.
2. Compose adversary prompt from `refs/adversary_mandate.md` + all workspace artifacts.
3. Call `_lib/reviewer_router.mjs::invokeReviewer(systemPrompt, userPrompt, {blind: false})`. Capture `{tier, response, reviewer_meta}`.
4. Parse response → append entries to `failure_hypotheses.yaml`. Each entry tagged with `reviewer_provider`, `reviewer_model`, `reviewer_tier`, `blind: false`.
5. **Deep mode only:** call reviewer again with `refs/blind_adversary_mandate.md` (sees only DoW). Parse response, append with `blind: true`.
6. **Resolution loop.** For each failure_hypothesis with `status: open`:
   - Read it. Decide:
     - **Accept** → add a probe or acceptance test that addresses it; set `status: accepted_test_added`; set `resolution_test_id`.
     - **Reject** → cite specific claim_ids that contradict the hypothesis; set `status: rejected_with_counter_evidence`.
     - **Escalate** → mark `status: escalated`; emit to user.
   - No `status: open` may remain at exit.
7. Write `grill_report.md` summarizing accepted tests, rejected hypotheses, escalations.
8. Exit.

### 6.7 EXECUTE (`phases/execute/SKILL.md`)

Purpose: build the artifact and prove it works against the DoW.

Inputs: every workspace artifact.

Outputs:
- Artifact files (code, design, report, etc.) in their target locations.
- `workspaces/{slug}/acceptance_results.jsonl` (one line per criterion).
- Possibly `dow_addendum_{n}.yaml` if re-entry to FIND is triggered.

Gates:
1. All `dow.success_criteria_measurable` entries have a passing `acceptance_results.jsonl` line.
2. All `dow.hard_constraints` entries have a passing verification line.
3. No `dow.unacceptable_failure_modes` triggers in detection runs.
4. Done Means Ran (invariant 1) — `enforce_done_means_ran.mjs` will block stop otherwise.

Procedure:

**For code/system artifacts** (TDD micro-cycles, per `refs/tdd_micro_cycle.md`):

1. Pick the next DoW success_criterion_measurable not yet passing.
2. Write a failing test that asserts the criterion.
3. Write minimal code to pass.
4. Save file (PostToolUse fires `post_code.mjs`: linter + per-language test runner).
5. If test fails:
   - 2 retry attempts inline with web-search if error is library-specific.
   - 3rd retry: escalate.
6. After test passes: invoke `gates/acceptance_test.mjs --workspace <path>` to update `acceptance_results.jsonl`.
7. Loop until all measurable criteria pass.

**For research_report artifacts:**

1. Draft sections per artifact specification.
2. Each section's claims must reference claim_ledger entries with `entailment: directly_supported` (no critical claims at `weakly_supported`).
3. Run `gates/audit.mjs` on the report (extends to grep section claims against ledger).
4. Update `acceptance_results.jsonl` per criterion (acceptance criteria for reports include: ledger coverage, no broken citations, no critical claims at weak entailment).

**For design artifacts:**

1. Generate per artifact specification.
2. Acceptance criteria for designs include rubric scoring + screenshot/user-flow review.
3. Update `acceptance_results.jsonl` per criterion.

**Fact-gap re-entry to FIND:**

If `gates/acceptance_test.mjs` fails AND the agent diagnoses the failure as a missing fact rather than a code bug (typically: a documented behavior doesn't match runtime reality, or a required threshold was never sourced):
1. Optionally call `tools/probe.mjs` to confirm the gap is real (not transient).
2. Write `workspaces/{slug}/dow_addendum_{n}.yaml` (single narrowed criterion).
3. Re-invoke `forger-find` in single-lane mode (production only, target=3, no frontier).
4. Cap: 2 re-entries per task; 3rd escalates to user (Done Means Ran will block stop anyway).

Exit: orchestrator returns when `gates/acceptance_test.mjs` exits 0 (all required criteria pass).

### 6.8 RETAIN (`phases/retain/SKILL.md`)

Purpose: persist what was learned. Update the KB. Decay what's stale.

Inputs: every workspace artifact + final status.

Outputs:
- `workspaces/{slug}/retro_note.yaml`
- Mutations to `knowledge/{domain_slug}/` (via `tools/update_kb.mjs`)

Gates:
1. `retro_note.yaml` schema validates.
2. `tools/update_kb.mjs` returns exit 0.

Procedure:

1. Compute `task_id` (= slug-date), `domain_slug` (from DoW), `mode_used`, `status` (shipped/escalated/abandoned), `token_used` (sum from telemetry.jsonl), `duration_ms`.
2. Collect `proven_claim_ids`: every claim_ledger entry with `status` ∈ {verified, probed_ok} AND referenced by a passing acceptance_test.
3. Collect `failed_assumptions`: every risk_map assumption with `status: probed_fail`, plus DoW.assumptions that turned out invalid.
4. Identify `working_architecture_ref` if applicable: path to a written architecture doc in the workspace.
5. Set `ttl_overrides` if any sources need non-default TTL (fast-moving libs get 30d).
6. Write `retro_note.yaml`. Validate.
7. Invoke `tools/update_kb.mjs --workspace <path>`:
   - Tool merges proven claims into `knowledge/{domain}/claim_ledger.yaml` with `expires_at` stamp.
   - Tool merges underlying sources into `knowledge/{domain}/source_ledger.yaml`.
   - Tool appends failed assumptions to `knowledge/{domain}/failure_memory.yaml`.
   - Tool updates `working_architectures.md` if ref set.
   - Tool increments `index.yaml.tasks_*` counter for the status.
   - Tool checks last 3 task statuses; if all `shipped`, sets `index.yaml.shortcut_eligible: true`.
   - Tool appends one line to `knowledge/{domain}/telemetry.jsonl`.
8. Exit.

---

## 7. Lane mandates (worked example: production)

Full text of `phases/find/lanes/production.md`. Community and frontier follow the same template; only the "Source criteria for this lane" and "Search strategies" sections differ. Length is unconstrained per D5.

```markdown
# Production Lane Mandate

## Identity
You are the Production Lane subagent. Isolated context. You receive a Definition of Works (DoW)
path and a workspace path. You emit two YAML files (source_ledger.yaml and claim_ledger.yaml).
You do not collaborate with other lanes during fan-out. You do not read other lanes' output.

## Mode detection
Read DoW.meta.mode. Quick → target=5, ceiling=7. Standard → target=8-10, ceiling=12.
Deep → target=12-15, ceiling=18.

Floor (claims, not sources) = 5 across all modes for this lane.

## Source criteria for this lane
Acceptable:
  - Official documentation sites (docs.*, *.dev, vendor-hosted reference)
  - Peer-reviewed papers (arXiv with conference acceptance, journals)
  - Working open-source repos with active CI badges and recent commits
  - Vendor RFCs and design documents
  - Reproducible benchmarks with public methodology

Out of scope (this is the community lane's job):
  - Forum threads
  - GitHub Issues (unless the issue resolves to a documented vendor fix)
  - Blog posts (unless authored by the official project)
  - Reddit, Stack Overflow, Hacker News

If unsure: prefer official > peer-reviewed > vendor RFC > working repo.

## Required workflow

### Step 1 — Brief absorption
Read DoW. Extract every:
  - hard_constraint (every constraint needs a verifying source)
  - success_criteria_measurable (every metric needs a sourced threshold or
    documented absence of one)
  - unacceptable_failure_mode (every failure mode needs ≥1 source describing
    detection or known cases)

Compute the set of dow_criterion_refs you must cover. This is your search target.

### Step 2 — Browser-driven exploration
Use playwright-cli + cloakbrowser. Never use the --browser flag.

For each search:
  - Start broad, narrow toward your target dow_criterion_refs
  - Follow internal links 1-2 hops deep
  - Read pages, not just titles
  - Capture URL, page title, and one or more candidate quotes per claim

### Step 3 — Mechanical filter
For each candidate source: invoke tools/filter.mjs.

  node ../../../tools/filter.mjs --workspace <path> --urls <jsonfile>

filter.mjs checks: HEAD-request 2xx/3xx, domain not blocklisted, repo health if
github URL (stars > 0 OR last_commit < 2y). Rejected sources go to your notes,
not to the ledger.

### Step 4 — Source scoring (6 dimensions, 0-5 each)
For each source kept, score per refs/quality_rubric.md:
  - authority: how authoritative for this domain?
  - recency: how current? (vendor docs current = 5; 10yo blog = 1)
  - reproducibility: can claims be independently verified?
  - implementation_relevance: how directly does it inform building?
  - independence: independent source or derivative?
  - conflict_of_interest: does the source have incentives to mislead? (5 = clean)

Composite = mean of all six.

Append entry to source_ledger.yaml:
  - id format: src-<short-slug>
  - lane: production
  - ttl_days: 90 (override in notes if you think otherwise)
  - flags: leave empty unless you see something (audit.mjs will set link-dead etc.)

### Step 5 — Claim extraction
For each source, extract claims that affect ≥1 dow_criterion_ref.

For each claim:
  - claim_text: 1-2 sentences, your wording
  - verbatim_quote: ≤25 words, literal match on the page (test by grep before
    committing — if you can't grep it, you can't use it)
  - severity: from DoW mapping per refs/severity_calibration.md:
    - affects unacceptable_failure_mode marked safety_critical → critical
    - affects hard_constraint OR unacceptable_failure_mode (non-safety) → critical
    - affects success_criteria_measurable → high
    - affects success_criteria_subjective → medium
    - background context only → low
    - obvious / definitional → trivial
  - dow_criterion_refs: list of DoW criterion ids this claim affects (≥1)
  - entailment: per refs/entailment_calibration.md:
    - quote literally states the claim → directly_supported
    - quote implies/suggests it → weakly_supported
    - claim extends quote's scope → extrapolated
    - quote contradicts the claim → contradicted (still write it; flag)
    - claim not yet checked against quote → unverified (you should fix this)
    - claim is hypothetical → speculative
  - mechanism: one sentence on how the claim transfers to the artifact mechanism

Append to claim_ledger.yaml.

### Step 6 — Volume contract
- Floor: 5 claims (count pivot claims toward this floor)
- Target: per mode (5/8-10/12-15)
- Ceiling: per mode (7/12/18)

If below floor after honest search (Steps 2-5 exhausted): run pivot procedure
per refs/pivot_procedure.md. Pick a proxy topic that still informs the DoW.
Flag pivot in your closing block.

### Step 7 — Closing block
Append to bottom of source_ledger.yaml as a comment block:

  # ---LANE_SUMMARY---
  # lane: production
  # findings_count: <N>
  # mode: <quick|standard|deep>
  # pivot_taken: <true|false>
  # pivot_proxy_topic: <str, if pivoted>
  # under_sourced: <true|false>
  # notes: <free text — interpretive choices, ambiguities, exclusion rationales>
  # ---END---

## Stop conditions
- Reached ceiling
- 30 minutes elapsed
- Three consecutive empty searches
- dow_criterion_refs coverage ≥ 95% by claim-to-criterion mapping
- Pivot exhausted and still below floor → mark under_sourced=true, return

## Hard rules
- No claim without a verbatim_quote that literally exists on the page (grep test).
- No claim without an entailment grade.
- No claim without ≥1 dow_criterion_ref.
- Do not infer values that aren't in the source. If unsure: entailment=weakly_supported.
- Do not edit other lanes' output files.
- Do not read other lanes' output files during your run (after fan-out: ok).
- All schema fields are required; write a default if uncertain, never omit.
```

Community lane (`community.md`) differs at:
- Source criteria: forums, GitHub Issues, war-story blogs, datasets, public talks
- Search strategies: Stack Overflow tag pages, GitHub Issues with `resolution`/`bug`/`workaround` labels, Reddit subreddit recent threads
- Quality scoring calibration: authority lower ceiling (typically 0-3 for forum posts); independence/conflict-of-interest emphasized
- Severity mapping unchanged

Frontier lane (`frontier.md`) differs at:
- Source criteria: contrarian takes, cross-domain analogues, outlier results, debates, refutations
- Search strategies: critique sections of papers, "considered harmful" essays, cross-disciplinary applications
- Floor: 3 (lower; high variance expected)
- Every claim emits `intended_use: tier2_seed`
- Mode gate: only spawned when `meta.mode == deep`

---

## 8. Hooks, gates, tools — full contracts

### 8.1 Naming convention (D6)

| Category | Where | Invoked by | Blocks? |
|---|---|---|---|
| **hooks** | `hooks/*.mjs` | Claude Code harness (settings.json) | Yes if exit 2 (PreToolUse, Stop) |
| **gates** | `gates/*.mjs` | Agent skill via Bash tool | Yes if exit 1 (phase exit blocked) |
| **tools** | `tools/*.mjs` | Agent skill via Bash tool | No (returns data; never blocks) |

### 8.2 hooks/post_code.mjs (PostToolUse)

```
Trigger: settings.json matcher "Edit|Write|NotebookEdit"
Inputs:  stdin JSON from Claude Code hook payload {tool_name, file_path, ...}
Action:
  1. If file_path is inside workspaces/ AND ends in .yaml:
       run ledger.validate(file_path) → write result to hook_log.jsonl
  2. If file_path is source code (.mjs|.ts|.js|.py|...):
       run project-detected linter (eslint/prettier/biome/...) on file
       if a test exists for the file, run it
Outputs: stdout = optional advisory; stderr = error
Exit:    0 always (PostToolUse is advisory)
```

### 8.3 hooks/enforce_tier_firewall.mjs (PreToolUse)

```
Trigger: settings.json matcher "Edit|Write|Bash"
Inputs:  stdin JSON {tool_name, file_path?, command?, ...}
Action:
  1. Detect active forger workspace from cwd or env FORGER_WORKSPACE.
  2. If no workspace active → exit 0 (skip).
  3. If tool would write to a non-workspace path:
     a. Read workspaces/{slug}/tier2_speculation.md and tier3_proposals.md.
     b. Extract every {idea, frontier_seed_refs, promoted_at} block.
     c. If proposed write content (new_string for Edit, content for Write,
        command body for Bash) substantially overlaps a non-promoted Tier 2/3
        block (≥60% bigram overlap on stopword-stripped content) → block.
  4. Else exit 0.
Outputs: stderr = structured JSON {level: 'error', code: 'tier_firewall',
                                   message, suggested_action}
Exit:    0 = allow; 2 = block (Claude Code reprompts agent)
```

### 8.4 hooks/enforce_done_means_ran.mjs (Stop)

```
Trigger: Stop hook (every stop attempt)
Inputs:  stdin JSON {transcript_path, ...}
Action:
  1. Detect active forger workspace from env or cwd.
  2. If none → exit 0.
  3. Tail the last 20 agent messages from transcript_path. Scan for completion
     claims: "done", "complete", "finished", "passed", "shipped", "ready",
     "all tests pass", "✓" or "✅" near "done"/"complete".
  4. If no completion claim → exit 0.
  5. If completion claim found:
     a. Read workspaces/{slug}/acceptance_results.jsonl.
     b. Group by criterion_id. For each required criterion (from dow.yaml
        success_criteria_measurable + hard_constraints), latest line must have
        passed=true.
     c. If any required criterion missing or has passed=false → exit 2 with
        explicit reason.
  6. Else exit 0.
Outputs: stderr = structured JSON {level, code, message: "Done Means Ran:
                                   <criterion_id> not passing. Run gates/
                                   acceptance_test.mjs or fix and re-run.",
                                   suggested_action}
Exit:    0 = allow stop; 2 = block (Claude Code reprompts agent)
```

### 8.5 gates/audit.mjs

```
Invocation: node gates/audit.mjs --workspace <path> [--phase find|grill]
Action:
  1. AJV-validate source_ledger.yaml and claim_ledger.yaml against schemas.
  2. For each source: HEAD-request URL (5s timeout); flag link-dead on
     non-2xx/3xx.
  3. For each claim: curl -s the source URL (no JS), grep verbatim_quote
     literally; flag quote-not-found on miss.
  4. If ≥2 lanes ran (deep mode or standard): bigram anti-redundancy check
     between frontier and {production+community} lane claims; ≥30% overlap →
     flag redundant-with-other-lane.
  5. Lineage: every claim_ledger.source_id exists in source_ledger; flag
     orphan-claim otherwise.
  6. Independence: every critical claim has ≥2 sources with independence ≥ 4;
     flag (not block).
  7. Write flag updates back to the ledgers (append to flags arrays).
Outputs: stdout JSON {passed: bool, errors: [...], warnings: [...]}
         appends one line to workspaces/{slug}/hook_log.jsonl
Exit:    0 = passed; 1 = schema validation failed or critical missing fields
                       (phase cannot exit)
```

### 8.6 gates/acceptance_test.mjs

```
Invocation: node gates/acceptance_test.mjs --workspace <path>
Inputs:     workspaces/{slug}/dow.yaml
Action:
  1. For each entry in dow.success_criteria_measurable:
     - Run test_method as subprocess (timeout 5min default).
     - Capture stdout, stderr, exit, duration.
     - Append line to acceptance_results.jsonl:
       {ts, criterion_id, type: 'measurable', passed: bool, expected, actual,
        duration_ms, exit, output_snippet}
  2. For each entry in dow.hard_constraints:
     - Run verification_method.
     - Same line format with type: 'hard_constraint'.
  3. For each entry in dow.unacceptable_failure_modes:
     - Run detection_method; passed = !triggered (failure mode must NOT fire).
     - Same line format with type: 'failure_mode'.
  4. For each entry in dow.success_criteria_subjective:
     - Emit prompt to stderr asking agent to evaluate via measurement_protocol.
     - Wait? No — agent runs separately, then re-invokes this gate. Skip in
       this run, mark type: 'subjective_pending'.
Outputs: stdout summary {required_passed, required_failed, subjective_pending}
Exit:    0 = all required passed; 1 = any required failed
```

### 8.7 tools/filter.mjs

```
Invocation: node tools/filter.mjs --workspace <path> --urls <jsonfile>
Inputs:     JSON array of {url, candidate_title, lane} from a FIND lane
Action:     Mechanical only (invariant 8):
  - HEAD-request URL (5s); reject on non-2xx/3xx
  - Reject if URL host in config/domain_blocklist.txt (e.g. known scraper
    farms, AI-generated content sites)
  - Extract publication date (meta og:article:published_time, schema.org
    DatePublished, dateline parsing); fail-soft (omit if not found)
  - If host is github.com: GET repo metadata via REST API, check
    stargazers_count >= 1 AND pushed_at within last 2 years
Outputs: stdout JSON {kept: [{url, title, accessed_at, github_meta?}],
                      rejected: [{url, reason}]}
Exit:    0 always
```

### 8.8 tools/probe.mjs

```
Invocation: node tools/probe.mjs --workspace <path> --assumption-id <id>
                                  --type <type> --cmd <inline-command>
                                  [--timeout-ms 60000]
Action:
  1. Create sandbox dir workspaces/{slug}/probe-sandbox/{assumption_id}/.
  2. Run cmd with cwd=sandbox, timeout, captured stdout/stderr.
  3. Build probe_result:
     - id: gen UUID short
     - assumption_ref: <id>
     - probe_type: <type>
     - command_or_code: <cmd>
     - expected: (probably blank; skill writes it separately)
     - actual: captured stdout (truncated to 8000 chars)
     - passed: subprocess exit == 0
     - duration_ms: measured
     - ran_at: now ISO
     - environment_notes: Node version, OS, network availability
     - evidence: stderr + last 2000 chars of stdout
  4. Append result line to workspaces/{slug}/probe_results.jsonl.
  5. AJV-validate against schemas/probe_result.schema.yaml.
Outputs: stdout = full probe_result JSON
Exit:    0 if probe ran successfully (regardless of pass/fail);
         1 if probe couldn't execute (timeout, sandbox failure)
```

### 8.9 tools/update_kb.mjs

```
Invocation: node tools/update_kb.mjs --workspace <path>
Inputs:     workspaces/{slug}/retro_note.yaml,
            workspaces/{slug}/source_ledger.yaml,
            workspaces/{slug}/claim_ledger.yaml
Action:
  1. AJV-validate retro_note.yaml. Halt on schema fail.
  2. Compute domain_slug from retro_note.
  3. Ensure knowledge/{domain_slug}/ exists with seeded files
     (index.yaml, source_ledger.yaml, claim_ledger.yaml, failure_memory.yaml,
      working_architectures.md, ground_truth_brief.md, telemetry.jsonl).
  4. For each proven_claim_id:
     - Read claim from workspace claim_ledger; resolve underlying source.
     - Merge claim into KB claim_ledger.yaml (dedupe by id).
     - Merge source into KB source_ledger.yaml (dedupe by id).
     - Set expires_at = now + ttl_days (default 90, or retro_note.ttl_overrides).
  5. For each failed_assumption:
     - Append to KB failure_memory.yaml.
  6. If retro_note.working_architecture_ref:
     - Read referenced file; append heading + content to working_architectures.md.
  7. Increment index.yaml.tasks_<status> counter.
  8. Check last 3 task statuses in telemetry.jsonl; if all 'shipped' →
     set index.yaml.shortcut_eligible = true.
  9. Append one line to KB telemetry.jsonl: {ts, task_id, mode, token_used,
     duration_ms, status}.
Outputs: stdout = summary
Exit:    0 on success; 1 on schema fail or write error
```

---

## 9. `_lib/` shared utilities

### 9.1 `_lib/config.mjs`

```
Exports:
  getConfig(workspacePath) -> {
    mode,                  // loaded from modes/{mode}.yaml
    env,                   // loaded from .env via dotenv
    schemaPaths,           // map schema name -> absolute path
    kbPath,                // knowledge/{domain_slug}
    workspacePath,         // workspaces/{slug}-{date}
    pluginRoot,            // framework/forger/
  }
  loadMode(modeName) -> mode object
  resolveDomainPath(domainSlug) -> path
```

### 9.2 `_lib/ledger.mjs`

```
Exports:
  // Validators (return {valid, errors})
  validateDoW(obj)
  validateSourceEntry(obj)
  validateClaimEntry(obj)
  validateRiskMap(obj)
  validateFailureHypothesis(obj)
  validateProbeResult(obj)
  validateRetroNote(obj)

  // I/O
  readYaml(path) -> object
  writeYaml(path, obj) -> void          // round-trips schema header comment
  appendJsonl(path, obj) -> void
  readJsonl(path) -> [object]

  // Append helpers (validate + append, atomic via write-rename)
  appendSourceEntry(workspacePath, entry)
  appendClaimEntry(workspacePath, entry)
  appendProbeResult(workspacePath, entry)

AJV instance is module-singleton with all schemas pre-loaded.
```

### 9.3 `_lib/reviewer_router.mjs`

```
Exports:
  invokeReviewer(systemPrompt, userPrompt, opts) -> {
    tier,                  // 'best' | 'good' | 'acceptable' | 'weak'
    response,              // string text from reviewer
    reviewer_meta: {
      provider,
      model,
      key_source,          // 'env' | 'subagent'
      duration_ms,
      tokens_used
    }
  }

  opts = { blind?: boolean, mode?: string, timeout_ms?: number }

Algorithm (see §10 for full):
  1. detectSessionProvider()
  2. parseEnvUncommented('.env')
  3. filter to different-provider keys
  4. rank by tier_priority (configurable)
  5. ping each candidate; drop unreachable
  6. invoke top-ranked adapter
  7. on failure: cascade to next candidate
  8. if all fail: fallback to same-provider different-model subagent
  9. tag result with achieved tier
```

### 9.4 `_lib/playwright.mjs`

```
Exports:
  openPage(url) -> Page handle               // playwright-cli open <url>
  getPageText(url) -> string                 // raw text (no JS render path)
  headRequest(url) -> {status, headers}
  grepQuote(pageText, quote) -> boolean      // literal substring search

NEVER passes --browser flag (per CLAUDE.md project rule).
Uses PLAYWRIGHT_MCP_EXECUTABLE_PATH from env if set.
```

### 9.5 `_lib/kb.mjs`

```
Exports:
  loadDomain(slug) -> {index, sourceLedger, claimLedger, failureMemory, ...}
  saveDomain(slug, partial) -> void
  pruneExpired(file) -> {kept, removed}
  isShortcutEligible(slug) -> boolean
  countShippedTasks(slug, lastN=3) -> integer
  computeCoverage(domainClaims, dowCriterionIds) -> number 0..1

All writes validated against their schemas via _lib/ledger.mjs.
```

### 9.6 `_lib/adapters/`

Each adapter exports:

```
invoke(systemPrompt, userPrompt, opts) -> {
  text,
  model_used,
  tokens_in,
  tokens_out,
  duration_ms
}
ping() -> boolean      // cheap healthcheck request (or static check)
provider -> 'openai' | 'gemini' | ...
defaultModel -> string
familyOf(model) -> string  // e.g. 'gpt-5', 'gemini-2.5'
```

Adapter implementations are small (~50-100 lines each). They wrap the provider's HTTPS API or shell-out (for `codex_cli` and `subagent_fallback`).

---

## 10. Reviewer router — priority gate

User-defined priority gate logic (D3). Code lives in `_lib/reviewer_router.mjs`.

```js
// Pseudocode for invokeReviewer:

function invokeReviewer(systemPrompt, userPrompt, opts = {}) {
  const sessionProvider = detectSessionProvider();
    // reads CLAUDE_CODE_MODEL or env signals; returns 'anthropic' / 'openai' / ...

  const envKeys = parseEnvUncommented('.env');
    // returns [{provider: 'openai', key: '...'}, ...] in file order

  // Optional override: FORGER_REVIEWER_PROVIDER + FORGER_REVIEWER_MODEL
  if (process.env.FORGER_REVIEWER_PROVIDER) {
    return invokeForced(process.env.FORGER_REVIEWER_PROVIDER,
                        process.env.FORGER_REVIEWER_MODEL);
  }

  // Tier 'best': different provider + (assumed) different family
  const diffProvider = envKeys.filter(k => k.provider !== sessionProvider);
  const ranked = rankByTier(diffProvider, tierPriority);
  for (const cand of ranked) {
    if (await adapters[cand.provider].ping()) {
      const result = await adapters[cand.provider].invoke(
        systemPrompt, userPrompt, { key: cand.key, ...opts });
      return { tier: 'best', response: result.text,
               reviewer_meta: { provider: cand.provider,
                                model: result.model_used,
                                key_source: 'env',
                                duration_ms: result.duration_ms,
                                tokens_used: result.tokens_in + result.tokens_out } };
    }
  }

  // Tier 'good': same provider, but a key exists for a different model family
  // (e.g. session is OpenAI gpt-5; .env has OpenAI key for gpt-4o-realtime variant)
  // — usually not the case, so this branch is rare.
  const sameProvider = envKeys.filter(k => k.provider === sessionProvider);
  for (const cand of sameProvider) {
    const altModel = pickDifferentFamilyModel(cand.provider, sessionModel);
    if (altModel && await adapters[cand.provider].ping(altModel)) {
      const result = await adapters[cand.provider].invoke(
        systemPrompt, userPrompt, { key: cand.key, model: altModel, ...opts });
      return { tier: 'good', response: result.text,
               reviewer_meta: { ..., model: altModel, key_source: 'env' } };
    }
  }

  // Tier 'acceptable': same provider, same family, different model size/tier
  // Implemented by spawning a Claude Code subagent (no API key needed)
  if (sessionProvider === 'anthropic') {
    const executorModel = sessionModel;
    const reviewerModel = (executorModel.includes('sonnet')
                           ? 'claude-opus-4-7' : 'claude-sonnet-4-6');
    const result = await adapters.subagent_fallback.invoke(
      systemPrompt, userPrompt, { model: reviewerModel, ...opts });
    return { tier: 'acceptable', response: result.text,
             reviewer_meta: { provider: 'anthropic',
                              model: reviewerModel,
                              key_source: 'subagent' } };
  }

  // Tier 'weak': last resort — same model reviewing itself with adversarial framing
  const result = await adapters.subagent_fallback.invoke(
    systemPrompt, userPrompt + '\n\n[CRITICAL: review as if from a different model family.]',
    { model: sessionModel, ...opts });
  return { tier: 'weak', response: result.text, reviewer_meta: { ... } };
}
```

Tier priority order (config, edit in `_lib/config.mjs`):

```yaml
tier_priority:
  - openai
  - google
  - anthropic
  - xai
  - mistral
  - qwen
  - glm
  - kimi
  - deepseek
```

`.env.example`:

```bash
# Uncomment any keys you have. Router picks the highest-priority working key
# that differs from the current session's provider.

# OPENAI_API_KEY=
# GEMINI_API_KEY=
# ANTHROPIC_API_KEY=
# XAI_API_KEY=
# MISTRAL_API_KEY=
# QWEN_API_KEY=
# GLM_API_KEY=
# KIMI_API_KEY=
# DEEPSEEK_API_KEY=

# Optional overrides
# FORGER_REVIEWER_PROVIDER=        # force a specific provider (skips ranking)
# FORGER_REVIEWER_MODEL=            # force a specific model
# FORGER_REVIEWER_TIMEOUT_MS=120000
```

Mode requirements on `reviewer_tier`:

| Mode | grill_required | min_tier required | dual_reviewer |
|---|---|---|---|
| quick | false | n/a | no |
| standard | true | acceptable | no |
| deep | true | good | yes (one blind) |

Standard mode with only 'weak' available → GRILL emits a warning to user and continues; user can promote workspace to deep.

---

## 11. Modes (full configs)

### `modes/quick.yaml`

```yaml
mode: quick
description: Trusted-domain shortcut. Production lane only. Minimal probes.
token_budget_cold: 6000
token_budget_warm: 2500
lanes: [production]
recombine_tiers_allowed: [1]
grill_required: false
grill_blind_reviewer: false
grill_min_reviewer_tier: any
probe_severity_threshold: critical
probe_waivers_allowed: true
acceptance_test_required: true
done_means_ran_strict: true
extended_acceptance_suite: false
```

### `modes/standard.yaml`

```yaml
mode: standard
description: Default. Production + community lanes. Single cross-model reviewer.
token_budget_cold: 22000
token_budget_warm: 9000
lanes: [production, community]
recombine_tiers_allowed: [1, 2]
grill_required: true
grill_blind_reviewer: false
grill_min_reviewer_tier: acceptable
probe_severity_threshold: high
probe_waivers_allowed: true
acceptance_test_required: true
done_means_ran_strict: true
extended_acceptance_suite: false
```

### `modes/deep.yaml`

```yaml
mode: deep
description: Three lanes including frontier. Dual reviewer (one blind). No probe waivers.
token_budget_cold: 35000
token_budget_warm: 14000
lanes: [production, community, frontier]
recombine_tiers_allowed: [1, 2, 3]
grill_required: true
grill_blind_reviewer: true
grill_min_reviewer_tier: good
probe_severity_threshold: high
probe_waivers_allowed: false
acceptance_test_required: true
done_means_ran_strict: true
extended_acceptance_suite: true
```

Mode selection lives in CONTRACT (§6.2 step 5), not in code.

---

## 12. Invariant enforcement matrix

Reproducing the table from §3 of `FORGER.md`, with the exact enforcement location in this v0.1 build.

| # | Invariant | Enforcement |
|---|-----------|-------------|
| 1 | **Done Means Ran** | `hooks/enforce_done_means_ran.mjs` (Stop hook) — blocks stop unless `acceptance_results.jsonl` has all required criteria passing |
| 2 | **No Claim Without Evidence or Label** | `gates/audit.mjs` + AJV schema validation — claim missing entailment, verbatim_quote, or severity fails validation |
| 3 | **Test Critical, Skip Trivial** | OBSERVE SKILL.md procedure step 3 — severity table dictates `resolution_required`; trivial/low need no probes |
| 4 | **Tier 2/3 Firewall** | `hooks/enforce_tier_firewall.mjs` (PreToolUse) — blocks Edit/Write/Bash with content traceable only to tier2/3 files without `promoted_at` |
| 5 | **Cross-Model Review (standard + deep)** | `_lib/reviewer_router.mjs` priority gate; GRILL SKILL.md gate 4 enforces `reviewer_tier ≥ mode.grill_min_reviewer_tier` |
| 6 | **Mechanism-Fit Before Recombination** | RECOMBINE SKILL.md gate 2 — every Tier 1 idea has populated `mechanism_fit_check` with `fit_verdict ∈ {ok, partial}` |
| 7 | **Knowledge Self-Evolves** | `tools/update_kb.mjs` after every task; shortcut detection in `_lib/kb.mjs::isShortcutEligible` |
| 8 | **Scripts Are Mechanical Only** | Convention enforced by review: only `_lib/reviewer_router.mjs` may invoke an LLM, and only when called from GRILL skill. `dev/scripts/validate_all_schemas.mjs` lints hook/gate/tool sources for LLM-invocation patterns. |
| 9 | **Definition of Works Is the Single Source of Truth** | DoW is read-only after CONTRACT exits; reframe-during-execute writes `dow.v2.yaml` and pauses for user; every gate references `dow_criterion_refs` |

---

## 13. Implementation order

v0.1 build order. Each step has a verification gate. Build incrementally; don't skip.

1. **Scaffold root.** Create `framework/forger/` (done). Add `README.md`, `manifest.json`, `package.json`, `.env.example`, `.gitignore`. Verify: `node -e "require('./framework/forger/package.json')"` works.
2. **Write all 7 schemas** in `schemas/`. Verify: `dev/scripts/validate_all_schemas.mjs` self-validates every schema against JSON Schema meta-schema.
3. **Write all templates** in `templates/` matching schemas. Verify: each template AJV-validates against its schema.
4. **Implement `_lib/ledger.mjs`** (AJV + YAML I/O). Verify: `dev/tests/ledger.test.mjs` passes (load every template, validate, round-trip write).
5. **Implement `_lib/config.mjs`** (mode loader, .env loader). Verify: load each mode YAML and assert keys.
6. **Implement `_lib/kb.mjs`** (KB I/O + TTL + shortcut). Verify: `dev/tests/kb.test.mjs` passes.
7. **Implement `_lib/playwright.mjs`** (cloakbrowser wrapper). Verify: `headRequest('https://example.com')` returns 200.
8. **Implement `gates/audit.mjs`** + tests. Verify against `dev/fixtures/sample_source_ledger.yaml`.
9. **Implement `tools/filter.mjs`** + tests.
10. **Implement `tools/probe.mjs`** + tests (sandbox + timeout).
11. **Implement `gates/acceptance_test.mjs`** + tests.
12. **Implement `tools/update_kb.mjs`** + tests.
13. **Implement `_lib/reviewer_router.mjs`** + 1 adapter (subagent_fallback first; no key needed). Verify: tier='acceptable' branch works end-to-end.
14. **Add remaining adapters** (openai, gemini, anthropic, ...) as stubs that throw 'not implemented' until tested with a real key.
15. **Implement `hooks/post_code.mjs`** + register in `hooks/settings.hooks.json`.
16. **Implement `hooks/enforce_tier_firewall.mjs`** + register.
17. **Implement `hooks/enforce_done_means_ran.mjs`** + register.
18. **Write `phases/contract/SKILL.md`** + refs + examples. Verify: agent can run CONTRACT standalone and produce valid DoW.
19. **Write `phases/find/SKILL.md`** + lane mandates (production.md fully fleshed, community.md and frontier.md following same template) + refs. Verify: spawn a 1-lane FIND run on a simple DoW.
20. **Write `phases/observe/SKILL.md`** + refs + examples.
21. **Write `phases/recombine/SKILL.md`** + refs.
22. **Write `phases/grill/SKILL.md`** + refs (including adversary_mandate.md).
23. **Write `phases/execute/SKILL.md`** + refs.
24. **Write `phases/retain/SKILL.md`** + refs.
25. **Write orchestrator `SKILL.md`** at root.
26. **Write `dev/scripts/install.mjs`**: copies/symlinks `framework/forger/` to `~/.claude/plugins/forger/`, merges `hooks/settings.hooks.json` into `~/.claude/settings.json` after showing diff.
27. **End-to-end smoke test:** run `/forger` on a trivial task (e.g. "write a Node.js function that parses ISO8601 dates"). Confirm: workspace created, all phase artifacts produced, acceptance test passes, KB updated, Done Means Ran enforced.

Each step is one commit. CLAUDE.md project rule "Commit every turn" applies.

---

## 14. Open questions (for future passes; not blocking v0.1)

These were surfaced but deferred. Document them so they don't get forgotten.

- **Cost telemetry granularity.** Currently per-phase. Per-tool? Per-hook? Probably overkill for v0.1.
- **Probe sandboxing on Windows.** Node `child_process.spawn` with timeout + cwd is the v0.1 implementation. Long-term: containerized probes (Docker) for hostile code. Out of scope for v0.1.
- **KB merge conflicts across concurrent tasks on same domain.** Locking via `knowledge/{domain}/.lock` file (advisory). v0.1: assume one task at a time per domain.
- **Reviewer router caching.** Cache `ping()` results within a session to avoid repeat checks. v0.1: ping every time.
- **Adapter for codex CLI.** Implemented as `_lib/adapters/codex_cli.mjs` that shells out to the `codex` command; tested only if codex is on PATH.
- **Multi-language post_code linter dispatch.** v0.1: detect `package.json` → run npm script `lint`; detect `pyproject.toml` → run ruff; else skip. Add languages as needed.
- **Browser usage in audit.** Quote-grep is currently `curl + grep`, no JS render. For JS-rendered pages, audit can't verify quotes. v0.1: accept this; mark JS-rendered sources with `flags: [js-rendered]`. Future: optional playwright-cli render path for high-stakes claims.
- **Gnosis archival.** Move `reTruth/skills/gnosis/` to `reTruth/_archive/gnosis-v1/` after FIND ships. Not a code change; just file move + CLAUDE.md update.
- **Tier firewall false positives.** `enforce_tier_firewall.mjs` uses 60% bigram overlap as fuzzy detection. Legitimate Tier 1 ideas that share vocabulary with Tier 2 entries may be blocked. Mitigation: orchestrator inserts explicit `[tier2:<id>]` markers on promotion; firewall whitelists content matching marker-tagged entries. v0.1 ships fuzzy-only; mitigation is a v0.2 task.
- **Re-entry FIND budget.** Re-entry runs single-lane production. Token budget for re-entries is not allocated separately from main mode budget. v0.1: re-entry tokens count against total budget; if total exceeds 2× mode budget, orchestrator escalates regardless of acceptance results.

---

## 15. Glossary

- **DoW** — Definition of Works. Machine-readable YAML produced by CONTRACT. Single source of truth.
- **Lane** — One of three FIND subagents: production / community / frontier. Mode-aware.
- **Severity** — 5-level (trivial/low/medium/high/critical) tag on a claim, tied to a DoW criterion.
- **Entailment** — 6-level grade of how strongly a source supports a claim (directly_supported / weakly_supported / extrapolated / contradicted / unverified / speculative).
- **Probe** — Smallest test that can falsify an assumption. Runs in sandbox via `tools/probe.mjs`.
- **Tier 1/2/3** — Creativity tier per Boden. T1 = grounded recombination. T2 = speculation with validation plan. T3 = transformational. Firewalled.
- **Done Means Ran** — Invariant 1. No completion without execution + passing acceptance tests.
- **KB shortcut** — When `index.yaml.shortcut_eligible == true` and cached sources cover ≥80% of DoW criteria, FIND skips lane fan-out.
- **Reviewer tier** — Achieved level of cross-model review: best / good / acceptable / weak (D3 priority gate).
- **Hook** — Harness-invoked script (settings.json). Always fires on its event.
- **Gate** — Agent-invoked validator. Blocks phase exit on failure (exit 1).
- **Tool** — Agent-invoked utility. Returns data; never blocks.

---

## 16. Next step

After your review of this spec, the next step is to invoke the `superpowers:writing-plans` skill to produce a step-by-step implementation plan keyed to §13 above, and then execute.
