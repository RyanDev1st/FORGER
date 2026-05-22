# Using FORGER

Install, run, resume, debug. Covers the CLI and the file layout you will be looking at when something needs attention.

---

## Prerequisites

| Component | Version | Why |
| --- | --- | --- |
| Node.js | ≥ 20 | The orchestrator, hooks, and reviewer router run on Node |
| Python | ≥ 3.10 | Some probes and the KB index tools are Python |
| Playwright | latest | Drives the stealth browser for FIND and EXECUTE web searches |
| `cloakbrowser` | latest | Bot-protection bypass; required for live FIND |
| Claude Code | latest | The current supported host. Other hosts in progress. |

Optional but useful: an API key for a second model family (OpenAI, Gemini, or a second Anthropic account) so GRILL can run cross-family reviews. Without one, GRILL falls back to a same-family-different-model review, which is weaker but still useful.

---

## Install

### Path A — npm (target state, v0.2)

```bash
npm install -g forger-framework
forger --version
```

The npm package will register the plugin to your Claude Code config and copy hooks to the right place. Tracking issue: [FORGER_FLAWS #1](../framework/FORGER_FLAWS.md#flaw-1).

### Path B — local marketplace shim (current, v0.1)

Until the packaging is fixed, install via the local shim:

```bash
git clone https://github.com/your-org/forger.git
cd forger
node src/dev/install.mjs --target ~/.claude/plugins/cache/forger-local-marketplace/forger/0.1.0
```

The shim handles the path layout that Claude Code expects. The framework itself is identical between the two install paths.

### Verify

```bash
forger doctor
```

This checks:
- Node + Python versions
- Playwright + cloakbrowser binaries
- Plugin registration with Claude Code
- Reviewer router adapters (warns if no cross-family adapter is configured)
- Workspace permissions

Fix every red line before running tasks.

---

## Initialise a workspace

```bash
cd my-project
forger init
```

This creates:

```
my-project/
├── .forger/
│   ├── config.yaml              # workspace-level config
│   ├── workspaces/              # per-task workspaces live here
│   └── knowledge/               # persistent KB (shared across tasks)
```

Workspace-level config example:

```yaml
# .forger/config.yaml
default_mode: standard
reviewer_router:
  primary: anthropic            # executor model family
  reviewer: openai              # different family for GRILL
  fallback: anthropic-sonnet    # same-family-different-model if cross-family fails
playwright:
  use_cloakbrowser: true
  headless: true
  navigation_timeout_ms: 30000
budgets:
  cold_tokens_warn: 50000       # emit warning above this
  cold_tokens_hard_cap: 800000  # abort above this
knowledge_base:
  ttl_overrides:
    ios: 18 months
    ml-libraries: 6 months
```

---

## Run a task

```bash
forger run "Build a real-time facial emotion classifier for iOS"
```

You will be dropped into the CONTRACT phase first. The pipeline walks itself from there.

Optional flags:

```bash
forger run "..." \
  --mode standard \              # quick | standard | deep
  --autonomous \                 # CONTRACT uses conservative assumptions, no questions
  --domain ios-emotion-classification \  # explicit domain (else inferred)
  --workspace-name emotion-v1    # else timestamped slug
```

---

## Modes

| Mode | When | Cold budget* | Key differences |
| --- | --- | --- | --- |
| `quick` | Same domain as a previous run, trivial task | ~5–6k tokens | KB-only FIND, trimmed probes, optional GRILL, Tier 1 only |
| `standard` | Default | ~22k (theoretical) / ~700k observed on cold runs | Full pipeline, single cross-model reviewer |
| `deep` | Novel domain, high stakes, overnight autonomy | ~35k+ | Dual reviewer (cross-model + blind), no waivers on critical probes, extended acceptance |

*Token budgets are being recalibrated against real telemetry. The `standard` cold-run figure is much higher than the theoretical budget. Tracking: [FORGER_FLAWS #6](../framework/FORGER_FLAWS.md#flaw-6).

---

## Resume an interrupted run

Every phase writes state to disk before advancing. If the agent session limit was hit mid-FIND, the partial source ledger is already on disk.

```bash
forger resume .forger/workspaces/emotion-2026-05-22/
```

The resume command reads the last completed gate and continues from the next phase. If a phase was mid-run when interrupted, it restarts that phase from its first step (lanes re-fan-out, probes re-run, micro-cycles restart).

---

## Common commands

```bash
forger run "..."                  # start a new task
forger resume <workspace-path>    # resume an interrupted run
forger status                      # show active workspaces and their phase
forger status --domain ios         # filter by domain
forger doctor                      # health check
forger kb show <domain>            # inspect a domain's knowledge base
forger kb forget <domain>          # wipe a domain's KB (with confirmation)
forger artifacts <workspace>       # print artifact path + acceptance report
forger audit <workspace>           # rerun audit.sh on a completed workspace
```

---

## File layout of a workspace

After a complete run:

```
.forger/workspaces/emotion-2026-05-22/
├── definition_of_works.yaml         # CONTRACT output
├── reframe_memo.md                  # CONTRACT output
├── source_ledger.yaml               # FIND output
├── claim_ledger.yaml                # FIND output
├── ground_truth_brief.md            # FIND draft → OBSERVE final
├── risk_map.yaml                    # OBSERVE output
├── probe_results.jsonl              # OBSERVE output
├── proposals/
│   ├── tier1.md                     # RECOMBINE: executable
│   ├── tier2.md                     # RECOMBINE: firewalled
│   └── tier3.md                     # RECOMBINE: human-approval-required
├── failure_hypotheses.yaml          # GRILL output
├── review_report.md                 # GRILL output
├── artifact/                        # EXECUTE: the actual deliverable
│   └── EmotionClassifier/
│       ├── Package.swift
│       ├── Sources/
│       └── Tests/
├── test_log.jsonl                   # EXECUTE: TDD micro-cycle log
├── acceptance_report.md             # EXECUTE: final acceptance
└── retro_note.md                    # RETAIN: lessons learned
```

The KB lives outside the per-task workspace:

```
.forger/knowledge/
└── ios-emotion-classification/
    ├── runs.jsonl                   # append-only log of all runs in this domain
    ├── source_ledger.yaml           # surviving sources from prior runs
    ├── source_quality.yaml          # per-source authority/recency/repro scores
    ├── working_architectures.md     # patterns that delivered green acceptance
    ├── failure_memory.yaml          # assumptions that proved wrong
    └── index.yaml                   # metadata, TTLs, shortcut eligibility
```

---

## Troubleshooting

### `forger doctor` reports plugin not registered

The npm install path is currently broken. Use the local marketplace shim (see Install above). Tracking: [FORGER_FLAWS #1, #2, #3](../framework/FORGER_FLAWS.md).

### FIND lane returns under the floor

A lane needs at least 5 findings to clear the floor. If it returns fewer:

- The framework retries the lane up to 3 times (attempt 1 inline, 2 and 3 delayed 5 min each)
- After 3 failures, the lane is marked `under-sourced` and the run continues with partial data
- The DoW is annotated so RETAIN does not over-confidently bank lessons from a thin run

If this happens repeatedly for a domain, the domain ontology is probably too narrow. Try widening the query in CONTRACT or splitting the task.

### Probe gate fails

If OBSERVE has unresolved high/critical assumptions and no probe can be written:

```bash
forger waiver --workspace <path> --assumption <id> --reason "explain"
```

Waivers are logged and persist into the acceptance report. The pipeline proceeds, but RETAIN flags the resulting architecture as `waived-assumption` in the KB. Future runs will probe the same assumption rather than trusting the cached result.

### GRILL has no cross-family reviewer

If `reviewer_router` cannot reach a different model family:

- Configure an OpenAI or Gemini key in `.forger/config.yaml`
- Or: accept the fallback to same-family-different-model (e.g., Claude Opus reviewing Claude Sonnet)
- The acceptance report flags the run with `cross_family_review: false` so downstream consumers know

### EXECUTE escalates after 3 failed fixes

The TDD micro-cycle does not loop forever. After 3 fix attempts on a single behaviour:

1. The agent web-searches the exact error via cloakbrowser
2. Reads top results and proposes a fix derived from real sources
3. If that fails, the cycle escalates: writes the failure context to disk, pauses

Run `forger resume` after fixing manually, or `forger abort` to wind down cleanly.

### KB stale claims

The KB has TTLs. To force re-verification of a domain's cached sources:

```bash
forger kb refresh --domain ios-emotion-classification
```

This rebuilds `source_quality.yaml` and re-runs audit.sh against every cached URL.

---

## Patterns

### Run multiple related tasks back-to-back

Each run updates the KB. The third run in the same domain triggers Quick Forge eligibility.

```bash
forger run "Build emotion classifier" --domain ios-emotion
forger run "Add audio emotion classifier" --domain ios-emotion
forger run "Build emotion-tagged journaling UI" --domain ios-emotion
# Fourth run becomes quick-eligible automatically
```

### Run autonomously overnight

```bash
forger run "..." --autonomous --mode deep
```

CONTRACT will not ask questions. Every ambiguity becomes a tagged risk. Wake up and read `retro_note.md` first; it summarises what FORGER decided and why.

### Re-grade an old run

```bash
forger audit .forger/workspaces/some-old-run/
```

Re-runs `audit.sh` against the recorded ledgers. Useful for catching link rot or for re-validating after a KB refresh.

---

## What FORGER will not do for you

- Decide your acceptance criteria. CONTRACT will help you write them; it will not invent them.
- Run forever. Every phase has a budget. If the budget is hit, the run pauses, not silently continues.
- Pretend to succeed. Acceptance is binary. A red suite blocks completion.
- Hide failures. Failed assumptions and waivers are recorded in the KB on purpose.

---

## Next

- [Architecture](06-architecture.md) — plugin layout, schema details, audit internals
- [Demos](04-examples.md) — full walkthroughs
