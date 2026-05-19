# Memory Citation Spine

Search-first reTruth variation using lane-local memory ledgers and citation-node synthesis. Every lane stores compact retrieval memory before extraction, then final synthesis uses claim-sized citation nodes rather than whole findings.

## Status

Complete v48 variation package.

## Source basis

- Original reTruth architecture: isolated Scholar, Community, and Edge lanes with validation, verification audit, and re-fan.
- Search-first requirement from user.
- Current best-practice patterns from LangGraph and LlamaIndex docs: stateful agents, long-term memory retrieval, store/search over memories, agentic RAG, and citation-source nodes before synthesis.

## Core drift

Memory Citation Spine separates retrieval memory from final prose. Lanes first build searchable memory ledgers of queries, candidates, absences, and source judgments. Findings then become small citation nodes that the orchestrator can verify, rank, deduplicate, and synthesize with less context pollution.

## Files

- `SKILL.md` — orchestrator skill.
- `scholar-dive.md` — academic lane mandate.
- `community-search.md` — practitioner lane mandate.
- `edge-finder.md` — divergent lane mandate.
- `variation-pipeline.md` — pipeline and rationale.

## Best use

Use for long-running research, broad domains, or topics where prior search paths and absences matter as much as positive findings.
