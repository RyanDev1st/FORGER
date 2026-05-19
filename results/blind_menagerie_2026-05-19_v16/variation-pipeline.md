# Variation Pipeline — Blind Menagerie

Parent: ARCHITECTURE.md

## Status
Created v16 variation centered on partial-brief divergence.

## Pipeline
1. Parse full brief into dimensions and likely framing biases.
2. Create three partial briefs.
3. Spawn isolated lanes without revealing withheld context.
4. Validate findings, quotes, and blindspot notes.
5. Audit links, quotes, and redundancy.
6. Reconcile blind outputs against full brief.
7. Promote surprises caused by partial framing.
8. Flag findings likely caused by missing context.
9. Re-fan one lane with revealed context if needed.

## WHY
Blind Menagerie improves reTruth by reducing shared assumption lock-in. It creates structural divergence at prompt level, not only source level.

## Difference From Original
Original architecture keeps lane mandates different but prompt brief same. Blind Menagerie makes prompt brief itself divergent while preserving final orchestrator reconciliation.

## Expected Benefit
- Less framing bias.
- More surprising findings.
- Stronger independent convergence signal.
- Better detection of prompt-induced blindspots.

## Tradeoff
Partial briefs can miss obvious context. Mitigation: final reconciliation and one revealed-context re-fan.
