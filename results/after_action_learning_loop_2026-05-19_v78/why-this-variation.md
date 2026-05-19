Parent: ARCHITECTURE.md

# Why This Variation — After-Action Learning Loop v78

## Status

v78. Search-first, browser-read, lessons-loop gated.

## Scope

This variation extends v77 by making every run self-improving. It adds an after-action review loop that compares what reTruth intended to do with what actually happened.

## Evidence

- Atlassian retrospective page was opened with `playwright-cli`; visible title confirmed the source.
- Atlassian text said a sprint retrospective reviews the latest sprint and makes improvements for future sprints.
- Atlassian text said regular assessment and improvement leads to quality results and fewer obstacles.
- Atlassian text said teams should celebrate what went well, discuss what did not, and determine next improvements.
- Atlassian text said documented action items should have owners and deadlines.
- HBR Learning in the Thick of It was opened with `playwright-cli`; visible title confirmed the source, but accessible text was limited.
- Wikipedia After-action review page was opened with `playwright-cli`; visible title confirmed the source.
- Wikipedia text defined AAR as analyzing intended outcome and actual outcome.
- Wikipedia text said AAR identifies practices to sustain and improve or initiate.
- Wikipedia text said changes should be practiced at the next iteration.
- USAID AAR candidate returned 502 and became blocked-source evidence.
- KnowledgeSuccess AAR candidate returned page-not-found and became dead/mismatch evidence.

## Rationale

reTruth already logs source quality and lane output, but repeated autonomous research needs process learning. This variation prevents the system from making the same search, access, drift, and synthesis mistakes across runs.

It also supports the user’s goal of reliable creative grounding. Human mastery comes from practice plus feedback. After-Action Learning Loop gives the framework a practice loop: attempt, compare, preserve what worked, change what failed, and test the change next time.

## Tradeoff

Better compounding reliability and fewer repeated mistakes, but extra closing overhead. Most useful for repeated or high-stakes research, less useful for one-off quick scans.

## Next

1. Add optional `after-action.md` artifact for runs above a duration or source-count threshold.
2. Pair with Saturation Stop Rule to learn when stopping was premature.
3. Pair with Evidence Freshness Clock to review whether stale-source handling improved.
