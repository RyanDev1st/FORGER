Parent: ARCHITECTURE.md

# reTruth Variation Pipeline — Claim Cell Swarm

## Status

Draft variation v2. Generated for iterative comparison only. File created under `results/` only.

## Scope

This variation keeps Scholar, Community, and Edge as epistemic lenses, but changes primary work unit from lane to claim cell. Instead of each lane researching whole brief, orchestrator decomposes brief into small claim cells. Each cell passes through all three lenses, then synthesizes locally before global synthesis.

## Why This Variation

Original fan-out is lane-first. Strong for divergent source baskets, but weak when broad prompts contain multiple claims with different evidence needs. One lane may over-serve easy claims and under-serve hard claims. Claim Cell Swarm forces each claim to receive academic, practitioner, and divergent treatment.

Chosen because it may produce better results for complex prompts, product strategy questions, policy questions, and multi-factor technical decisions. It trades lane autonomy for finer coverage and clearer traceability.

## Variation Pipeline

1. **Parse brief into claim cells.** Orchestrator extracts 3–5 atomic claims, each with scope, domain, harm class, and answer type.
2. **Create cell ledger.** `ledger.md` records each cell, required evidence class, lane budget, and stopping rule.
3. **Spawn lens batch.** For each iteration, run up to three lane lenses in parallel for one selected cell. Max four concurrent threads total.
4. **Cell-local synthesis.** After three lenses return, orchestrator writes cell answer: robust, contested, boundary-only, or under-sourced.
5. **Coverage scheduler.** Next cell chosen by uncertainty, harm class, and source scarcity, not original order.
6. **Drift allowance.** A lane may propose a new cell if evidence exposes hidden mechanism or better question.
7. **Validation gate V1–V7.** Adds V6 cell coverage and V7 cross-cell contradiction checks.
8. **Cheap audit.** HEAD links, quote grep, bigram redundancy, plus claim-to-source alignment check.
9. **Global synthesis.** Merge cell answers into final thesis with dependency graph.
10. **Re-fan.** Only cells marked contested or under-sourced receive additional pass.

## Rewritten `SKILL.md`

```markdown
---
name: gnosis
version: 0.3.0-claim-cell
summary: Orchestrates claim-cell research through Scholar, Community, and Edge lenses.
---

# /gnosis — Claim Cell Swarm

## Purpose

Break broad research prompts into atomic claim cells, run each cell through isolated evidence lenses, then synthesize local and global answers.

## Parse

Extract:
- topic slug
- user goal
- 3–5 claim cells
- domain per cell
- harm class per cell
- required freshness
- answer type: factual, causal, comparative, procedural, strategic
- mode: standard or high

## Workspace

Create `./reTruth/{topic-slug}-{YYYY-MM-DD}/`; append `-v2`, `-v3` on collision.

Files:
- `ledger.md`
- `cell-{n}-scholar.md`
- `cell-{n}-community.md`
- `cell-{n}-edge.md`
- `cell-{n}-synthesis.md`
- `audit.md`
- `synthesis.md`

## Cell Ledger Format

```text
CELL C#
Claim:
Scope:
Domain:
Harm class:
Answer type:
Required lenses:
Stop rule:
Known ambiguity:
```

## Orchestration

1. Write cell ledger before spawning lanes.
2. Select highest-risk or most central cell first.
3. Spawn Scholar, Community, Edge lenses for selected cell in parallel.
4. Validate outputs against V1–V7.
5. Write `cell-{n}-synthesis.md` before moving to next cell.
6. Continue until all cells have local synthesis or under-sourced status.
7. Run audit across all cited URLs and quotes.
8. Build global synthesis from cell answers and contradiction graph.
9. Re-fan only contested or under-sourced cells.

## Validation

- V1: lane file exists and has Closing block
- V2: finding floor met or under-sourced reason logged
- V3: every finding has URL/stable ID
- V4: every finding has quote ≤25 words
- V5: all gates populated in order
- V6: every cell has required lens coverage or explicit waiver
- V7: cross-cell contradiction identified and resolved or preserved

## Synthesis Labels

- Robust: all required lenses align or disagreements bounded
- Contested: credible lens disagreement remains
- Boundary-only: true under stated condition
- Mechanism-found: drift revealed stronger underlying claim
- Under-sourced: floor or evidence class missing

## Final Output

Return:
1. Direct answer
2. Claim-cell table
3. Evidence by lens
4. Contradiction graph
5. Boundary conditions
6. Drift-generated cells
7. Audit flags
8. Recommended next cells
```

## Rewritten `scholar-dive.md`

```markdown
---
name: scholar-dive
summary: Academic lens for one claim cell at a time.
---

# Scholar Dive — Claim Cell Academic Lens

## Mission

Evaluate one atomic claim using formal research, institutional evidence, methods quality, and replication signals.

## Input Required

- Cell ID
- Claim
- Domain
- Harm class
- Answer type
- Stop rule

## Source Basket

Prefer:
- peer-reviewed papers
- systematic reviews
- meta-analyses
- preregistrations
- standards bodies
- government datasets
- university repositories
- credible conference proceedings

Drop on sight:
- predatory journal
- press release as evidence
- no method section for empirical claim
- citation laundering
- AI-written literature summary
- unsupported causal leap

## Gates

- G0 mechanical: DOI/ID, year, author, venue, domain fit
- G1 existence: stable URL or bibliographic identifier
- G2 claim fidelity: quote ≤25 words tied to exact cell claim
- G3 method fitness: design matches answer type
- G4 falsifiability: effect size, PICO, conditional, or measurable variable
- G5 triangulation: independent support, null, or contradiction
- G6 anti-drift: evidence must answer cell, not adjacent easier claim
- G7 harm bar: Tier 1–2 only for safety-critical advice
- G8 backstop: fair paraphrase and no overclaim

## Finding Format

```text
FINDING S-C#-#
Cell:
Claim:
Source:
Tier:
Quote:
Method:
Result:
Limit:
Contradicts cell?:
G0:
G1:
G2:
G3:
G4:
G5:
G6:
G7:
G8:
Confidence:
```

## Closing

Report answer for cell, confidence, strongest evidence, strongest academic objection, missing method class, and whether cell should be split or merged.
```

## Rewritten `community-search.md`

```markdown
---
name: community-search
summary: Practitioner lens for one claim cell at a time.
---

# Community Search — Claim Cell Practitioner Lens

## Mission

Evaluate one atomic claim using field evidence: implementations, debates, repos, datasets, benchmarks, postmortems, and practitioner reports.

## Input Required

- Cell ID
- Claim
- Domain
- Harm class
- Answer type
- Stop rule

## Source Basket

Prefer:
- active repos and issue threads
- named engineering blogs
- postmortems
- benchmarks with code
- public datasets
- RFC discussions
- community debates with linked artifacts
- migration stories

Drop on sight:
- vendor funnel
- anonymous authority claim
- stale answer for current-tool claim
- benchmark without environment
- deprecated repo as current proof
- SEO article with no field artifact

## Gates

- G0 mechanical: date, actor, venue, version, artifact activity
- G1 existence: live or archived source
- G2 claim fidelity: quote ≤25 words tied to cell claim
- G3 bias filter: vendor, analyst, advocacy, ideology recorded
- G4 field fitness: artifact matches answer type
- G5 reproducibility: repo, config, dataset, benchmark, or detailed steps
- G6 anti-drift: do not answer adjacent implementation question unless proposing new cell
- G7 harm bar: named expertise or downgrade
- G8 backstop: not popularity-only, fair to source

## Finding Format

```text
FINDING C-C#-#
Cell:
Claim:
Source:
Venue:
Actor:
Quote:
Artifact:
Practice signal:
Failure signal:
G0:
G1:
G2:
G3:
G4:
G5:
G6:
G7:
G8:
Confidence:
```

## Closing

Report cell answer, strongest working example, strongest failure example, artifact quality, echo risk, and whether cell needs new practitioner subclaim.
```

## Rewritten `edge-finder.md`

```markdown
---
name: edge-finder
summary: Divergent lens for one claim cell at a time.
---

# Edge Finder — Claim Cell Divergent Lens

## Mission

Evaluate one atomic claim through structurally divergent sources, adjacent fields, historical analogues, non-English niches, and high-variance mechanisms while excluding crank patterns.

## Input Required

- Cell ID
- Claim
- Domain
- Harm class
- Answer type
- Stop rule
- Scholar/Community summaries when available for anti-redundancy pass

## Source Basket

Prefer:
- adjacent-field archives
- standards history
- old mailing lists
- field manuals
- non-English practitioner posts
- patent mechanisms as hints
- named pseudonym communities with track record
- institutional archives

Drop on sight:
- persecution narrative
- secret-knowledge framing
- unfalsifiable mechanism
- anonymous no-track-record source
- quote-mined mainstream source
- miracle cure or guaranteed return
- novelty without mechanism

## Gates

- G0 mechanical: provenance, date, identity, archive stability
- G1 existence: stable URL or archive ID
- G2 cell divergence: explains why this source changes cell framing
- G3 crank filter: specificity, refutation handling, argument shape, harm risk
- G4 authority signal: artifact, track record, institution, adoption, prediction, archival depth
- G5 anti-redundancy: compare against known Scholar/Community cell findings when available
- G6 anti-drift: adjacent insight must propose explicit new cell or answer current cell
- G7 harm bar: high confidence required for safety-critical claims
- G8 backstop: mechanism coherent and expert-safe

## Finding Format

```text
FINDING E-C#-#
Cell:
Claim:
Source:
Edge type:
Quote:
Mechanism:
Authority signal:
Cell reframing:
Hostile check:
G0:
G1:
G2:
G3:
G4:
G5:
G6:
G7:
G8:
Confidence:
```

## Closing

Report cell answer, reframes, useful analogues, rejected crank patterns, redundancy risk, and proposed drift cells.
```

## Evidence

- Used existing session context from `ARCHITECTURE.md`.
- Used known `reTruth/skills/` references: orchestrator plus Scholar, Community, Edge mandates.
- Checked existing `results/*.md` to avoid filename collision.

## Next

1. Next iteration can explore **Red-Team Arbiter**: keep three lanes, add internal challenge court after synthesis.
2. Another drift: **Temporal Spiral**: same topic researched across historical, current, and emerging time horizons.
3. Another drift: **Question Market**: lanes bid on which subquestions deserve more budget.
