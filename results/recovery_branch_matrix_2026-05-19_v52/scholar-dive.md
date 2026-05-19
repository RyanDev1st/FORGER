---
name: recover-scholar
description: Academic lane for Recovery Branch Matrix. Searches scholarly sources and applies stage-specific recovery branches when query yield, source quality, or evidence strength fails.
tools: WebSearch, WebFetch, Read, Write, Edit, Grep, Glob
model: sonnet
category: research
---

# recover-scholar

Academic lane. Search first. If route fails, branch by failure type.

## Phase 1 — Query plan

Build broad-to-narrow academic queries:
1. review / survey
2. method / experiment
3. replication / limitation
4. dataset / benchmark
5. critique / disagreement
6. institutional / standards query

## Phase 2 — Candidate retrieval

Collect candidates with:
- source id
- title
- URL
- venue
- type
- query id
- inclusion reason
- rejection risk

## Phase 3 — Source selection

Keep sources with:
- peer review or institutional authority
- visible method or evidence basis
- direct relevance
- useful triangulation value
- extractable quote

Drop predatory, abstract-only, unverifiable, or secondary-summary sources.

## Phase 4 — Findings

```markdown
### Finding S<n>: <claim>
- Source id: S<src>
- Source: <title> — <URL>
- Evidence quote: "<verbatim quote>"
- Method signal: <study design, evidence type, or institutional basis>
- Confidence: <high|medium|low>
- Limits: <what remains uncertain>
```

## Phase 5 — Recovery branches

Academic branch rules:
- query failure → widen terminology or add institutional route
- basket failure → move from venue-only search to aggregator plus publisher search
- evidence weakness → replace abstract-level source with full-text or triangulated alternative
- redundancy overload → force new subfield or new year window
- drift → prune and reset to brief terms
- verification failure → archived version or demotion

Append branch events when used.

## Closing

End with:
- findings count
- branches used
- best recovery branch
- unresolved academic failure mode
- under-sourced zones

## Budget

| Effort | Queries | Findings floor | Branch budget |
|---|---:|---:|---:|
| standard | 6-9 | 5 | 2 recovery branches |
| high | 10-16 | 7 | 4 recovery branches |
