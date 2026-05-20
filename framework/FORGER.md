# FORGER — Philosophical Foundation & Architectural Specification

A test-gated, execution-centric framework for grounded AI creativity.

v0.1 shipped. May 2026.

---

## Why FORGER exists

In March 2026, Chacón Sartori published a paper on what he called the Bidirectional Coherence Paradox: an AI agent's internally consistent explanations systematically diverge from empirical reality, so that better explanations can actually hide the agent's real epistemic relationship to the domain. His controlled experiments in compiler optimization and hyperparameter tuning showed a 61-point swing. In low-observability domains, models acted successfully while misidentifying the mechanisms that produced their success. In high-observability domains, they generated explanations that tracked observable causal structure but failed to translate those diagnoses into effective intervention.

This is not an edge case. It is the central failure mode of AI-driven creative work. An agent proposes a facial emotion recognition system with plausible architecture, real citations, and confident reasoning. It fails when built because the mechanisms don't transfer, the API doesn't exist in that form, or the cited source was describing a different problem. The output looks grounded. It passes review. It doesn't work.

Sartori's answer is the Epistemic Triangle. Evaluating an AI epistemic agent needs three criteria, not one: coherence (does the explanation hold together?), grounding (does it correspond to physical reality?), and a proper basing relation (does the explanation actually link to the action taken?). FORGER runs this triangle. Every phase, every gate, every invariant exists to confirm coherence, grounding, and basing independently before any artifact is called complete.

---

## Part I: The philosophy

### 1.1 AI cannot trust its training data

Large language models are, as Bender and Gebru framed it, "stochastic parrots": systems that produce plausible-seeming text without understanding its meaning. But the deeper problem is not that they parrot. It's that their training data is a snapshot of a world that has already moved on. APIs deprecate. Libraries shift. Working repos go stale. Benchmarks get superseded. The model's internal knowledge is at best an orientation device, never a source of truth.

This was the original insight that drove reTruth and now FORGER. Inspiration has to come from the live world, not from training-data residue. `playwright-cli` + `cloakbrowser` contact real websites, real documentation, real GitHub repos, real forum discussions, today.

### 1.2 Humans learn first, then add spice

Graham Wallas, in his 1926 book *The Art of Thought*, identified four stages of creative work: Preparation (gathering knowledge and defining the problem), Incubation (unconscious processing), Illumination (the flash of insight), and Verification (testing and refining). The model has held for a century because it describes something real about how human minds produce novel, working ideas.

A mathematician does not invent new theorems from nothing. She studies existing proofs. She solves hundreds of problems. She reads Euler and Gauss. Only after years of absorbing does she produce original work, and her theorems still rest on what she studied.

A chef does not invent fusion cuisine by imagining flavors in a vacuum. She cooks the classics fifty times each. She understands why certain combinations work at the chemical level. Then she adds her own spices.

The human sequence is:

```
Inspiration → Learn → Practice → Master → Recombine → Verify → Ship
```

FORGER enforces this sequence structurally. The agent cannot skip to recombination. It has to find real sources, study them, probe its own understanding. Only then can it create.

### 1.3 Creativity is combination, not conjuration

Margaret Boden's taxonomy of computational creativity names three forms: combinational (novel combinations of familiar ideas), exploratory (new possibilities within an existing conceptual space), and transformational (changing the enabling constraints of the conceptual space itself).

The point FORGER builds on: all three start from existing knowledge. Even transformational creativity, which looks like rule-breaking, starts by understanding which rules exist and why. Boden's later work argued that transformational creativity arises specifically from changes in the "enabling constraints" of a conceptual space.

Fauconnier and Turner's Conceptual Blending framework gives the cognitive mechanism. Novel concepts emerge when two input mental spaces project selectively into a blended space, producing structure not present in either input alone. It's a search problem over grounded elements. That is what FORGER's RECOMBINE phase does.

### 1.4 The harness is the product

VILA-Lab's analysis of Claude Code's source code found that only 1.6% of the system is AI decision logic. The remaining 98.4% is deterministic infrastructure: permission gates, context management, tool routing, recovery logic, hooks, compaction. The agent loop itself is a trivial while-loop.

Alenezi's 2026 reference architecture for production-grade LLM agents formalizes this. The architecture separates cognitive reasoning from execution using typed tool interfaces, with state management and policy enforcement as first-class concerns. The BDI model — Beliefs (world state and memory), Desires (goals and constraints), Intentions (adopted plans and tool calls) — gives the control skeleton that modern generative agents can inherit, "separating free-form generation from governed behavior."

The harness is the product. Scripts, hooks, gates, contracts, ledgers. The agent's creativity is bounded and directed by the harness, not replaced by it.

### 1.5 Intent has to be clarified before it can be executed

The RECAP benchmark (2026) captures the problem: real-world dialogues are ambiguous, underspecified, or dynamic. Intent drift, vagueness, and mixed-goal conversations are the norm. A survey of LLM alignment research confirms that users' natural-language expressions are "inherently fuzzy, ambiguous, and uncertain, leading to challenges such as vagueness, polysemy, and contextual ambiguity."

The Socratic Method Revisited framework (2026) shows that classical Socratic moves — Elenchus (critical refutation), Maieutics (knowledge elicitation), Aporia (constructive doubt), Dialectic (collaborative synthesis) — integrate into human-LLM interactions and "turn confident-but-wrong outputs into testable claims that must be justified, challenged, and revised."

The Nous agent (2026) flips the framing. Instead of the human painstakingly teaching the AI, the AI guides the human, probing for information to resolve its uncertainty about user intent. The core mechanism is an information-theoretic reward: information gain from dialogue as the reduction of Shannon entropy over a structured task space.

FORGER's CONTRACT phase runs this. Before any research begins, the framework detects vagueness, resolves ambiguity, clarifies intent, and produces a machine-readable Definition of Works that becomes the single source of truth for every later phase.

### 1.6 Knowledge has to self-evolve or it stagnates

The EvolveMem architecture (May 2026) shows that adaptive memory needs co-evolution at two levels: the stored knowledge and the retrieval mechanism that queries it. Self-evolving software agents (Robol & Giorgini, 2026) combine BDI reasoning with LLMs to enable autonomous evolution of goals, reasoning, and executable code, with an evolution module that runs alongside the agent's reasoning loop.

FORGER's RETAIN phase runs this. Every task that succeeds contributes its verified knowledge to a persistent, version-tracked KB. Failed assumptions are recorded alongside successful ones — often more valuable. After three successful tasks in the same domain, the framework auto-generates shortcuts that drop token consumption by roughly 60%. The system gets better with every use.

---

## Part II: The architecture

### 2.1 Architectural overview

FORGER is a seven-phase, plugin-native pipeline orchestrated through a single agent loop with deterministic script hooks. It is not a multi-agent system. Following the 2026 research consensus (Anthropic found multi-agent systems consume 3-10× the tokens of single-agent approaches; OneFlow showed single agents can match heterogeneous workflows with KV cache efficiency advantages), FORGER uses one capable agent, with skills loaded on demand and a second model from a different family invoked only for adversarial review in GRILL.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          FORGER ARCHITECTURE                                 │
│                                                                              │
│                         ┌─────────────────────┐                              │
│                         │   DEFINITION OF     │                              │
│                         │      WORKS          │                              │
│                         │  (Single Source     │                              │
│                         │    of Truth)        │                              │
│                         └──────────┬──────────┘                              │
│                                    │                                         │
│  ┌──────────┐  ┌──────────┐  ┌────┴─────┐  ┌──────────┐  ┌──────────┐        │
│  │ CONTRACT │─▶│   FIND   │─▶│ OBSERVE  │─▶│RECOMBINE │─▶│  GRILL   │        │
│  │  Clarify │  │  Ground  │  │Internalize│ │  Create  │  │ Falsify  │        │
│  │  Intent  │  │ (Source  │  │ & Probe  │  │ (Tiered  │  │ (Cross-  │        │
│  │(Socratic)│  │ Ledger)  │  │(Risk Map)│  │Blending) │  │  Model)  │        │
│  └──────────┘  └──────────┘  └──────────┘  └─────┬────┘  └─────┬────┘        │
│                                                  │             │             │
│                   ┌──────────────────────────────┘             │             │
│                   ▼                                            ▼             │
│  ┌──────────┐  ┌──────────┐                            (gate: pass)          │
│  │ RETAIN   │◀─┤ EXECUTE  │◀───────────────────────────────┘                 │
│  │ Persist  │  │Build/Test│                                                  │
│  │Knowledge │  │  Prove   │                                                  │
│  └──────────┘  └──────────┘                                                  │
│                                                                              │
│  EPISTEMIC TRIANGLE (Chacón Sartori, 2026):                                  │
│  • Coherence: Does the explanation hold together logically?                  │
│  • Grounding: Does it correspond to physical reality (live sources+probes)?  │
│  • Proper Basing: Does the explanation actually link to the action taken?    │
│                                                                              │
│  ARCHITECTURAL INVARIANTS:                                                   │
│  • Done Means Ran              • No claim without evidence or label          │
│  • Test critical, skip trivial  • Tier 2/3 cannot leak into execution        │
│  • Cross-model review           • Knowledge self-evolves                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 The Epistemic Triangle as architectural organizing principle

Sartori's framework is not just inspiration. It maps onto FORGER's phase architecture:

| Epistemic Criterion | Question | FORGER Phase(s) That Verify It |
|---------------------|----------|-------------------------------|
| Coherence | Does the explanation hold together logically? | RECOMBINE (mechanism-fit test), GRILL (reviewer checks reasoning) |
| Grounding | Does it correspond to physical reality? | FIND (live web sources), OBSERVE (runtime probes), EXECUTE (acceptance tests) |
| Proper Basing | Does the explanation actually link to the action taken? | `src/gates/audit.mjs` (claim-to-source trace), GRILL (falsification tests), EXECUTE (Done Means Ran) |

Every phase gate traces to at least one leg of the triangle. No single leg can pass the framework alone.

### 2.3 The Wallas-Boden pipeline: human creativity, made structural

FORGER's phase sequence runs Wallas's creative process, extended with Boden's creativity taxonomy and grounded by Sartori's epistemic requirements:

| Wallas Stage | FORGER Phase | Boden Creativity Type | Epistemic Function |
|-------------|-------------|----------------------|-------------------|
| Preparation | CONTRACT + FIND | — | Define the problem; gather real-world evidence |
| Incubation | OBSERVE | — | Deepen understanding; surface hidden assumptions; probe the riskiest unknowns |
| Illumination | RECOMBINE | Combinational / Exploratory / Transformational (tiered) | Generate novel ideas from grounded elements; conceptual blending with mechanism-fit verification |
| Verification | GRILL + EXECUTE | — | Falsification review (cross-model); acceptance testing against Definition of Works |
| (Extended) | RETAIN | — | Persist verified knowledge; self-evolve for future tasks |

---

## Phase 0: CONTRACT — Socratic intent clarification

### 0.1 Architectural purpose

CONTRACT is FORGER's answer to the "intention expression gap": the difficulty humans face conveying complex, high-dimensional thoughts to AI. Before any research begins, before any source gets consulted, the framework has to confirm that user intent is clarified, problem framing is explicit, and success criteria are machine-checkable.

The phase pulls from three 2026 research threads:

1. ClarifySTL: detection of vague expressions, then targeted clarification queries that guide users in supplementing requirements until all necessary details are provided.
2. RECAP: reframing user-agent dialogues into concise representations of user goals, capturing ambiguity, intent drift, vagueness, and mixed-goal conversations.
3. The Nous agent: active probing for information to resolve uncertainty about user intent, with information gain from dialogue as the intrinsic reward signal.

### 0.2 Intent clarification

When the user provides a task description, the CONTRACT agent does not just accept it. It interrogates it.

Step 1: vagueness detection. The agent scans the input for underspecified elements: unclear artifact type, missing success criteria, ambiguous constraints, unstated assumptions, mixed goals.

Step 2: Socratic elicitation. For each detected vagueness, the agent generates targeted clarification queries using the four classical Socratic moves:

| Socratic Move | Function | Example |
|-----------------|----------|---------------|
| Maieutics (knowledge elicitation) | Draw out unstated knowledge the user has | "When you say 'emotion recognition,' are you thinking of real-time video, or batch analysis of stored images?" |
| Elenchus (critical refutation) | Test whether the framing holds up under scrutiny | "You mentioned using a CNN. What problem are we actually solving that requires deep learning? Could a simpler approach work?" |
| Aporia (constructive doubt) | Surface productive uncertainty | "I'm not sure I understand the constraint. You need this to run on-device — does that mean mobile, embedded, or just local server? The architecture choice depends entirely on this." |
| Dialectic (collaborative synthesis) | Build toward shared understanding | "So: you need real-time facial emotion recognition running on a mobile device, offline, with <100ms latency, output is one of 7 emotion labels. Right?" |

Step 3: problem reframing. Before finalizing the contract, the agent does the senior engineer's most important move: challenging the problem statement itself. The question: "What would have to be true for the simplest possible solution to work?" The agent generates at least one alternative framing (simplification, constraint, adjacent). Both framings persist in the contract.

Step 4: scope confirmation. Before writing the DoW, the agent echoes a three-bullet scope summary (artifact, audience, must-haves) and waits for explicit user confirmation. Autonomous mode skips this and logs the skip in the reframe memo. Added in v0.1 after the dolphin-physiology coherence test revealed CONTRACT could otherwise persist a DoW the user wouldn't recognize.

Step 5: contract finalization. The output is the Definition of Works, a machine-readable YAML document validated by `src/lib/ledger.mjs::validateDoW`. Its schema covers artifact spec, audience, hard constraints with verification methods, measurable success criteria with thresholds, subjective criteria with measurement protocols, unacceptable failure modes, and the work mode selection.

### 0.3 The reframe memo

For every task, the agent writes a reframe memo with the user's original framing, at least one alternative framing, the trade-off rationale, and what would need to be true for a simpler approach to work. The memo persists through the pipeline. If EXECUTE reveals that the original framing was the source of failure, the reframe is the fallback.

---

## Phase 1: FIND — Ground

### 1.1 Architectural purpose

FIND runs the grounding leg of the Epistemic Triangle. The agent contacts real websites, real documentation, real repos, today. It builds a Source Ledger with multi-dimensional quality scoring and a Claim Ledger with severity ratings.

All page fetches route through the `forger-real-search` skill (`framework/forger/skills/real_search/SKILL.md`). The skill wraps `playwright-cli` + `cloakbrowser`, enforces the no-`--browser`-flag rule, and applies the progressive read library at `src/lib/read_progressive.mjs` (SKIM → SCAN → DEEP staged by claim density and token budget). Lanes never spawn `playwright-cli` directly.

### 1.2 Multi-source exploration architecture

Lane fan-out is mode-aware. Lanes live as filesystem-injected subagent mandates at `framework/forger/skills/forger/phases/find/lanes/{lane}.md`.

| Lane | Quick | Standard | Deep | Source types |
|------|-------|----------|------|-------------|
| production | ✓ (target 5) | ✓ (8-10) | ✓ (12-15) | Official docs, peer-reviewed papers, working repos with CI, vendor RFCs, reproducible benchmarks |
| community | — | ✓ (8-10) | ✓ (8-10) | Stack Overflow, GitHub Issues, Reddit, HN, blog war stories, public talks, podcasts |
| frontier | — | — | ✓ (5-7) | Contrarian takes, "considered harmful" essays, cross-domain analogues, debates. Every claim flagged `intended_use: tier2_seed`. |

Each lane navigates dynamically — following links, expanding threads, reading the page. Exploration, not keyword search.

### 1.3 Source quality

A deterministic CLI tool at `src/cli/filter.mjs` does the mechanical checks: URL liveness, domain blocklist, date extraction, repo health indicators. It does not judge credibility or truth.

The LLM then scores each surviving source on six independent dimensions: authority, recency, reproducibility, implementation relevance, independence, conflict of interest. Each is 0-5; composite is the mean.

### 1.4 Claim severity

Not all claims need equal proof. FORGER uses a five-level severity model:

| Severity | Meaning | Required support |
|----------|---------|------------------|
| Trivial | Wrongness has no project impact | No citation needed |
| Low | Minor inconvenience if wrong | At least one source |
| Medium | Moderate rework if wrong | Source + reasoning |
| High | Significant rework if wrong | Source + probe (or human waiver) |
| Critical | Project fails if wrong | Source + probe + acceptance test (or waiver) |

A claim is critical because the contract says the project fails if it's wrong, not because it sounds important.

### 1.5 Entailment

The claim ledger carries explicit entailment status:

| Status | Meaning |
|-------------------|---------|
| directly_supported | The source explicitly states this claim |
| weakly_supported | The source implies or suggests it |
| extrapolated | The claim extends beyond what the source states |
| contradicted | The source contradicts the claim |
| unverified | Not yet checked against the source |
| speculative | Hypothetical, not evidence-based |

Critical claims with entailment worse than `directly_supported` get tagged `status: blocked`. OBSERVE has to resolve every blocked claim before exit (probe to `probed_ok`/`probed_fail`, downgrade severity with rationale, or escalate).

### 1.6 Audit

`src/gates/audit.mjs` runs after lanes return: HEAD-request every source URL, literal grep of each `verbatim_quote` against fetched page text, lineage check (`source_id` exists in source ledger), bigram anti-redundancy for frontier vs production+community (≥30% overlap flags `redundant-with-other-lane`), independence advisory (critical claims should have ≥2 independent sources), lane-floor warning (under floor and not marked `under_sourced`). The audit preserves YAML comments by skipping writeback when no flags change.

---

## Phase 2: OBSERVE — Internalize & probe

### 2.1 Architectural purpose

OBSERVE corresponds to Wallas's Incubation. The agent deepens understanding through mechanism extraction, Feynman-style explanation, risk mapping, and mandatory runtime probes on every high and critical assumption.

### 2.2 Mechanism extraction

From the ground-truth brief and claim ledger, the agent extracts core mechanisms (what causal processes make this work?), domain constraints, and known failure modes.

### 2.3 The Feynman gate

The agent explains the entire domain in simple terms. No jargon without inline definition, no assumptions without stating them. Minimum 200 words. If the explanation breaks down, the agent has not internalized the material and re-reads the claim ledger.

### 2.4 The risk map

Every unverified assumption lands in `risk_map.yaml` with a severity and a `resolution_required` field:

| Severity | Required resolution |
|----------|---------------------|
| Trivial | None |
| Low | Source citation |
| Medium | Source + reasoning |
| High | Source + probe (or human waiver) |
| Critical | Source + probe + acceptance test (or human waiver) |

### 2.5 Probe architecture

For every high or critical unresolved assumption, the agent writes a probe — the smallest test that can falsify it. No arbitrary line limit. The mandate is: smallest test that can falsify.

Probe types (per `src/cli/probe.mjs`): `script`, `repo_clone`, `web_search`, `prototype_fn`, `benchmark`, `api_test`. `web_search` probes drive the `forger-real-search` skill, never `playwright-cli` directly.

The probe gate: zero unresolved high/critical assumptions without a passed probe or a documented waiver. Deep mode forbids waivers entirely. The agent cannot claim to understand something it hasn't tested.

---

## Phase 3: RECOMBINE — Create

### 3.1 Architectural purpose

RECOMBINE corresponds to Wallas's Illumination. The agent generates creative solutions through conceptual blending of grounded elements. The tiered model allows exploration beyond proven territory while keeping execution safe.

### 3.2 Element catalog

From verified claims, the agent extracts discrete cognitive building blocks — patterns, algorithms, techniques, design principles — each traceable to a source.

### 3.3 The mechanism-fit test

For every creative combination the agent answers: does the causal mechanism that made this work in the source domain still apply in the target domain?

This is the architectural answer to grounded hallucination. Two true claims can combine into a false idea if the mechanism connecting them doesn't transfer. The mechanism-fit test catches that.

### 3.4 Tiered creativity model

| Tier | Description | Execution permission |
|------|-------------|---------------------|
| Tier 1 — Grounded Recombination | Proven elements; full source lineage; mechanism-fit verified | SAFE TO EXECUTE |
| Tier 2 — Frontier Speculation | Extends beyond direct evidence; concrete validation plan | SAFE TO EXPLORE (validation required before building) |
| Tier 3 — Transformational Proposal | Challenges domain assumptions | HUMAN APPROVAL REQUIRED |

### 3.5 The speculation firewall

Tier 2 and Tier 3 ideas live in separate files (`tier2_speculation.md`, `tier3_proposals.md`) and are structurally blocked from entering the primary execution path. The PreToolUse hook at `src/hooks/enforce_tier_firewall.mjs` bigram-matches proposed writes against un-promoted Tier 2/3 ideas (`promoted_at: null`); 60% overlap blocks the write with exit 2. No Tier 2 or Tier 3 idea becomes part of the deliverable unless its validation plan passes, or a human explicitly promotes it by setting `promoted_at`.

---

## Phase 4: GRILL — Falsification review

### 4.1 Architectural purpose

GRILL is the start of Wallas's Verification. A cross-model adversarial reviewer from a different model family tries to break the proposal. The reviewer does not score. The reviewer tries to kill.

### 4.2 The audit gate

Before any LLM review, `src/gates/audit.mjs` mechanically re-runs on the workspace: every cited URL is live, every verbatim quote exists on the page, weak-entailment critical claims are flagged. The script does not judge truth. It judges traceability.

### 4.3 Reviewer router

`src/lib/reviewer_router.mjs` picks the highest-priority working API key that differs from the current session's provider. With no keys it falls back to a Claude Code subagent spawn with a different model in the same family. Tier requirement per mode: quick = any (or skipped via `mode.grill_required: false`); standard = ≥ acceptable; deep = ≥ good AND ≥ 1 hypothesis from a blind reviewer.

### 4.4 Dual-reviewer architecture (Deep Forge)

| Reviewer | Sees | Function |
|----------|------|----------|
| Internal Adversary | Proposal + Source Ledger + Claim Ledger | Checks reasoning, claim support, mechanism validity |
| Blind Adversary | Definition of Works only | Independently searches; identifies alternative approaches and missing assumptions |

### 4.5 Failure hypothesis format

For each substantive concern the reviewer outputs: what would make this idea fail, what evidence would disprove it, what minimal test can check it, severity if wrong (critical/high/medium/low), confidence (0-5). The executor resolves every failure hypothesis: accept and add the suggested test (`status: accepted_test_added`), reject with counter-evidence from the source ledger (`status: rejected_with_counter_evidence`), or escalate (`status: escalated`). No `status: open` may remain at exit.

---

## Phase 5: EXECUTE — Build, run, fix, prove

### 5.1 Architectural purpose

EXECUTE is the center of gravity. Wallas's Verification becomes concrete. The agent builds the artifact and proves it works against the Definition of Works.

### 5.2 TDD micro-cycles (for code)

```
Cycle:
  1. Write failing test (RED)
  2. Write minimal code to pass (GREEN)
  3. Run all tests + linter (PostToolUse fires src/hooks/post_code.mjs)
  4. If all pass → summarize delta → next cycle (IMPROVE)
  5. If test fails after 2 fix attempts → pause, web-search error, fix, retry
  6. If still failing after 3 attempts → escalate
```

### 5.3 Branches for non-code artifacts

EXECUTE picks branch by `dow.artifact.type`:

- code / system → TDD micro-cycle above
- research_report → every claim in the report references a claim-ledger entry; no critical claim at entailment worse than `directly_supported`; `src/gates/audit.mjs` re-runs against the report text
- design → rubric scoring + screenshot/user-flow review

### 5.4 The acceptance test suite

All measurable success criteria from the Definition of Works convert into automated tests via `src/gates/acceptance_test.mjs`, which writes one line per criterion to `acceptance_results.jsonl`. Subjective criteria get measurement protocols.

### 5.5 The "Done Means Ran" rule

The agent cannot claim completion unless:

| Artifact type | Requirement |
|---------------|-------------|
| Code / System | Artifact has been executed successfully AND acceptance tests pass |
| Research Report | All claims ledger-verified with `directly_supported` entailment; no critical claims weakly supported |
| Design | Artifact checked against rubric or tested with screenshots/user-flow review |
| Any | If execution is impossible, the reason is documented and escalated, not hidden |

The Stop hook at `src/hooks/enforce_done_means_ran.mjs` enforces this. If the transcript contains a completion claim ("done", "shipped", "all tests pass", ✓) while required acceptance criteria are still unproven, the hook exits 2 and blocks Stop. The proper-basing leg of Sartori's triangle in code: an explanation alone is not enough; the action has to be taken, and its result has to match the explanation.

### 5.6 Fact-gap re-entry to FIND

If acceptance fails and the agent diagnoses the failure as a missing fact rather than a code bug, it writes `dow_addendum_{n}.yaml` (a single narrowed criterion) and re-invokes `forger-find` in single-lane mode (production only, target 3, no frontier). Cap: 2 re-entries per task. The 3rd escalates.

---

## Phase 6: RETAIN — Knowledge persistence & self-evolution

### 6.1 Architectural purpose

RETAIN runs the BDI-LLM self-evolution pattern. Only validated, working knowledge enters the persistent KB. Failure memory persists alongside success.

### 6.2 What gets stored

- Proven claims: those that passed probes and acceptance tests, with TTL (default 90d; overridable per claim type — 30d for fast-moving libs, 365d for algorithmic)
- Working architectures: with version pins and dependency constraints
- Failure memory: assumptions that proved wrong, with the lesson learned
- Source quality assessments: so future tasks can skip re-evaluation

### 6.3 Self-evolution triggers

`src/cli/update_kb.mjs` merges proven claims into `knowledge/{domain}/claim_ledger.yaml` with `expires_at` stamps, appends failed assumptions to `failure_memory.yaml`, and tracks the last 3 task statuses. If all 3 are `shipped`, `index.yaml.shortcut_eligible` flips to true. If any is `escalated` or `abandoned`, the flag flips back to false. When eligible AND DoW coverage ≥ 0.80, FIND serves from cache and skips lane fan-out entirely. Token consumption drops roughly 60%.

---

## Part III: Work modes

| Mode | Trigger | Token budget (cold) | Key difference |
|------|---------|---------------------|----------------|
| Quick Forge | Simple tasks, well-known domain, cached knowledge | ~5,000-6,000 | FIND loads from KB; OBSERVE probes trimmed; GRILL optional; RECOMBINE Tier 1 only |
| Standard Forge | Default | ~22,000 | Full pipeline; single cross-model reviewer in GRILL |
| Deep Forge | Novel domain, high stakes, overnight autonomy | ~35,000 | Dual-reviewer GRILL; all high+critical assumptions probed with no waivers; extended acceptance suite |

CONTRACT asks the plain-language mode question (Fast / Normal / Thorough / You choose). "You choose" runs the auto-rule: shortcut-eligible familiar domain → quick; ≥1 safety-critical failure mode OR novel domain → deep; else → standard.

---

## Part IV: Architectural invariants

Non-negotiable. Every design decision in the plugin has to satisfy them.

| # | Invariant | Epistemic basis |
|---|-----------|-----------------|
| 1 | Done Means Ran. Completion cannot be claimed without execution and passing tests, or a documented reason why execution was impossible. | Proper Basing |
| 2 | No Claim Without Evidence or Label. Every claim has to end in a passed test, a sourced constraint, or an explicit "speculative" tag. | Grounding |
| 3 | Test Critical, Skip Trivial. Only high and critical assumptions need probes. Trivial claims need no citation. Prevents over-verification paralysis. | Efficiency |
| 4 | Tier 2/3 Firewall. No speculative or transformational idea may enter the primary execution path without explicit promotion. | Grounding |
| 5 | Cross-Model Review for Standard and Deep. Reviewer is from a different model family. | Coherence verification |
| 6 | Mechanism-Fit Before Recombination. Every creative combination passes: does the causal mechanism transfer? | Grounding + Coherence |
| 7 | Knowledge Self-Evolves. Every completed task updates the KB. After 3 tasks in the same domain, shortcuts become available. | Efficiency |
| 8 | Scripts Are Mechanical Only. No script performs judgment. All qualitative assessment is LLM-driven with structured output. | Architectural hygiene |
| 9 | Definition of Works Is the Single Source of Truth. Every gate, probe, and acceptance test traces back to this contract. | Coherence |

---

## Part V: Plugin filesystem (v0.1 shipped)

```
~/.claude/plugins/forger/                       # installed location
framework/forger/                               # repo location
├── manifest.json                               # Plugin metadata, hook registration
├── SKILL.md                                    # Orchestrator (drives 7-phase pipeline)
├── README.md
├── _archive/                                   # Historical build-spec snapshots (not agent-facing)
├── package.json                                # Node deps, npm scripts
├── schemas/                                    # JSON Schemas (YAML)
│   ├── definition_of_works.schema.yaml
│   ├── source_ledger_entry.schema.yaml
│   ├── claim_ledger_entry.schema.yaml
│   ├── failure_hypothesis.schema.yaml
│   ├── probe_result.schema.yaml
│   ├── risk_map.schema.yaml
│   └── retro_note.schema.yaml
├── templates/                                  # Round-trip-validated artifact templates
├── skills/
│   ├── forger/                                 # Forger plugin skill bundle
│   │   ├── modes/{quick,standard,deep}.yaml
│   │   └── phases/
│   │       ├── contract/
│   │       ├── find/
│   │       │   ├── SKILL.md
│   │       │   ├── lanes/{production,community,frontier}.md
│   │       │   ├── refs/ (quality / severity / entailment / pivot / read_content_rules)
│   │       │   └── examples/
│   │       ├── observe/
│   │       ├── recombine/
│   │       ├── grill/
│   │       ├── execute/
│   │       └── retain/
│   └── real_search/                            # Cross-phase browser-driven page-read skill
│       └── SKILL.md
├── src/
│   ├── lib/                                    # Shared helpers (config, ledger I/O, KB, playwright, reviewer router, progressive read)
│   │   ├── ledger.mjs
│   │   ├── kb.mjs
│   │   ├── playwright.mjs
│   │   ├── reviewer_router.mjs
│   │   ├── read_progressive.mjs
│   │   └── adapters/                           # Provider adapters for reviewer router
│   ├── gates/                                  # Phase-exit validators (block on failure)
│   │   ├── audit.mjs
│   │   └── acceptance_test.mjs
│   ├── cli/                                    # Agent-invoked utilities (never block)
│   │   ├── filter.mjs
│   │   ├── probe.mjs
│   │   └── update_kb.mjs
│   └── hooks/                                  # Harness-fired hooks (registered in settings.json)
│       ├── post_code.mjs
│       ├── enforce_tier_firewall.mjs
│       ├── enforce_done_means_ran.mjs
│       └── settings.hooks.json
├── dev/
│   ├── scripts/                                # install.mjs, setup_browser.mjs, validators
│   ├── tests/                                  # vitest suite
│   └── fixtures/
├── workspaces/{slug}-{date}/                   # Runtime state, gitignored
└── knowledge/{domain_slug}/                    # Persistent, version-tracked KB
    ├── index.yaml
    ├── source_ledger.yaml
    ├── claim_ledger.yaml
    ├── failure_memory.yaml
    ├── working_architectures.md
    └── telemetry.jsonl
```

Install: `cd framework/forger && npm install && npm run install:plugin`. Opt-in browser setup: `npm run setup:browser`. Inside Claude Code: `/forger <task>` for full pipeline; `/forger:contract <task>` for CONTRACT only.

---

## Epilogue: what FORGER is and is not

FORGER is:
- A framework that forces AI to contact reality before it creates
- A pipeline that separates grounding from recombination, and verification from both
- A harness where 98.4% of the value lives in deterministic infrastructure — contracts, hooks, gates, ledgers, audits
- A system that gets better with every use through persistent, version-tracked knowledge

FORGER is not:
- A guarantee of correctness (no framework can be)
- A creativity suppressor (the tiered model explicitly allows speculation within labeled boundaries)
- A replacement for human judgment on high-stakes, one-way-door decisions
- A lightweight tool for trivial tasks (use simpler patterns when the stakes are low)

v0.1 ships with 51 tests passing, 7 schemas + 7 templates round-trip-validated, 7 example phase artifacts schema-clean, and all skill cross-references resolving. The framework's real test is whether it stops the agent from producing plausible, well-cited, confidently-reasoned output that breaks the moment someone tries to build it. The dolphin-physiology coherence test was the first one. The next few will tell us if it generalizes.
