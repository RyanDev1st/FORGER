# THE reTruth FRAMEWORK
**A Multi-Agent Architecture for Autonomous Knowledge Synthesis**

## 1. Executive Summary
The reTruth framework is an orchestration methodology designed to empower artificial intelligence systems to explore, learn, and synthesize knowledge across the internet with human-like discernment and creativity. It solves the "production blocking" and premature convergence problems inherent in single-agent research by utilizing an isolated, multi-lane fan-out architecture under the `/gnosis` skill. Each lane is governed by a bulletproof mandate with ten-or-more sequential quality gates, mode-adaptive effort budgets, red-flag drop-on-sight tables, and mid-run anti-drift checkpoints.

## 2. Core Philosophy
True discovery requires the separation of divergent generation from convergent evaluation. The framework mimics the human creative mind by splitting research into three distinct cognitive streams—academic, applied, and fringe—before synthesizing them into a coherent whole. Each stream is structurally divergent by construction, not by vibe: source baskets, gate ordering, red-flag patterns, and authority signals differ per lane and are enforced mechanically before any LLM judgment runs.

## 3. System Architecture: The Fan-Out Model
The framework operates via a central Orchestrator that commands three isolated Sub-Systems. To prevent context pollution, the Orchestrator never loads the operational mandates of its sub-agents.

### A. The Orchestrator (Synthesis & Routing)
*   **Function:** Parses the brief, spawns three subagents in parallel with their respective mandates injected as text, validates returned outputs against a five-check validation gate (V1–V5), runs a cheap post-spawn verification audit, aggregates raw data, preserves consensus counts (discarding only true redundancy), and executes follow-up routing if knowledge gaps remain.
*   **Execution Tier:** Default Sonnet with high thinking; `/gnosis high` escalates to Opus and propagates `effort = high` to all subagents (which expands their tool-call budget, finding ceiling, and wall-clock cap).
*   **Concurrency cap:** Maximum four concurrent threads (orchestrator + three subagents). No fan-out beyond four. Re-fans (Step 6) reuse the same envelope.

### B. The Three Discovery Lanes
Each lane operates in strict isolation, functioning under a dedicated mandate. Datasets and raw repositories are classified under Community. Each mandate is plugin-agent-ready (YAML frontmatter present) and will migrate to the `agents/` directory verbatim when the framework ships as a plugin.

| Lane | Domain | Cognitive Focus | Success Metric |
| :--- | :--- | :--- | :--- |
| **Scholar** | Academic / Institutional | Rigor, methodology, peer-reviewed consensus, empirical data, replication status. | Identification of citation tiers, methodological alternatives, and falsifiable claims with triangulation. |
| **Community** | Practitioner / Applied | Active debates, war stories, working examples, datasets, repos, named-byline expertise. | Extraction of functional knowledge while bypassing vendor marketing and AI-generated SEO. |
| **Edge** | Unconventional / Fringe | Adjacent-field analogues, cross-domain connections, contrarian perspectives, hidden-gem forums, named-pseudonym practitioners with track record. | Discovery of structurally divergent ideas that *do not* overlap with Scholar or Community findings; crank-exclusion enforced. |

## 4. Operational State & Memory Management
To ensure crash resilience and contextual integrity, the framework mandates persistent, incremental state logging rather than volatile memory buffering.

*   **State Directory:** `./reTruth/[topic-slug]-[YYYY-MM-DD]/` — same topic same day collisions resolved by appending `-v2`, `-v3`, etc.
*   **Output Vectors:** Data is incrementally appended to isolated files (`scholar.md`, `community.md`, `edge.md`). Subagents never buffer.
*   **Mode detection:** Each mandate carries a §1 effort-budget table mapping `standard|high` to tool-call budget, floor/target/ceiling, and wall-clock soft cap. The mandate is authoritative — the orchestrator does not override.
*   **Source baskets:** Each lane carries a deterministic domain-to-venue dictionary inside its mandate. Domain is parsed from the brief; the basket selects the venues.
*   **Volume contract:** Floor 5 findings (pivot findings count toward floor). Target and ceiling are mode-dependent (Scholar/Community 8–10 / 12–15; Edge 7–8 / 8–12). Below floor invokes the pivot strategy (structural mechanism → adjacent topic, explicitly flagged).
*   **Retry semantics:** Hybrid retry — attempt 1 fires inline same turn (transient-failure case); attempts 2 and 3 wait 5 minutes each via the harness scheduler (`ScheduleWakeup(delaySeconds=300)` in /loop mode, otherwise `CronCreate` one-shot). Retry counter persists at `./reTruth/{workspace}/.retry-<lane>`. After three failed retries the lane is reported `under-sourced` and the run continues. Codex fallback is opt-in only.
*   **Calibration:** Agents align output depth by referencing hand-curated examples stored at `./reTruth/references/examples/` when present. Seeded manually as the framework matures.

## 5. Cognitive Filtration Mechanisms (QC Gates)
Standard logical reasoning is insufficient for autonomous research. reTruth implements sequential, lane-specific filtration gates in three layers: drop-on-sight red flags before any gate runs, ordered per-finding gates G0 → G(n), and a post-spawn audit hook at the orchestrator level.

### Layer 0: Red Flags — Drop on Sight
Each lane carries an explicit table of 10–16 patterns that disqualify a candidate immediately, bypassing G0–G(n). Scholar examples: predatory journals, citation laundering, press release as source, AI-generated literature reviews. Community examples: vendor sales funnels, anonymous "I worked at FAANG" claims, deprecated projects, circular citation chains. Edge examples: conspiracy shape, persecution narratives, pseudoscience markers, anonymous sources with no track record. The red-flag layer exists to save gate-evaluation cost on the worst material.

### Layer 1: Per-Finding Quality Gates (G0 → G8 / G9)

Run in order. Stop at first failure. Log per-gate result inline in the appended finding.

*   **G0 — Anti-hallucination prelude (mechanical).** Regex / range / pattern checks: author format, year range, DOI pattern `^10\.\d{4,}/...`, URL pattern, venue lookup against §3 basket. Edge additionally checks provenance metadata. Community additionally cross-checks author bio against employer or registry.
*   **G1 — Existence.** Verifiable URL or stable bibliographic identifier required. Orchestrator's HEAD-request audit confirms after.
*   **G2 — Source-claim fidelity (Scholar/Community) / Anti-redundancy Socratic (Edge).** Scholar: section-of-source + verbatim quote ≤25 words + claim-type recorded. Edge: explicit "could the other lanes have found this?" Socratic with structural reason recorded.
*   **G3 — Lane-specific filtration.** Scholar: CRAAP with measurable axes (Currency / Relevance / Authority / Accuracy / Purpose) — each axis must record a value, two ⚠ flags or any fail → drop. Community: four-test bias filter (Vendor / Analyst / Advocacy / Ideological). Edge: five-test crank filter (Mainstream-engagement spot-check / Specificity / Refutation-handling / Argument-shape / Domain-harm).
*   **G4 — Falsifiability (Scholar) / Currency (Community) / Authority-signal (Edge).** Scholar requires numeric effect size, explicit conditional, or population×intervention×outcome triple. Community applies domain-specific currency cutoffs. Edge requires one of six recognized authority signal types.
*   **G5 — Triangulation (Scholar) / Verbatim-quote + venue-id (Community) / Edge-justification (Edge).** Edge-justification must be *structural* (archive depth, non-English, adjacent field, dead-board, named-pseudonym practitioner); vibes ("interesting", "unique") are auto-drop.
*   **G6 — Anti-drift checkpoint (mid-run).** Runs after every 3 findings or after each search step. Halts execution and forces self-audit on echo-chamber risk (same author / same group / same venue / same year window), out-of-scope drift, and pivot trigger. Detected drift → halt searches, prune, log correction in Closing.
*   **G7 — Domain-harm gate.** When the brief touches medicine, safety-critical engineering, public health, or finance/legal advice the reader may act on: heightened bar — Tier-1 venues only, triangulation required, Edge confidence must be `high`, downgrades become drops.
*   **G8 / G9 — Socratic backstop.** Final yes/no per finding: opened-original / main-conclusion / fair-paraphrase / not-embarrassed-if-wrong (Scholar). Lane variants apply.

### Layer 2: The Verification Audit (Post-Processing)
A lightweight algorithmic audit runs after each lane returns, after V1–V5 validation. It serves as the anti-hallucination mechanism without spawning additional subagents.

*   **Quote requirement:** Every appended finding must include a verbatim quote (≤25 words) drawn from the source supporting the claim.
*   **Link liveness:** A HEAD request is issued for every cited URL. Dead links (4xx/5xx/timeout) flag the finding with `⚠ link-dead`.
*   **Quote presence:** The page text is fetched (curl, no JS render) and the verbatim quote is grep-matched literally. Miss → flag `⚠ quote-not-found` (may indicate JS-rendered page; flagged, not deleted).
*   **Edge anti-redundancy:** With Scholar and Community files now complete, the audit extracts significant bigrams from each Edge finding and compares against the combined Scholar+Community bigram set. Overlap ≥30% flags the finding `⚠ redundant-with-other-lane`. (Threshold is a starting heuristic; tune against real runs.)
*   **Synthesis policy:** Flagged findings remain in the workspace files but are excluded from the synthesis "robust" tier. Drill-in available on request.

The audit is intentionally cheap (bash + curl + grep). It sacrifices ~5% verification rigor for an order-of-magnitude faster overall run.

## 6. Quality Assurance Before Return
Each lane mandate ends with a QA ✓ checklist the subagent runs before declaring done: floor met, every G-field populated, no out-of-scope leakage, isolated-claim cap respected, same-author/same-platform caps respected, queries logged, absences logged, Closing block complete. Unfixable failures are logged under *Known limitations* in the Closing block.

## 7. Plugin Readiness
All three lane mandates carry plugin-agent YAML frontmatter (`name`, `description`, `tools`, `model`, `category`, `displayName`, `color`). When the framework ships as a plugin, the files migrate verbatim to the `agents/` directory; the orchestrator skill (`SKILL.md`) becomes a plugin skill, and the subagent invocation mechanism changes from text-injection-via-spawn-template to native Task-tool dispatch by agent name. Mandate content is unchanged across this migration.

## 8. Capacity Exception
Lane mandate specs in `reTruth/skills/` are exempted from the project's 200-line source-file cap and instead carry a 500-line cap, reflecting their nature as detailed agent specifications (comparable in density to plugin-agent files such as `oracle.md` and `research-expert.md`).

"A framework for general research and ideation, not just coding" thats right. 

The idea is to have a reliable framework that works. current frameworks just get so much drift and invalid ideation model. 

for example: if I am making a facial emotion recognition system, instead of going with grounded truths and working projects from githubs, the AI models would just think of solutions that do not work at all. This is a problem. People waste hours upon hours, days upon days to work on a solution that do not work. AIs cannot do creative work based on their trained knowledge. They have to be creative based on "grounding" works (hence inspiration). 

A human first have to learn maths, learn concepts, practice over and over again. Once they master it, they add "spices" to make these concepts their own. Thats the philosophy.

Humans don't create from nothing. They learn what exists, practice until they master it, then add their own "spices" to make it theirs.

A mathematician first learns calculus from textbooks. She solves hundreds of problems. She reads proofs by Euler and Gauss. Only after years of absorbing and internalizing does she produce original work — and even then, her theorems stand on the shoulders of everything she studied.

An AI trained on vast corpora can appear creative, but its "creativity" without grounding is what produces the facial emotion recognition system that simply doesn't work. It hallucinates architectures, invents non-existent APIs, and generates plausible-sounding nonsense because it skipped the step every human must take: grounding in what actually exists and works.

FORGE enforces this sequence structurally. It makes the AI behave like a human researcher: find real work, study it deeply, master the concepts, then — and only then — innovate.