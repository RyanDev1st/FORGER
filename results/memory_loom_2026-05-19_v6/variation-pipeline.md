# Variation Pipeline — Memory Loom

Parent: ARCHITECTURE.md

## Status
Created v6 variation centered on append-only evidence lineage.

## Scope
This folder contains rewritten versions of:
- `SKILL.md`
- `scholar-dive.md`
- `community-search.md`
- `edge-finder.md`

## Pipeline
1. Parse prompt into topic, horizon, and stale assumptions.
2. Create lane files plus evidence ledger files.
3. Spawn three isolated lanes.
4. Convert each finding into ledger event form.
5. Validate lineage, relation, quote, and staleness metadata.
6. Audit links and redundancy.
7. Synthesize from event relations.
8. Re-fan only one critical open thread.
9. Return current synthesis and next-run brief.

## WHY
Memory Loom suits reTruth when knowledge should accumulate across runs instead of collapsing into isolated reports. It makes supersession visible, keeps stale claims from hiding, and gives later iterations something concrete to extend.

## Why Chosen
This drift leans hardest into `Operational State & Memory Management`. Original architecture already values incremental append; this version makes that the core product behavior.

## Expected Benefit
- Better longitudinal memory.
- Easier diffing between runs.
- Clearer supersession and contradiction tracking.
- Stronger re-use of prior evidence.

## Tradeoff
More structure, less freeform synthesis. Good for persistent domains, worse for quick ad hoc probes.
