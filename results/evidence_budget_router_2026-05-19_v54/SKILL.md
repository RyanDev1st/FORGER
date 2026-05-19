# evidence-budget-router

Search-first orchestrator for reTruth using adaptive evidence budgets and stop rules. Goal: spend retrieval effort where it changes answer most, not evenly or endlessly.

## Invocation

- `/evidence-budget-router <topic>` uses standard effort.
- `/evidence-budget-router high <topic>` increases budget units and adds one extra rebalance pass.

## Core drift

Original reTruth expands until enough findings and validation gates pass. Evidence Budget Router adds explicit search budgeting. Each lane allocates effort units across query families, rebalances based on yield and uncertainty, then stops by rule instead of intuition.

## Pipeline

### Step 1 — Parse brief

Extract:
- topic
- lens
- desired output
- domain
- effort: `standard|high`
- success criteria
- exclusion zones
- likely high-value unknowns
- likely low-yield zones

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  budget-plan.md
  scholar.md
  community.md
  edge.md
  budget-log.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Write shared budget schema

Write `budget-plan.md`:

| Field | Meaning |
|---|---|
| budget unit | one query family pass or one follow-up bundle |
| planned budget | initial units per lane |
| yield | useful findings per unit |
| uncertainty reduction | how much claim ambiguity dropped |
| stop rule | condition to stop spending |
| rebalance rule | when to move units elsewhere |
```

Initial budget suggestion:
- standard: 8 units per lane
- high: 12 units per lane

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- lane mandate
- budget schema
- output path
- budget log path
- effort

Each lane must run:
1. budget allocation
2. query planning by budget unit
3. candidate retrieval
4. yield review after each unit
5. rebalance if needed
6. source selection
7. finding extraction
8. stop-rule check before close

### Step 5 — Lane budget log schema

Every lane must append budget events:

```markdown
### Budget <lane><n>
- Unit: <n>
- Query family: <family>
- Spend reason: <why this unit>
- Yield: <high|medium|low|zero>
- Uncertainty reduction: <high|medium|low|none>
- Rebalance action: <keep|shift|stop>
- Notes: <what changed>
```

### Step 6 — Stop rules

Lane must stop when any hold:
- two consecutive zero-yield units in same route family
- central claims already triangulated and next unit unlikely to change answer
- only low-value marginal findings remain
- budget exhausted without compelling rebalance case

Lane may continue past initial plan only if one extra unit has high expected uncertainty reduction.

### Step 7 — Orchestrator validation

Validate in order:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | at least 5 findings or justified stop | allow under-sourced flag |
| V3 | every finding has quote | mark unsupported |
| V4 | budget log exists | retry budget closeout |
| V5 | stop reason recorded | retry closeout only |

### Step 8 — Cross-lane budget merge

Write `budget-log.md`:
- best-yield query families
- wasted units and why
- strongest uncertainty reduction per lane
- where extra budget would matter most
- where search should have stopped earlier

### Step 9 — Verification audit

Check URL liveness, quote match, and claim-source alignment. Failed verification can retroactively mark budget spend as low-value.

### Step 10 — Synthesis

Synthesis must include:
- strongest findings
- where budget was well spent
- unresolved claims due to budget limits
- zones intentionally stopped early
- highest-value next search if more budget granted

### Step 11 — Re-fan

Re-fan when:
- central claim unresolved but one lane shows high expected value for extra unit
- all lanes exhausted budget without triangulation
- wasted spend pattern reveals bad routing
- verification failure erased too much value from spent units

## Why this variation

Search-first systems can drift into endless retrieval or spend equal effort on unequal questions. Evidence Budget Router forces explicit prioritization and stopping behavior. This should improve efficiency, expose where more search is actually worth it, and reduce low-value wandering.
