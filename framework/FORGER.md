# FORGER v2 — Philosophical Foundation & Architectural Specification

**A Test-Gated, Execution-Centric Framework for Grounded AI Creativity**

Final Architecture · May 2026

---

## Prologue: The Epistemic Problem FORGER Exists to Solve

In March 2026, Chacón Sartori published a landmark paper identifying what he called the **Bidirectional Coherence Paradox**: the phenomenon whereby an AI agent's internally consistent explanations systematically diverge from empirical reality, such that *greater explanatory coherence may obscure rather than reveal the agent's actual epistemic relationship to the domain*. Across controlled experiments in compiler optimization and hyperparameter tuning, he documented a 61-percentage-point swing: in low-observability domains, LLMs acted successfully while misidentifying the mechanisms that produced their success; in high-observability domains, they generated explanations that accurately tracked observable causal structure yet failed to translate those diagnoses into effective intervention.

This paradox is not an edge case. It is the central failure mode of AI-driven creative work. An agent proposes a facial emotion recognition system with plausible architecture, real citations, and confident reasoning—and it fails when built because the mechanisms don't transfer, the API doesn't exist in that form, or the cited source was describing a different problem. The output *looks* grounded. It *passes* review. But it doesn't *work*.

Sartori's solution is the **Epistemic Triangle**: evaluating artificial epistemic agents requires not one criterion but three—**coherence** (does the explanation hold together logically?), **grounding** (does it correspond to physical reality?), and **a proper basing relation** (does the explanation actually link to the action taken?). FORGER is the operationalization of this tripartite framework. Every phase, every gate, every invariant exists to ensure that coherence, grounding, and proper basing are independently verified before any artifact is declared complete.

---

## Part I: The Philosophy

### 1.1 The First Principle: AI Cannot Trust Its Training Data

Large language models are—as Bender, Gebru, and colleagues framed it—"stochastic parrots": systems that produce plausible-seeming text without understanding its meaning. But the deeper problem is not that they parrot. The problem is that their training data is a snapshot of a world that has already moved on. APIs are deprecated. Libraries shift. Working repositories go stale. Benchmarks are superseded. The model's internal knowledge is, at best, an orientation device—never a source of truth.

This principle was recognized early by the user and is the philosophical core of the entire lineage from reTruth through FORGER. **Inspiration must come from the live world.** Not from training data. Not from memory. From `playwright-cli` + `cloakbrowser` contacting real websites, real documentation, real GitHub repositories, real forum discussions—*today*.

### 1.2 The Second Principle: Humans Create by Learning First, Then Adding Spices

Graham Wallas, in his 1926 work *The Art of Thought*, identified four stages that every creative act passes through: **Preparation** (gathering knowledge and defining the problem), **Incubation** (unconscious processing), **Illumination** (the flash of insight), and **Verification** (testing and refining the idea). This model has held sway for a century because it describes something universal about how the human mind produces novel, working ideas.

A mathematician does not invent new theorems from nothing. She studies existing proofs. She solves hundreds of problems. She reads Euler and Gauss. Only after years of absorbing and internalizing does she produce original work—and even then, her theorems stand on the shoulders of everything she studied.

A chef does not invent fusion cuisine by imagining flavors in a vacuum. She cooks the classics fifty times each. She understands why certain combinations work at the chemical level. Then—and only then—she adds her own spices.

The human sequence is:

```
Inspiration → Learn → Practice → Master → Recombine → Verify → Ship
```

FORGER enforces this sequence structurally. The AI cannot skip to recombination. It must first find real sources. It must study them. It must probe its own understanding. Only then may it create.

### 1.3 The Third Principle: Creativity Is Combination, Not Conjuration

Margaret Boden's taxonomy of computational creativity identifies three forms: **combinational** (novel combinations of familiar ideas), **exploratory** (working within an existing conceptual space to find new possibilities), and **transformational** (changing the enabling constraints of the conceptual space itself).

The critical insight—one that FORGER operationalizes directly—is that **all three forms start from existing knowledge**. Even transformational creativity, which appears to break rules, does so by first understanding which rules exist and why. Boden's own later work identified that transformational creativity arises specifically from changes in the "enabling constraints" of a conceptual space.

Fauconnier and Turner's **Conceptual Blending** framework provides the cognitive mechanism: novel concepts emerge when two or more input mental spaces are selectively projected into a blended space, producing emergent structure not present in either input alone. This is not magic. It is a search problem over grounded elements—precisely what FORGER's RECOMBINE phase operationalizes.

### 1.4 The Fourth Principle: The Harness Is the Product

The VILA-Lab analysis of Claude Code's source code revealed that only 1.6% of the system is AI decision logic. The remaining 98.4% is deterministic infrastructure—permission gates, context management, tool routing, recovery logic, hooks, and compaction routines. The agent loop itself is trivial: a simple while-loop.

Alenezi's 2026 reference architecture for production-grade LLM agents formalizes this: the architecture separates **cognitive reasoning from execution using typed tool interfaces**, with state management and policy enforcement as first-class concerns. The BDI model—Beliefs (world state and memory), Desires (goals and constraints), Intentions (adopted plans and tool calls)—provides the control skeleton that modern generative agents can inherit, "separating free-form generation from governed behavior."

**The harness is the product.** The scripts, hooks, gates, contracts, and ledgers are the framework. The agent's creativity is bounded and directed by the harness, not replaced by it.

### 1.5 The Fifth Principle: Intent Must Be Clarified Before It Can Be Executed

The RECAP benchmark (2026) captures the fundamental challenge of agentic planning: real-world dialogues are ambiguous, underspecified, or dynamic. Intent drift, vagueness, and mixed-goal conversations are the norm, not the exception. A survey of LLM alignment research confirms that users' natural language expressions are "inherently fuzzy, ambiguous, and uncertain, leading to challenges such as vagueness, polysemy, and contextual ambiguity."

The Socratic Method Revisited framework (2026) demonstrates that classical Socratic elements—Elenchus (critical refutation), Maieutics (knowledge elicitation), Aporia (constructive doubt), and Dialectic (collaborative synthesis)—can be systematically integrated into human-LLM interactions, "turning confident-but-wrong outputs into testable claims that must be justified, challenged, and revised."

The Nous agent (2026) reframes the entire problem: instead of the human painstakingly teaching the AI, the AI intelligently guides the human, actively probing for information to resolve its uncertainty about user intent. The core mechanism is an information-theoretic reward signal: information gain from dialogue as the reduction of Shannon entropy over a structured task space.

This is what FORGER's CONTRACT phase operationalizes: before any research begins, the framework detects vagueness, resolves ambiguity, clarifies intent, and produces a machine-readable Definition of Works that serves as the single source of truth for every subsequent phase.

### 1.6 The Sixth Principle: Knowledge Must Self-Evolve or Stagnate

The EvolveMem architecture (May 2026) demonstrates that truly adaptive memory requires co-evolution at two levels: the stored knowledge and the retrieval mechanism that queries it. Self-evolving software agents (Robol & Giorgini, 2026) combine BDI reasoning with LLMs to enable autonomous evolution of goals, reasoning, and executable code, with an automated evolution module that operates alongside the agent's reasoning loop.

FORGER's RETAIN phase implements this principle: every task that succeeds contributes its verified knowledge to a persistent, version-tracked knowledge base. Failed assumptions are recorded alongside successful ones—often more valuable. After three successful tasks in the same domain, the framework auto-generates shortcuts that reduce token consumption by ~60%. The system gets better with every use.

---

## Part II: The Architecture

### 2.1 Architectural Overview

FORGER is a **seven-phase, plugin-native pipeline** orchestrated through a single agent loop with deterministic script hooks. It is not a multi-agent system. Following the 2026 research consensus—Anthropic's finding that multi-agent systems consume 3-10x more tokens than single-agent approaches, OneFlow's demonstration that single agents can match heterogeneous workflows with KV cache efficiency advantages—FORGER uses **one capable agent**, with skills loaded on demand and a second model from a different model family invoked only for adversarial review in the GRILL phase.

```
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

### 2.2 The Epistemic Triangle as Architectural Organizing Principle

Sartori's tripartite framework is not merely philosophical inspiration—it maps directly onto FORGER's phase architecture:

| Epistemic Criterion | Question | FORGER Phase(s) That Verify It |
|---------------------|----------|-------------------------------|
| **Coherence** | Does the explanation hold together logically? | RECOMBINE (mechanism-fit test), GRILL (reviewer checks reasoning) |
| **Grounding** | Does it correspond to physical reality? | FIND (live web sources), OBSERVE (runtime probes), EXECUTE (acceptance tests) |
| **Proper Basing** | Does the explanation actually link to the action taken? | audit.sh (claim-to-source tracing), GRILL (falsification tests), EXECUTE (Done Means Ran) |

Every phase gate in FORGER is traceable to at least one leg of the Epistemic Triangle. No single leg can pass the framework alone.

### 2.3 The Wallas-Boden Pipeline: Human Creativity, Made Structural

FORGER's phase sequence directly instantiates the Wallas creative process, extended with Boden's creativity taxonomy and grounded by Sartori's epistemic requirements:

| Wallas Stage | FORGER Phase | Boden Creativity Type | Epistemic Function |
|-------------|-------------|----------------------|-------------------|
| **Preparation** | CONTRACT + FIND | — | Define the problem; gather real-world evidence |
| **Incubation** | OBSERVE | — | Deepen understanding; surface hidden assumptions; probe the riskiest unknowns |
| **Illumination** | RECOMBINE | Combinational / Exploratory / Transformational (tiered) | Generate novel ideas from grounded elements; conceptual blending with mechanism-fit verification |
| **Verification** | GRILL + EXECUTE | — | Falsification review (cross-model); acceptance testing against Definition of Works |
| **(Extended)** | RETAIN | — | Persist verified knowledge; self-evolve for future tasks |

---

## Phase 0: CONTRACT — Socratic Intent Clarification

### 0.1 Architectural Purpose

The CONTRACT phase is the architectural answer to the "intention expression gap"—the fundamental difficulty humans face in conveying complex, high-dimensional thoughts to AI. Before any research begins, before any source is consulted, the framework must ensure that user intent is fully clarified, problem framing is explicit, and success criteria are machine-checkable.

This phase draws directly from three 2026 research threads:

1. **ClarifySTL**: detection of vague expressions that indicate underspecified information, followed by targeted clarification queries to guide users in supplementing requirements until all necessary details are provided.

2. **RECAP**: reframing user-agent dialogues into concise representations of user goals, capturing ambiguity, intent drift, vagueness, and mixed-goal conversations.

3. **The Nous agent**: active probing for information to resolve uncertainty about user intent, with information gain from dialogue as the intrinsic reward signal.

### 0.2 The Intent Clarification Sub-Phase

When the user provides a task description, the CONTRACT agent does not simply accept it. It interrogates it.

**Step 1: Vagueness Detection.** The agent scans the user's input for underspecified elements:
- **Unclear artifact type**: "Build me something for..." → What exactly? Code? Design? Research report? Architecture?
- **Missing success criteria**: "Make it good" → What does "good" mean? Measurable how?
- **Ambiguous constraints**: "It should be fast" → What latency threshold? Under what load?
- **Unstated assumptions**: Any domain, platform, or audience assumptions the user hasn't articulated
- **Mixed goals**: Multiple objectives that may conflict

**Step 2: Socratic Elicitation.** For each detected vagueness, the agent generates targeted clarification queries using the four classical Socratic elements:

| Socratic Element | Function | Example Query |
|-----------------|----------|---------------|
| **Maieutics** (knowledge elicitation) | Draw out unstated knowledge the user possesses | "When you say 'emotion recognition,' are you thinking of real-time video processing, or batch analysis of stored images? What's the end context?" |
| **Elenchus** (critical refutation) | Test whether the user's framing holds up under scrutiny | "You mentioned using a CNN. If we reframe: what problem are we actually solving that requires deep learning? Could a simpler approach work?" |
| **Aporia** (constructive doubt) | Surface productive uncertainty | "I'm not sure I understand the constraint. You need this to run on-device—does that mean mobile, embedded, or just local server? The architecture choice depends entirely on this." |
| **Dialectic** (collaborative synthesis) | Build toward shared understanding | "So if I'm understanding correctly: you need real-time facial emotion recognition running on a mobile device, offline, with <100ms latency. The output is one of 7 emotion labels. Is that right?" |

**Step 3: Problem Reframing.** Before finalizing the contract, the agent performs the senior engineer's most important move: challenging the problem statement itself. The question: "What would have to be true for the simplest possible solution to work?"

The agent generates at least one alternative problem framing:
- **Simplification reframe**: Can the same outcome be achieved with less complexity?
- **Constraint reframe**: Are all stated constraints actually non-negotiable?
- **Adjacent reframe**: Is this really an X problem, or is it better framed as a Y problem?

The original framing and the best alternative are both preserved in the contract. The agent may proceed with the original, but the reframe is documented for traceability.

**Step 4: Contract Finalization.** The output of CONTRACT is the **Definition of Works**—a machine-readable YAML document that serves as the single source of truth for every subsequent phase. Its schema includes:

- **Artifact specification**: type, format, description
- **Audience and use case**: who this is for and how they will use it
- **Hard constraints**: each with a measurable verification method
- **Measurable success criteria**: quantitative thresholds and test methods
- **Subjective criteria**: with measurement protocols
- **Unacceptable failure modes**: what must never happen
- **Work mode selection**: quick, standard, or deep, with rationale

### 0.3 The Reframe Memo

For every task, the agent produces a **Reframe Memo** documenting:
- The user's original framing
- At least one alternative problem framing
- The trade-off rationale for the chosen framing
- What would need to be true for a simpler approach to work

This memo persists through the entire pipeline. If the EXECUTE phase reveals that the original framing was the source of failure, the reframe provides an immediate fallback.

### 0.4 Autonomous vs. Interactive Mode

| Mode | Contract Behavior |
|------|-------------------|
| **Interactive** | Agent presents clarification queries to user; user responds; contract is co-created |
| **Autonomous** | Agent writes the contract using conservative assumptions; all assumptions are documented as explicit risks; agent proceeds without blocking |

In autonomous mode, any assumption that cannot be verified is tagged with a risk level and proceeds—but the assumption is recorded, not buried.

---

## Phase 1: FIND — Ground

### 1.1 Architectural Purpose

FIND operationalizes the *grounding* leg of the Epistemic Triangle. The agent uses `playwright-cli` + `cloakbrowser` to contact real websites, real documentation, real repositories—today. It builds a **Structured Source Ledger** with multi-dimensional quality scoring and a **Claim Ledger** with severity ratings.

### 1.2 Multi-Source Exploration Architecture

Two parallel lanes using live browser automation:

| Lane | Focus | Source Types |
|------|-------|-------------|
| **Production Lane** | Official documentation, peer-reviewed papers, working repositories, reproducible benchmarks | Documentation sites, GitHub repos with CI badges, arXiv, conference proceedings |
| **Community Lane** | Practitioner reports, forum discussions, war stories, known failure cases | Stack Overflow, GitHub Issues, Reddit, Hacker News |

Each lane navigates dynamically—following links, expanding threads, scraping content. This is **exploration, not keyword search**.

### 1.3 Source Quality Architecture

A deterministic `filter.sh` script performs mechanical checks: URL liveness, domain blocklist, date extraction, repository health indicators. It does **not** judge credibility or truth.

The LLM then scores each surviving source on six independent dimensions:

| Dimension | Question |
|-----------|----------|
| **Authority** | Is this source authoritative in its domain? |
| **Recency** | Is the information current? (with TTL) |
| **Reproducibility** | Can the claims be independently verified? |
| **Implementation Relevance** | How directly does this inform implementation? |
| **Independence** | Is this an independent source or derived? |
| **Conflict of Interest** | Does the source have incentives to mislead? |

### 1.4 Claim Severity Architecture

Not all claims need equal proof. FORGER uses a five-level severity model:

| Severity | Meaning | Required Support |
|----------|---------|------------------|
| **Trivial** | Wrongness has no project impact | No citation needed |
| **Low** | Minor inconvenience if wrong | At least one source |
| **Medium** | Moderate rework if wrong | Source + reasoning |
| **High** | Significant rework if wrong | Source + probe (or human waiver) |
| **Critical** | Project fails if wrong | Source + probe + acceptance test (or waiver) |

Every claim extracted from sources carries a severity rating tied back to the Definition of Works. A claim is "critical" not because it sounds important, but because the contract says the project fails if it's wrong.

### 1.5 Entailment Architecture

The claim ledger includes explicit entailment status:

| Entailment Status | Meaning |
|-------------------|---------|
| **directly_supported** | The source explicitly states this claim |
| **weakly_supported** | The source implies or suggests this claim |
| **extrapolated** | The claim extends beyond what the source states |
| **contradicted** | The source contradicts this claim |
| **unverified** | The claim has not been checked against the source |
| **speculative** | The claim is hypothetical, not evidence-based |

Critical claims with entailment status `weakly_supported`, `extrapolated`, or worse are blocked from proceeding.

---

## Phase 2: OBSERVE — Internalize & Probe

### 2.1 Architectural Purpose

OBSERVE corresponds to Wallas's *Incubation* stage. The agent deepens its understanding through mechanism extraction, Feynman-style explanation, risk mapping, and—critically—**mandatory runtime probes on every high and critical assumption**.

### 2.2 Mechanism Extraction

From the Ground-Truth Brief and Claim Ledger, the agent extracts:
- **Core mechanisms**: What causal processes make this work?
- **Domain constraints**: Data requirements, latency limits, scalability boundaries
- **Known failure modes**: What breaks, and under what conditions?

### 2.3 The Feynman Gate

The agent explains the entire domain in simple terms—no jargon without definition, no assumptions without stating them. This is a comprehension check. If the explanation breaks down, the agent has not internalized the material.

### 2.4 The Risk Map

Every unverified assumption is listed with severity and required resolution:

| Severity | Required Resolution |
|----------|---------------------|
| Trivial | None |
| Low | Source citation |
| Medium | Source + reasoning |
| High | Source + probe (or human waiver) |
| Critical | Source + probe + acceptance test (or human waiver) |

### 2.5 The Probe Architecture

For every `high` or `critical` unresolved assumption, the agent writes a probe—the smallest test that can falsify the assumption. There is no arbitrary line limit. The mandate is: **smallest test that can falsify**.

A probe may be:
- A short script testing API behavior
- A full repository clone and test suite run
- A small benchmark
- A targeted web search for a specific fact
- A prototype function with measured output

**The probe gate**: Zero unresolved `high` or `critical` assumptions without either a passed probe or a documented human waiver. This is not optional. It is the architectural expression of Sartori's proper basing relation—the agent cannot claim to understand something it hasn't tested.

---

## Phase 3: RECOMBINE — Create

### 3.1 Architectural Purpose

RECOMBINE corresponds to Wallas's *Illumination*. The agent generates creative solutions through conceptual blending of grounded elements. The tiered model allows exploration beyond proven territory while keeping execution safe.

### 3.2 Element Catalog

From the verified knowledge, the agent extracts discrete "cognitive building blocks"—patterns, algorithms, techniques, design principles—each traceable to a source.

### 3.3 The Mechanism-Fit Test

For every creative combination, the agent must answer: **Does the causal mechanism that made this work in the source domain still apply in the target domain?**

This is the architectural answer to grounded hallucination. Two true claims can combine into a false idea if the mechanism that connects them doesn't transfer. The mechanism-fit test is the gate that catches this.

### 3.4 Tiered Creativity Model

| Tier | Description | Execution Permission |
|------|-------------|---------------------|
| **Tier 1 — Grounded Recombination** | Combines proven elements; full source lineage; mechanism-fit verified | ✓ SAFE TO EXECUTE |
| **Tier 2 — Frontier Speculation** | Extends beyond direct evidence; includes concrete validation plan | ⚠ SAFE TO EXPLORE (validation required before building) |
| **Tier 3 — Transformational Proposal** | Challenges domain assumptions | 🚫 HUMAN APPROVAL REQUIRED |

### 3.5 The Speculation Firewall

Tier 2 and Tier 3 ideas are **structurally prevented** from entering the primary execution path. They are written to separate files and clearly tagged. No Tier 2 or Tier 3 idea may become part of the deliverable unless: (a) its validation plan is completed and passes, or (b) a human explicitly promotes it.

---

## Phase 4: GRILL — Falsification Review

### 4.1 Architectural Purpose

GRILL corresponds to the beginning of Wallas's *Verification*. A cross-model adversarial reviewer—from a **different model family**—attempts to break the proposal. The reviewer does not score. The reviewer tries to kill.

### 4.2 The audit.sh Gate

Before any LLM review, a deterministic script mechanically verifies:
- Every cited URL is live (HEAD request)
- Every verbatim quote exists on the page (fuzzy grep)
- Claims with weak entailment are flagged

The script does not judge truth. It judges traceability.

### 4.3 Dual-Reviewer Architecture (Deep Forge)

| Reviewer | Sees | Function |
|----------|------|----------|
| **Internal Adversary** | Proposal + Source Ledger + Claim Ledger | Checks reasoning, claim support, mechanism validity |
| **Blind Adversary** | Definition of Works only | Independently searches; identifies alternative approaches and missing assumptions |

### 4.4 Failure Hypothesis Format

The reviewer produces, for each major concern:
- What would make this idea fail?
- What evidence would disprove it?
- What minimal test can check it?
- Severity if wrong (critical / high / medium / low)
- Confidence in the hypothesis

The executor must resolve every failure hypothesis: accept and add the suggested test, reject with counter-evidence from the Source Ledger, or escalate to human.

---

## Phase 5: EXECUTE — Build, Run, Fix, Prove

### 5.1 Architectural Purpose

EXECUTE is the center of gravity. This is where Wallas's *Verification* becomes concrete. The agent builds the artifact and proves it works against the Definition of Works.

### 5.2 TDD Micro-Cycles (for Code)

```
Cycle:
  1. Write failing test
  2. Write minimal code to pass
  3. Run all tests + linter (post_code.sh hook)
  4. If all pass → summarize delta → next cycle
  5. If test fails after 2 fix attempts → pause, web-search error, fix, retry
  6. If still failing after 3 attempts → escalate
```

### 5.3 The Acceptance Test Suite

All measurable success criteria from the Definition of Works are converted into automated tests. Subjective criteria get measurement protocols.

### 5.4 The "Done Means Ran" Rule

The agent **cannot** claim completion unless:

| Artifact Type | Requirement |
|---------------|-------------|
| Code / System | Artifact has been executed successfully AND acceptance tests pass |
| Research Report | All claims are ledger-verified with directly_supported entailment; no critical claims are weakly supported |
| Design | Artifact checked against rubric or tested with screenshots/user-flow review |
| Any | If execution is impossible, the reason is documented and escalated—not hidden |

This rule is the architectural expression of Sartori's proper basing relation. An explanation alone is not enough. The action must be taken, and its result must match the explanation.

---

## Phase 6: RETAIN — Knowledge Persistence & Self-Evolution

### 6.1 Architectural Purpose

RETAIN implements the BDI-LLM self-evolution pattern: only validated, working knowledge enters the persistent knowledge base. Failure memory is preserved alongside success.

### 6.2 What Gets Stored

- **Proven claims**: those that passed probes and acceptance tests, with TTL
- **Working architectures**: with version pins and dependency constraints
- **Failure memory**: assumptions that proved wrong, with the lesson learned
- **Source quality assessments**: so future tasks can skip re-evaluation

### 6.3 Self-Evolution Triggers

After 3 successful tasks in the same domain:
- The framework auto-generates a Quick Forge shortcut
- Future tasks skip FIND (cached sources) and shorten OBSERVE (known probes already passed)
- Token consumption drops ~60%

---

## Part III: Work Modes

| Mode | Trigger | Token Budget (Cold) | Key Difference |
|------|---------|---------------------|----------------|
| **Quick Forge** | Simple tasks, well-known domain, cached knowledge | ~5,000–6,000 | FIND loads from KB; OBSERVE probes trimmed; GRILL optional; RECOMBINE Tier 1 only |
| **Standard Forge** | Default | ~22,000 | Full pipeline; single cross-model reviewer in GRILL |
| **Deep Forge** | Novel domain, high stakes, overnight autonomy | ~35,000 | Dual-reviewer GRILL; all high+critical assumptions probed with no waivers; extended acceptance suite |

---

## Part IV: Architectural Invariants

These are non-negotiable. Every design decision in the plugin implementation must satisfy them.

| # | Invariant | Epistemic Basis |
|---|-----------|-----------------|
| 1 | **Done Means Ran.** Completion cannot be claimed without execution and passing tests, or a documented reason why execution was impossible. | Proper Basing |
| 2 | **No Claim Without Evidence or Label.** Every claim must end in a passed test, a sourced constraint, or an explicit "speculative" tag. | Grounding |
| 3 | **Test Critical, Skip Trivial.** Only high and critical assumptions require probes. Trivial claims need no citation. This prevents over-verification paralysis. | Efficiency constraint |
| 4 | **Tier 2/3 Firewall.** No speculative or transformational idea may enter the primary execution path without explicit promotion. | Grounding |
| 5 | **Cross-Model Review for Standard and Deep modes.** The reviewer must be from a different model family. | Coherence verification |
| 6 | **Mechanism-Fit Before Recombination.** Every creative combination must pass: does the causal mechanism transfer? | Grounding + Coherence |
| 7 | **Knowledge Self-Evolves.** Every completed task must update the KB. After 3 tasks in the same domain, shortcuts become available. | Efficiency |
| 8 | **Scripts Are Mechanical Only.** No script performs judgment. All qualitative assessment is LLM-driven with structured output. | Architectural hygiene |
| 9 | **Definition of Works Is the Single Source of Truth.** Every gate, every probe, every acceptance test traces back to this contract. | Coherence |

---

## Part V: Plugin Filesystem

```
~/.claude/plugins/forger/
├── manifest.json                    # Plugin metadata, hook registration
├── SKILL.md                         # Progressive disclosure entry point
├── modes/                           # Work mode configurations
│   ├── quick.yaml
│   ├── standard.yaml
│   └── deep.yaml
├── phases/                          # Phase skill definitions
│   ├── contract.md                  # Socratic intent clarification
│   ├── find.md                      # Ground: live web research
│   ├── observe.md                   # Internalize & probe
│   ├── recombine.md                 # Tiered creative blending
│   ├── grill.md                     # Cross-model falsification review
│   ├── execute.md                   # Build, run, fix, prove
│   └── retain.md                    # Knowledge persistence & evolution
├── hooks/                           # Deterministic scripts
│   ├── filter.sh                    # Mechanical source filtering
│   ├── probe.sh                     # Execute probe in target environment
│   ├── audit.sh                     # Claim-to-source mechanical trace
│   ├── acceptance_test.sh           # Run acceptance suite
│   ├── post_code.sh                 # Linter + test runner hook
│   └── update_kb.sh                 # Knowledge persistence with TTL
├── templates/                       # Structured output schemas
│   ├── definition_of_works.yaml
│   ├── source_ledger_entry.yaml
│   ├── claim_ledger_entry.yaml
│   ├── failure_hypothesis.yaml
│   ├── risk_map.yaml
│   └── retro_note.yaml
└── knowledge/                       # Persistent, version-tracked KB
    └── {domain-slug}/
        ├── index.yaml
        ├── ground_truth_brief.md
        ├── source_ledger.yaml
        ├── working_architectures.md
        └── failure_memory.yaml
```

---

## Epilogue: What FORGER Is and Is Not

**FORGER is:**
- A framework that forces AI to contact reality before it creates
- A pipeline that separates grounding from recombination, and verification from both
- A harness where 98.4% of the value is in the deterministic infrastructure—contracts, hooks, gates, ledgers, and audits
- A system that gets better with every use through persistent, version-tracked knowledge

**FORGER is not:**
- A guarantee of correctness (no framework can be)
- A creativity suppressor (the tiered model explicitly allows speculation within labeled boundaries)
- A replacement for human judgment on high-stakes, one-way-door decisions
- A lightweight tool for trivial tasks (use simpler patterns when the stakes are low)

The framework is **ready for prototype implementation**. The next step is to build the minimum working spine—Contract → Grounding → Risk Map → Recombine → Execute → Done Means Ran → Retain—and test it on real tasks. The architecture will prove itself not in theory, but in whether it prevents the agent from producing plausible, well-cited, confidently-reasoned output that fails the moment someone tries to build it.