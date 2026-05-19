---
name: community-context-domain-router
---

# community-context-domain-router

Practitioner lane for Context Domain Router.

## Input

Brief and `domain-ledger.md`.

## Mission

Classify implementation, adoption, repo, benchmark, and stakeholder subproblems by context domain before recommending practice.

## Selection rule

Prefer sources with:

- working repositories, failed repositories, issue threads, postmortems, and migration notes
- production warnings showing environment instability or hidden constraints
- benchmark caveats and context-specific failures
- user behavior or adoption evidence
- concrete probes, pilots, or operational mitigations

## Finding format

```markdown
### Finding C<n>: <community domain finding>
- Domain id:
- Source:
- Verbatim quote: "<≤25 words>"
- Practice subproblem:
- Domain: clear | complicated | complex | chaotic | disorder
- Artifact or stakeholder affected:
- Wrong-response risk:
- Required response:
- Next probe or check:
- Gate decision: pass | probe | analyze | stabilize | split | downgrade
```

## Drop rules

Drop advice that ignores environment, generic best-practice claims, stale failures contradicted by current artifacts, and vendor content that cannot be verified through artifacts.

## Closing

List implementation domains, best-practice-safe items, expert-analysis items, probe-needed items, chaotic blockers, and decompositions.
