Parent: ARCHITECTURE.md

# Variation Pipeline — Search Provenance Spine v72

## Status

v72. Search-first, browser-read, audit-path preserving.

## Scope

This variation inserts a provenance spine before lane synthesis so meaningful search actions, inclusions, exclusions, mismatches, and route changes become first-class evidence.

## Pipeline

1. Search broad lead pool.
2. Open candidates directly with `playwright-cli`.
3. Record meaningful actions in `provenance-spine.md`.
4. Preserve query, interface, final URL, quote, decision, and reason for each non-trivial step.
5. Keep failed, blocked, mismatched, and rerouted steps instead of hiding them.
6. Route provenance-rich material by lane.
7. Audit whether another agent could reconstruct search path.
8. Synthesize findings plus path, exclusions, failures, and reproducibility gaps.

## Audit checks

- Search strategies or meaningful actions preserved exactly enough to reconstruct.
- Final URL captured after browser open.
- Exclusion and mismatch reasons logged, not implied.
- Reproduction depends on path evidence, not memory.

## Evidence

- Cochrane Chapter 4 indexed text said bibliographic search strategies should be copied and pasted exactly as run and in full, with search set numbers and records retrieved.
- Cochrane Chapter 4 indexed text said interfaces used for other sources should also be specified where possible.
- Cochrane Chapter 4 indexed text said methodical record keeping is needed because recreating the search post hoc can be nearly impossible.
- Cochrane Chapter 4 indexed text said review authors should examine previous reviews and check reference lists of included studies and relevant systematic reviews.
- Cochrane technical supplement was browser-opened, but extraction was thin, so it mainly supported supplement/reporting structure.
- PRISMA-S candidate resolved to unrelated PMC content, creating explicit source-mismatch evidence.

## Next

1. Test on topic where many candidates redirect or mismatch expectation.
2. Combine with citation chaining so provenance steps and anchor traversal stay linked.
3. Add severity labels for provenance failures that most threaten reproducibility.
