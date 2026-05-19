# calibration-lattice

Search-first orchestrator for reTruth using calibrated confidence and attribution strength per finding. Goal: tie every claim to explicit evidence quality and movement conditions.

## Invocation

- `/calibration-lattice <topic>` uses standard effort.
- `/calibration-lattice high <topic>` increases evidence triangulation and calibration detail.

## Core drift

Original reTruth records confidence labels. Calibration Lattice turns confidence into structured explanation: evidence basis, attribution strength, uncertainty type, and update trigger. Synthesis can then separate robust claims from merely polished ones.

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
- likely uncertainty classes
- decisions sensitive to overconfidence

Write `brief.md`.

### Step 2 — Create workspace

```text
./reTruth/{slug}-{YYYY-MM-DD}/
  brief.md
  calibration-rubric.md
  scholar.md
  community.md
  edge.md
  calibration.md
  verification.md
  synthesis.md
  re-fan.md
```

### Step 3 — Write calibration rubric

Write `calibration-rubric.md`:

| Field | Meaning |
|---|---|
| confidence level | high / medium / low |
| attribution strength | direct / strong-indirect / weak-indirect |
| uncertainty type | source / scope / method / transfer / conflict |
| upgrade trigger | what evidence would raise confidence |
| downgrade trigger | what evidence would lower confidence |
| evidence breadth | single-source / multi-source / triangulated |

### Step 4 — Spawn lanes in parallel

Each lane receives:
- brief
- lane mandate
- calibration rubric
- output path
- effort

Each lane must run:
1. query planning
2. candidate retrieval
3. source selection
4. finding extraction
5. calibration pass
6. closing with uncertainty profile

### Step 5 — Lane finding schema

Every finding must include:

```markdown
### Finding <id>: <claim>
- Source id: <id>
- Source: <title> — <URL>
- Evidence quote: "<verbatim quote>"
- Confidence: <high|medium|low>
- Attribution strength: <direct|strong-indirect|weak-indirect>
- Uncertainty type: <source|scope|method|transfer|conflict>
- Evidence breadth: <single-source|multi-source|triangulated>
- Upgrade trigger: <what would raise confidence>
- Downgrade trigger: <what would lower confidence>
- Limits: <what remains uncertain>
```

### Step 6 — Orchestrator validation

Validate in order:

| Check | Pass rule | Fail action |
|---|---|---|
| V1 | lane file exists and non-empty | retry lane |
| V2 | at least 5 findings | repair or mark under-sourced |
| V3 | every finding has quote | mark unsupported |
| V4 | every finding has calibration fields | retry calibration only |
| V5 | uncertainty profile exists in closing | retry closeout only |

### Step 7 — Cross-lane calibration merge

Write `calibration.md`:
- strongest direct-attribution claims
- strongest triangulated claims
- highest-uncertainty but decision-relevant claims
- claims with conflicting calibration across lanes
- evidence gaps most likely to change answer

### Step 8 — Verification audit

Check URL liveness, quote match, and claim-source alignment. Update confidence tier when verification fails.

### Step 9 — Synthesis

Synthesis structure:
1. robust claims: direct or triangulated support
2. usable but uncertain claims: explain why
3. high-uncertainty claims worth watching
4. evidence gaps and upgrade paths

Do not present low-attribution claims as settled.

### Step 10 — Re-fan

Re-fan when:
- too many central claims remain weak-indirect
- decision-critical claim has only single-source support
- conflict uncertainty dominates synthesis
- one upgrade trigger could materially change answer

## Why this variation

Agentic research often reports confidence as style, not structure. Calibration Lattice makes confidence auditable by tying it to source grounding, breadth, and explicit update conditions. This should improve honesty and make synthesis more useful for real decisions.
