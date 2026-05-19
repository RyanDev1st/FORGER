Parent: ARCHITECTURE.md

# reTruth Variation Pipeline — Temporal Spiral

## Status

Draft variation v4. Generated for iterative comparison only. File created under `results/` only.

## Scope

This variation keeps the three epistemic lanes, but forces every lane to spiral through time: historical roots, current state, and emerging signals. Instead of treating freshness as a cutoff, the pipeline treats time as a source of explanation. Each lane must show how a claim formed, how it behaves now, and what early signals might change it.

## Why This Variation

Original architecture handles currency through lane gates, especially Community. It can still over-index on current sources and miss why a belief exists, whether it already failed before, or whether new weak signals are meaningful. Temporal Spiral adds diachronic evidence: origin, present validation, and future pressure.

Chosen because it may produce better results for fast-moving fields, recurring hype cycles, policy debates, AI tooling, scientific controversies, and topics where old failures reappear under new names. It trades speed for pattern recognition across time.

## Variation Pipeline

1. **Parse brief into time-sensitive claims.** Orchestrator marks claims as stable, evolving, cyclic, or emergent.
2. **Create temporal ledger.** Each lane receives same three temporal passes: origin, present, frontier.
3. **Spawn three lanes in parallel.** Scholar, Community, Edge remain isolated; each writes temporal sections internally.
4. **Origin pass.** Find earliest strong formulation, prior analogue, or first failure mode.
5. **Present pass.** Find current best evidence, active practice, or contemporary dispute.
6. **Frontier pass.** Find weak signals, new datasets, open issues, preprints, standards drafts, or fringe mechanisms.
7. **Spiral checkpoint.** Every lane compares time slices: continuity, reversal, recurrence, or mutation.
8. **Validation gate V1–V7.** Adds V6 temporal coverage and V7 time-slice contradiction handling.
9. **Cheap audit.** HEAD links, quote grep, Edge redundancy, plus date-order sanity check.
10. **Synthesis.** Final answer states not only what is true, but how truth changed over time.
11. **Re-fan.** Only missing or contradictory time slices get follow-up.

## Rewritten `SKILL.md`

```markdown
---
name: gnosis
version: 0.5.0-temporal-spiral
summary: Orchestrates three-lane research across origin, present, and frontier time slices.
---

# /gnosis — Temporal Spiral

## Purpose

Research a topic through three isolated lanes while preserving how claims emerge, stabilize, reverse, or mutate over time.

## Parse

Extract:
- topic slug
- user goal
- domain
- harm class
- answer type
- freshness requirement
- temporal class: stable, evolving, cyclic, emergent
- mode: standard or high

## Workspace

Create `./reTruth/{topic-slug}-{YYYY-MM-DD}/`; append `-v2`, `-v3` on collision.

Files:
- `ledger.md`
- `scholar.md`
- `community.md`
- `edge.md`
- `audit.md`
- `synthesis.md`

## Temporal Ledger Format

```text
TEMPORAL LEDGER
Topic:
Temporal class:
Origin window:
Present window:
Frontier window:
Known cycle risk:
Harm class:
```

## Orchestration

1. Write temporal ledger before spawning lanes.
2. Spawn Scholar, Community, Edge in parallel. Max four concurrent threads including orchestrator.
3. Inject lane mandate text at spawn time. Do not load lane mandates into orchestrator context.
4. Require each lane to produce Origin, Present, Frontier, and Spiral Check sections.
5. Validate lane outputs with V1–V7.
6. Run cheap audit over URLs, quotes, and date ordering.
7. Synthesize by temporal movement: stable, reversed, cyclic, accelerating, unresolved.
8. Re-fan only missing time slices or high-impact contradictions.

## Validation

- V1: required two-part lane return present
- V2: floor met or under-sourced reason logged
- V3: every finding has URL/stable identifier
- V4: every finding has quote ≤25 words
- V5: gates and Closing block complete
- V6: Origin, Present, and Frontier represented or waived with reason
- V7: time-slice contradictions preserved and labeled

## Temporal Labels

- Stable: claim persists across time slices
- Reversed: later evidence overturns earlier belief
- Cyclic: old pattern returns under new language
- Mutated: mechanism persists but implementation changes
- Frontier-only: promising but not yet validated
- Decayed: once true, now stale or obsolete
- Under-sourced: time slice missing or weak

## Final Output

Return:
1. Current answer
2. Temporal movement summary
3. Origin roots
4. Present evidence
5. Frontier signals
6. Reversals and cycles
7. Audit flags
8. Follow-up time slices
```

## Rewritten `scholar-dive.md`

```markdown
---
name: scholar-dive
summary: Academic lane structured by origin, present, and frontier evidence.
---

# Scholar Dive — Temporal Academic Lane

## Mission

Track how formal knowledge about a claim emerged, changed, and may shift through current research signals.

## Temporal Passes

- Origin: first strong academic formulation, foundational study, early critique, or historical analogue
- Present: current consensus, meta-analysis, guidelines, or best empirical evidence
- Frontier: preprints, preregistrations, new datasets, conference work, or open methodological disputes

## Source Basket

Prefer:
- peer-reviewed papers
- systematic reviews and meta-analyses
- preregistration registries
- standards and guidelines
- government/institutional datasets
- university repositories
- conference proceedings with credible review

Drop on sight:
- predatory journal
- press release as evidence
- no method section for empirical claim
- citation laundering
- AI-generated literature overview
- current claim citing obsolete source without caveat

## Gates

- G0 mechanical: DOI/ID, year, author, venue, temporal slice
- G1 existence: stable URL or bibliographic identifier
- G2 claim fidelity: quote ≤25 words tied to slice
- G3 CRAAP: currency, relevance, authority, accuracy, purpose recorded
- G4 falsifiability: effect size, PICO, measurable variable, or conditional
- G5 triangulation: independent source within or across time slice
- G6 anti-drift: do not replace temporal question with easier current-only answer
- G7 harm gate: safety-critical topics require high-tier present evidence
- G8 temporal check: stable, reversed, cyclic, mutated, decayed, or frontier-only
- G9 backstop: fair paraphrase and no overclaim beyond slice

## Finding Format

```text
FINDING S#
Temporal slice:
Claim:
Source:
Year:
Tier:
Quote:
Method:
Result:
Temporal role:
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

Report academic origin, current consensus, frontier signals, reversals, stale assumptions, missing time slices, and known limitations.
```

## Rewritten `community-search.md`

```markdown
---
name: community-search
summary: Practitioner lane structured by origin, present, and frontier field evidence.
---

# Community Search — Temporal Practitioner Lane

## Mission

Track how practitioners first handled a claim, how current field practice behaves, and which emerging signals may change adoption.

## Temporal Passes

- Origin: early implementation, first adoption wave, first failure report, or old forum debate
- Present: active repos, current practice, maintained docs, recent postmortems, current benchmarks
- Frontier: experimental branches, open issues, draft RFCs, new datasets, early migration chatter

## Source Basket

Prefer:
- GitHub repos and issue histories
- maintainer discussions
- named engineering blogs
- postmortems
- benchmarks with reproducible setup
- RFC and standards threads
- public datasets/notebooks
- old forum archives for origin pass

Drop on sight:
- vendor funnel
- anonymous authority claim
- stale answer as current practice
- deprecated repo as current proof
- benchmark without environment
- SEO article without artifact

## Gates

- G0 mechanical: URL, actor, date, version, activity, temporal slice
- G1 existence: live or archived source
- G2 claim fidelity: quote ≤25 words tied to slice
- G3 bias filter: vendor, analyst, advocacy, ideology recorded
- G4 currency: appropriate for slice; stale only fails when mislabeled current
- G5 artifact: repo, issue, dataset, benchmark, postmortem, or detailed steps
- G6 anti-drift: do not mistake popularity timeline for evidence timeline
- G7 harm gate: named expertise required for advice-risk claims
- G8 temporal check: adoption, abandonment, migration, recurrence, or frontier-only
- G9 backstop: not anecdote overgeneralized beyond slice

## Finding Format

```text
FINDING C#
Temporal slice:
Claim:
Source:
Year/date:
Venue:
Actor:
Quote:
Artifact:
Practice signal:
Failure signal:
Temporal role:
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

Report field origin, current adoption, active failures, frontier signals, recurring patterns, abandoned paths, and known limitations.
```

## Rewritten `edge-finder.md`

```markdown
---
name: edge-finder
summary: Divergent lane structured by historical analogues, present anomalies, and frontier weak signals.
---

# Edge Finder — Temporal Divergent Lane

## Mission

Find high-variance time-based insight: forgotten precursors, recurring patterns, present anomalies, and early weak signals that mainstream lanes may miss.

## Temporal Passes

- Origin: forgotten standard, old mailing list, historical analogue, field manual, early failed version
- Present: active anomaly, niche community, non-English practice, adjacent-field mechanism
- Frontier: weak signal, speculative mechanism, draft standard, early adopter cluster, unusual dataset

## Source Basket

Prefer:
- old mailing lists and forums
- institutional archives
- field manuals
- standards history
- non-English practitioner sources
- adjacent discipline archives
- named pseudonym communities with track record
- patents only as mechanism hints

Drop on sight:
- persecution narrative
- secret knowledge framing
- unfalsifiable mechanism
- anonymous no-track-record source
- miracle cure or guaranteed return
- quote-mined mainstream source
- novelty with no mechanism

## Gates

- G0 mechanical: provenance, date, identity, archive stability, temporal slice
- G1 existence: stable URL or archive identifier
- G2 anti-redundancy: why Scholar/Community likely miss this time signal
- G3 crank filter: specificity, refutation handling, argument shape, harm risk
- G4 authority signal: artifact, track record, adoption, prediction, institution, archival depth
- G5 structural edge: old archive, non-English, adjacent field, dead board, forgotten standard, named pseudonym
- G6 anti-drift: time-based divergence must inform topic, not novelty hunt
- G7 harm gate: safety-critical claims require high confidence or drop
- G8 temporal check: precursor, recurrence, anomaly, weak signal, or decayed idea
- G9 backstop: mechanism coherent and expert-safe

## Finding Format

```text
FINDING E#
Temporal slice:
Claim:
Source:
Year/date:
Edge type:
Authority signal:
Quote:
Mechanism:
Why not other lanes:
Temporal role:
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

Report forgotten precursors, current anomalies, frontier weak signals, cycles, dropped crank patterns, redundancy risk, and known limitations.
```

## Evidence

- Used `ARCHITECTURE.md` session context as source architecture.
- Used known `reTruth/skills/` references: `SKILL.md`, `scholar-dive.md`, `community-search.md`, `edge-finder.md`.
- Checked existing `results/*.md` before choosing v4 filename.

## Next

1. Next iteration can explore **Question Market**: lanes bid budget toward highest expected information gain.
2. Another drift: **Blind Synthesis**: strip lane identity before first synthesis to reduce authority bias.
3. Another drift: **Failure-First Gnosis**: every lane starts with known failure cases before success evidence.
