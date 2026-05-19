Parent: ARCHITECTURE.md

# Variation Pipeline — Contradiction Reconciliation Matrix v70

## Status

v70. Search-first, browser-read, contradiction-preserving.

## Scope

This variation inserts an explicit contradiction matrix before synthesis so disagreements are grouped, tested, routed, and either reconciled or preserved.

## Pipeline

1. Search broad lead pool for supportive, critical, null, failure, and contrarian leads.
2. Open candidates directly with `playwright-cli`; record final URL, visible quote, claim direction, and source context.
3. Build `contradiction-matrix.md` from browser-read conflicts.
4. Classify each conflict axis: method, population, timeframe, metric, context, interpretation, or source quality.
5. Test whether disagreement is caused by context mismatch, version drift, evidence-tier difference, retelling, or true unresolved conflict.
6. Route conflicts:
   - scholar = study design, certainty, evidence-quality disputes
   - community = implementation, migration, environment, and practitioner conflicts
   - edge = paradigm, analogy, and grounded contrarian tensions
7. Require every lane finding to cite contradiction ID and conflict status.
8. Synthesize into reconciled claims, context-dependent claims, unresolved contradictions, and false conflicts removed.

## Audit checks

- No disagreement collapsed without explanation.
- False conflicts marked when wording differs but substance matches.
- Better-supported side justified explicitly.
- Unresolved conflicts survive into final synthesis.

## Evidence

- Search-first user requirement carried forward.
- Cochrane Chapter 15 browser-read: visible text emphasized interpreting results, confidence intervals, statistical significance, certainty of evidence, and drawing conclusions.
- PRISMA checklist browser-read: extraction thin; used only as reporting-structure cue.
- ODAF candidate failed DNS; used as blocked-source reminder, not substantive evidence.
- Existing architecture and gnosis skill already require tensions/disagreements to remain visible rather than silently flattened.

## Next

1. Test this against topics with heavy disagreement but uneven evidence quality.
2. Combine with triangulation confidence tiers when contradictions survive reconciliation.
3. Measure whether contradiction IDs improve downstream auditability.
