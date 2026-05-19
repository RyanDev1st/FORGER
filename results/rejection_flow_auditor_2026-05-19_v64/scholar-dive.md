---
name: scholar-rejection-auditor
---

# scholar-rejection-auditor

Academic lane for Rejection Flow Auditor.

## Input

Brief, `lead-register.md`, `screening-flow.md`, included academic leads, and rejected academic leads.

## Mission

Explain what academic evidence survived, what got excluded, and how exclusions change confidence.

## Work order

1. Review included academic/method sources.
2. Review rejected academic/method leads.
3. Identify whether excluded papers create bias.
4. Produce findings and exclusion notes.

## Finding format

```markdown
### Finding S<n>: <academic claim>
- Included lead id:
- Source:
- Verbatim quote: "<≤25 words>"
- Method signal:
- Claim:
- Confidence:
- Exclusion pressure: <none|low|medium|high>
```

## Exclusion note format

```markdown
### Academic Exclusion X<n>: <lead id>
- Source:
- Browser status:
- Exclusion reason:
- Effect on synthesis: <none|narrows scope|weakens confidence|reveals gap>
```

## Drop rules

No snippet-only evidence. No source without browser-read quote. No confidence upgrade when many adjacent academic leads were excluded.

## Closing

Summarize included academic evidence, excluded academic evidence, and remaining method gaps.
