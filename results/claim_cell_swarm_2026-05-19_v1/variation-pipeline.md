# Variation Pipeline — Claim-Cell Swarm

Parent: ARCHITECTURE.md

## Status
Created v1 variation focused on claim-level evidence handling.

## Scope
This folder contains rewritten versions of:
- `SKILL.md`
- `scholar-dive.md`
- `community-search.md`
- `edge-finder.md`

## Pipeline
1. Parse prompt into research lens and boundaries.
2. Spawn three lane agents in isolation.
3. Force each lane to emit atomic claim cells.
4. Validate cells before synthesis.
5. Merge cells by claim identity.
6. Build contradiction map.
7. Re-fan only unresolved high-value contradictions.
8. Return synthesis plus raw appendices.

## Why Chosen
Source-lane output can become three parallel reports. Claim cells create common currency across lanes. This makes synthesis sharper: consensus becomes counted support, contradictions become objects to test, and fringe material gets judged by transfer mechanism rather than novelty vibe.

## Expected Benefit
- Better audit trail.
- Cleaner contradiction handling.
- Easier future memory/indexing.
- Less risk of redundant synthesis.

## Risk
Atomic claim format may feel rigid for exploratory topics. Mitigation: allow five claim types and keep raw appendices intact.

## Next
1. Test on one broad research prompt.
2. Compare contradiction density against original gnosis.
3. Iterate v2 toward temporal or adversarial synthesis if needed.
