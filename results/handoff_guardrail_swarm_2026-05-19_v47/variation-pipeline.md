# Variation Pipeline: Handoff Guardrail Swarm

## Status

Complete v47 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, verification audit, validation gates, re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from AutoGen and CrewAI docs: planner-led multi-agent systems, explicit handoffs, handoff context, planning before each iteration, sequential guardrails, and guardrail retries with feedback.

## Core drift

Handoff Guardrail Swarm makes every lane assignment explicit before search starts. The orchestrator writes handoff packets, then validates each lane through ordered guardrails. Failed checks return narrow feedback to the same lane rather than rerunning unrelated work.

## Pipeline

1. Parse brief into topic, lens, output goal, domain, effort, exclusions, and lane boundaries.
2. Create workspace with `brief.md`, `handoffs.md`, `guardrails.md`, lane files, `validation.md`, `synthesis.md`, and `retry-log.md`.
3. Write one handoff packet per lane: target, context, search routes, required source types, output contract, guardrails, retry budget.
4. Write shared sequential guardrail chain before spawning lanes.
5. Spawn scholar, community, and edge lanes in parallel with their handoff packets.
6. Each lane performs query planning, candidate retrieval, source selection, finding extraction, and guardrail self-check.
7. Orchestrator validates each lane in guardrail order.
8. First failed guardrail returns targeted retry feedback to the same lane.
9. Exhausted retry budget marks section `guardrail-failed` or `under-sourced` without deleting evidence.
10. Cross-lane review identifies duplicate claims, lane-boundary conflicts, weak utility findings, and missing handoff routes.
11. Verification audit checks URL liveness, quote match, and claim-source alignment.
12. Synthesis uses only findings that pass source fit, quote support, lane boundary, utility, and verification checks.
13. Failed or weak signals move to appendix with failure reason.
14. Re-fan targets the exact failed handoff route or repeated guardrail.

## Why this variation

Multi-agent research can fail because agents receive vague assignments, then validators report vague failures. Handoff Guardrail Swarm fixes both ends. Up front, each lane receives a compact contract. At the back, each failure has a named guardrail and retry instruction. This should reduce wasted reruns and make orchestration easier to audit.

## Expected strengths

- Better lane coordination.
- Clearer context passed to each subagent.
- Fewer full-lane reruns.
- Stronger validation trace.
- Better repair targeting.
- Cleaner audit trail for under-sourced outputs.

## Tradeoffs

- More orchestrator setup overhead.
- Guardrail chains can become too rigid if written poorly.
- Targeted retry may miss broader search flaws unless re-fan triggers catch them.
- More files and tables per run.

## Best use

Use for complex research where lanes often blur, output formats drift, or full retries are too expensive. Especially useful when final answer quality depends on knowing exactly which validation step failed.
