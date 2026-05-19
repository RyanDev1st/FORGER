Parent: ARCHITECTURE.md

# Variation Pipeline — Assumption Testing Matrix v80

## Status

v80. Search-first, browser-read, riskiest-assumption gated.

## Scope

This variation adds an assumption-testing pass before convergence so reTruth does not recommend ideas that depend on critical but weakly evidenced assumptions.

## Pipeline

1. Search broad lead pool for methods, working examples, failures, repositories, datasets, stakeholder evidence, and assumption-testing guidance.
2. Open candidates directly with `playwright-cli`; record final URL, visible title, browser status, and quote.
3. Build `assumption-ledger.md` with assumption, importance, existing evidence, risk level, test type, evidence to collect, gate decision, and route hint.
4. Identify critical assumptions where success depends on belief rather than evidence.
5. Route assumptions to lanes: Scholar for method/evidence assumptions, Community for implementation/adoption assumptions, Edge for weird or neglected assumptions.
6. Search and browser-read at least one evidence lead per critical weak-evidence assumption when possible.
7. Match test type to assumption type: prototype for behavior, data mining for existing data, research spike for feasibility, repo check for implementation, source triangulation for claim reliability.
8. Downgrade, reject, re-search, or visibly preserve any unresolved critical assumption.

## Audit checks

- Assumption must be falsifiable.
- Importance and existing evidence must both be scored.
- Critical plus weak evidence requires a test path or downgrade.
- Evidence must directly support or weaken the assumption.
- Dead or blocked pages cannot be used as substantive evidence.
- Unresolved critical assumptions block robust tier.

## Evidence

- Product Talk assumption testing page was opened with `playwright-cli`; visible title confirmed the source.
- Product Talk text said regular cadence of assumption testing helps teams quickly determine which ideas will work and which will not.
- Product Talk text said assumption mapping evaluates how important an assumption is to success.
- Product Talk text said assumption mapping evaluates how much evidence already exists for the assumption.
- Product Talk text said riskiest assumptions are critical to success and have little evidence that they are safe.
- Product Talk text said the goal of assumption testing is to collect more evidence.
- Product Talk text listed prototype tests, one-question surveys, data mining, and research spikes as test types.
- Strategyzer library page was opened with `playwright-cli`; visible title confirmed a broad source about designing strategy, testing ideas, and building business models.
- Strategyzer, DesignKit, Leanstack, and NN/g targeted assumption-testing candidates returned Not Found or page mismatch, so they were treated as source-quality/access signals, not substantive support.

## Next

1. Pair with Premortem Failure Oracle so imagined failures become explicit assumptions to test.
2. Pair with Community lane repo checks so implementation assumptions are tested against working artifacts.
3. Add assumption severity scoring: importance, evidence, reversibility, test cost, and time-to-learn.
