Parent: ARCHITECTURE.md

# Variation Pipeline — After-Action Learning Loop v78

## Status

v78. Search-first, browser-read, lessons-loop gated.

## Scope

This variation adds an after-action review layer to reTruth so each run learns from its own intent, actual behavior, source failures, productive surprises, and next-run improvements.

## Pipeline

1. Search broad lead pool for evidence, working examples, failures, postmortems, retrospectives, and review methods.
2. Open candidates directly with `playwright-cli`; record final URL, visible title, and quote.
3. Build `aar-ledger.md` with source class, browser status, quote, intended outcome, actual outcome, difference, sustain item, improve/initiate item, next-iteration test, and route hint.
4. Before synthesis, log lane expectations and evidence thresholds.
5. After lane return, log findings, absences, blocked sources, dead links, mismatches, and drift.
6. Compare intended and actual outcomes; classify each difference.
7. Split lessons into sustain, improve, initiate, reject, or watch.
8. Convert every improve/initiate lesson into a next-run observable test.

## Audit checks

- Lesson requires intended-versus-actual comparison.
- Improvement requires evidence from current run.
- Every action has a next-iteration test.
- Blocked/dead/mismatched sources become source-access lessons.
- Productive surprises are preserved as optional drift seeds.

## Evidence

- Atlassian retrospective page was opened with `playwright-cli`; visible title confirmed the source.
- Atlassian text said retrospectives review the latest sprint and make improvements for future sprints.
- Atlassian text said teams celebrate what went well, discuss what did not go well, and determine improvements.
- Atlassian text said action items should have owners and deadlines.
- HBR Learning in the Thick of It was opened with `playwright-cli`; visible title confirmed the source, but full extraction was limited.
- Wikipedia After-action review page was opened with `playwright-cli`; visible title confirmed the source.
- Wikipedia text said AAR analyzes intended outcome and actual outcome.
- Wikipedia text said AAR identifies practices to sustain and improve or initiate.
- Wikipedia text said changes are practiced at the next iteration.
- USAID AAR guidance returned 502 and was logged as blocked-source evidence.
- KnowledgeSuccess candidate returned page-not-found and was logged as dead/mismatch evidence.

## Next

1. Pair with Search Provenance Spine so run decisions become reviewable actions.
2. Add `after-action.md` as optional closing artifact for long gnosis runs.
3. Test on repeated topic runs to see whether next-iteration tests reduce repeated source failures.
