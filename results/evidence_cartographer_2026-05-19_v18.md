# Evidence Cartographer — 2026-05-19 v18

Parent: ARCHITECTURE.md

## Status
Complete single-file variation under `results/` only.

## WHY
Original reTruth synthesizes findings after lane fan-out. Evidence Cartographer drifts by first mapping terrain: where evidence is dense, sparse, disputed, contaminated, stale, or structurally missing. Chosen because many bad answers come from treating unknown terrain as if it were evenly mapped.

## Clean Hierarchy
```text
evidence_cartographer_2026-05-19_v18.md
├── WHY
├── Variation Pipeline
├── SKILL.md
├── scholar-dive.md
├── community-search.md
└── edge-finder.md
```

## Variation Pipeline
1. Parse brief into target question, subdomains, and likely evidence terrain.
2. Spawn three isolated lanes with terrain-mapping mandate.
3. Each lane returns map cards, not only findings.
4. Orchestrator validates source, quote, terrain label, and gap note.
5. Build evidence map:
   - dense and reliable
   - dense but distorted
   - sparse but promising
   - disputed
   - stale
   - unmapped
6. Synthesis answers only from mapped regions and flags extrapolations.
7. Re-fan once if one unmapped region blocks answer quality.
8. Return terrain map, safe conclusions, and expedition targets.

## SKILL.md
```markdown
---
name: gnosis-evidence-cartographer
description: reTruth orchestrator variation that maps evidence terrain before answering. Three lanes identify density, distortion, disputes, staleness, and unmapped regions.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
displayName: Gnosis Evidence Cartographer
---

# gnosis-evidence-cartographer

## Invocation
Use when user needs to know not only answer, but shape and reliability of knowledge landscape.

## Pipeline

### Step 1 — Parse Terrain Frame
Extract:
- core question
- subdomains
- likely evidence sources
- expected blind zones
- decision stakes
- acceptable extrapolation level

### Step 2 — Spawn Lanes
Spawn Scholar, Community, and Edge in parallel. Each lane emits map cards and region notes.

### Step 3 — Validate
Run V1–V8:
- V1 file exists and non-empty.
- V2 at least 5 map cards or pivot log.
- V3 no top-level refusal.
- V4 every card has verbatim quote.
- V5 every card has terrain label.
- V6 every card has region or subdomain.
- V7 every card has gap or contamination note.
- V8 closing block present.

### Step 4 — Audit
Check URLs, quotes, and Edge redundancy. Preserve failures as contamination flags.

### Step 5 — Build Terrain Map
Classify regions:
- dense and reliable
- dense but distorted
- sparse but promising
- disputed
- stale
- unmapped

### Step 6 — Synthesize
Return what can be safely concluded, what remains speculative, and where further search matters most.

### Step 7 — Re-fan
If one unmapped region blocks decision quality, re-fan one lane with narrowed regional brief. One round max.

## Output
Return:
1. Terrain map.
2. Safe conclusions.
3. Distorted zones.
4. Unmapped regions.
5. Expedition targets.

## Constraints
- No even-confidence answer across uneven terrain.
- No extrapolation without label.
- Maximum four concurrent threads.
- Preserve raw evidence appendices.
```

## scholar-dive.md
```markdown
---
name: scholar-dive-evidence-cartographer
description: Academic lane for Evidence Cartographer. Maps rigorous evidence density, disputes, staleness, and blind zones across formal literature.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# scholar-dive-evidence-cartographer

## Mission
Map academic terrain: where formal evidence is strong, fragmented, disputed, stale, or absent.

## Sources
Priority:
1. Systematic reviews, meta-analyses, standards.
2. Peer-reviewed papers.
3. Replication, null, and contradiction studies.
4. Institutional reports and datasets.

## Search Procedure
1. Search core literature by subdomain.
2. Search replication and contradiction patterns.
3. Search literature age and update cadence.
4. Search known blind populations or contexts.
5. Stop at floor 5, target 8–10, ceiling 12–15 map cards.

## Map Card Gate
Each card must include:
- terrain label
- region or subdomain
- claim
- source
- verbatim quote
- method basis
- gap or contamination note
- confidence

## Append Schema
```markdown
## Map S-<n>
Terrain label:
Region:
Claim:
Source:
Quote:
Method basis:
Gap or contamination note:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name best-mapped academic region and biggest blind zone.
```

## community-search.md
```markdown
---
name: community-search-evidence-cartographer
description: Practitioner lane for Evidence Cartographer. Maps operational evidence density, lore distortion, maintainer visibility, and real-world blind zones.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# community-search-evidence-cartographer

## Mission
Map practitioner terrain: where field evidence is dense, noisy, stale, vendor-shaped, or missing.

## Sources
Priority:
1. Postmortems, migration reports, incident reviews.
2. Maintainer issues, RFCs, changelogs.
3. Production case studies, repos, benchmarks.
4. Expert practitioner threads.

## Search Procedure
1. Search working examples and failures by subdomain.
2. Search maintainer visibility and roadmap density.
3. Search vendor lore and repeated unsupported claims.
4. Search weakly documented operational zones.
5. Stop at floor 5, target 8–10, ceiling 12–15 map cards.

## Map Card Gate
Each card must include:
- terrain label
- region or subdomain
- claim
- source
- verbatim quote
- authority signal
- gap or contamination note
- confidence

## Append Schema
```markdown
## Map C-<n>
Terrain label:
Region:
Claim:
Source:
Quote:
Authority signal:
Gap or contamination note:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name best-mapped field region and noisiest lore swamp.
```

## edge-finder.md
```markdown
---
name: edge-finder-evidence-cartographer
description: Edge lane for Evidence Cartographer. Maps hidden archives, neglected regions, anomalous clusters, and structurally unmapped terrain with strict crank filtering.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# edge-finder-evidence-cartographer

## Mission
Map anomalous and neglected terrain: hidden archives, adjacent regions, weak-signal clusters, and places mainstream search misses.

## Sources
Priority:
1. Adjacent-field analogues.
2. Forgotten archives and old terminology.
3. Non-English or regional sources.
4. Niche expert forums.
5. Substantive contrarian mechanisms.

## Search Procedure
1. Search anomalous clusters and outlier terms.
2. Search adjacent domains for overlooked terrain.
3. Search old and regional archives.
4. Search signs of structural unmappedness.
5. Stop at floor 5, target 7–8, ceiling 8–12 map cards.

## Map Card Gate
Each card must include:
- terrain label
- region or subdomain
- claim
- source
- verbatim quote
- structural miss reason
- gap or contamination note
- crank filter result
- confidence

## Append Schema
```markdown
## Map E-<n>
Terrain label:
Region:
Claim:
Source:
Quote:
Structural miss reason:
Gap or contamination note:
Crank filter:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name one region mainstream lanes would mis-map without edge search.
```

## Expected Gains
- Better map-before-answer behavior.
- Less fake certainty over sparse regions.
- Clear expedition targets for next research.
- Better gap communication.

## Main Risk
Can delay direct answer. Mitigation: synthesis still returns safe conclusions from mapped regions.

## Next Variation Ideas
1. Consensus Ladder: rank claims by independence and convergence depth.
2. Causal Forge: build mechanism-first synthesis.
3. Adversary Mirror: simulate strongest opponent interpretation.
