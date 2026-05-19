# Variation Pipeline: Calibration Lattice

## Status

Complete v51 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, validation gates, verification audit, and re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from agentic RAG and retrieval-quality work: explicit citation grounding, uncertainty estimation, attribution strength, and calibrated confidence linked to evidence quality.

## Core drift

Calibration Lattice surrounds each finding with structured uncertainty metadata. Every claim now carries confidence, attribution strength, uncertainty type, evidence breadth, and update triggers. This turns confidence from style into explicit evidence accounting.

## Pipeline

1. Parse brief into topic, lens, output goal, domain, effort, exclusions, likely uncertainty classes, and overconfidence-sensitive decisions.
2. Create workspace with lane files, `calibration-rubric.md`, `calibration.md`, `verification.md`, `synthesis.md`, and `re-fan.md`.
3. Write shared calibration rubric before spawning lanes.
4. Spawn scholar, community, and edge lanes in parallel with rubric attached.
5. Each lane performs query planning, candidate retrieval, source selection, and finding extraction.
6. Each lane calibrates every finding: confidence level, attribution strength, uncertainty type, evidence breadth, upgrade trigger, and downgrade trigger.
7. Orchestrator validates that all findings contain full calibration fields.
8. Cross-lane calibration merge identifies strongest direct claims, strongest triangulated claims, conflict-heavy claims, and highest-value evidence gaps.
9. Verification audit checks URL liveness, quote match, and claim-source alignment; failed checks downgrade confidence.
10. Synthesis separates robust claims from usable-but-uncertain claims and from watchlist signals.
11. Re-fan targets upgrade triggers most likely to change answer and central claims with weak-indirect support.

## Why this variation

Search-first systems often produce answers that sound calibrated without exposing why. That makes overconfidence hard to detect. Calibration Lattice fixes this by forcing each lane to expose confidence basis and movement conditions. User gets clearer picture of what is robust, what is conditional, and what evidence would change answer.

## Expected strengths

- More honest confidence reporting.
- Better distinction between direct and inferred support.
- Better handling of evidence-fragile topics.
- More targeted re-fan based on upgrade triggers.
- Better decision support under uncertainty.

## Tradeoffs

- More verbosity per finding.
- Calibration can become formulaic if prompts weak.
- Extra effort for low-stakes topics.
- Requires discipline to avoid fake precision.

## Best use

Use for ambiguous, emerging, or fast-moving topics where answer quality depends on knowing not just what seems true, but how firmly and why.
