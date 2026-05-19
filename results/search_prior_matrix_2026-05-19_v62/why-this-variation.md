# Why This Variation — Search Prior Matrix v62

Parent: ARCHITECTURE.md

## Status

v62 after existing `complexity_tree_router_2026-05-19_v61`.

## Scope

This version emphasizes search-first pipeline per user instruction while keeping output hierarchy compatible with existing results folders.

## Evidence

- ARCHITECTURE.md centers on fan-out lanes and post-spawn synthesis.
- User asked for wild drift and search-first info gathering.
- Existing v61 already explored route complexity; v62 shifts from complexity routing to uncertainty routing.

## Rationale

Search Prior Matrix makes discovery auditable before interpretation. Each lane inherits concrete uncertainty cells instead of abstract mandate. This can improve source coverage, reduce duplicated searching, and make synthesis easier to inspect.

## Tradeoff

Less pure independence. More coordination through shared source matrix.

## Next

1. Run one trial topic through v62.
2. Score against v61 on coverage, novelty, and synthesis clarity.
3. Mutate v63 toward forced edge-divergence if matrix makes outputs too conventional.
