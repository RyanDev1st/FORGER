# Variation Pipeline — Evidence Gap Mapper v67

Parent: ARCHITECTURE.md

## Status

Generated variation v67 with search-first, browser-read, evidence-gap mapping.

## Scope

Adds map-first accounting for evidence density, true gaps, search gaps, access gaps, quality gaps, and lane gaps before synthesis.

## Evidence

Browser-checked sources:

1. PRISMA Scoping Reviews page: visible text says scoping reviews synthesize evidence and assess the scope of literature on a topic.
2. Cornell Evidence Synthesis guide: visible text says scoping reviews or evidence maps identify research gaps and opportunities for evidence synthesis.
3. Campbell Evidence Gap Maps candidate: opened with `playwright-cli`, returned page not found; logged as rejected-source/access evidence.
4. EPPI evidence-gap candidate: browser reported DNS resolution failure; logged as blocked-source/access evidence.

## Pipeline

1. Parse brief into evidence-map axes.
2. Search broad lead pool across academic, practitioner, edge, and gap-map sources.
3. Register every lead before opening.
4. Open candidates with `playwright-cli`.
5. Build `gap-map.md` cells with density, included sources, rejected/blocked sources, quote, and gap type.
6. Classify gaps as true, search, access, quality, or lane gaps.
7. Route cells: method gaps to Scholar, artifact/failure gaps to Community, lane/analogue gaps to Edge.
8. Require every lane finding to cite a gap-map cell and state whether it fills or confirms a gap.
9. Audit that empty cells have search evidence and that blocked/dead sources are counted.
10. Synthesize dense claims, sparse claims, true gaps, access/search gaps, and recommended next searches.

## Why this drift might work

A synthesis can be biased by what is easiest to find. Evidence Gap Mapper makes missingness visible and separates "no evidence" from "bad search" or "blocked access."

## Risks

- Gap maps can over-document absences and slow synthesis.
- Search gaps may be mistaken for true gaps.
- Dense low-quality cells can look more important than sparse high-quality cells.

## Mitigations

- Each empty cell must cite searched routes.
- Gap claims are separate from evidence claims.
- Quality gap classification prevents density from becoming authority.
- Edge lane handles lane gaps without treating absence as proof.

## Next

1. Add fixed axis templates by domain.
2. Add gap severity scoring.
3. Compare v67 against v64: does gap mapping improve rejected-source accounting or add too much bookkeeping?
