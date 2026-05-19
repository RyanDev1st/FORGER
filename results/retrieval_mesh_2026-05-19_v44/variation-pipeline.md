# Variation Pipeline: Retrieval Mesh

## Status

Complete v44 variation package.

## Source basis

- Original architecture: isolated fan-out, three lanes, validation gate, quote audit, re-fan.
- Current skill set: `SKILL.md`, `scholar-dive.md`, `community-search.md`, `edge-finder.md`.
- Search-first best practice from current docs: plan research, delegate focused subagents, start broad, assess after each search, narrow to fill gaps, stop when enough evidence exists, consolidate citations, verify coverage.

## Core drift

Original reTruth emphasizes lane isolation and evidence quality gates. Retrieval Mesh adds a mandatory first pass: every lane maps search space before deep reading. Synthesis then sees not only findings, but missed zones and failed queries.

## Pipeline

1. Parse brief into topic, lens, decision, domain, effort, exclusions.
2. Create workspace with `brief.md`, `source-map.md`, lane files, `verification.md`, `synthesis.md`.
3. Spawn three lanes for source-map pass only.
4. Merge candidate URLs, dead ends, and missing zones into `source-map.md`.
5. Re-spawn lanes for deep-read pass using mapped candidates first.
6. Validate lane files for findings, quotes, claim structure, query ledger, and missing zones.
7. Verify cited URLs, quote matches, duplicate claims, and unsupported claims.
8. Synthesize with explicit source coverage and next-search moves.
9. Re-fan only when direct evidence is missing, conflict lacks arbiter, or floors fail.

## Why this variation

Search-first workflow attacks a weak point in agent research: early attractive sources can dominate synthesis before search space is known. By separating source mapping from evidence extraction, Retrieval Mesh makes ignorance visible. Failed queries and missing zones become first-class outputs, which improves trust and gives later loops better targets.

## Expected strengths

- Better coverage audit.
- Less premature convergence.
- Clearer evidence gaps.
- Easier re-fan targeting.
- Strong fit for broad or ambiguous topics.

## Tradeoffs

- Slower than one-pass fan-out.
- More metadata overhead.
- Requires strict lane discipline to avoid reading deeply during map pass.

## Best use

Use for topics where source availability matters as much as answer quality: emerging research, controversial claims, vendor-heavy domains, and broad strategy questions.
