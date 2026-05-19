# Variation Pipeline: Checkpoint Cascade

## Status

Complete v45 variation package.

## Source basis

- Original reTruth architecture: isolated three-lane fan-out, append-only lane files, validation gate, verification audit, re-fan on gaps.
- Current skill files: `SKILL.md`, `scholar-dive.md`, `community-search.md`, `edge-finder.md`.
- Current best-practice research: LangGraph-style durable execution uses checkpointers, retry policies, human-interruptable state, and resumable thread ids; citation workflows preserve source nodes before synthesis.

## Core drift

Checkpoint Cascade treats research as a stateful graph rather than a single subagent run. Each lane writes explicit checkpoints after planning, candidate retrieval, selection, extraction, verification notes, and closing. Search stays first because no lane may browse before `C1_query_plan` exists.

## Pipeline

1. Parse brief into topic, lens, output decision, domain, effort, risk flags, exclusions.
2. Create workspace with lane files plus `checkpoints/*.jsonl`.
3. Spawn lanes for query planning. Require `C1_query_plan` before browsing.
4. Run retrieval phase. Lanes append `C2_source_candidates` and `C3_selected_sources`.
5. Run extraction phase. Lanes append findings tied to selected source ids.
6. Validate checkpoint order, source-id continuity, quotes, gaps, and closing blocks.
7. Verify URL status, quote match, orphan claims, duplicate source nodes, and checkpoint continuity.
8. Synthesize only verified findings, plus checkpoint health and retry targets.
9. Retry only failed phase instead of whole lane.

## Why this variation

Long-running research fails in messy ways: web fetches time out, a lane drifts, source selection happens before search planning, or one quote fails after many valid findings. Original reTruth can retry a lane, but it lacks a phase-level resume model. Checkpoint Cascade adds durable state without new code infrastructure by using JSONL checkpoints.

## Expected strengths

- Better crash resilience.
- Lower retry waste.
- Easier audit of search order.
- Stronger source-node provenance.
- More useful logs for repeated loop iterations.

## Tradeoffs

- More file output.
- More discipline required from lanes.
- Slightly slower first pass.
- Not ideal for tiny fact lookups.

## Best use

Use for high-effort topics, broad market scans, controversial areas, or any research likely to run across multiple loop iterations.
