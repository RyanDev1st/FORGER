# Variation Pipeline — Assumption Ledger

Parent: ARCHITECTURE.md

## Status
Created v14 variation centered on assumption extraction and fragility mapping.

## Pipeline
1. Parse brief into claim, action context, and explicit assumptions.
2. Spawn three isolated lanes.
3. Force each lane to emit assumption cards.
4. Validate quote, assumption text, invalidation trigger, and impact if false.
5. Audit links, quotes, and redundancy.
6. Build assumption ledger by type.
7. Rank assumptions by fragility and impact.
8. Downgrade recommendations tied to fragile assumptions.
9. Re-fan one critical fragile assumption if needed.

## WHY
Assumption Ledger improves reTruth by turning hidden premises into inspectable objects. This makes recommendations safer and easier to monitor after delivery.

## Difference From Original
Original architecture captures evidence and gaps. Assumption Ledger captures conditions under which evidence stops applying.

## Expected Benefit
- Fewer hidden premises.
- Better action safety.
- Clear invalidation triggers.
- Useful monitoring plan.

## Tradeoff
Adds overhead and can feel repetitive. Best for action-oriented decisions, less needed for pure exploratory scans.
