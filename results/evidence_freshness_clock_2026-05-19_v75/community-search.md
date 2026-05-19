---
name: community-evidence-freshness-clock
---

# community-evidence-freshness-clock

Practitioner lane for Evidence Freshness Clock.

## Input

Brief and `freshness-clock.md`.

## Mission

Separate current operational practice from stale docs, deprecated tool versions, outdated benchmarks, and historical implementation lessons.

## Selection rule

Prefer sources with:

- visible update dates, release versions, or changelog links
- maintainer guidance on current behavior
- migration or deprecation evidence
- benchmark setup tied to current environment
- named practitioners and concrete implementation details

## Finding format

```markdown
### Finding C<n>: <practice freshness finding>
- Freshness id:
- Source:
- Verbatim quote: "<≤25 words>"
- Practice claim:
- Freshness status: current | aging | stale | historical | unknown
- Update signal:
- Decay risk:
- Practice note:
```

## Drop rules

Drop stale snippets, old issue-thread advice contradicted by current docs, and benchmarks with obsolete versions or missing environment context.

## Closing

List current practices, aging guidance, stale/deprecated sources, historical lessons, and version gaps requiring re-search.
