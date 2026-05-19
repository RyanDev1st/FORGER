# Variation Pipeline: Consensus Court

## Status

Complete v50 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, validation gates, verification audit, and re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from debate-style and judge-style agent systems: preserve disagreement, expose uncertainty, adjudicate evidence quality, and avoid flattening conflict into fake consensus.

## Core drift

Consensus Court turns synthesis into adjudication. Lanes still search independently, but they now return argument briefs, uncertainty, and conflict tags. Orchestrator rules on claims under review instead of simply blending findings.

## Pipeline

1. Parse brief into topic, lens, output goal, domain, effort, exclusions, likely contested claims, and decision points.
2. Create workspace with lane files, lane briefs, `docket.md`, `verdicts.md`, `verification.md`, `synthesis.md`, and `re-fan.md`.
3. Write tentative docket of claims under review before lane search begins.
4. Spawn scholar, community, and edge lanes in parallel with docket attached.
5. Each lane performs query planning, candidate retrieval, source selection, and finding extraction.
6. Each lane writes argument brief: strongest claim, strongest evidence, biggest uncertainty, likely conflict zones, and what should survive synthesis.
7. Each lane tags findings with docket claim, conflict risk, and consensus potential.
8. Orchestrator validates lane outputs and briefs.
9. Court review groups findings by claim under review.
10. For each claim, orchestrator records which lanes support, complicate, or dispute it.
11. Verification audit checks URL liveness, quote match, and claim-source alignment, then updates claim strength.
12. `verdicts.md` assigns ruling per claim: `consensus`, `split-verdict`, `weak-signal`, or `unresolved`.
13. Synthesis reports robust rulings first, then split verdicts, then unresolved questions, then weak-signal appendix.
14. Re-fan targets unresolved central claims, missing source baskets, or conflicts resting on weak evidence.

## Why this variation

Many multi-agent research systems preserve diversity during search, then erase it during synthesis. That loses valuable structure: which claims are truly robust, which are contested, and why disagreement exists. Consensus Court keeps disagreement visible and makes final answer more decision-useful by turning synthesis into explicit adjudication.

## Expected strengths

- Better handling of disagreement.
- Clearer uncertainty communication.
- Stronger distinction between robust and contested claims.
- Better use of Edge counterexamples.
- More honest synthesis for ambiguous topics.

## Tradeoffs

- More orchestrator reasoning overhead.
- Can feel heavy on easy topics.
- Depends on good claim grouping in docket.
- More documents to review.

## Best use

Use for strategic, contentious, or emerging topics where different evidence cultures disagree and user needs verdict structure, not flattened summary.
