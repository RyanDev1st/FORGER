# Handoff Guardrail Swarm

Search-first reTruth variation using explicit lane handoffs and sequential guardrails. The orchestrator plans lane context before search, then sends failed guardrail feedback back to the same lane for targeted retry.

## Status

Complete v47 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, verification audit, validation gates, re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from AutoGen and CrewAI docs: planner-led multi-agent systems, targeted handoffs, handoff context, planning before iteration, sequential guardrails, and guardrail retry feedback.

## Core drift

Handoff Guardrail Swarm turns orchestration into explicit contracts. Each lane receives a handoff packet containing context, expected output, search routes, and guardrails. Validation is not a single final check; it is a sequential guardrail chain that returns precise retry instructions.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for research tasks where lane confusion, weak output format, or partial failures cause wasted re-runs. Best when you want targeted repair instead of restarting whole lanes.
