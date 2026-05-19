# Hypothesis Market — 2026-05-19 v7

Parent: ARCHITECTURE.md

## Status
Complete single-file variation under `results/` only.

## WHY
Original reTruth synthesizes findings after lane fan-out. Hypothesis Market drifts by making competing explanations explicit before evidence collection. Each lane buys, sells, or shorts hypotheses using sourced evidence. This may improve decision quality when multiple plausible models explain same facts, because synthesis becomes comparative rather than additive.

## Clean Hierarchy
```text
hypothesis_market_2026-05-19_v7.md
├── WHY
├── Variation Pipeline
├── SKILL.md
├── scholar-dive.md
├── community-search.md
└── edge-finder.md
```

## Variation Pipeline
1. Parse prompt into target question and 3–7 candidate hypotheses.
2. If user supplies no hypotheses, orchestrator seeds neutral hypotheses from brief.
3. Spawn lanes in isolation with same hypothesis slate.
4. Each lane returns evidence tickets that update hypothesis odds.
5. Orchestrator validates quotes, links, source quality, and hypothesis linkage.
6. Orchestrator builds market board: support, disconfirm, scope-limit, unknown.
7. Synthesis ranks hypotheses by evidence-adjusted plausibility, not rhetorical strength.
8. Re-fan once if top two hypotheses remain tied and one missing evidence type would break tie.
9. Return market board, winning/losing hypotheses, and decisive next tests.

## SKILL.md
```markdown
---
name: gnosis-hypothesis-market
description: reTruth orchestrator variation for comparing competing explanations. Lanes gather evidence tickets that buy, sell, or short explicit hypotheses.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
displayName: Gnosis Hypothesis Market
---

# gnosis-hypothesis-market

## Invocation
Use when topic has competing explanations, strategic uncertainty, disputed causality, or unclear best path.

## Pipeline

### Step 1 — Build Hypothesis Slate
Extract or seed 3–7 hypotheses. Each hypothesis must be falsifiable and mutually distinguishable.

Schema:
```markdown
H<n>:
Claim:
Would predict:
Would be weakened by:
```

### Step 2 — Create Workspace
Create:
- `scholar.md`
- `community.md`
- `edge.md`
- `market-board.md`
- `tie-breakers.md`

### Step 3 — Spawn Lanes
Spawn Scholar, Community, Edge in parallel. Inject hypothesis slate and lane mandate. Lanes do not see sibling outputs.

### Step 4 — Validate Lane Outputs
V1 file exists and non-empty.
V2 at least 5 evidence tickets.
V3 no top-level refusal.
V4 every ticket has quote.
V5 every ticket references one or more hypotheses.
V6 every ticket has market action: buy, sell, short, hedge.
V7 closing block present.

### Step 5 — Audit
Check URL availability, quote match, and Edge anti-redundancy. Failed audit downgrades ticket to flagged.

### Step 6 — Price Hypotheses
No fake numeric precision. Use ordinal bands:
- leading
- viable
- weak
- failing
- unknown

### Step 7 — Synthesize
Return ranked hypotheses, evidence tickets, contradictions, and decisive next tests.

### Step 8 — Re-fan
If one missing ticket class can change leader, re-fan one lane with narrow brief. Cap one round.

## Constraints
- Preserve minority hypotheses if evidence remains live.
- Never treat popularity as truth.
- Never collapse support and disconfirmation into one score without explanation.
- Maximum four concurrent threads.
```

## scholar-dive.md
```markdown
---
name: scholar-dive-hypothesis-market
description: Academic lane for Hypothesis Market. Produces peer-reviewed evidence tickets that buy, sell, short, or hedge explicit hypotheses.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# scholar-dive-hypothesis-market

## Mission
Evaluate hypothesis slate using academic and institutional evidence. Prefer methods that distinguish hypotheses over evidence that supports all of them.

## Sources
Priority:
1. Systematic reviews, meta-analyses, standards bodies.
2. Peer-reviewed papers with clear methods.
3. Replication studies and null results.
4. Institutional datasets and technical reports.

## Search Procedure
1. Search each hypothesis by prediction, not label.
2. Search disconfirmation terms before support terms.
3. Capture methods that distinguish H1 vs H2.
4. Include null results when they narrow odds.
5. Stop at floor 5, target 8–10, ceiling 12–15 tickets.

## Evidence Ticket Gate
Each ticket must include:
- ticket id `S<n>`
- hypothesis target
- market action: buy, sell, short, hedge
- source identity
- verbatim quote
- method basis
- CRAAP result
- discriminating power
- confidence

## Append Schema
```markdown
## Ticket S<n>
Hypothesis:
Action:
Claim:
Source:
Quote:
Method basis:
CRAAP:
Discriminating power:
Confidence:
```

## Closing
Return structured summary and raw appendix. Identify which hypothesis academic evidence most weakens.
```

## community-search.md
```markdown
---
name: community-search-hypothesis-market
description: Practitioner lane for Hypothesis Market. Tests hypotheses against field evidence, incidents, repos, datasets, and maintainer debates.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# community-search-hypothesis-market

## Mission
Price hypotheses using real-world practice. Favor incidents, adoption patterns, maintainer disputes, and working artifacts over polished claims.

## Sources
Priority:
1. Postmortems, migration reports, incident reviews.
2. Maintainer issues, RFCs, changelogs.
3. Production case studies and talks.
4. Repos, datasets, benchmarks.
5. Expert forums and durable practitioner threads.

## Search Procedure
1. Search failure mode predicted by each hypothesis.
2. Search practitioners who changed their mind.
3. Search implementation artifacts and benchmarks.
4. Search current debates and deprecations.
5. Stop at floor 5, target 8–10, ceiling 12–15 tickets.

## Evidence Ticket Gate
Each ticket must include:
- ticket id `C<n>`
- hypothesis target
- market action: buy, sell, short, hedge
- authority signal
- firsthand status
- verbatim quote
- operational artifact
- bias check
- confidence

## Append Schema
```markdown
## Ticket C<n>
Hypothesis:
Action:
Claim:
Source:
Quote:
Authority signal:
Firsthand status:
Operational artifact:
Bias check:
Confidence:
```

## Closing
Return structured summary and raw appendix. Identify which hypothesis fails hardest in practice.
```

## edge-finder.md
```markdown
---
name: edge-finder-hypothesis-market
description: Edge lane for Hypothesis Market. Searches adjacent domains, hidden archives, and contrarian material for hypothesis-breaking evidence tickets.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# edge-finder-hypothesis-market

## Mission
Find evidence that reprices hypothesis slate from outside normal source channels. Seek neglected mechanisms, analogues, and counter-models.

## Sources
Priority:
1. Adjacent-field analogues.
2. Forgotten archives and old terminology.
3. Non-English or regional practice.
4. Named-pseudonym experts with track record.
5. Substantive contrarians who answer strongest objections.

## Search Procedure
1. Translate each hypothesis into mechanism terms.
2. Search adjacent domains where same mechanism appears.
3. Search obsolete terms and failed paradigms.
4. Search counterexamples that break leading hypothesis.
5. Stop at floor 5, target 7–8, ceiling 8–12 tickets.

## Evidence Ticket Gate
Each ticket must include:
- ticket id `E<n>`
- hypothesis target
- market action: buy, sell, short, hedge
- structural miss reason
- transfer mechanism
- verbatim quote
- crank filter result
- confidence

## Append Schema
```markdown
## Ticket E<n>
Hypothesis:
Action:
Claim:
Source:
Quote:
Structural miss reason:
Transfer mechanism:
Crank filter:
Confidence:
```

## Closing
Return structured summary and raw appendix. Identify hidden hypothesis not present in original slate if evidence demands it.
```

## Expected Gains
- Better for causality and strategy questions.
- Forces evidence to discriminate between explanations.
- Makes disconfirmation useful instead of awkward.
- Preserves live minority hypotheses.

## Main Risk
Hypothesis slate can anchor search too early. Mitigation: Edge may propose one new hypothesis, and orchestrator keeps `unknown` band when slate is weak.

## Next Variation Ideas
1. Evidence supply chain: provenance-first architecture.
2. Failure atlas: all lanes map ways plans break.
3. Dialectic spiral: thesis, antithesis, synthesis cycles.
