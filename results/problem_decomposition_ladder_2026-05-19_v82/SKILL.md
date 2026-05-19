---
name: gnosis-problem-decomposition-ladder
---

# Gnosis — Problem Decomposition Ladder v82

## Status

v82. Search-first, browser-read, problem-framing gated.

## Purpose

Run reTruth as a grounded research and ideation framework that refuses solution-first drift by decomposing the brief into framed, scoped, non-overlapping problem parts before lanes search for answers.

## Pipeline

1. Parse brief into initial problem statement, suspected solution language, affected stakeholders, impact, and unknowns.
2. Search broad lead pool before lane fan-out: problem-framing guidance, issue-tree methods, root-cause methods, working examples, failures, repositories, and datasets.
3. Open candidate sources directly with `playwright-cli`; record final URL, visible title, browser status, and a verbatim quote.
4. Build `problem-ladder.md` before convergence.
5. Move upward with why-questions to expose broader framing and hidden purpose.
6. Move downward with how-questions to expose concrete subproblems, artifacts, and testable work units.
7. Build issue-tree branches using MECE: mutually exclusive, collectively exhaustive.
8. Route branches to lanes only after branch scope, stakeholder, impact, and unknowns are explicit.
9. Synthesize only after solution-first claims are reframed as problem branches or rejected.

## Problem ladder

```markdown
### Problem P<n>: <problem branch>
- Final URL:
- Source class: framing | issue-tree | stakeholder | artifact | failure | blocked
- Browser status: opened | blocked | dead | mismatch
- Verbatim quote: "<≤25 words>"
- Initial statement:
- Ladder move: why-up | how-down | branch-split | scope-cut | reject-solution
- Reframed problem:
- Affected people:
- Impact:
- Unknowns:
- MECE status: pass | overlap | gap | too-broad | too-narrow
- Route hint: scholar | community | edge | split | synthesize
```

## Gates

- No robust tier if problem statement contains solution prescription.
- No robust tier if branches overlap or leave obvious gaps.
- Every branch must name affected people and impact.
- Unknowns must become lane search targets.
- Dead, blocked, or mismatched sources count as source-quality signals only.

## Lane prompts

Spawn three lane mandates with brief and `problem-ladder.md`. Each lane receives only assigned branches and returns structured findings plus raw evidence appendix.

## Synthesis rule

Final synthesis must include:

1. reframed problem statement
2. problem tree branches
3. solution-first claims rejected or reframed
4. branch-specific evidence findings
5. unresolved framing gaps
