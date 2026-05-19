Parent: ARCHITECTURE.md

# Variation Pipeline — Problem Decomposition Ladder v82

## Status

v82. Search-first, browser-read, problem-framing gated.

## Scope

This variation adds a problem-framing and decomposition pass before lane fan-out so reTruth searches from grounded problem branches instead of user-provided solution language.

## Pipeline

1. Search broad lead pool for problem-framing guidance, issue-tree methods, root-cause approaches, working examples, failures, repositories, and datasets.
2. Open candidates directly with `playwright-cli`; record final URL, visible title, browser status, and quote.
3. Build `problem-ladder.md` with initial statement, ladder move, reframed problem, affected people, impact, unknowns, MECE status, and route hint.
4. Move up with why-questions to expose broader purpose and hidden framing.
5. Move down with how-questions to expose concrete subproblems and testable work units.
6. Split branches with issue-tree discipline: mutually exclusive and collectively exhaustive.
7. Route branches to Scholar, Community, and Edge only after branch scope is explicit.
8. Reject or reframe solution-first claims before synthesis.

## Audit checks

- Problem statement must not prescribe a solution.
- Each branch must name affected people and impact.
- Branches must avoid overlap and obvious gaps.
- Unknowns must become lane search targets.
- Branch priority should use data or artifact evidence when available.
- Dead or mismatched pages cannot be substantive evidence.

## Evidence

- Untools issue trees page was opened with `playwright-cli`; visible title confirmed source.
- Untools text said issue trees are maps of problems that help break big problems into smaller manageable ones.
- Untools text said problem trees answer why and solution trees answer how.
- Untools text said a good issue tree must cover the whole problem and use MECE.
- Untools text defined mutually exclusive as no overlap and collectively exhaustive as covering the whole problem.
- Untools abstraction laddering page was opened with `playwright-cli`; visible title confirmed source.
- Untools text said abstraction laddering helps frame problems more skillfully and move beyond initial problem statements.
- Untools text said asking why moves to more abstract framing and asking how moves toward concrete statements or solutions.
- NN/g problem statements page was opened with `playwright-cli`; visible title confirmed source.
- NN/g text said some discoveries begin by investigating solutions rather than problems.
- NN/g text said if you do not know the problem, you will not have much luck solving it.
- NN/g text said problem statements should identify affected people and organizational impact.
- DesignKit How Might We and one HBR candidate returned 404, so they were treated as access/source-quality signals only.

## Next

1. Pair with Context Domain Router so each branch gets domain-appropriate response mode.
2. Pair with Assumption Testing Matrix so branch unknowns become testable assumptions.
3. Test on briefs that contain solution prescriptions masquerading as problems.
