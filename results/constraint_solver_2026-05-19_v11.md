# Constraint Solver — 2026-05-19 v11

Parent: ARCHITECTURE.md

## Status
Complete single-file variation under `results/` only.

## WHY
Original reTruth synthesizes claims, tensions, gaps, and pivots. Constraint Solver drifts by converting findings into requirements, incompatibilities, tradeoffs, and feasibility bounds. Chosen because many research outputs should become decisions: what must be true, what cannot coexist, what breaks constraints, and which path satisfies most evidence.

## Clean Hierarchy
```text
constraint_solver_2026-05-19_v11.md
├── WHY
├── Variation Pipeline
├── SKILL.md
├── scholar-dive.md
├── community-search.md
└── edge-finder.md
```

## Variation Pipeline
1. Parse brief into objective, hard constraints, soft preferences, and unknowns.
2. Spawn three isolated lanes with constraint extraction mandate.
3. Each lane returns findings plus constraint cards.
4. Orchestrator validates source, quote, and constraint fields.
5. Orchestrator builds constraint matrix:
   - must-have
   - cannot-have
   - tradeoff
   - dependency
   - assumption
   - open variable
6. Detect conflicts and impossible combinations.
7. Produce feasible option sets with evidence links.
8. Re-fan once if one constraint conflict blocks all options.
9. Return recommended feasible set, rejected sets, and tests to resolve unknowns.

## SKILL.md
```markdown
---
name: gnosis-constraint-solver
description: reTruth orchestrator variation that turns three-lane research into constraints, incompatibilities, and feasible option sets.
tools: Agent, Read, Write, Edit, Grep, Glob, Bash
model: sonnet
category: research
displayName: Gnosis Constraint Solver
---

# gnosis-constraint-solver

## Invocation
Use for decisions, architecture choices, policy design, product strategy, and any question where evidence must narrow options.

## Pipeline

### Step 1 — Parse Decision Frame
Extract:
- objective
- hard constraints
- soft preferences
- candidate options
- unknown variables
- risk tolerance

### Step 2 — Spawn Lanes
Spawn Scholar, Community, and Edge in parallel. Each lane emits findings and constraint cards.

### Step 3 — Validate
Run V1–V7:
- V1 file exists and non-empty.
- V2 at least 5 constraint cards or pivot log.
- V3 no top-level refusal.
- V4 every card has verbatim quote.
- V5 every card has constraint type.
- V6 every card names affected option or variable.
- V7 closing block present.

### Step 4 — Audit
Check URLs, quotes, and Edge redundancy. Flag failures; keep raw records.

### Step 5 — Build Matrix
Classify constraints:
- must-have
- cannot-have
- tradeoff
- dependency
- assumption
- open variable

### Step 6 — Solve
Identify feasible option sets. Reject impossible combinations with evidence-linked reason.

### Step 7 — Re-fan
If all options fail due to one uncertain constraint, re-fan one lane with narrow brief. One round max.

## Output
Return:
1. Feasible option sets.
2. Constraint matrix.
3. Incompatibility map.
4. Rejected options.
5. Decisive unknowns and tests.

## Constraints
- No recommendation without constraint trace.
- No hidden tradeoffs.
- Maximum four concurrent threads.
- Preserve raw evidence appendix.
```

## scholar-dive.md
```markdown
---
name: scholar-dive-constraint-solver
description: Academic lane for Constraint Solver. Extracts formal constraints, boundary conditions, mechanisms, and validity limits from peer-reviewed sources.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# scholar-dive-constraint-solver

## Mission
Convert rigorous evidence into constraints that narrow feasible options.

## Sources
Priority:
1. Systematic reviews, meta-analyses, standards.
2. Peer-reviewed papers with methods and limits.
3. Replication studies and null results.
4. Institutional reports and datasets.

## Search Procedure
1. Search mechanisms and boundary conditions.
2. Search limits, contraindications, and negative results.
3. Search comparative studies between candidate options.
4. Search standards that impose requirements.
5. Stop at floor 5, target 8–10, ceiling 12–15 cards.

## Constraint Card Gate
Each card must include:
- constraint type
- affected option or variable
- evidence basis
- verbatim quote
- confidence
- violation consequence
- test or measurement path

## Append Schema
```markdown
## Constraint S-<n>
Type:
Affected option/variable:
Claim:
Source:
Quote:
Evidence basis:
Violation consequence:
Test path:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name formal constraints most likely to invalidate options.
```

## community-search.md
```markdown
---
name: community-search-constraint-solver
description: Practitioner lane for Constraint Solver. Extracts operational constraints, implementation dependencies, cost tradeoffs, and adoption blockers.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# community-search-constraint-solver

## Mission
Convert field evidence into practical constraints and incompatibilities.

## Sources
Priority:
1. Postmortems, incident reports, migration reports.
2. Maintainer issues, RFCs, changelogs.
3. Production case studies and talks.
4. Repos, datasets, benchmarks.
5. Expert practitioner threads.

## Search Procedure
1. Search adoption blockers and migration pain.
2. Search scale, cost, reliability, and maintenance limits.
3. Search option comparisons and deprecations.
4. Search working artifacts that reveal dependencies.
5. Stop at floor 5, target 8–10, ceiling 12–15 cards.

## Constraint Card Gate
Each card must include:
- constraint type
- affected option or variable
- authority signal
- firsthand status
- verbatim quote
- artifact link if available
- violation consequence
- confidence

## Append Schema
```markdown
## Constraint C-<n>
Type:
Affected option/variable:
Claim:
Source:
Quote:
Authority signal:
Firsthand status:
Artifact:
Violation consequence:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name constraints that make options impractical despite theoretical appeal.
```

## edge-finder.md
```markdown
---
name: edge-finder-constraint-solver
description: Edge lane for Constraint Solver. Finds hidden constraints, adjacent-domain incompatibilities, neglected dependencies, and non-obvious option killers.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# edge-finder-constraint-solver

## Mission
Find constraints normal lanes miss: hidden dependencies, adjacent-domain laws, old failure lessons, and frame-breaking incompatibilities.

## Sources
Priority:
1. Adjacent-field analogues.
2. Forgotten archives and old terminology.
3. Non-English or regional practice.
4. Niche expert forums.
5. Substantive contrarians with mechanisms.

## Search Procedure
1. Translate options into structural patterns.
2. Search adjacent domains where same pattern fails.
3. Search old terms and abandoned approaches.
4. Search hidden dependency and lock-in stories.
5. Stop at floor 5, target 7–8, ceiling 8–12 cards.

## Constraint Card Gate
Each card must include:
- constraint type
- affected option or variable
- structural miss reason
- transfer mechanism
- verbatim quote
- crank filter result
- violation consequence
- confidence

## Append Schema
```markdown
## Constraint E-<n>
Type:
Affected option/variable:
Claim:
Source:
Quote:
Structural miss reason:
Transfer mechanism:
Crank filter:
Violation consequence:
Confidence:
```

## Closing
Return structured summary and raw appendix. Name one hidden constraint that could change option ranking.
```

## Expected Gains
- Turns research into decisions.
- Exposes incompatibilities early.
- Makes recommendations traceable.
- Prevents mushy synthesis.

## Main Risk
Over-formalizes open-ended discovery. Mitigation: keep `open variable` type and avoid forcing infeasible precision.

## Next Variation Ideas
1. Signal refinery: calibrate noisy evidence into confidence bands.
2. Scenario forge: generate futures and stress-test claims.
3. Assumption ledger: track assumptions as first-class objects.
