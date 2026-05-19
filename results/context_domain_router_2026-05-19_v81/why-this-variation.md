Parent: ARCHITECTURE.md

# Why This Variation — Context Domain Router v81

## Status

v81. Search-first, browser-read, context-domain gated.

## Scope

This variation extends v80 by adding a domain classification layer. Instead of only testing assumptions, it first asks what kind of problem each claim lives in and whether the chosen response mode fits that domain.

## Evidence

- Cynefin Co page was opened with `playwright-cli`; visible title confirmed the source.
- Cynefin Co text said different situations require different responses.
- Cynefin Co text said actions need to match reality through sense-making.
- Cynefin Co text said leaders should not overthink routine problems or force complex problems into standard solutions.
- Untools Cynefin page was opened with `playwright-cli`; visible title confirmed source.
- Untools text said the framework divides situations into clear, complicated, complex, chaotic, and disorder.
- Untools text gave concrete response modes for each domain, including experiment-first for complex and act-first for chaotic.
- Farnam Street OODA page was opened with `playwright-cli`; visible title confirmed source.
- Farnam Street text said decisions should cycle through observe, orient, decide, and act.
- Farnam Street text said orientation means connecting with reality and recognizing bias barriers.

## Rationale

reTruth failure mode is not only weak evidence. It is wrong response mode. AI often gives best-practice advice to complex systems, expert analysis to routine questions, or long synthesis when problem really needs decomposition. Context Domain Router forces domain fit first.

This also matches user philosophy. Grounding should not just mean finding real sources; it should mean reading situation correctly before innovating. If a topic is clear, do not pretend it is complex. If it is complex, do not pretend one answer is enough. If it is chaotic, stabilize before analyzing. If it is disorder, split it up.

v81 pairs with v80 naturally. v80 asks whether hidden assumptions are tested. v81 asks whether problem domain is even being handled with right response mode. Together they reduce drift from both assumption error and context error.

## Tradeoff

Better fit-to-problem and less generic advice, but more classification overhead. The risk is overusing domain labels on simple tasks. Still worth it because this framework is built for grounded research, not quick vibes.

## Next

1. Pair with a source-confidence tier so domain fit and evidence strength both affect synthesis.
2. Pair with a decomposition router so disorder cases split into smaller researchable units.
3. Test on a mixed brief with one clear subproblem, one complex subproblem, and one disorder pocket.
