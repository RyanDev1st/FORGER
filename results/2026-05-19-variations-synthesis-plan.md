Parent: ARCHITECTURE.md

# reTruth — Variations Synthesis & Improvement Plan

## Status

44 variations under `results/` (32 directory builds + 12 root single-file proposals) analyzed. Each variation's WHY / Expected Gains / Main Risk / Next-Variation suggestions extracted. Clustered into 9 dimensions. Two architectural options presented (A = unified baseline, B = mode-kit router). No edits to SKILL.md or lane mandates this turn — awaiting user direction.

## Scope

- **Source read:** every `*/README.md`, every `*/variation-pipeline.md`, every root-level `*_v*.md` under `results/`.
- **In scope:** synthesis of best contributions; concrete plan for improving the base `SKILL.md` + three lane mandates + audit hook.
- **Out of scope this turn:** editing `reTruth/skills/SKILL.md`, `scholar-dive.md`, `community-search.md`, `edge-finder.md`, `ARCHITECTURE.md`, `CLAUDE.md`. No code changes until user confirms architectural option.

## Evidence

### 1. Nine dimensions the variations actually explore

Each cluster's best mechanism, why it was picked, and which others stay as kit-conditional companions:

| # | Cluster | Members | Best | Why this one |
|---|---|---|---|---|
| A | Synthesis output structure | option_tournament · hypothesis_market · dialectic_spiral · consensus_ladder · claim_cell_swarm · decision_fork_map · robustness_ladder · signal_refinery | **robustness_ladder** | Most additive: tiers synthesis output (unsupported → action-grade by stress-class survival) without restructuring the pipeline. Decision_fork_map composes with it for action questions. |
| B | Adversarial / falsification | adversarial_covenant · adversarial_benchmark · red_team_tribunal · tribunal_mesh · reversal_sentinel | **adversarial_covenant** | Pre-search falsifier declaration is cheaper and more effective than post-hoc tribunals. One paragraph in the spawn prompt. Adversarial_benchmark joins the high-stakes/hype kit. |
| C | Causal / mechanism | causal_forge · counterfactual_lab · dependency_stressor · constraint_solver · method_stack | **method_stack + causal_forge** (complementary) | method_stack tags evidence by epistemic method (RCT, observational, incident, expert, archive) — prevents inference-shape collapse. causal_forge demands mechanism + confounder + falsifier card. Together they kill correlation theater; they are not substitutes. |
| D | Decision / action | intervention_backcast · intervention_friction_audit · threshold_finder · failure_budgeter · cost_of_error_matrix | **failure_budgeter + intervention_friction_audit** | failure_budgeter forces explicit stop-loss / rollback / warning thresholds per recommendation. friction_audit subtracts coordination, training, migration, maintenance cost before synthesis. Together produce real-world-shaped recommendations instead of clean-paper answers. |
| E | Temporal | temporal_spiral · temporal_decay · signal_decay_tracker · scenario_forge | **signal_decay_tracker** (always-on tag) + **scenario_forge** (kit) | Decay tag is one field per finding — cheap and additive. scenario_forge restructures synthesis around future-state pressure — keep it kit-conditional. |
| F | Stakeholder / incentive | stakeholder_prism · stakeholder_collision_map · incentive_lens · incentive_gradient | **stakeholder_prism** (light tag) + **incentive_gradient** (kit) | Prism = small per-finding fields (who benefits / who pays / who decides / who is missing). Gradient = post-recommendation actor adaptation (Goodhart, gaming, compliance theater) — heavier, kit-conditional. |
| G | Absence / blind-spot | blind_spot_inventory · blind_menagerie · residue_register · failure_atlas · evidence_cartographer | **blind_spot_inventory** | Catalogs absent populations, silent failures, inaccessible archives, and search-space bias. Drops into each lane's Closing block as a structured list. Doesn't require restructuring the search procedure. |
| H | Provenance / independence | provenance_chain · provenance_graph · evidence_compression_index · translation_engine | **provenance_chain + evidence_compression_index** (complementary) | Chain traces lineage (where a claim began, how it mutated). Compression counts independent supports after collapsing shared origin. Together kill echo-inflation. Live at the orchestrator audit hook, not in lane bodies. |
| I | Adaptive control / memory | evidence_thermostat · memory_loom · assumption_ledger | **assumption_ledger** (always-on) + **evidence_thermostat** (orchestrator) | Ledger = one field per finding ("what must be true for this to hold"). Thermostat = adaptive depth allocation (cold zones stop early, hot zones earn re-fan). memory_loom (cross-run state) is a bigger architectural shift — deferred. |

### 2. What the iteration chain reveals

The prior agent's "Next Variation Ideas" sections form a traceable successor chain. Following it forward shows a clear convergence in the late iterations:

- **Early (v1–v15)** — process structure: covenants, tribunals, tournaments, spirals.
- **Mid (v16–v28)** — added lenses: incentive, evidence terrain, residue, method, stakeholder, counterfactual, threshold, intervention backcast.
- **Late (v29–v43)** — compounded on output quality: failure_budgeter → evidence_thermostat → cost_of_error → signal_decay → reversal_sentinel → dependency_stressor → provenance_chain → adversarial_benchmark → stakeholder_collision → blind_spot_inventory → robustness_ladder → incentive_gradient → evidence_compression_index → decision_fork_map → intervention_friction_audit.

**Convergence theme:** decision-grade outputs, friction-aware recommendations, echo-resistant synthesis, stakeholder asymmetry. The prior agent stopped chasing process novelty and started fixing output quality. This plan weights late-iteration mechanisms accordingly.

## Two architectural options

### Option A — Unified baseline upgrade (smaller, ships fast)

Absorb 3 highest-leverage mechanisms into the existing pipeline as always-on additions. Single pipeline, no kit routing.

1. **`assumption_ledger` field per finding** — small block added to each lane's finding format (~3 lines per lane mandate, ~9 lines total). Each finding declares "for this to hold, the following must be true: …".
2. **`robustness_ladder` synthesis output format** — replaces freeform synthesis in `SKILL.md` Step 5 with a tier scheme (Unsupported / Single-source / Independent-corroboration / Stress-survived / Action-grade) keyed off existing CRAAP and triangulation passes (~15 lines in SKILL.md).
3. **`provenance_chain + evidence_compression_index` in the audit hook** — Step 4a extension: in addition to HEAD + quote-match + bigram redundancy, run a lineage hash across findings and report independent-support count alongside raw citation count (~10 lines in SKILL.md, spec only — bash script still to be written).

**Line cost:** ~35 lines spread across `SKILL.md` + 3 lane mandates. Comfortable under the 500-line lane cap (current 301 / 315 / 321; ~180 lines headroom each).

**Pros:** Minimal complexity, one pipeline, ships fast, every topic benefits.
**Cons:** Misses the mid/late-iteration value (mechanism rigor, decision-grade actionability, stakeholder asymmetry, temporal/scenario robustness). Same answer shape for every question class — exactly the limitation the prior agent's iteration chain was reacting against.

### Option B — Mode-kit router (recommended)

Keep Option A as the **baseline** (always-on for every run). Add one orchestrator step before Step 1:

> **Step 0.5 — Topic classification & kit selection.** Orchestrator classifies the brief into at most one of six topic classes. If confidence ≥ threshold, inject the matching kit text into all three lane spawn prompts. If below threshold, ship baseline only. User can override the classifier choice when submitting the brief.

Six kits live as standalone files (proposed location: `reTruth/skills/kits/`), each ~80–120 lines, loaded by the orchestrator as plain text and concatenated into the spawn payload — same isolation pattern as current lane mandates.

| Kit file | Triggers when brief class is | Mechanisms bundled |
|---|---|---|
| `decision_kit.md` | "should we / which option / when / how much to invest" | failure_budgeter + threshold_finder + cost_of_error_matrix + decision_fork_map + intervention_friction_audit |
| `mechanism_kit.md` | "why does X / what causes Y / what intervention works" | causal_forge + method_stack + dependency_stressor + counterfactual_lab |
| `hype_kit.md` | "is X real / will it scale / is the consensus warranted" | adversarial_covenant + reversal_sentinel + provenance_chain + evidence_compression_index |
| `policy_kit.md` | "who should X / what rule / who is affected" | stakeholder_prism + stakeholder_collision_map + incentive_gradient + blind_spot_inventory |
| `forecast_kit.md` | "where is X going / will it last / what comes next" | scenario_forge + temporal_spiral + signal_decay_tracker + reversal_sentinel |
| `foundational_kit.md` | "is this still true / what's the long arc / what's solid" | temporal_decay + provenance_chain + consensus_ladder |

Orchestrator picks **at most one** kit per run. Below-confidence → no kit. User override at brief time.

**Pros:**
- Concentrates effort where it pays off per topic class.
- Preserves lane-mandate headroom (kits live in separate files, not in lane bodies).
- Keeps the four-thread concurrency cap (kits are text injection, not new subagents).
- Aligns with the prior agent's late-iteration convergence.
- Reversible: delete a kit file, baseline still works.

**Cons:**
- New orchestrator step (topic classification) is fallible — needs the "no kit" fallback path explicit.
- More files to maintain (6 kits).
- User has to learn kit semantics for override.

## Recommendation

**Option B**, shipped in 3 phases.

| Phase | Scope | Deliverable | Independent value |
|---|---|---|---|
| 1 | Always-on baseline (Option A items) | Edits to `SKILL.md` + 3 lane mandates | Real shippable improvement on its own. |
| 2 | Highest-ROI kit first: `decision_kit.md` + Step 0.5 classifier | New `reTruth/skills/kits/decision_kit.md` + classifier hook in `SKILL.md` | Unlocks the mode-router pattern with the kit late-iteration convergence indicates pays off most. |
| 3 | Remaining 5 kits | One PR per kit + one run + validate before the next | Incremental, low-risk, easy to revert per kit. |

Each phase is a separate session per CLAUDE.md's report → action discipline.

## Risks

- **Topic classifier misfires** → wrong kit injected. *Mitigation:* classifier outputs top-2 with confidence; below threshold → no kit; user override at brief time; classifier choice logged in workspace.
- **Kit overload** → spawn prompt balloons past lane context budget. *Mitigation:* one kit per run hard cap; measure spawn prompt size during Phase 2; if it leaks, kits become section-toggles instead of full files.
- **`memory_loom` (cross-run state) deferred** — bigger architectural shift than this plan covers; revisit after Phase 3.
- **Codex fallback unchanged** — opt-in only, per CLAUDE.md `community-search` clause.
- **`references/examples/` still empty** — pre-existing; not introduced by this plan; flagged so reviewers know it's not regressed here.

## Next

1. User confirms direction: **Option A**, **Option B** (recommended), or another shape.
2. If Option B: confirm the six-kit list above (drop any, add any).
3. If Option B: confirm phase ordering and that Phase 1 is independently shippable.
4. Confirm proposed kit directory: `reTruth/skills/kits/` (or alternative).
5. Open a new session for Phase 1 implementation per CLAUDE.md report-then-action separation.
