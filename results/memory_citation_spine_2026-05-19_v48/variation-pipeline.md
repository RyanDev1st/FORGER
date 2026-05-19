# Variation Pipeline: Memory Citation Spine

## Status

Complete v48 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, verification audit, validation gates, re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from LangGraph and LlamaIndex docs: stateful agents, semantic memory retrieval, durable stores, agentic RAG, citation query engines, and granular citation nodes before synthesis.

## Core drift

Memory Citation Spine makes retrieval state a first-class artifact. Each lane writes a memory ledger before findings, then emits claim-sized citation nodes. Orchestrator synthesizes from nodes, while memory ledgers explain how search space was covered and where gaps remain.

## Pipeline

1. Parse brief into topic, lens, output goal, domain, effort, exclusions, and useful memory keys.
2. Create workspace with `memory/`, `spine/`, lane files, `audit.md`, `synthesis.md`, and `re-fan.md`.
3. Define shared memory schema for query, candidate, rejection, absence, pattern, and gap entries.
4. Spawn three lanes in parallel with memory path, citation-node path, findings path, and effort.
5. Each lane performs query planning and candidate retrieval before extracting findings.
6. Each lane appends retrieval memory: queries attempted, candidates considered, rejected sources, absences, patterns, and gaps.
7. Each lane selects sources and extracts findings with quote support.
8. Each lane emits atomic citation nodes with claim, lane, source, quote, support type, utility tag, confidence, and memory links.
9. Orchestrator validates lane memory ledgers before reading final findings.
10. Orchestrator validates citation nodes for quote, URL, support type, utility tag, and one-claim-per-node shape.
11. Orchestrator merges nodes into `spine/merged-citation-spine.md`, grouped by utility tag and preserving lane provenance.
12. Verification audit checks URL liveness, quote match, claim-source alignment, and Edge redundancy.
13. Synthesis uses verified nodes as evidence units and memory ledgers as coverage explanation.
14. Re-fan targets memory gaps, repeated rejection patterns, high-value absences, weak node support, or duplicate-heavy clusters.

## Why this variation

Long research runs often lose valuable context: which searches failed, which sources were rejected, and why a lane ended up with certain evidence. Memory Citation Spine preserves that context separately from polished findings. Citation nodes then keep synthesis grounded in small auditable units instead of bulky lane prose.

## Expected strengths

- Better resumability for long-running research.
- Stronger audit trail for search coverage.
- More precise re-fan targets.
- Cleaner synthesis from atomic evidence units.
- Easier duplicate detection across lanes.
- Better handling of important absences.

## Tradeoffs

- More artifacts per run.
- Higher writing overhead for lanes.
- Requires disciplined node granularity.
- Memory ledgers can become noisy if not compact.

## Best use

Use for broad, long-running, or evolving research tasks where search history matters. Especially good when negative evidence, rejected sources, and uncovered zones are decision-relevant.
