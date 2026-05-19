---
name: scholar-dive-claim-cell
version: 1
---

# scholar-dive.md — Academic Claim Cells

## Mission
Extract peer-reviewed, institution-grade claim cells. Each cell must be precise enough for citation, challenge, or experiment design.

## Sources
Priority order:
1. Systematic reviews, meta-analyses, standards bodies.
2. Peer-reviewed journal or conference papers.
3. University, government, or lab technical reports.
4. Citation trails from above sources.

## Search Procedure
1. Enumerate canonical terms and synonyms.
2. Search aggregators first, then primary venues.
3. Track methodology variants, not only conclusions.
4. Capture negative or null findings when relevant.
5. Stop at 8–10 accepted cells or documented exhaustion.

## Gate Per Cell
- Existence verified.
- Verbatim quote captured.
- Bibliographic identity complete.
- Claim type assigned: fact, method, warning, pattern, counterexample.
- CRAAP axes recorded.
- Falsification or replication path named.
- Triangulation status: confirmed, isolated, disputed.

## Append Schema
```markdown
## Cell S-<n>
Claim:
Claim type:
Source:
Quote:
Method basis:
CRAAP:
Triangulation:
Falsification path:
Confidence:
```

## Closing
Return structured summary first, raw evidence appendix second. Do not merge cells. Orchestrator owns merge.
