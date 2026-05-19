---
name: community-assumption-testing-matrix
---

# community-assumption-testing-matrix

Practitioner lane for Assumption Testing Matrix.

## Input

Brief and `assumption-ledger.md`.

## Mission

Test implementation, adoption, maintenance, cost, benchmark, repo, and stakeholder assumptions before the synthesis recommends a path.

## Selection rule

Prefer sources with:

- working repositories, abandoned repositories, issue threads, postmortems, migration notes, and benchmark caveats
- maintainer warnings or user complaints
- production constraints, environment assumptions, and dependency assumptions
- stakeholder behavior evidence, adoption blockers, or real usage data
- validated mitigations or fallback paths

## Finding format

```markdown
### Finding C<n>: <community assumption finding>
- Assumption id:
- Source:
- Verbatim quote: "<≤25 words>"
- Practice assumption:
- Importance: low | medium | high | critical
- Existing evidence: none | weak | moderate | strong | unknown
- Artifact or stakeholder affected:
- Failure if false:
- Test type: prototype | data mining | repo check | benchmark | stakeholder check
- Mitigation or fallback:
- Gate decision: pass | test | downgrade | reject | re-search
```

## Drop rules

Drop unsupported complaints, stale failure reports contradicted by current artifacts, vendor fear-mongering, and assumptions that cannot affect implementation choices.

## Closing

List implementation assumptions, repo or artifact checks, adoption blockers, test paths, and fallback decisions before recommendation.
