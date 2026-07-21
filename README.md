<h1 align="center">FORGER v2</h1>

<p align="center">
  <strong>An execution-gated framework that forces AI to ground its work in reality before it ships anything.</strong>
</p>

<p align="center">
  <a href="#what-forger-is">What it is</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#the-execute-pipeline">EXECUTE</a> ·
  <a href="#demos">Demos</a> ·
  <a href="#quickstart">Quickstart</a> ·
  <a href="docs/README.md">Full docs</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Pipeline-7_Phase-000000?style=for-the-badge" alt="7-Phase Pipeline" />
  <img src="https://img.shields.io/badge/Done_Means-Ran-000000?style=for-the-badge" alt="Done Means Ran" />
  <img src="https://img.shields.io/badge/Cross_Model-Review-000000?style=for-the-badge" alt="Cross Model Review" />
  <img src="https://img.shields.io/badge/License-Apache_2.0-000000?style=for-the-badge" alt="License" />
</p>

> Status: pre-release. The architecture is locked. Public packaging is being rebuilt against the Claude Code plugin layout (see [FORGER_FLAWS.md](framework/FORGER_FLAWS.md) for the open list).

---

## The problem in one paragraph

You ask an AI to design a system. It scrapes a snippet, fills the gaps from memory, and writes a beautiful architecture with citations. The APIs were renamed two years ago. The benchmarks were retracted. Three days later you are still chasing a hallucination wrapped in confidence. The output passed every soft review because it was internally coherent. It just did not match the world.

FORGER exists to stop that specific failure mode. It is a harness around the agent, not a smarter agent. The harness blocks completion until the work has touched the real internet, survived an adversarial reviewer from a different model family, and actually run.

---

## What FORGER is

FORGER is a seven-phase pipeline that runs on top of an LLM agent (currently Claude Code; the plugin layout is portable). Each phase has a deterministic gate. You cannot skip phases. You cannot self-grade. The only way to get an artifact out of FORGER is to satisfy every gate.

The three things FORGER guarantees on a successful run:

| Guarantee | Mechanism |
| --- | --- |
| **Grounded** in live sources | `agent-browser` + `cloakbrowser` open real pages; no search-API snippets |
| **Reviewed** by an outsider | The GRILL phase invokes a model from a different family that tries to break the proposal |
| **Ran** | EXECUTE refuses to mark the task done until the artifact has been executed and acceptance tests pass |

The three things FORGER explicitly is **not**:

- A correctness oracle. It catches the failure modes it is built for. It will not catch every bug.
- A creativity suppressor. Speculative ideas are allowed; they live in a separate tier and cannot reach production without explicit promotion.
- A lightweight wrapper for trivial tasks. Use `forger init --mode quick` for those, or skip the framework entirely.

---

## Why use it

If any of these sound familiar, FORGER is meant for you:

- You have asked an agent to build something non-trivial and watched it ship a hallucinated architecture.
- You spend more time verifying agent output than you would have spent writing the code.
- You want to run agents overnight and trust the artifact in the morning.
- You are doing research synthesis and need every claim to trace to a real source.

If you are pair-programming small refactors with an agent, FORGER is overkill. Use it when the cost of being subtly wrong is higher than the cost of running a longer pipeline.

---

## How it works

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                            FORGER v2 PIPELINE                                  │
│                                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ CONTRACT │─▶│   FIND   │─▶│ OBSERVE  │─▶│RECOMBINE │─▶│  GRILL   │         │
│  │ Clarify  │  │  Ground  │  │ Internal │  │  Tiered  │  │  Cross-  │         │
│  │ intent   │  │  in live │  │ probes,  │  │ blending │  │  model   │         │
│  │ Socratic │  │  sources │  │ risk map │  │ + firewall│ │ attack  │         │
│  └──────────┘  └──────────┘  └──────────┘  └─────┬────┘  └─────┬────┘         │
│                                                  │              │             │
│                   ┌──────────────────────────────┘              │             │
│                   ▼                                             ▼             │
│  ┌──────────┐  ┌──────────┐                            (gate: hypotheses     │
│  │ RETAIN   │◀─┤ EXECUTE  │◀──────────────────────────  resolved)            │
│  │ Persist  │  │ Build →  │                                                   │
│  │ wins +   │  │ Run →    │                                                   │
│  │ failures │  │ Prove    │                                                   │
│  └──────────┘  └──────────┘                                                   │
│                                                                                │
│   Single Source of Truth: Definition of Works (YAML, produced in CONTRACT)    │
└──────────────────────────────────────────────────────────────────────────────┘
```

Each phase resolves one question:

| Phase | The question it answers |
| --- | --- |
| **0. CONTRACT** | What are we actually building, and how will we know it works? |
| **1. FIND** | What does the world already know about this, in writing, today? |
| **2. OBSERVE** | Which of our beliefs survive a real test? |
| **3. RECOMBINE** | What is the best idea we can assemble from verified parts? |
| **4. GRILL** | Why might this idea be wrong? Can another model break it? |
| **5. EXECUTE** | Does the artifact actually run and pass the acceptance suite? |
| **6. RETAIN** | What did we learn that future runs in this domain can skip? |

For the full philosophy and per-phase reference, see [docs/02-how-it-works.md](docs/02-how-it-works.md) and [docs/03-phases.md](docs/03-phases.md).

---

## The EXECUTE pipeline

EXECUTE is the phase that fails the most and matters the most. It runs its own micro-loop, separate from the outer pipeline. Most agents skip this loop entirely and announce success after writing code that compiled.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                       EXECUTE PHASE (Phase 5)                              │
│                                                                            │
│   Enter with: validated Tier-1 proposal + Definition of Works + tests      │
│                                                                            │
│            ┌─────────────────────┐                                         │
│            │  Acceptance Suite   │  ← compiled from Definition of Works    │
│            │  (auto-generated +  │     in CONTRACT                         │
│            │   hand-curated)     │                                         │
│            └──────────┬──────────┘                                         │
│                       │                                                    │
│                       ▼                                                    │
│        ┌────────────────────────────┐                                      │
│        │   TDD MICRO-CYCLE (loop)   │                                      │
│        └────────────┬───────────────┘                                      │
│                     │                                                      │
│                     ▼                                                      │
│           ┌──────────────────┐                                             │
│   ┌──────▶│ 1. Write failing │                                             │
│   │       │    test          │                                             │
│   │       └────────┬─────────┘                                             │
│   │                ▼                                                       │
│   │       ┌──────────────────┐                                             │
│   │       │ 2. Write minimal │                                             │
│   │       │    code to pass  │                                             │
│   │       └────────┬─────────┘                                             │
│   │                ▼                                                       │
│   │       ┌──────────────────┐    fail (≤2)                                │
│   │       │ 3. Run tests +   │────────────────┐                            │
│   │       │    linter        │                │                            │
│   │       └────────┬─────────┘                ▼                            │
│   │                │ pass             ┌───────────────┐                    │
│   │                │                  │ Patch + retry │                    │
│   │                ▼                  └───────┬───────┘                    │
│   │       ┌──────────────────┐                │                            │
│   │       │ 4. Summarise     │                │                            │
│   │       │    delta to log  │                │                            │
│   │       └────────┬─────────┘                ▼                            │
│   │                ▼                  fail again (≥3)                      │
│   │       ┌──────────────────┐        ┌────────────────────┐               │
│   └───────│ next behaviour?  │  yes   │ Web-search exact   │               │
│           │ continue cycle   │        │ error → fix → retry│               │
│           └────────┬─────────┘        └─────────┬──────────┘               │
│                    │ no                         │                          │
│                    ▼                            ▼                          │
│           ┌────────────────────┐         still failing?                    │
│           │ Run full           │         ┌──────────────┐                  │
│           │ acceptance suite   │         │  ESCALATE    │                  │
│           └─────────┬──────────┘         │  → human or  │                  │
│                     │                    │    abort     │                  │
│           pass      │      fail          └──────────────┘                  │
│        ┌────────────┴────────────┐                                         │
│        ▼                         ▼                                         │
│  ┌────────────┐          ┌─────────────────┐                               │
│  │ DONE       │          │ Re-enter        │                               │
│  │ MEANS RAN  │          │ TDD micro-cycle │                               │
│  │ → RETAIN   │          │ with failure as │                               │
│  └────────────┘          │ next test       │                               │
│                          └─────────────────┘                               │
│                                                                            │
│   Invariants enforced here:                                                │
│   • No "complete" claim without a green acceptance suite                   │
│   • No silent skip of failing tests                                        │
│   • Tier-2/3 ideas blocked from this loop unless promoted                  │
└────────────────────────────────────────────────────────────────────────────┘
```

Two rules govern this loop:

1. **Done Means Ran.** The artifact must have executed and passed acceptance, or the agent must document why execution was impossible. "I'm confident it works" is not a valid exit.
2. **Failures become tests.** Every test failure that gets fixed leaves behind a regression test. The acceptance suite grows during EXECUTE; it never shrinks.

For research and design artifacts the loop is the same, but the acceptance criteria differ. A research report passes EXECUTE when every claim is ledger-verified with `directly_supported` entailment. A design passes when the rubric is satisfied and screenshots match the spec.

---

## Demos

Four short walkthroughs are in [docs/04-examples.md](docs/04-examples.md). Quick previews below.

### CONTRACT — turning a vague ask into a contract

**You type:**
> "Build me an emotion recognition thing for my app."

**FORGER asks back:**
> 1. What runs the inference: device, server, or both?
> 2. Real-time video, single images, or audio?
> 3. Which emotions, and what counts as right?
> 4. What is the worst acceptable latency at p95?
> 5. Is "good" measured against FER+, AffectNet, or your own labels?

**You answer in one paragraph.** FORGER writes a `definition_of_works.yaml` with measurable acceptance criteria and a reframe memo that asks whether you actually need deep learning or whether facial-action-unit detection would do. The reframe is recorded even if you stick with the original framing.

### FIND — what real grounding looks like

Instead of a search API summary, FIND opens GitHub Issues, scrolls JS-rendered docs, follows code references, and produces:

```yaml
- url: https://github.com/serengil/deepface/issues/1207
  domain: github.com
  authority: high                 # repo with active CI, named maintainers
  recency: 2025-11               # within TTL for ML libs
  reproducibility: verified       # repro steps in the issue
  quote: "FER backend returns logits, not softmaxed probabilities."
  severity_for_dow: critical      # contradicts assumption in CONTRACT
  entailment: directly_supported
```

Every claim ties back to one of the rows in the Source Ledger. Anything `weakly_supported` cannot be load-bearing in EXECUTE.

### GRILL — the adversary tries to kill it

The proposal goes to a reviewer in a different model family. It does not score. It hunts.

```text
FAILURE HYPOTHESIS #2
  claim: "MobileNetV3 small fits in <100ms on Pixel 7"
  what would make it fail: thermal throttling under sustained video at 30fps
  evidence required: 5-minute sustained run on Pixel 7 with thermal logging
  severity if wrong: critical (kills latency invariant in DoW)
  confidence: medium-high
```

EXECUTE cannot proceed until every open failure hypothesis is either accepted (with a test added), rejected (with counter-evidence from the Source Ledger), or escalated.

### EXECUTE — the loop in motion

```text
[cycle 1] test: model loads in <2s on cold start → FAIL (load = 4.3s)
[cycle 1] fix:  switch to TFLite quantised int8 → PASS (load = 1.1s)
[cycle 2] test: p95 latency <100ms over 30s at 30fps → FAIL (p95 = 142ms)
[cycle 2] fix:  drop input resolution 240→192 → PASS (p95 = 78ms)
[cycle 3] test: sustained 5-minute run, no thermal throttle → PASS
[cycle 4] acceptance suite: 17/17 → DONE
```

The fail-then-fix transcript is stored. If you re-run the task tomorrow, RETAIN serves these as known-good shortcuts.

---

## Quickstart

Prerequisites: Node.js 20+, Python 3.10+, Playwright with `cloakbrowser`, Claude Code (or another supported host).

```bash
# 1. install
npm install -g forger-framework

# 2. cd into your project
cd my-project

# 3. initialise the workspace (writes .forger/ and registers the plugin)
forger init --mode standard

# 4. run a task
forger run "Build a real-time facial emotion classifier for iOS"
```

You will be dropped into CONTRACT first. From there the pipeline runs to RETAIN, asking for your input only when the contract is ambiguous or when a Tier-3 transformational idea wants promotion.

### Modes

| Mode | When to pick it | Token budget (cold) | Differences |
| --- | --- | --- | --- |
| `quick` | You have built this kind of thing in this domain before | ~5k | FIND reads cached KB, OBSERVE trims probes, GRILL optional, Tier 1 only |
| `standard` | The default | ~22k | Full pipeline, single cross-model reviewer |
| `deep` | High stakes, novel domain, overnight autonomy | ~35k+ | Dual reviewer in GRILL, no waivers on high/critical probes, extended acceptance |

The token budgets in the table assume a cold run with no cached domain knowledge. The actual full-pipeline budget on first runs is closer to 700k for `standard`; the framework is being recalibrated. Tracking issue: [FORGER_FLAWS #6](framework/FORGER_FLAWS.md#flaw-6).

---

## Architectural invariants

These do not get bent for convenience:

1. **Done Means Ran.** No completion claim without execution and a green acceptance suite, or a documented reason execution was impossible.
2. **No claim without evidence or label.** Every claim is either ledger-supported, test-supported, or tagged `speculative`.
3. **Test critical, skip trivial.** Only `high` and `critical` assumptions require runtime probes.
4. **Tier 2/3 firewall.** Speculative ideas live in their own files. They do not enter EXECUTE without explicit human promotion.
5. **Cross-model review for standard and deep.** GRILL reviewer must be from a different model family than the executor.
6. **Mechanism-fit before recombination.** Every combination passes a "does the causal mechanism transfer?" check.
7. **Knowledge self-evolves.** Successful runs update the KB. After three runs in a domain, shortcuts become available.
8. **Scripts are mechanical.** Hooks check liveness, schema, quote-existence. Judgment is LLM only.
9. **Definition of Works is the single source of truth.** Every gate traces back to it.

---

## Documentation

| Doc | What's in it |
| --- | --- |
| [docs/01-what-is-forger.md](docs/01-what-is-forger.md) | Plain-language framing, the failure mode it targets, the philosophy in short |
| [docs/02-how-it-works.md](docs/02-how-it-works.md) | Architecture, harness vs agent, BDI split, epistemic triangle map |
| [docs/03-phases.md](docs/03-phases.md) | Per-phase reference, including the EXECUTE sub-pipeline in full |
| [docs/04-examples.md](docs/04-examples.md) | Full demo walkthroughs for CONTRACT, FIND, OBSERVE, RECOMBINE, GRILL, EXECUTE, RETAIN |
| [docs/05-usage.md](docs/05-usage.md) | Install, init, modes, CLI reference, troubleshooting, common workflows |
| [docs/06-architecture.md](docs/06-architecture.md) | Plugin filesystem, ledger schemas, audit hooks, KB structure |
| [framework/FORGER.md](framework/FORGER.md) | Long-form philosophical foundation (legacy; being merged into `/docs`) |

---

## Status and known gaps

The current packaging has 8 critical flaws documented in [framework/FORGER_FLAWS.md](framework/FORGER_FLAWS.md). The pipeline ships artifacts that pass acceptance, but the install path requires an external shim while the plugin layout is restructured. If you want to try it before the v0.2 packaging lands, follow the install instructions in [docs/05-usage.md](docs/05-usage.md) and use the shim at `forger-local-marketplace`.

What we are working on next:

- Restructure the plugin to the standard Claude Code layout (`.claude-plugin/`, `agents/`, `skills/<slug>/`)
- Move FIND fan-out to the orchestrator level (Claude Code strips `Task` from subagent toolsets)
- Recalibrate the token budgets against real telemetry
- Real reviewer adapters for OpenAI, Gemini, and cross-account Anthropic

---

## Related

- **[SkillRouter](https://github.com/RyanDev1st/SkillRouter)** — a retrieval MCP for Claude Code skills. Claude Code loads every skill's description into context on every request; SkillRouter suppresses them and lets the agent retrieve only the skills a task actually needs. Built alongside FORGER, shipped separately because it is useful on its own.

---

## Community

- **Discord** — coming with the v0.2 release
- **GitHub Issues** — bug reports, especially when the framework lets a hallucination through
- **Contributing** — see `CONTRIBUTING.md` (in progress)

---

<div align="center">
  <sub>Apache 2.0 licensed. Built because watching agents confidently produce broken code got old.</sub>
</div>
