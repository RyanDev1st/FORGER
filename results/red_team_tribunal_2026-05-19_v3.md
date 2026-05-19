Parent: ARCHITECTURE.md

# reTruth Variation Pipeline — Red-Team Tribunal

## Status

Draft variation v3. Generated for iterative comparison only. File created under `results/` only.

## Scope

This variation keeps original Scholar, Community, and Edge lanes unchanged as discovery agents, but adds a tribunal phase inside the orchestrator after lane return. No fourth subagent is spawned. The orchestrator converts lane findings into claims, prosecutes them against each other, and forces final synthesis to preserve unresolved conflict rather than flattening it.

## Why This Variation

Original architecture audits links, quotes, and redundancy. It verifies existence and source fidelity, but does not deeply pressure contradictions after discovery. Red-Team Tribunal targets synthesis failure: over-clean summaries that hide real disagreement.

Chosen because it may produce better results when sources disagree, authority is split, or Edge finds a useful mechanism that Scholar cannot yet validate. It trades speed for sharper conflict handling without violating four-thread concurrency.

## Variation Pipeline

1. **Parse brief.** Orchestrator extracts topic, domain, harm class, and expected answer type.
2. **Spawn lanes.** Scholar, Community, Edge run in parallel with original isolation and source baskets.
3. **Validate lane returns.** V1–V5: floor, format, quotes, gates, Closing blocks.
4. **Extract atomic assertions.** Orchestrator converts findings into assertion cards with source tier and confidence.
5. **Tribunal docket.** Assertions grouped as support, opposition, boundary, mechanism, and drift.
6. **Cross-examination.** Each assertion must answer: who would dispute this, what evidence would weaken it, which lane conflicts with it.
7. **Verdict labels.** Robust, contested, plausible mechanism, anecdotal, redundant, unsafe, under-sourced.
8. **Cheap audit.** HEAD links, quote grep, Edge bigram redundancy, tribunal contradiction count.
9. **Synthesis.** Final answer structured around verdicts, not consensus prose.
10. **Re-fan.** Only docket items with high impact and weak evidence trigger follow-up lanes.

## Rewritten `SKILL.md`

```markdown
---
name: gnosis
version: 0.4.0-tribunal
summary: Orchestrates three-lane discovery plus internal red-team tribunal synthesis.
---

# /gnosis — Red-Team Tribunal

## Purpose

Discover evidence through three isolated lanes, then run an internal adversarial tribunal before synthesis.

## Parse

Extract:
- topic slug
- user goal
- domain
- harm class
- answer type
- freshness requirement
- mode: standard or high
- likely decision risk

## Workspace

Create `./reTruth/{topic-slug}-{YYYY-MM-DD}/`; append `-v2`, `-v3` on collision.

Files:
- `scholar.md`
- `community.md`
- `edge.md`
- `docket.md`
- `audit.md`
- `synthesis.md`

## Orchestration

1. Spawn Scholar, Community, Edge in parallel. Max four concurrent threads including orchestrator.
2. Inject lane mandate text at spawn time. Do not load lane mandates into orchestrator context.
3. Validate each lane with V1–V5.
4. Extract assertion cards from all findings.
5. Build tribunal docket.
6. Cross-examine assertion cards against other lanes.
7. Assign verdict labels.
8. Run cheap verification audit.
9. Synthesize by verdict tier.
10. Re-fan only high-impact contested or under-sourced docket items.

## Assertion Card Format

```text
ASSERTION A#
Claim:
Source lane:
Source tier:
Quote:
Support type:
Confidence:
Would be weakened by:
Conflicting lanes:
Boundary:
Harm note:
Verdict:
```

## Validation

- V1: lane output has required two-part return
- V2: floor met or under-sourced reason logged
- V3: every finding has URL/stable identifier
- V4: every finding has quote ≤25 words
- V5: gates and Closing block complete
- V6: every synthesis claim has assertion card
- V7: contested assertions remain visible, not averaged away

## Verdict Labels

- Robust: independent support, audit-clean, no serious contradiction
- Contested: credible sources conflict
- Plausible mechanism: useful but not fully validated
- Anecdotal: field signal with weak generalization
- Redundant: adds no new support after overlap check
- Unsafe: harm gate failed
- Under-sourced: floor, hostile class, or source quality missing

## Final Output

Return:
1. Verdict-first answer
2. Docket table
3. Robust claims
4. Contested claims
5. Plausible mechanisms
6. Unsafe or excluded claims
7. Audit flags
8. Follow-up docket items
```

## Rewritten `scholar-dive.md`

```markdown
---
name: scholar-dive
summary: Academic lane optimized for tribunal-ready assertions.
---

# Scholar Dive — Tribunal Academic Lane

## Mission

Produce academic findings that can survive cross-examination by practitioner and divergent evidence.

## Source Basket

Prefer:
- systematic reviews
- meta-analyses
- peer-reviewed empirical papers
- preregistered studies
- government datasets
- standards bodies
- university repositories
- credible conference proceedings

Drop on sight:
- predatory journal
- press release as proof
- citation laundering
- no methods for empirical claim
- unbounded causal claim
- AI-generated literature summary

## Gates

- G0 mechanical: DOI/ID, year, author, venue, domain match
- G1 existence: stable URL or bibliographic identifier
- G2 claim fidelity: quote ≤25 words and source section
- G3 CRAAP: currency, relevance, authority, accuracy, purpose recorded
- G4 falsifiability: effect size, PICO, measurable variable, or conditional
- G5 triangulation: support, null, or contradiction from independent source
- G6 anti-drift: same author/group/venue/year check every 3 findings
- G7 harm gate: safety-critical topics require high-tier evidence
- G8 tribunal prep: state who would dispute this and why
- G9 backstop: fair paraphrase and no abstract-only overclaim

## Finding Format

```text
FINDING S#
Claim:
Source:
Tier:
Quote:
Method:
Result:
Boundary:
Likely dispute:
Would be weakened by:
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

Report floor/target, strongest academic claim, strongest academic contradiction, tribunal-ready disputes, harm downgrades, and known limitations.
```

## Rewritten `community-search.md`

```markdown
---
name: community-search
summary: Practitioner lane optimized for tribunal-ready assertions.
---

# Community Search — Tribunal Practitioner Lane

## Mission

Produce field findings that can survive cross-examination by academic rigor and divergent mechanisms.

## Source Basket

Prefer:
- active repos
- issue threads with maintainer signal
- postmortems
- named engineering blogs
- benchmarks with reproducible setup
- migration stories
- RFC threads
- public datasets and notebooks

Drop on sight:
- vendor funnel as proof
- anonymous authority claim
- stale version answer
- benchmark without environment
- deprecated project as current evidence
- SEO article without artifact

## Gates

- G0 mechanical: date, actor, venue, version, artifact activity
- G1 existence: live or archived URL
- G2 claim fidelity: quote ≤25 words and thread/context marker
- G3 bias filter: vendor, analyst, advocacy, ideology recorded
- G4 currency: domain freshness cutoff or stale flag
- G5 reproducibility: artifact, repo, dataset, benchmark, or detailed steps
- G6 anti-drift: same repo/vendor/platform cluster check every 3 findings
- G7 harm gate: named expertise required for advice-risk claims
- G8 tribunal prep: state what Scholar would challenge
- G9 backstop: not popularity-only and no anecdote overgeneralization

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
Failure signal:
Boundary:
Likely dispute:
Would be weakened by:
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

Report floor/target, strongest field claim, strongest failure story, reproducibility quality, tribunal-ready disputes, echo risks, and known limitations.
```

## Rewritten `edge-finder.md`

```markdown
---
name: edge-finder
summary: Divergent lane optimized for tribunal-ready mechanisms.
---

# Edge Finder — Tribunal Divergent Lane

## Mission

Produce high-variance findings that survive crank exclusion and can be cross-examined as mechanisms, analogues, or reframes.

## Source Basket

Prefer:
- adjacent-field archives
- historical standards
- old mailing lists
- non-English practitioner sources
- institutional archives
- field manuals
- named pseudonym communities with track record
- patents only as mechanism hints

Drop on sight:
- persecution narrative
- secret knowledge claim
- unfalsifiable mechanism
- anonymous no-track-record source
- miracle cure or guaranteed return
- quote-mined mainstream source
- novelty with no mechanism

## Gates

- G0 mechanical: provenance, date, identity, archive stability
- G1 existence: stable URL or archive identifier
- G2 anti-redundancy Socratic: why other lanes would miss this
- G3 crank filter: mainstream engagement, specificity, refutation handling, argument shape, harm risk
- G4 authority signal: artifact, track record, adoption, prediction, institution, or archival depth
- G5 structural edge justification: adjacent field, non-English, dead board, old archive, forgotten standard, named pseudonym
- G6 anti-drift: novelty addiction and topic drift check every 3 findings
- G7 harm gate: safety-critical claims need high confidence or drop
- G8 tribunal prep: state what Scholar and Community would challenge
- G9 backstop: mechanism coherent and expert-safe

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
Boundary:
Likely dispute:
Would be weakened by:
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

Report floor/target, strongest mechanism, strongest reframe, dropped crank patterns, tribunal-ready disputes, redundancy risks, and known limitations.
```

## Evidence

- Used `ARCHITECTURE.md` session context as source architecture.
- Used known `reTruth/skills/` references: `SKILL.md`, `scholar-dive.md`, `community-search.md`, `edge-finder.md`.
- Checked `results/*.md` before choosing v3 filename.

## Next

1. Next iteration can explore **Temporal Spiral**: lanes split evidence by past/current/emerging time horizons.
2. Another drift: **Question Market**: lanes bid for budget based on expected information gain.
3. Another drift: **Blind Synthesis**: orchestrator hides lane identity until after first synthesis to reduce authority bias.
