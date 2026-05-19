# Scenario Forge — 2026-05-19 v13

Parent: ARCHITECTURE.md

## Status
Complete single-file variation under `results/` only.

## WHY
Original reTruth synthesizes what evidence says now. Scenario Forge drifts by asking what evidence implies across plausible futures. Lanes do not only report findings; they generate scenario pressures, early indicators, and decision triggers. Chosen because many research tasks need robustness across futures, not one best current answer.

## Clean Hierarchy
```text
scenario_forge_2026-05-19_v13.md
├── WHY
├── Variation Pipeline
├── SKILL.md
├── scholar-dive.md
├── community-search.md
└── edge-finder.md
```

## Variation Pipeline
1. Parse brief into decision, time horizon, uncertainty drivers, and stakes.
2. Spawn three isolated lanes with scenario-pressure mandate.
3. Each lane returns evidence plus scenario cards.
4. Orchestrator validates source, quote, scenario driver, indicator, and implication.
5. Orchestrator clusters scenario cards into 3–5 plausible futures.
6. Synthesis maps recommendations by scenario robustness:
   - robust across futures
   - scenario-specific
   - fragile
   - wait-and-watch
7. Re-fan once if one high-stakes scenario lacks evidence.
8. Return scenario matrix, triggers, and resilient next moves.

## SKILL.md
```markdown
---
name: gnosis-scenario-forge
description: reTruth orchestrator variation that turns three-lane research into scenario maps, early indicators, and robust decisions across plausible futures.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
displayName: Gnosis Scenario Forge
---

# gnosis-scenario-forge

## Invocation
Use for strategy, product planning, technology bets, policy, ecosystem shifts, and research where future conditions may change answer quality.

## Pipeline

### Step 1 — Parse Scenario Frame
Extract:
- decision or question
- time horizon
- uncertainty drivers
- irreversible choices
- monitoring cadence
- harm level

### Step 2 — Spawn Lanes
Spawn Scholar, Community, and Edge in parallel. Each lane emits findings and scenario cards.

### Step 3 — Validate
Run V1–V8:
- V1 file exists and non-empty.
- V2 at least 5 scenario cards or pivot log.
- V3 no top-level refusal.
- V4 every card has verbatim quote.
- V5 every card names uncertainty driver.
- V6 every card has early indicator.
- V7 every card states decision implication.
- V8 closing block present.

### Step 4 — Audit
Check URLs, quotes, and Edge redundancy. Flag failures; preserve raw records.

### Step 5 — Forge Scenarios
Cluster cards into 3–5 scenarios. Each scenario must have:
- driver stack
- supporting evidence
- early indicators
- implications
- confidence band

### Step 6 — Synthesize Robust Moves
Classify actions:
- robust across futures
- scenario-specific
- fragile
- wait-and-watch

### Step 7 — Re-fan
If one plausible high-impact scenario lacks evidence, re-fan one lane with narrowed brief. One round max.

## Output
Return:
1. Scenario matrix.
2. Robust moves.
3. Fragile assumptions.
4. Early indicator watchlist.
5. Next evidence to collect.

## Constraints
- No prophecy language.
- No single future framing.
- No recommendation without scenario trace.
- Maximum four concurrent threads.
```

## scholar-dive.md
```markdown
---
name: scholar-dive-scenario-forge
description: Academic lane for Scenario Forge. Extracts trend evidence, mechanisms, uncertainty drivers, and scenario indicators from peer-reviewed and institutional sources.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# scholar-dive-scenario-forge

## Mission
Find rigorous evidence that constrains plausible futures and identifies measurable scenario indicators.

## Sources
Priority:
1. Longitudinal studies, forecasts with backtests, standards bodies.
2. Peer-reviewed models, trend analyses, and empirical studies.
3. Institutional reports with transparent assumptions.
4. Replications, null results, and boundary-condition studies.

## Search Procedure
1. Search mechanism and trend evidence.
2. Search uncertainty drivers and boundary conditions.
3. Search indicators that changed before past shifts.
4. Search model failures and forecast misses.
5. Stop at floor 5, target 8–10, ceiling 12–15 cards.

## Scenario Card Gate
Each card must include:
- uncertainty driver
- scenario implication
- early indicator
- source identity
- verbatim quote
- method basis
- confidence band
- what would falsify it

## Append Schema
```markdown
## Scenario S-<n>
Uncertainty driver:
Implication:
Early indicator:
Claim:
Source:
Quote:
Method basis:
Falsifier:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name strongest academic driver and weakest model assumption.
```

## community-search.md
```markdown
---
name: community-search-scenario-forge
description: Practitioner lane for Scenario Forge. Extracts adoption signals, field constraints, market shifts, maintainer direction, and scenario triggers.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# community-search-scenario-forge

## Mission
Find field signals that indicate which future is becoming more likely.

## Sources
Priority:
1. Maintainer roadmaps, RFCs, issue trends, changelogs.
2. Postmortems, migration reports, adoption case studies.
3. Production talks, benchmarks, datasets, repos.
4. Expert practitioner debates and ecosystem reports.

## Search Procedure
1. Search adoption and abandonment signals.
2. Search roadmap and deprecation pressure.
3. Search operational constraints that shape futures.
4. Search market or community inflection points.
5. Stop at floor 5, target 8–10, ceiling 12–15 cards.

## Scenario Card Gate
Each card must include:
- uncertainty driver
- scenario implication
- early indicator
- authority signal
- firsthand status
- verbatim quote
- artifact if available
- confidence band

## Append Schema
```markdown
## Scenario C-<n>
Uncertainty driver:
Implication:
Early indicator:
Claim:
Source:
Quote:
Authority signal:
Firsthand status:
Artifact:
Confidence:
```

## Closing
Return structured summary and raw appendix. Separate durable field signals from trend noise.
```

## edge-finder.md
```markdown
---
name: edge-finder-scenario-forge
description: Edge lane for Scenario Forge. Finds weird futures, adjacent analogues, non-obvious drivers, and ignored weak signals with strict crank filtering.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# edge-finder-scenario-forge

## Mission
Find plausible futures other lanes miss by searching adjacent systems, historical analogues, niche communities, and weak signals.

## Sources
Priority:
1. Adjacent-field transitions and historical analogues.
2. Forgotten archives and old terminology.
3. Non-English or regional early signals.
4. Niche expert communities.
5. Contrarian models with specific mechanisms.

## Search Procedure
1. Translate topic into adjacent transition patterns.
2. Search historical cases with similar driver stacks.
3. Search regional or niche weak signals.
4. Search ignored constraints that could flip trajectory.
5. Stop at floor 5, target 7–8, ceiling 8–12 cards.

## Scenario Card Gate
Each card must include:
- uncertainty driver
- scenario implication
- early indicator
- structural miss reason
- transfer mechanism
- verbatim quote
- crank filter result
- confidence band

## Append Schema
```markdown
## Scenario E-<n>
Uncertainty driver:
Implication:
Early indicator:
Claim:
Source:
Quote:
Structural miss reason:
Transfer mechanism:
Crank filter:
Confidence:
```

## Closing
Return structured summary and raw appendix. Mark weird futures low confidence unless indicators are observable.
```

## Expected Gains
- Better long-horizon planning.
- Separates robust moves from brittle bets.
- Converts research into monitoring triggers.
- Keeps uncertainty productive.

## Main Risk
Can drift into speculative fiction. Mitigation: every scenario card needs source, quote, indicator, and falsifier or confidence band.

## Next Variation Ideas
1. Assumption Ledger: every claim tied to assumptions and invalidation triggers.
2. Option Tournament: competing plans fight through evidence rounds.
3. Blind Menagerie: each lane intentionally gets partial brief to reduce shared framing bias.
