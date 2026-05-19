Parent: ARCHITECTURE.md

# Variation Pipeline — Premortem Failure Oracle v79

## Status

v79. Search-first, browser-read, failure-anticipation gated.

## Scope

This variation adds a premortem pass before convergence so reTruth searches for why its final recommendation may fail before presenting it as robust.

## Pipeline

1. Search broad lead pool for evidence, working examples, failure reports, dissent, risk guidance, and weak assumptions.
2. Open candidates directly with `playwright-cli`; record final URL, visible title, and quote.
3. Build `premortem-ledger.md` with assumed answer, imagined failure, failure cause, evidence supporting risk, evidence weakening risk, mitigation, and route hint.
4. Generate high-impact failure modes before synthesis finalization.
5. Route failure modes to lanes: Scholar for method/evidence failure, Community for implementation/adoption failure, Edge for blind spots and neglected dissent.
6. Search and browser-read at least one evidence lead per high-impact failure mode when possible.
7. Downgrade, reject, or mitigate any claim with unresolved high-impact risk.
8. Return remaining risks visibly instead of hiding them behind confidence language.

## Audit checks

- Failure mode must name a concrete cause.
- High-impact risks require search attempt or access-gap log.
- Evidence must support or weaken risk, not just mention it.
- Mitigation must change recommendation, search, or test plan.
- Unmitigated high-impact risks block robust tier.

## Evidence

- Atlassian premortem page was opened with `playwright-cli`; visible title confirmed the source.
- Atlassian text said premortems help prepare for every twist and turn before a project starts.
- Atlassian text asked teams to consider what could go wrong and what could go right.
- Atlassian text said quantitative data should be added to potential risks when available.
- HBR Project Premortem page was opened with `playwright-cli`; visible title confirmed the source.
- HBR text said projects fail at a spectacular rate.
- HBR text said people are often reluctant to speak up about reservations during planning.
- HBR text said making it safe for knowledgeable dissenters to speak up can improve a project’s chance.
- Asana premortem page was opened with `playwright-cli`; visible title confirmed updated 2025 source.
- Asana text said premortems ask teams to imagine a project has already failed so they can brainstorm honestly.
- Asana text said cross-functional partners can identify risks from different perspectives.

## Next

1. Pair with After-Action Learning Loop so imagined failures are checked against actual failures later.
2. Pair with Incentive Bias Ledger to surface failure modes caused by sponsor, vendor, or reputational incentives.
3. Test on a topic with attractive but fragile implementation claims.
