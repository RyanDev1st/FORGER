Parent: ARCHITECTURE.md

# Why This Variation — Problem Decomposition Ladder v82

## Status

v82. Search-first, browser-read, problem-framing gated.

## Scope

This variation extends v81 by adding explicit problem decomposition before domain routing and lane search. It prevents solution-first drift by forcing the system to frame what is being solved before deciding how to research it.

## Evidence

- Untools issue trees page was opened with `playwright-cli`; visible title confirmed source.
- Untools text said issue trees provide a clear and systematic way of looking at a problem.
- Untools text said issue trees help break down a big problem into smaller, more manageable ones.
- Untools text said problem trees answer why and solution trees answer how.
- Untools text said a good issue tree should use the MECE principle.
- Untools abstraction laddering page was opened with `playwright-cli`; visible title confirmed source.
- Untools text said abstraction laddering helps define a problem more clearly and move beyond an initial problem statement.
- Untools text said why-questions move up the ladder and how-questions move toward concrete statements or solutions.
- NN/g problem statements page was opened with `playwright-cli`; visible title confirmed source.
- NN/g text warned that discoveries sometimes investigate solutions rather than the problems those solutions are meant to solve.
- NN/g text said a problem statement should describe the problem, affected people, and organizational impact.
- DesignKit and HBR candidates returned 404, reinforcing need to log access-quality and avoid relying on search snippets.

## Rationale

reTruth can still fail if it searches hard for answer to wrong problem. AI often treats user’s initial solution framing as truth, then builds plausible synthesis around it. Problem Decomposition Ladder forces the framework to ask why, how, who is affected, what impact exists, and whether branches cover the whole problem without overlap.

This matches user philosophy: learn what exists before adding spice. Here, learning starts with problem itself. If facial emotion recognition is framed as “pick best model,” AI may skip deeper branches: dataset validity, label quality, real deployment harm, consent, benchmark leakage, and whether emotion inference is valid at all.

v82 complements v81 and v80. v82 frames branches. v81 classifies branch domain. v80 tests assumptions. Together they form a stronger front-end before evidence synthesis.

## Tradeoff

Better problem fit and less solution drift, but more upfront framing cost. On simple tasks, decomposition may be overkill. On ambiguous research and ideation, it prevents days lost solving wrong problem.

## Next

1. Add branch-priority scoring based on impact, evidence availability, uncertainty, and reversibility.
2. Pair with Community repo checks to see which branches already have working artifacts.
3. Test against prompts that include hidden solution bias or overloaded multi-problem briefs.
