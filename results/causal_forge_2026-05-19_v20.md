# Causal Forge — 2026-05-19 v20

Parent: ARCHITECTURE.md

## Status
Complete single-file variation under `results/` only.

## WHY
Original reTruth aggregates claims, tensions, and gaps well, but many strong-looking answers still mix correlation, mechanism, anecdote, and intuition. Causal Forge drifts by forcing every lane to hunt mechanisms, causal chains, confounders, and disproof routes. Chosen because many important research questions are really causal questions wearing information clothes.

## Clean Hierarchy
```text
causal_forge_2026-05-19_v20.md
├── WHY
├── Variation Pipeline
├── SKILL.md
├── scholar-dive.md
├── community-search.md
└── edge-finder.md
```

## Variation Pipeline
1. Parse brief into target outcome, candidate causes, confounders, and intervention points.
2. Spawn three isolated lanes with causal-analysis mandate.
3. Each lane returns causal cards, not generic findings.
4. Orchestrator validates source, quote, causal role, confounder note, and falsifier.
5. Build causal map:
   - driver
   - mediator
   - confounder
   - moderator
   - feedback loop
   - failure pathway
6. Synthesis ranks claims by causal strength, not narrative appeal.
7. Re-fan once if one unresolved confounder blocks useful conclusion.
8. Return causal map, strongest mechanisms, weak links, and best interventions.

## SKILL.md
```markdown
---
name: gnosis-causal-forge
description: reTruth orchestrator variation that converts three-lane research into causal maps, mechanism chains, confounder analysis, and intervention guidance.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
displayName: Gnosis Causal Forge
---

# gnosis-causal-forge

## Invocation
Use when question is really about what causes what, what changes outcomes, what breaks systems, or what intervention matters most.

## Pipeline

### Step 1 — Parse Causal Frame
Extract:
- target outcome
- candidate causes
- candidate confounders
- possible mediators
- interventions user may control
- harm level

### Step 2 — Spawn Lanes
Spawn Scholar, Community, and Edge in parallel. Each lane emits causal cards.

### Step 3 — Validate
Run V1–V8:
- V1 file exists and non-empty.
- V2 at least 5 causal cards or pivot log.
- V3 no top-level refusal.
- V4 every card has verbatim quote.
- V5 every card has causal role.
- V6 every card has confounder or boundary note.
- V7 every card has falsifier or disproof route.
- V8 closing block present.

### Step 4 — Audit
Check URLs, quote matches, and Edge redundancy. Preserve failures as downgrade flags.

### Step 5 — Build Causal Map
Classify cards into:
- driver
- mediator
- confounder
- moderator
- feedback loop
- failure pathway

### Step 6 — Synthesize
Return:
- strongest causal mechanisms
- confounded or weakly supported links
- interventions with best leverage
- outcomes still correlation-heavy

### Step 7 — Re-fan
If one unresolved confounder blocks action-quality synthesis, re-fan one lane with narrow brief. One round max.

## Output
Return:
1. Causal map.
2. Highest-leverage interventions.
3. Confounder register.
4. Weak or broken links.
5. Best next disambiguation test.

## Constraints
- No causal language without mechanism or falsifier note.
- No intervention advice without pathway trace.
- Maximum four concurrent threads.
- Preserve raw evidence appendices.
```

## scholar-dive.md
```markdown
---
name: scholar-dive-causal-forge
description: Academic lane for Causal Forge. Extracts mechanisms, confounders, mediators, moderators, and falsification routes from rigorous literature.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# scholar-dive-causal-forge

## Mission
Find rigorous evidence about causal mechanisms, not only associations.

## Sources
Priority:
1. Causal inference studies, systematic reviews, meta-analyses, standards.
2. Peer-reviewed papers with experimental, longitudinal, or quasi-experimental designs.
3. Replication, null, and contradiction studies.
4. Institutional datasets and technical reports.

## Search Procedure
1. Search mechanism-first terms.
2. Search confounders and boundary conditions.
3. Search intervention evidence and outcome shifts.
4. Search null or contradictory causal evidence.
5. Stop at floor 5, target 8–10, ceiling 12–15 causal cards.

## Causal Card Gate
Each card must include:
- causal role
- linked outcome
- source
- verbatim quote
- method basis
- confounder or boundary note
- falsifier or disproof route
- confidence

## Append Schema
```markdown
## Causal S-<n>
Causal role:
Linked outcome:
Claim:
Source:
Quote:
Method basis:
Confounder or boundary note:
Falsifier:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name strongest academic mechanism and weakest claimed causal link.
```

## community-search.md
```markdown
---
name: community-search-causal-forge
description: Practitioner lane for Causal Forge. Extracts operational mechanisms, failure pathways, hidden confounders, and intervention effects from field evidence.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# community-search-causal-forge

## Mission
Find how outcomes actually change in practice: what causes failures, what fixes them, and what confounds operator intuition.

## Sources
Priority:
1. Postmortems, migration reports, incident reviews.
2. Maintainer issues, RFCs, changelogs.
3. Production case studies, repos, benchmarks.
4. Practitioner debates with named expertise.

## Search Procedure
1. Search incident and intervention sequences.
2. Search recurring failure pathways.
3. Search hidden operational confounders.
4. Search cases where expected fix did not work.
5. Stop at floor 5, target 8–10, ceiling 12–15 causal cards.

## Causal Card Gate
Each card must include:
- causal role
- linked outcome
- authority signal
- firsthand status
- source
- verbatim quote
- confounder or boundary note
- intervention effect or falsifier
- confidence

## Append Schema
```markdown
## Causal C-<n>
Causal role:
Linked outcome:
Claim:
Source:
Quote:
Authority signal:
Firsthand status:
Confounder or boundary note:
Intervention effect or falsifier:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name strongest practical lever and most misleading field intuition.
```

## edge-finder.md
```markdown
---
name: edge-finder-causal-forge
description: Edge lane for Causal Forge. Finds adjacent mechanisms, hidden confounders, weird feedback loops, and neglected causal models with strict crank filtering.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# edge-finder-causal-forge

## Mission
Find causal structures normal lanes miss: adjacent mechanisms, perverse loops, historical reversals, and hidden drivers.

## Sources
Priority:
1. Adjacent-field analogues.
2. Forgotten archives and old terminology.
3. Non-English or regional sources.
4. Niche expert forums.
5. Substantive contrarians with mechanisms.

## Search Procedure
1. Search alternate mechanism hypotheses.
2. Search hidden confounders and feedback loops.
3. Search historical reversals and odd interventions.
4. Search adjacent domains with same causal geometry.
5. Stop at floor 5, target 7–8, ceiling 8–12 causal cards.

## Causal Card Gate
Each card must include:
- causal role
- linked outcome
- structural miss reason
- transfer mechanism
- source
- verbatim quote
- confounder or boundary note
- crank filter result
- confidence

## Append Schema
```markdown
## Causal E-<n>
Causal role:
Linked outcome:
Claim:
Source:
Quote:
Structural miss reason:
Transfer mechanism:
Confounder or boundary note:
Crank filter:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name one hidden causal driver that could flip synthesis if true.
```

## Expected Gains
- Stronger mechanism-first answers.
- Better intervention guidance.
- Clearer confounder handling.
- Less correlation theater.

## Main Risk
Can overfit causal stories where evidence only supports association. Mitigation: every causal card needs confounder note and falsifier path.

## Next Variation Ideas
1. Adversary Mirror: strongest hostile reading of every claim.
2. Residue Register: system optimized for unresolved remainder.
3. Translation Engine: map same claim across lane vocabularies.
