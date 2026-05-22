<div align="center">
  <img src="https://via.placeholder.com/120x120/000000/FFFFFF?text=F" alt="FORGER Logo" width="120" />
</div>

<h1 align="center">FORGER v2</h1>

<p align="center">
  <strong>A Test-Gated, Execution-Centric Framework for Grounded AI Creativity.</strong>
</p>

<h2 align="center">BETA VERSION</h2>

<p align="center">
  <a href="#-the-problem-the-paradox"><img src="https://img.shields.io/badge/Paradox-Solved-000000?style=for-the-badge" alt="Paradox Solved" /></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-7_Phase-000000?style=for-the-badge" alt="Architecture" /></a>
  <a href="#quick-start"><img src="https://img.shields.io/badge/License-MIT-000000?style=for-the-badge" alt="License" /></a>
  <a href="#community"><img src="https://img.shields.io/badge/Discord-Join%20Us-7289DA?style=for-the-badge&logo=discord" alt="Discord" /></a>
</p>

<p align="center">
  <em>We've all been there. You ask an AI to design a system. It pings its built-in web search, scrapes a two-sentence summary, and hallucinates the rest. It hands you a beautiful architecture complete with citations. Then you try to actually build it. The concepts don't fit together, and half the APIs it cited were deprecated three years ago. You just wasted three days chasing a ghost because the AI built a sandcastle in its head.</em>
</p>

---

## ⚡ The Problem: Toy Search and the Coherence Paradox

Researchers call this the **Bidirectional Coherence Paradox** (Chacón Sartori, 2026). Just because an AI explains an idea logically doesn't mean that idea survives contact with the physical world.

**AI cannot trust its training data.** Knowledge drifts. The world moves on. But relying on built-in AI web search doesn't fix the problem. Standard AI search tools are heavily constrained toys. They get blocked by Cloudflare, they trip over JavaScript-heavy sites, and they summarize snippets instead of reading actual source code.

We built **FORGER** to rip that out.

FORGER forces the AI to use `playwright-cli` and `cloakbrowser`. It doesn't query a sanitized search API. It opens a real, stealth browser. It navigates to the actual documentation. It bypasses bot protections, reads the full DOM, and extracts the unvarnished truth. It hits reality before it writes a single line of production code.

---

## 💎 The Philosophy: Grounded Creativity

FORGER isn't just a coding bot. It is a framework for **general research and ideation**.

Most AI frameworks drift too far and rely on broken ideation models. Ask a standard agent to build a facial emotion recognition system, and it doesn't ground itself in working projects. It hallucinates architectures and gives you a confident fantasy. You try to build it, and it fails.

**AI cannot do creative work purely from trained knowledge.**

Think about how humans create. We don't pull ideas from the void. A mathematician learns calculus from textbooks. She grinds through hundreds of proofs. She reads Euler and Gauss. Only after years of absorbing, practicing, and internalizing does she write original theorems. She masters the concepts, and then adds her own spin.

FORGER forces an AI to do the exact same thing. It makes the agent act like a strict human researcher: **Open a real browser. Find real work. Study it. Master the pieces. Then, and only then, innovate.**

Evaluating these agents takes three criteria. Every FORGER gate enforces the Epistemic Triangle (Chacón Sartori, 2026):

1. 🧩 **Coherence:** Does the idea actually hold together logically?
2. 🌍 **Grounding:** Does it match physical reality? (Tested via stealth browsers and runtime probes)
3. 🔗 **Proper Basing:** Does the explanation link to the final action? (*Done Means Ran*)

Creativity is combination, not magic. Inspiration has to come from the real world.

---

## 🏗 Architecture

FORGER uses a deterministic harness with a Belief-Desire-Intention (BDI) split. **The harness is the product.**

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                          FORGER v2 ARCHITECTURE                                 │
│                                                                                 │
│                         ┌─────────────────────┐                                 │
│                         │   DEFINITION OF     │                                 │
│                         │      WORKS          │                                 │
│                         │  (Single Source     │                                 │
│                         │    of Truth)        │                                 │
│                         └──────────┬──────────┘                                 │
│                                    │                                            │
│  ┌──────────┐  ┌──────────┐  ┌────┴─────┐  ┌──────────┐  ┌──────────┐         │
│  │ CONTRACT │─▶│   FIND   │─▶│ OBSERVE  │─▶│RECOMBINE │─▶│  GRILL   │         │
│  │  Clarify │  │  Ground  │  │Internalize│  │  Create  │  │ Falsify  │         │
│  │  Intent  │  │ (Source  │  │ & Probe   │  │ (Tiered  │  │ (Cross-  │         │
│  │(Socratic)│  │ Ledger)  │  │(Risk Map) │  │Blending) │  │  Model)  │         │
│  └──────────┘  └──────────┘  └──────────┘  └─────┬────┘  └─────┬────┘         │
│                                                   │              │             │
│                   ┌───────────────────────────────┘              │             │
│                   ▼                                              ▼             │
│  ┌──────────┐  ┌──────────┐                              (gate: pass)          │
│  │ RETAIN   │◀─┤ EXECUTE  │◀─────────────────────────────────┘                 │
│  │ Persist  │  │Build/Test│                                                     │
│  │Knowledge │  │  Prove   │                                                     │
│  └──────────┘  └──────────┘                                                     │
│                                                                                 │
│  ════════════════════════════════════════════════════════════════════════════   │
│  EPISTEMIC TRIANGLE (Chacón Sartori, 2026):                                     │
│  • Coherence: Does the explanation hold together logically?                     │
│  • Grounding: Does it correspond to physical reality (live sources + probes)?   │
│  • Proper Basing: Does the explanation actually link to the action taken?       │
│                                                                                 │
│  ARCHITECTURAL INVARIANTS:                                                       │
│  • Done Means Ran              • No claim without evidence or label              │
│  • Test critical, skip trivial  • Tier 2/3 cannot leak into execution            │
│  • Cross-model review           • Knowledge self-evolves                         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ The 7-Phase Pipeline

Most agents just take your prompt and start guessing. FORGER acts more like a paranoid senior engineer. You don't get to skip steps.

| Phase | Action | Operation |
| :--- | :--- | :--- |
| **0. CONTRACT** | **Clarify Intent** | The agent questions the request. It detects vagueness, asks Socratic questions, and locks down a hard `Definition of Works`. |
| **1. FIND** | **Ground Reality** | **No API search.** The agent opens `cloakbrowser` via Playwright. It reads full GitHub issues, renders JS docs, and builds a Source Ledger. |
| **2. OBSERVE** | **Probe Assumptions** | Internalizes the mechanics. Builds Risk Maps. It writes and runs tiny scripts (**probes**) to falsify the riskiest assumptions. |
| **3. RECOMBINE** | **Tiered Sandbox** | Synthesizes answers from validated parts. Highly speculative ideas get firewalled into "Tier 2/3" files so they don't break the build. |
| **4. GRILL** | **Falsification Review**| A **Blind Cross-Model Adversary** (a completely different model family) attacks the proposal to break its logic. |
| **5. EXECUTE** | **Build & Prove** | Micro-cycles of TDD execution. Enforces the golden rule: **Done Means Ran**. If it doesn't pass the tests, it isn't done. |
| **6. RETAIN** | **Persist Knowledge** | Stores verified architectures and explicitly remembers failures. Next time around, it skips the slow parts and runs 60% faster. |

---

## 🚀 Quickstart

Prerequisites: [Node.js](https://nodejs.org/) v20+ · [Python](https://www.python.org/) 3.10+ · [Playwright](https://playwright.dev/)

```bash
# 1. Install deps
npm install

# 2. Preview Claude Code hook install
npm run install:plugin -- --dry-run

# 3. Install plugin into Claude Code
npm run install:plugin

# 4. Optional browser setup
npm run setup:browser
```

### Install notes

- Plugin installs into `~/.claude/plugins/forger`
- Hook settings merge into `~/.claude/settings.json`
- Marketplace listing is separate from local install; submit source through Anthropic's plugin directory flow after the repo is public

### Work Modes

Depending on how confident you are in the domain, adjust FORGER:

- `quick`: (~5k tokens) For trivial tasks in cached domains. Skips `FIND`, trims probes.
- `standard`: (~22k tokens) The default. Full 7-gate pipeline. Single cross-model review.
- `deep`: (~35k tokens) High stakes autonomy. Dual-reviewer `GRILL`, mandatory manual waivers for assumptions.

---

## 🔒 Architectural Invariants

FORGER plugins and integrations live by a few non-negotiable rules:

1. **Done Means Ran** — The agent cannot claim completion without executing code and passing tests.
2. **No Claim Without Evidence** — Every claim ends in a passed test, a sourced constraint, or a giant "speculative" warning tag.
3. **Test Critical, Skip Trivial** — We avoid over-verification paralysis. The framework only probes high and critical assumptions.
4. **Tier 2/3 Firewall** — Transformational ideas do not get executed unless a human explicitly promotes them.
5. **Cross-Model Review** — The `GRILL` adversary must belong to a different model family.

---

## 📖 Documentation

- [Introduction & Best Practices](#)
- [The Philosophical Foundation](framework/FORGER.md)
- [Implementing Custom Hooks](#)
- [Managing the Knowledge Ledger](#)

---

## 🌍 Community & Support

- **[Join Discord](#)** — Talk epistemic grounding, BDI architecture, and AI hallucination management.
- **[GitHub Issues](#)** — Found a bug where the agent bypassed the firewall? Drop it here.
- **[Contributing](#)** — Read our contribution guide.

<br>

<div align="center">
  <b>Built for developers tired of AI slop. 100% Free and Open Source.</b> <br/>
  Star this repository to support grounded AI engineering.
</div>
