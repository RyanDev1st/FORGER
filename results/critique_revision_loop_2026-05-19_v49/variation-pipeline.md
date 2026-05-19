# Variation Pipeline: Critique Revision Loop

## Status

Complete v49 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, verification audit, validation gates, anti-drift checkpoints, and re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from agentic research: retrieval before generation, self-critique, verifier passes, revise-after-critique loops, and preserving rejected evidence instead of hiding it.

## Core drift

Critique Revision Loop adds adversarial review inside each lane. Instead of trusting first-pass findings, lanes must attack every claim, record strongest failure case, then revise, demote, or drop evidence before orchestrator synthesis.

## Pipeline

1. Parse brief into topic, lens, output goal, domain, effort, exclusions, risk level, and false-positive traps.
2. Create workspace with lane files, critique files, `critique-rubric.md`, `revisions.md`, `verification.md`, and `synthesis.md`.
3. Write shared critique rubric before spawning lanes.
4. Spawn scholar, community, and edge lanes in parallel with critique rubric attached.
5. Each lane performs query planning, candidate retrieval, source selection, and finding extraction.
6. Each lane writes one critique entry per finding with strongest attack, evidence weakness, redundancy risk, misclassification risk, and revision action.
7. Each lane revises output: keep, revise, demote, or drop.
8. Orchestrator validates that every surviving finding has both quote support and critique record.
9. Revisions ledger collects kept, revised, demoted, and dropped findings, plus repeated critique patterns.
10. Verification audit checks URL liveness, quote match, and claim-source alignment.
11. Synthesis uses only findings that survive critique and verification.
12. Weak but interesting signals move to appendix with critique reason attached.
13. Re-fan targets repeated critique failures, especially source weakness, unclear falsification path, or lane collapse after critique.

## Why this variation

Search-first systems still fail when they retrieve superficially plausible sources and then overtrust them. Post-hoc verification catches some issues, but many semantic weaknesses are easiest to see where the lane still remembers why it chose the source. Critique Revision Loop pushes that attack phase down into the lane itself. Result should be fewer polished weak claims and better visibility into what got rejected.

## Expected strengths

- Stronger resistance to plausible junk.
- Better preservation of rejected-but-interesting ideas.
- More explicit reasons for confidence downgrades.
- Better synthesis filtering.
- Useful re-fan targeting from repeated critique patterns.

## Tradeoffs

- More overhead per finding.
- Critique quality depends on prompt sharpness.
- Weak lanes may over-demote and reduce coverage.
- More artifacts to review.

## Best use

Use for strategic, safety-relevant, or contentious topics where wrong-but-plausible evidence is especially costly.
