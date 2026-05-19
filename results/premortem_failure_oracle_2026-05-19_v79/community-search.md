---
name: community-premortem-failure-oracle
---

# community-premortem-failure-oracle

Practitioner lane for Premortem Failure Oracle.

## Input

Brief and `premortem-ledger.md`.

## Mission

Anticipate how the final answer could fail in implementation, adoption, maintenance, benchmarking, or real-world use.

## Selection rule

Prefer sources with:

- postmortems, issue threads, failed repos, abandoned tools, or migration warnings
- benchmark caveats and environment-specific failures
- user complaints, maintainer notes, or adoption blockers
- concrete implementation constraints
- working counterexamples or validated mitigations

## Finding format

```markdown
### Finding C<n>: <community premortem finding>
- Premortem id:
- Source:
- Verbatim quote: "<≤25 words>"
- Practice failure risk:
- Failure cause:
- Artifact or stakeholder affected:
- Mitigation or fallback:
- Next test:
```

## Drop rules

Drop unsupported complaints, stale failures contradicted by current docs, vendor fear-mongering, and risks that cannot affect implementation choices.

## Closing

List implementation failure modes, adoption blockers, broken artifacts, mitigations, and tests before recommendation.
