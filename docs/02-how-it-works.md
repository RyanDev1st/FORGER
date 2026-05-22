# How FORGER works

This doc is the architectural tour. If you only have five minutes, read [What is FORGER](01-what-is-forger.md). If you want the per-phase deep dive, see [The seven phases](03-phases.md).

---

## The big idea: the harness is the product

VILA-Lab's 2026 analysis of Claude Code's source code found that only 1.6% of the system is AI decision logic. The other 98.4% is deterministic infrastructure: permission gates, context routing, recovery logic, hooks, compaction. The agent loop itself is a while-loop.

FORGER takes the same bet. The agent's creativity is bounded by the harness, not replaced by it. The scripts, contracts, ledgers, and gates are the framework. The agent is a tool inside it.

This matters because the failure modes FORGER targets are not "the LLM is not smart enough." They are "the LLM is smart enough to produce plausible nonsense when nothing stops it." The fix is structural.

---

## The BDI split

Alenezi's 2026 reference architecture for production LLM agents formalised the pattern FORGER uses. Belief-Desire-Intention separates cognitive reasoning from execution:

| Layer | What lives here | Owned by |
| --- | --- | --- |
| **Beliefs** | World state, source ledger, claim ledger, knowledge base, probe results | Files on disk, not the agent's memory |
| **Desires** | Goals, constraints, acceptance criteria — the Definition of Works | YAML, signed by CONTRACT |
| **Intentions** | Adopted plans, tool calls, the current micro-cycle | The agent, bounded by phase skill |

The agent does not "remember" what it found in FIND. It reads the ledger. The agent does not "decide" what success looks like. It reads the DoW. Memory is durable and inspectable. Plans are auditable. This is what makes the framework debuggable.

---

## One agent, one reviewer

Anthropic's own published research on agent architectures found that multi-agent setups consume 3–10× more tokens than single-agent loops without proportional quality gains. OneFlow's 2026 paper went further and showed single-agent loops match heterogeneous workflows when KV cache is preserved.

FORGER runs:

- **One executor agent** through all seven phases
- **One reviewer agent**, in a different model family, called only during GRILL

That is it. No swarms. No "agent of agents." Skills are loaded on demand inside the single agent loop. The reviewer is invoked through a `reviewer_router` that picks a model from a different family (e.g. executor = Claude, reviewer = GPT or Gemini).

---

## The architecture diagram

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│                          FORGER v2 ARCHITECTURE                                │
│                                                                                │
│                         ┌─────────────────────┐                                │
│                         │   DEFINITION OF     │                                │
│                         │      WORKS          │  ← machine-readable contract   │
│                         │  (Single Source     │     produced in CONTRACT       │
│                         │    of Truth)        │     consumed by every later    │
│                         └──────────┬──────────┘     phase                      │
│                                    │                                           │
│  ┌──────────┐  ┌──────────┐  ┌────┴─────┐  ┌──────────┐  ┌──────────┐         │
│  │ CONTRACT │─▶│   FIND   │─▶│ OBSERVE  │─▶│RECOMBINE │─▶│  GRILL   │         │
│  │ Clarify  │  │ Ground   │  │ Internal │  │ Tiered   │  │ Cross-   │         │
│  │ Intent   │  │ (Source  │  │ & Probe  │  │ Blending │  │ Model    │         │
│  │(Socratic)│  │ Ledger)  │  │(Risk Map)│  │ + tier   │  │ Attack   │         │
│  │          │  │          │  │          │  │ firewall │  │          │         │
│  └──────────┘  └──────────┘  └──────────┘  └─────┬────┘  └─────┬────┘         │
│                                                  │              │             │
│                   ┌──────────────────────────────┘              │             │
│                   ▼                                             ▼             │
│  ┌──────────┐  ┌──────────┐                                 (gate:            │
│  │ RETAIN   │◀─┤ EXECUTE  │◀──────────────────────────────  hypotheses        │
│  │ Persist  │  │ Build →  │                                  resolved)        │
│  │ + self-  │  │ Run →    │                                                   │
│  │ evolve   │  │ Prove    │                                                   │
│  └──────────┘  └──────────┘                                                   │
│                                                                                │
│  ════════════════════════════════════════════════════════════════════════════ │
│                                                                                │
│  EPISTEMIC TRIANGLE (Chacón Sartori, 2026):                                   │
│  • Coherence    — checked in RECOMBINE (mechanism-fit) and GRILL              │
│  • Grounding    — checked in FIND, OBSERVE, EXECUTE                           │
│  • Proper Basing — checked in audit.sh and Done-Means-Ran                     │
│                                                                                │
│  ARCHITECTURAL INVARIANTS:                                                     │
│  • Done Means Ran             • Tier 2/3 firewall                              │
│  • No claim without evidence  • Cross-model review                             │
│  • Test critical, skip trivial • Knowledge self-evolves                        │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## What flows between phases

Every phase reads and writes structured files. Nothing important lives in agent memory.

```text
CONTRACT  ──writes──▶ definition_of_works.yaml
                     reframe_memo.md

FIND      ──reads───▶ definition_of_works.yaml
          ──writes──▶ source_ledger.yaml
                     claim_ledger.yaml
                     ground_truth_brief.md  (draft)

OBSERVE   ──reads───▶ source_ledger.yaml, claim_ledger.yaml
          ──writes──▶ ground_truth_brief.md  (final)
                     risk_map.yaml
                     probe_results.jsonl

RECOMBINE ──reads───▶ ground_truth_brief.md, risk_map.yaml
          ──writes──▶ proposals/tier1.md
                     proposals/tier2.md  (firewalled)
                     proposals/tier3.md  (firewalled, human-approval-required)

GRILL     ──reads───▶ proposals/tier1.md, source_ledger.yaml
          ──writes──▶ failure_hypotheses.yaml
                     review_report.md
          ──invokes─▶ reviewer_router → different model family

EXECUTE   ──reads───▶ proposals/tier1.md, failure_hypotheses.yaml, definition_of_works.yaml
          ──writes──▶ artifact/*
                     test_log.jsonl
                     acceptance_report.md

RETAIN    ──reads───▶ acceptance_report.md, source_ledger.yaml, failure_hypotheses.yaml
          ──writes──▶ knowledge/<domain>/working_architectures.md
                     knowledge/<domain>/failure_memory.yaml
                     knowledge/<domain>/source_quality.yaml
                     retro_note.md
```

Every output file has a schema in `templates/`. The mechanical hooks check the schema before any LLM judgment runs.

---

## The gates

Each phase has at least one gate. A gate is a deterministic check (bash, no LLM) that decides whether the pipeline can proceed.

| Phase | Gate | What it checks |
| --- | --- | --- |
| CONTRACT | Schema gate | `definition_of_works.yaml` validates against the schema |
| FIND | Schema gate + audit hook | Source URLs resolve (HEAD), quotes exist on the page, no `weakly_supported` critical claims |
| OBSERVE | Probe gate | Zero unresolved `high` or `critical` assumptions without a passed probe or documented waiver |
| RECOMBINE | Tier gate | Tier 2/3 ideas written to firewalled files; Tier 1 has mechanism-fit passed |
| GRILL | Hypothesis gate | Every failure hypothesis is `accepted` (test added), `rejected` (counter-evidence), or `escalated` |
| EXECUTE | Acceptance gate | Full acceptance suite passes, OR documented reason execution was impossible |
| RETAIN | Persistence gate | KB index updated, retro_note written, TTLs set |

A gate failure does not silently drop the run. It either retries (FIND lane retries up to 3× with delays), waits for human input (Tier 3 promotion, GRILL escalation), or marks the run as `under-sourced` / `failed-acceptance` and writes the partial state to disk so it can be resumed.

---

## Hooks and scripts

The mechanical pieces:

| Hook | Runs | What it does |
| --- | --- | --- |
| `filter.sh` | After FIND collects candidate sources | URL liveness, domain blocklist, date extraction, repo health |
| `probe.sh` | In OBSERVE, per probe | Executes the probe in the target environment, captures stdout/stderr/exit |
| `audit.sh` | After FIND and again before GRILL | HEAD-request every cited URL, grep verbatim quotes against page text |
| `acceptance_test.sh` | In EXECUTE | Runs the acceptance suite, parses results, writes `acceptance_report.md` |
| `post_code.sh` | After every TDD micro-cycle | Linter + test runner; pipeline gate |
| `update_kb.sh` | In RETAIN | Writes to knowledge base with TTLs, updates index |

**The hooks do not judge.** They check liveness, schema, presence. All qualitative assessment (is this source authoritative? does this mechanism transfer?) runs inside the LLM with structured output. The split keeps the framework auditable: every judgment leaves a paper trail, every mechanical check is reproducible.

---

## The single source of truth

The `definition_of_works.yaml` is the contract that every later phase has to honour. A trimmed example:

```yaml
artifact:
  type: code
  language: swift
  description: "On-device real-time facial emotion classifier for iOS 17+"

audience:
  who: "Indie dev building a journaling app"
  use_case: "Tag journal entries with a coarse emotion label"

hard_constraints:
  - id: c1
    rule: "Runs fully on-device, no network calls during inference"
    verification: "Network proxy logs zero outbound traffic during a 60s session"
  - id: c2
    rule: "p95 latency under 100ms on iPhone 13 or newer"
    verification: "Latency histogram from XCTest performance run"

success_criteria:
  - id: s1
    metric: "Accuracy on FER+ test set"
    threshold: ">= 0.72"
    test_method: "scripts/eval_fer_plus.swift"
  - id: s2
    metric: "Model file size"
    threshold: "< 30 MB"
    test_method: "stat output of Models/emotion.mlmodel"

unacceptable_failure_modes:
  - "Crash on any input image regardless of resolution"
  - "Returns same label for >70% of distinct inputs (collapsed output)"

work_mode: standard
reframe:
  alternative: "Use Apple Vision facial landmark + rule-based emotion mapping"
  rejected_because: "Indie dev wants ML pipeline for portfolio; reframe noted, not adopted"
```

Every acceptance test in EXECUTE traces back to a `success_criteria.id`. Every probe in OBSERVE traces back to a `hard_constraints.id`. The DoW is the spine.

---

## Mode mechanics

The three modes are not different pipelines. They are the same pipeline with different budgets.

| Setting | `quick` | `standard` | `deep` |
| --- | --- | --- | --- |
| FIND lanes | KB only | Production + Community | Production + Community + Edge (high-variance) |
| OBSERVE probes | Critical only | High + Critical | High + Critical + Medium |
| RECOMBINE tiers allowed | Tier 1 only | Tier 1 + Tier 2 (firewalled) | All three tiers, with mandatory waiver review |
| GRILL reviewer | Optional | Single cross-model | Dual: cross-model + blind reviewer |
| Acceptance suite | DoW criteria only | DoW + audit hook | DoW + audit + extended fuzzing |

The mode is chosen in CONTRACT, recorded in the DoW, and read by every later phase. The agent does not choose the mode mid-run.

---

## Self-evolution: how runs get faster

After three successful runs in the same domain (`knowledge/<domain>/runs.jsonl` has 3+ green entries), RETAIN generates a **Quick Forge shortcut**:

- FIND skips live search and reads `knowledge/<domain>/source_ledger.yaml`
- OBSERVE skips probes that have already passed for the same assumptions
- GRILL uses cached failure hypotheses from previous runs as the seed attack
- EXECUTE keeps the same acceptance suite plus regression tests harvested from prior failures

Token cost typically drops ~60%. The KB has TTLs: claims expire and get re-verified on a schedule, so the framework does not get stuck citing dead 2024 docs in 2027.

---

## What the agent actually does

For all the architecture, the agent's job per phase is small and bounded:

| Phase | Agent's task |
| --- | --- |
| CONTRACT | Read user input, ask clarification questions, produce DoW YAML |
| FIND | Drive `playwright-cli` to pages, extract claims, write ledger entries |
| OBSERVE | Read ledger, list assumptions, write and run probes |
| RECOMBINE | Read ground truth, propose Tier 1 designs, tag Tier 2/3 separately |
| GRILL | Hand the proposal to the reviewer router; for each returned hypothesis, accept/reject/escalate |
| EXECUTE | Write tests, write code, run, fix, repeat until acceptance passes |
| RETAIN | Summarise wins and failures, update KB with TTLs |

Each task has a phase skill that lays out exactly what to do, what to read, what to write, and what the gate is. The agent does not improvise the pipeline.

---

## Next

- [The seven phases](03-phases.md) — per-phase reference and the EXECUTE sub-pipeline
- [Demos](04-examples.md) — what each phase looks like in motion
- [Architecture](06-architecture.md) — plugin filesystem, schemas, audit internals
