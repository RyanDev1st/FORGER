# THE reTruth FRAMEWORK
**FORGER: A Test-Gated Pipeline for Grounded AI Creativity**

## 1. Executive Summary
reTruth ships as **FORGER v0.1**, a seven-phase pipeline (`Contract → Find → Observe → Recombine → Grill → Execute → Retain`) that turns a user query into a verified artifact by forcing every step through schema-validated state, mechanical audit gates, and a Done-Means-Ran completion bar. It replaces the original single-pass `/gnosis` 3-lane research skill (archived at `reTruth/_archive/gnosis-v1/`) with an end-to-end build loop: clarify intent, ground in real sources, internalize, recombine, adversarially review, execute under TDD, and persist learning. Each phase is an independently invocable skill; the orchestrator is the only thread that walks all seven.

## 2. Core Philosophy
True discovery requires the separation of divergent generation from convergent evaluation, and both from blind execution. FORGER enforces three structural separations: (a) **claim from quote** — every claim carries a verbatim, grep-verified citation; (b) **idea from mechanism** — every Tier 1 recombination passes a 5-question mechanism-fit check tying source-domain behavior to target-domain behavior; (c) **completion from claim of completion** — a Stop hook refuses to let the agent declare done unless the acceptance suite has actually run and passed. Creativity rides on top of grounding, not in place of it.

## 3. Pipeline Architecture: The Seven Phases
The orchestrator (`framework/forger/SKILL.md`) drives a sequential phase walk. State lives on disk; phases hand off via workspace files, not chat memory. Only FIND fans out subagents; all other phases run single-threaded.

| Phase | Slug | Purpose | Primary outputs |
| :--- | :--- | :--- | :--- |
| 0 CONTRACT | `forger-contract` | Socratic vagueness elicitation, reframe, mode pick | `dow.yaml`, `reframe_memo.md` |
| 1 FIND | `forger-find` | Mode-aware lane fan-out, ground every DoW criterion | `source_ledger.yaml`, `claim_ledger.yaml`, `find_summary.md` |
| 2 OBSERVE | `forger-observe` | Feynman internalization, risk map, probe high/critical assumptions, resolve blocked claims | `ground_truth_brief.md`, `risk_map.yaml`, `probe_results.jsonl` |
| 3 RECOMBINE | `forger-recombine` | Generate Tier 1 (grounded) / Tier 2 (speculative) / Tier 3 (transformational) ideas behind a firewall | `recombine.md`, optional `tier2_speculation.md`, deep-only `tier3_proposals.md` |
| 4 GRILL | `forger-grill` | Cross-model adversarial review (priority-gated provider router) | `failure_hypotheses.yaml`, `grill_report.md` |
| 5 EXECUTE | `forger-execute` | TDD micro-cycles (code), ledger-coverage (research), rubric+screenshot (design) | artifact files, `acceptance_results.jsonl`, optional `dow_addendum_{n}.yaml` |
| 6 RETAIN | `forger-retain` | Persist proven claims + failed assumptions to per-domain KB, decay stale | `retro_note.yaml`, mutations to `knowledge/{domain}/` |

**Concurrency cap:** 4 concurrent threads (orchestrator + max 3 subagents during deep-mode FIND). No other phase fans out beyond orchestrator + 1. **Re-entry:** EXECUTE may re-invoke FIND in single-lane mode (production only, target=3, no frontier) up to 2× to close fact gaps; 3rd attempt escalates.

## 4. FIND Lanes (the only fan-out point)
FIND spawns lanes per mode. Lanes are subagents with isolated context — the orchestrator never reads lane mandates; they are filesystem-injected at spawn from `framework/forger/skills/forger/phases/find/lanes/{lane}.md`.

| Lane | Mandate file | Quick mode | Standard mode | Deep mode | Floor (claims) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **production** | `lanes/production.md` | ✓ (5) | ✓ (8-10) | ✓ (12-15) | 5 |
| **community** | `lanes/community.md` | — | ✓ (8-10) | ✓ (12-15) | 5 |
| **frontier** | `lanes/frontier.md` | — | — | ✓ (5-7) | 3 (silent pivot) |

Source criteria differ by lane: production = official docs / peer-reviewed / vendor RFCs / working repos; community = forums, GitHub Issues, blog war stories, Reddit, HN, public talks, podcasts; frontier = contrarian takes, "considered harmful" essays, cross-domain analogues, debates. Every frontier claim is stamped `intended_use: tier2_seed` and feeds RECOMBINE's Tier 2 firewall.

## 5. State, Schemas, and the Knowledge Base
Per-task state lives at `framework/forger/workspaces/{slug}-{date}/`. Same topic + same date collisions resolve by appending `-v2`, `-v3`. Workspaces are gitignored runtime state; the persistent layer is `framework/forger/knowledge/{domain_slug}/` (version-tracked).

Every workspace artifact is JSON-Schema-validated via `src/lib/ledger.mjs` against schemas in `framework/forger/schemas/`:
- `definition_of_works.schema.yaml` (DoW)
- `source_ledger_entry.schema.yaml`, `claim_ledger_entry.schema.yaml`
- `risk_map.schema.yaml`, `probe_result.schema.yaml`
- `failure_hypothesis.schema.yaml`, `retro_note.schema.yaml`

KB self-evolves: `src/cli/update_kb.mjs` merges proven claims with TTL stamps (default 90d; overridable per claim type — 30d fast-moving libs, 365d algorithmic), appends failed assumptions to `failure_memory.yaml`, and flips `index.yaml.shortcut_eligible: true` after 3 consecutive shipped tasks. When eligible AND coverage ≥ 0.80, FIND serves from cache and skips lane fan-out entirely.

## 6. Cognitive Filtration: Gates, Hooks, Audit
Three enforcement layers replace gnosis's G0–G9 sequence:

### Layer A — Per-phase Gates (agent-invoked; block phase exit)
- `src/gates/audit.mjs` — HEAD-request every source URL, literal grep of each `verbatim_quote` against fetched page text, lineage (`source_id` exists), bigram anti-redundancy (frontier vs production+community ≥30% overlap → `redundant-with-other-lane`), independence advisory (critical claims need ≥2 independent sources).
- `src/gates/acceptance_test.mjs` — runs every DoW `test_method`, `verification_method`, `detection_method`; writes one line per criterion to `acceptance_results.jsonl`.

### Layer B — Harness-fired Hooks (registered in settings.json)
- `src/hooks/post_code.mjs` (PostToolUse) — re-validates any workspace YAML touched by Edit/Write.
- `src/hooks/enforce_tier_firewall.mjs` (PreToolUse) — bigram-matches proposed writes against un-promoted Tier 2/3 ideas (`promoted_at: null`); blocks the write at 60% overlap. Prevents speculative-idea leakage into the production artifact.
- `src/hooks/enforce_done_means_ran.mjs` (Stop) — refuses Stop if any completion claim ("done", "shipped", "all tests pass", ✓) appears in the transcript while required acceptance criteria are still unproven.

### Layer C — Reviewer Router (priority-gated cross-model GRILL)
`src/lib/reviewer_router.mjs` picks the highest-priority working API key that differs from the current session's provider; falls back to a Claude Code subagent spawn with a different model in the same family. Tier requirement per mode: quick=any (or skipped via `mode.grill_required: false`); standard=≥acceptable; deep=≥good AND ≥1 hypothesis from a blind reviewer (sees only the DoW).

## 7. Modes
Three mode configs at `framework/forger/skills/forger/modes/{quick,standard,deep}.yaml` control lane fan-out, probe severity threshold, reviewer tier, and Tier 2/3 allowance:

| Mode | Lanes | Probe threshold | Reviewer tier | Tier 2 | Tier 3 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| quick | production | critical only | any (or skipped) | — | — |
| standard | production + community | high+ | ≥ acceptable | ✓ | — |
| deep | production + community + frontier | high+ (no waivers) | ≥ good + blind | ✓ | ✓ |

CONTRACT asks the plain-language mode question (Fast / Normal / Thorough / You choose). "You choose" applies an auto-rule: shortcut-eligible familiar domain → quick; ≥1 safety-critical failure mode OR novel domain → deep; else → standard.

## 8. Plugin Layout
The framework ships as a Claude Code plugin. Layout under `framework/forger/`:

```
SKILL.md                                  # orchestrator
skills/forger/phases/{contract,find,observe,recombine,grill,execute,retain}/SKILL.md
skills/forger/phases/find/lanes/{production,community,frontier}.md   # subagent-only
skills/forger/phases/*/refs/                  # calibration material (read at runtime)
skills/forger/phases/*/examples/              # schema-valid sample artifacts
schemas/                                  # AJV-validated JSON schemas (YAML)
templates/                                # round-trip-validated artifact templates
modes/                                    # mode configs (quick/standard/deep)
src/lib/                                  # config, ledger I/O, KB, reviewer router
src/gates/                                # phase-exit validators
src/cli/                                  # agent-invoked utilities (filter, probe, update_kb)
src/hooks/                                # harness-fired hooks + settings.hooks.json
src/dev/                                  # install, validators, scaffolders
knowledge/{domain_slug}/                  # persistent KB, version-tracked
workspaces/{slug}-{date}/                 # runtime state, gitignored
```

Install: `npm install && npm run install:plugin` (use `-- --dry-run` to preview hook merge into `~/.claude/settings.json`).

## 9. Capacity Exception
Skill spec files in `framework/forger/SKILL.md` and `framework/forger/skills/forger/phases/**/SKILL.md` (plus lane mandate files under `skills/forger/phases/find/lanes/`) are exempted from the project's 200-line source-file cap and carry a 500-line soft cap, reflecting their nature as detailed agent specifications.

---

"A framework for general research and ideation, not just coding" — that's right.

The idea is to have a reliable framework that works. Current frameworks get so much drift and invalid ideation that they leak speculation as fact.

For example: building a facial emotion recognition system. Instead of grounding in real working GitHub projects and peer-reviewed methodology, AI models invent architectures and hallucinate APIs that don't exist. People waste hours, days, weeks on solutions that never could have worked. AIs cannot do creative work from trained knowledge alone — they have to be creative based on grounding (hence inspiration).

A human first learns maths, learns concepts, practices over and over. Once they master it, they add "spices" to make these concepts their own. That's the philosophy.

Humans don't create from nothing. They learn what exists, practice until they master it, then add their own "spices" to make it theirs.

A mathematician first learns calculus from textbooks. She solves hundreds of problems. She reads proofs by Euler and Gauss. Only after years of absorbing and internalizing does she produce original work — and even then, her theorems stand on the shoulders of everything she studied.

An AI trained on vast corpora can appear creative, but its "creativity" without grounding is what produces the facial emotion recognition system that simply doesn't work. It hallucinates architectures, invents non-existent APIs, and generates plausible-sounding nonsense because it skipped the step every human must take: grounding in what actually exists and works.

FORGER enforces this sequence structurally. CONTRACT extracts intent. FIND grounds it. OBSERVE internalizes it. RECOMBINE produces ideas with mechanism-fit checks tying the new construct back to the grounding. GRILL tries to kill the proposal. EXECUTE proves it works against the contract. RETAIN keeps what shipped. The pipeline makes the AI behave like a human researcher: find real work, study it deeply, master the concepts, then — and only then — innovate.
