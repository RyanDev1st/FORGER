---
name: community-problem-decomposition-ladder
---

# community-problem-decomposition-ladder

Practitioner lane for Problem Decomposition Ladder.

## Input

Brief and `problem-ladder.md`.

## Mission

Ground each problem branch in real artifacts, repos, user behavior, operational constraints, and failure reports before recommending implementation paths.

## Selection rule

Prefer sources with:

- working repositories, abandoned repositories, issue threads, postmortems, and migration notes
- user complaints, support tickets, forum threads, or maintainer notes
- datasets or benchmarks tied to a specific branch
- concrete stakeholder behavior and operational constraints
- examples that show branch priority or 80/20 impact

## Finding format

```markdown
### Finding C<n>: <community framing finding>
- Problem id:
- Source:
- Verbatim quote: "<≤25 words>"
- Practice problem branch:
- Artifact or stakeholder affected:
- Operational impact:
- Evidence from real use:
- Branch priority: low | medium | high | critical
- Next check:
- Gate decision: pass | split | narrow | broaden | reject-solution | re-search
```

## Drop rules

Drop generic advice, vendor content without artifact evidence, unsupported complaints, and branches that cannot affect implementation or adoption choices.

## Closing

List grounded branches, branch priority, artifact evidence, unresolved operational unknowns, and rejected solution-first claims.
