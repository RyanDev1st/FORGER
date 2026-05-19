# consensus-court

Search-first orchestrator for reTruth using court-style adjudication. Lanes return findings plus argument briefs, then orchestrator rules on consensus, split verdicts, and unresolved questions.

## Invocation

- `/consensus-court <topic>` uses standard effort.
- `/consensus-court high <topic>` expands conflict analysis and re-fan threshold.

## Core drift

Original reTruth preserves consensus counts during synthesis. Consensus Court turns that into explicit adjudication. Evidence is grouped into claims under review, then judged by lane agreement quality, source strength, uncertainty, and contradiction.

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
- likely contested claims
- likely decision points

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  docket.md
  scholar.md
  community.md
  edge.md
  briefs/
    scholar-brief.md
    community-brief.md
    edge-brief.md
  verdicts.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Write docket

Write `docket.md` before spawning lanes:

```markdown
## Claims under review
1. <likely central claim>
2. <likely contested claim>
3. <likely mechanism claim>
4. <likely risk or counterexample claim>
```

Docket is tentative. Lanes may add claims if evidence forces it.

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- lane mandate
- docket
- output path
- brief path
- effort

Each lane must run:
1. query planning
2. candidate retrieval
3. source selection
4. finding extraction
5. argument brief writing
6. uncertainty and conflict tagging

### Step 5 — Lane argument brief format

Every lane writes `briefs/<lane>-brief.md` with:

```markdown
## Lane brief: <lane>
- Strongest claim: <best-supported claim>
- Strongest evidence: <finding ids>
- Biggest uncertainty: <what remains weak>
- Most likely conflict with other lanes: <claim area>
- Claims that should survive synthesis: <ids>
- Claims that need adjudication: <ids>
- Claims best kept as weak signals: <ids>
```

### Step 6 — Orchestrator validation

Validate in order:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | at least 5 findings | repair or mark under-sourced |
| V3 | every finding has quote | mark unsupported |
| V4 | lane brief exists | retry brief only |
| V5 | uncertainty/conflict tags present | retry argument brief only |

### Step 7 — Court review

Write `verdicts.md` with sections:
- claims with broad consensus
- claims with partial consensus
- claims in direct conflict
- claims too weak to rule on
- strongest evidence by lane
- unresolved uncertainty

For each claim under review:
- which lanes support it
- which lanes resist it
- evidence rank
- verification flags
- ruling: `consensus | split-verdict | weak-signal | unresolved`
- why

### Step 8 — Verification audit

Check URL liveness, quote match, and claim-source alignment. Add flags to `verification.md` and propagate to verdicts.

### Step 9 — Synthesis

Synthesis structure:
1. claims court would rule robust
2. split verdicts and what drives disagreement
3. unresolved questions
4. weak signals appendix

Do not flatten conflict into fake certainty.

### Step 10 — Re-fan

Re-fan when:
- central claim ends unresolved
- conflict depends on missing source basket
- Edge raises high-value counterexample without enough support
- consensus claim relies on single lane too heavily

## Why this variation

Multi-agent systems often average outputs into bland certainty. Debate-style systems improve quality when disagreement is preserved and adjudicated instead of hidden. Consensus Court adapts that pattern into search-first reTruth: lanes gather evidence independently, then orchestrator acts like judge, not blender.
