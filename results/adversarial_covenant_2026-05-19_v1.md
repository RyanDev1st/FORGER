Parent: ARCHITECTURE.md

# reTruth Variation Pipeline — Adversarial Covenant

## Status

Draft variation v1. Generated for iterative comparison only. No project files changed outside `results/`.

## Scope

This variation keeps original three-lane fan-out, but shifts core model from "discover then audit" to "make every lane sign a falsifiable covenant before it searches." Each lane must declare what would disprove its current direction, what source class would count as hostile evidence, and when it must pivot. Drift is allowed only when covenant terms are logged before drift begins.

## Why This Variation

Original architecture has strong gates after candidate discovery. Weak spot: lanes can still spend too long gathering attractive material before falsification pressure bites. Covenant-first design makes each lane search for disconfirming evidence early, reducing premature convergence and making drift auditable instead of vibe-based.

Chosen because it may bear better results for topics with disputed evidence, hype cycles, or polarized communities. It trades some raw breadth for stronger epistemic pressure.

## Variation Pipeline

1. **Parse brief into claims, stakes, and harm class.** Orchestrator extracts 3–7 testable claims from user brief.
2. **Open covenant ledger.** Each lane writes: target claim, likely bias, disproof condition, hostile-source target, pivot trigger.
3. **Spawn three lanes in parallel.** Scholar, Community, Edge run isolated searches with lane-specific source baskets.
4. **Early hostile pass.** First two findings per lane must challenge or constrain the claim, not support it.
5. **Balanced acquisition.** Lane gathers supporting, opposing, and boundary-condition evidence until floor reached.
6. **Covenant check every 3 findings.** If disproof condition triggered, lane pivots and labels previous line as weakened.
7. **Validation gate V1–V6.** Adds V6: covenant compliance present and not retrofitted.
8. **Cheap audit.** HEAD links, quote grep, bigram redundancy, plus covenant timestamp/order sanity.
9. **Synthesis.** Output tiers: robust, contested, boundary-only, under-sourced, drift-generated.
10. **Re-fan only on missing adversarial class.** Follow-up lanes fill hostile-source gaps, not generic breadth.

## Rewritten `SKILL.md`

```markdown
---
name: gnosis
version: 0.2.0-covenant
summary: Orchestrates covenant-first multi-lane research synthesis.
---

# /gnosis — Covenant-First Knowledge Synthesis

## Purpose

Run isolated multi-lane research where each lane must define what would change its mind before it gathers evidence.

## Input Parse

Extract:
- topic slug
- user goal
- 3–7 testable claims
- domain and harm class
- required freshness window
- output depth: standard or high

## Workspace

Create `./reTruth/{topic-slug}-{YYYY-MM-DD}/`. If exists, append `-v2`, `-v3`.

Files:
- `ledger.md`
- `scholar.md`
- `community.md`
- `edge.md`
- `audit.md`
- `synthesis.md`

## Orchestration

1. Write brief summary and claims into `ledger.md`.
2. Spawn Scholar, Community, Edge in parallel. Max four concurrent threads including orchestrator.
3. Inject lane mandate text at spawn time. Do not read lane mandate into orchestrator context.
4. Require each lane to append covenant block before first search result.
5. Validate lane output with V1–V6.
6. Run cheap audit.
7. Synthesize consensus, conflict, boundary conditions, and drift findings.
8. Re-fan only if required evidence class is missing.

## Lane Covenant Required Format

```text
COVENANT
Claim tested:
Likely lane bias:
Disproof condition:
Hostile source class:
Pivot trigger:
Harm class:
Timestamp/order marker:
```

## Validation

- V1: required workspace file exists and has Closing block
- V2: floor met or pivot/under-sourced reason logged
- V3: every finding has URL or stable identifier
- V4: every finding has quote ≤25 words
- V5: gates populated in order; no skipped mandatory gate
- V6: covenant appears before findings and is used in at least one checkpoint

## Retry

Attempt 1 inline same turn. Attempts 2–3 delayed 5 minutes. After 3 failures, mark lane `under-sourced` and continue. Codex fallback only when user explicitly requests.

## Synthesis Tiers

- Robust: triangulated and audit-clean
- Contested: credible disagreement remains
- Boundary-only: true under specific conditions
- Drift-generated: useful adjacent result from declared pivot
- Under-sourced: below floor or missing hostile class

## Final Output

Return:
1. Executive answer
2. Consensus map
3. Disagreement map
4. Boundary conditions
5. Drift discoveries
6. Source table with audit flags
7. Next search routes
```

## Rewritten `scholar-dive.md`

```markdown
---
name: scholar-dive
summary: Academic lane using covenant-first falsification and formal evidence tiers.
---

# Scholar Dive — Covenant Academic Lane

## Mission

Find rigorous institutional evidence, but begin by defining what academic evidence would weaken the claim.

## Covenant

Before searching, append:
- claim tested
- likely scholar bias: privileging formal publications over live practice
- disproof condition: failed replication, contradictory meta-analysis, invalid operationalization, or effect disappears under better controls
- hostile source class: replication attempt, negative result, corrigendum, preregistered null, methods critique
- pivot trigger: no Tier 1–2 material after budgeted search or claim too broad for falsifiable population/intervention/outcome

## Source Basket

Prefer:
- peer-reviewed journals
- systematic reviews and meta-analyses
- university repositories
- government or standards bodies
- preregistration registries
- conference proceedings with named program committees

Drop on sight:
- predatory journal signals
- press release as evidence
- citation laundering
- AI-generated literature overview
- no method section
- unsupported causal headline

## Gates

- G0 mechanical: DOI/year/venue/author pattern checks
- G1 existence: stable URL, DOI, PMID, arXiv, SSRN, or institutional handle
- G2 claim fidelity: section name and quote ≤25 words
- G3 CRAAP: currency, relevance, authority, accuracy, purpose all recorded
- G4 falsifiability: effect size, confidence interval, PICO, or explicit conditional
- G5 triangulation: at least one independent corroborating or opposing source
- G6 anti-drift: every 3 findings, check same author/group/venue/year concentration
- G7 domain harm: safety-critical topics require Tier 1–2 evidence or downgrade
- G8 covenant check: did hostile evidence alter confidence or trigger pivot?
- G9 backstop: fair paraphrase, main conclusion preserved, not embarrassed if wrong

## Finding Format

```text
FINDING S#
Claim:
Source:
Tier:
Quote:
Method signal:
Result:
Opposition/limit:
G0:
G1:
G2:
G3:
G4:
G5:
G6:
G7:
G8:
G9:
Confidence:
```

## Closing

Report floor/target, hostile-source coverage, strongest disproof, unresolved gaps, pivot history, and known limitations.
```

## Rewritten `community-search.md`

```markdown
---
name: community-search
summary: Practitioner lane using covenant-first field evidence, repos, datasets, and war stories.
---

# Community Search — Covenant Practitioner Lane

## Mission

Find lived implementation evidence while actively hunting for field failures, abandoned paths, and practitioner disagreement.

## Covenant

Before searching, append:
- claim tested
- likely community bias: over-weighting vivid anecdotes and popular tools
- disproof condition: repeated failure reports, maintainer abandonment, reproducibility failure, benchmark mismatch, or expert reversal
- hostile source class: postmortem, issue thread, migration-away story, deprecation notice, negative benchmark, practitioner critique
- pivot trigger: sources collapse into vendor funnel, SEO sludge, or same-platform echo

## Source Basket

Prefer:
- GitHub repos and issues
- Hacker News with named links or reproducible artifacts
- Stack Overflow only when answer has durable votes and current version fit
- engineering blogs with named authors
- benchmarks with reproducible code
- public datasets and notebooks
- standards discussions and RFC threads

Drop on sight:
- vendor sales page as main proof
- anonymous authority claim
- listicle without implementation detail
- deprecated project as current evidence
- benchmark without environment
- SEO article echoing docs

## Gates

- G0 mechanical: URL, author handle, date, project activity, version relevance
- G1 existence: live page or archived source
- G2 claim fidelity: quote ≤25 words plus local context
- G3 bias filter: vendor, analyst, advocacy, ideological markers recorded
- G4 currency: domain-specific freshness cutoff met or stale flag applied
- G5 venue identity: repo/org/forum/thread identity recorded
- G6 anti-drift: every 3 findings, check same repo/vendor/community cluster
- G7 domain harm: advice-risk topics require named expertise or downgrade
- G8 covenant check: hostile class searched and effect on claim logged
- G9 backstop: reproducible enough, not popularity-only, fair summary

## Finding Format

```text
FINDING C#
Claim:
Source:
Venue:
Actor:
Quote:
Artifact:
Practice signal:
Failure/limit:
G0:
G1:
G2:
G3:
G4:
G5:
G6:
G7:
G8:
G9:
Confidence:
```

## Closing

Report floor/target, strongest working example, strongest failure case, dataset/repo quality, echo risks, pivot history, and known limitations.
```

## Rewritten `edge-finder.md`

```markdown
---
name: edge-finder
summary: High-variance lane using covenant-first anti-crank and structural divergence checks.
---

# Edge Finder — Covenant Divergence Lane

## Mission

Find structurally divergent ideas from adjacent fields, old forums, non-mainstream archives, and unusual practitioners while excluding crank patterns.

## Covenant

Before searching, append:
- claim tested
- likely edge bias: novelty seeking and over-valuing contrarian frames
- disproof condition: claim depends on conspiracy shape, refuses falsification, lacks mechanism, or collapses into existing Scholar/Community finding
- hostile source class: mainstream engagement that directly refutes edge claim, failed prediction, archive contradiction, domain expert rebuttal
- pivot trigger: no authority signal, no mechanism, redundancy ≥30%, or harm gate cannot be satisfied

## Source Basket

Prefer:
- adjacent discipline archives
- old mailing lists and forums with named pseudonyms
- non-English practitioner sources
- patents only as mechanism hints, not proof
- field manuals and standards history
- long-running niche communities with track record
- museums/libraries/institutional archives for historical analogues

Drop on sight:
- persecution narrative
- secret knowledge framing
- unfalsifiable claims
- miracle cure or guaranteed return
- anonymous source with no track record
- quote-mined mainstream source
- aesthetic contrarianism with no mechanism

## Gates

- G0 mechanical: provenance, date, identity/handle, archive stability
- G1 existence: stable URL/archive identifier
- G2 anti-redundancy Socratic: why Scholar/Community would not find this
- G3 crank filter: mainstream engagement, specificity, refutation handling, argument shape, harm risk
- G4 authority signal: track record, institution, artifact, prediction, adoption, or archival depth
- G5 structural edge justification: adjacent field, dead board, non-English, old archive, named pseudonym, or forgotten standard
- G6 anti-drift: every 3 findings, check novelty addiction and topic drift
- G7 domain harm: safety-critical claims require high confidence or drop
- G8 covenant check: hostile source sought and redundancy tested
- G9 backstop: mechanism clear, not embarrassing if surfaced to domain expert

## Finding Format

```text
FINDING E#
Claim:
Source:
Edge type:
Authority signal:
Quote:
Mechanism:
Why not other lanes:
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
G9:
Confidence:
```

## Closing

Report floor/target, useful divergences, dropped crank patterns, redundancy risks, strongest hostile rebuttal, pivot history, and known limitations.
```

## Evidence

- Read `ARCHITECTURE.md` session context.
- Inspected `reTruth/skills/` file list: `SKILL.md`, `scholar-dive.md`, `community-search.md`, `edge-finder.md`.
- Created only this result under `results/`.

## Next

1. Next iteration can explore **Red-Team Arbiter** variation: add fourth internal evaluation phase without fourth concurrent lane.
2. Another drift: **Memory-First Research** where lanes search prior workspaces before web discovery.
3. Another drift: **Question-Decomposition Swarm** where claims, not lanes, become primary work units.
