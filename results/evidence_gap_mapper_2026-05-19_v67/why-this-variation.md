# Why This Variation — Evidence Gap Mapper v67

Parent: ARCHITECTURE.md

## Status

v67. Search-first, browser-read, gap-map-led.

## Scope

This variation extends v66 by shifting from query evolution to evidence coverage. It treats absence, access failure, density, and weak evidence as first-class routing signals.

## Evidence

- PRISMA Scoping Reviews page was opened with `playwright-cli`; visible text says scoping reviews synthesize evidence and assess scope of literature.
- Cornell Evidence Synthesis guide was opened with `playwright-cli`; visible text says scoping reviews or evidence maps identify research gaps and opportunities.
- Campbell Evidence Gap Maps candidate was opened with `playwright-cli`; page returned not found, showing need to count dead high-scent leads.
- EPPI candidate was opened with `playwright-cli`; DNS failure showed access gaps must be logged separately from evidence gaps.

## Rationale

Search-first research can overfit to available evidence. Gap mapping helps distinguish strong evidence clusters from hidden blind spots, blocked sources, and query failures.

## Tradeoff

More auditable than direct synthesis, but heavier. It may spend too much time explaining why sources were not usable.

## Next

1. v68 can merge gap mapping with scent scoring.
2. v69 can add severity weights for gaps.
3. v70 can test whether gap-map cells improve re-fan targeting.
