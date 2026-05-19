# Option Tournament — 2026-05-19 v15

Parent: ARCHITECTURE.md

## Status
Complete single-file variation under `results/` only.

## WHY
Original reTruth synthesizes evidence into unified answer. Option Tournament drifts by forcing candidate approaches to compete through evidence rounds. Each lane scores options by its own epistemic lens, then orchestrator advances, eliminates, or merges options. Chosen because many prompts ask “what should we do?” and need comparative selection rather than broad synthesis.

## Clean Hierarchy
```text
option_tournament_2026-05-19_v15.md
├── WHY
├── Variation Pipeline
├── SKILL.md
├── scholar-dive.md
├── community-search.md
└── edge-finder.md
```

## Variation Pipeline
1. Parse brief into objective, constraints, and candidate options.
2. If options absent, seed 3–6 neutral options.
3. Spawn three isolated lanes with same option roster.
4. Each lane emits option scorecards and knockout evidence.
5. Orchestrator validates source, quote, option linkage, and scoring rationale.
6. Run tournament rounds:
   - eligibility gate
   - evidence strength round
   - implementation viability round
   - edge-risk round
   - final synthesis round
7. Return winner, runner-up, eliminated options, merge candidates, and decisive unknowns.
8. Re-fan once if top options tie due to missing evidence.

## SKILL.md
```markdown
---
name: gnosis-option-tournament
description: reTruth orchestrator variation that evaluates competing options through evidence rounds using Scholar, Community, and Edge scorecards.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
displayName: Gnosis Option Tournament
---

# gnosis-option-tournament

## Invocation
Use for choosing between strategies, architectures, tools, research directions, policies, or product bets.

## Pipeline

### Step 1 — Build Option Roster
Extract or seed 3–6 options. Each option must be distinct and actionable.

Schema:
```markdown
O<n>:
Description:
Success condition:
Known risks:
```

### Step 2 — Spawn Lanes
Spawn Scholar, Community, and Edge in parallel. Each lane scores all options it can evaluate and flags unevaluable options.

### Step 3 — Validate
Run V1–V8:
- V1 file exists and non-empty.
- V2 at least 5 scorecards or pivot log.
- V3 no top-level refusal.
- V4 every scorecard has verbatim quote.
- V5 every scorecard links to option id.
- V6 every scorecard includes advance/eliminate/merge/hold verdict.
- V7 every verdict has reason.
- V8 closing block present.

### Step 4 — Audit
Check URLs, quotes, and Edge redundancy. Audit failures downgrade scorecards.

### Step 5 — Tournament
Run rounds:
1. Eligibility: violates hard constraints?
2. Evidence: enough independent support?
3. Viability: can survive field conditions?
4. Edge risk: hidden failure or overlooked upside?
5. Final: winner, runner-up, merge option, or no-decision.

### Step 6 — Re-fan
If top two remain tied because one evidence type is missing, re-fan one lane. One round max.

## Output
Return:
1. Winner and why.
2. Runner-up and when to choose it.
3. Eliminated options with evidence-linked reasons.
4. Merge candidates.
5. Decisive unknowns.

## Constraints
- No winner without evidence trace.
- No elimination without reason.
- Keep minority option alive if evidence remains unresolved.
- Maximum four concurrent threads.
```

## scholar-dive.md
```markdown
---
name: scholar-dive-option-tournament
description: Academic lane for Option Tournament. Scores candidate options by rigorous evidence, mechanisms, comparative studies, and validity limits.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# scholar-dive-option-tournament

## Mission
Evaluate options using rigorous academic and institutional evidence. Prefer comparative evidence and mechanisms over isolated claims.

## Sources
Priority:
1. Comparative studies, systematic reviews, standards.
2. Peer-reviewed empirical papers.
3. Replication, null, and negative studies.
4. Institutional datasets and technical reports.

## Search Procedure
1. Search comparative evidence across options.
2. Search mechanism evidence for each option.
3. Search limitations and failure conditions.
4. Search standards or formal requirements.
5. Stop at floor 5, target 8–10, ceiling 12–15 scorecards.

## Scorecard Gate
Each scorecard must include:
- option id
- verdict: advance, eliminate, merge, hold
- evidence basis
- source
- verbatim quote
- method basis
- validity limit
- confidence

## Append Schema
```markdown
## Scorecard S-<n>
Option:
Verdict:
Claim:
Source:
Quote:
Method basis:
Validity limit:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name academically strongest option and strongest reason not to overgeneralize.
```

## community-search.md
```markdown
---
name: community-search-option-tournament
description: Practitioner lane for Option Tournament. Scores options by implementation viability, operational evidence, maintainer signals, and field failures.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# community-search-option-tournament

## Mission
Evaluate options by real-world viability: cost, reliability, maintainability, adoption, failure modes, and working artifacts.

## Sources
Priority:
1. Postmortems, migration reports, incident reviews.
2. Maintainer issues, RFCs, changelogs.
3. Production case studies, repos, benchmarks.
4. Practitioner debates with named expertise.

## Search Procedure
1. Search implementation reports for each option.
2. Search failures, rollbacks, and migration pain.
3. Search maintainability and ecosystem signals.
4. Search artifacts proving viability.
5. Stop at floor 5, target 8–10, ceiling 12–15 scorecards.

## Scorecard Gate
Each scorecard must include:
- option id
- verdict: advance, eliminate, merge, hold
- authority signal
- firsthand status
- source
- verbatim quote
- operational artifact
- implementation risk
- confidence

## Append Schema
```markdown
## Scorecard C-<n>
Option:
Verdict:
Claim:
Source:
Quote:
Authority signal:
Firsthand status:
Artifact:
Implementation risk:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name most practical option and biggest operational trap.
```

## edge-finder.md
```markdown
---
name: edge-finder-option-tournament
description: Edge lane for Option Tournament. Finds hidden option killers, overlooked hybrids, adjacent analogues, and contrarian option advantages.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# edge-finder-option-tournament

## Mission
Stress candidate options with unusual evidence and find hidden hybrids or option killers other lanes miss.

## Sources
Priority:
1. Adjacent-field analogues.
2. Forgotten archives and old terminology.
3. Non-English or regional practice.
4. Niche expert forums.
5. Substantive contrarian mechanisms.

## Search Procedure
1. Translate each option into structural pattern.
2. Search adjacent domains where similar option won or failed.
3. Search obsolete approaches and hidden hybrids.
4. Search adversarial or neglected constraints.
5. Stop at floor 5, target 7–8, ceiling 8–12 scorecards.

## Scorecard Gate
Each scorecard must include:
- option id
- verdict: advance, eliminate, merge, hold
- structural miss reason
- transfer mechanism
- source
- verbatim quote
- crank filter result
- hidden risk or upside
- confidence

## Append Schema
```markdown
## Scorecard E-<n>
Option:
Verdict:
Claim:
Source:
Quote:
Structural miss reason:
Transfer mechanism:
Crank filter:
Hidden risk/upside:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name one option that should be merged, not eliminated, if evidence supports it.
```

## Expected Gains
- Better decision support.
- Clear rejected-option rationale.
- Explicit tradeoff handling.
- Less “all options have pros and cons” mush.

## Main Risk
Tournament framing can over-eliminate early. Mitigation: `hold` verdict preserves options when evidence is insufficient.

## Next Variation Ideas
1. Blind Menagerie: partial-brief agents reduce shared framing bias.
2. Evidence Cartographer: map knowledge terrain before answering.
3. Incentive Lens: analyze stakeholder incentives as first-class evidence.
