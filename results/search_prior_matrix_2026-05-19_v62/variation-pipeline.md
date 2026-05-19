# Variation Pipeline — Search Prior Matrix v62

Parent: ARCHITECTURE.md

## Status

Generated variation v62.

## Scope

Search-first rewrite of gnosis. Keeps three lane outputs but delays lane identity until shared prior matrix exists.

## Pipeline

1. Parse brief into topic, domain, decision type, risk, effort.
2. Run broad web search before any lane spawns.
3. Build `prior-matrix.md` with quote-bearing claim seeds.
4. Tag uncertainty type: method, practice, frame, verification.
5. Route cells to Scholar, Community, Edge resolvers.
6. Lanes resolve assigned cells and may create justified new cells.
7. Audit URL liveness, quote match, cell coverage, and edge redundancy.
8. Synthesize by prior outcome: confirmed, weakened, reversed, new, unknown.

## Why this drift might work

Original gnosis protects divergence by isolating lanes. Search Prior Matrix protects against premature lane bias by making all lanes react to same first-pass evidence surface. It trades some isolation purity for stronger coverage accounting.

## Risks

- Shared prior matrix may reduce edge creativity.
- Bad initial search can bias all lanes.
- Matrix creation adds upfront cost.

## Mitigations

- Edge can create `new-cell` entries.
- Audit checks ignored high-priority cells.
- Synthesis preserves unknowns instead of forcing closure.

## Next

1. Compare against v61 on same topic.
2. If edge output becomes tame, add forced adjacent-field quota.
3. If matrix bloats, cap cells by value-of-information score.
