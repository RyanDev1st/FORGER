# Failure Budgeter — 2026-05-19 v29

Parent: ARCHITECTURE.md

## Status
Created v29 variation centered on explicit failure budgets, stop-loss triggers, and containment routes.

## Clean Hierarchy
```text
failure_budgeter_2026-05-19_v29/
├── README.md
├── SKILL.md
├── scholar-dive.md
├── community-search.md
├── edge-finder.md
└── variation-pipeline.md
```

## WHY
Original reTruth can identify risks and gaps, but action often requires deciding how much uncertainty or failure is acceptable. Failure Budgeter drifts by converting downside evidence into explicit budgets: severity, detectability, warning thresholds, stop-loss triggers, and rollback paths.

Chosen because many real decisions should not be framed as “safe or unsafe” but “safe under what guardrails, with what budget, and when do we stop?”

## Files
- `SKILL.md` — orchestrator that builds failure budget before go/no-go judgment.
- `scholar-dive.md` — academic lane for adverse outcomes, risk estimates, severity, and mitigation evidence.
- `community-search.md` — practitioner lane for incidents, blast radius, warning signs, rollback, and guardrails.
- `edge-finder.md` — edge lane for tail risks, hidden coupling, old disaster patterns, and adjacent containment methods.
- `variation-pipeline.md` — pipeline, expected gains, risks, and next variations.
