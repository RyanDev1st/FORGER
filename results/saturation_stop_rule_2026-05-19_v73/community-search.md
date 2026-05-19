---
name: community-saturation-stop-rule
---

# community-saturation-stop-rule

Practitioner lane for Saturation Stop Rule.

## Input

Brief and `saturation-ledger.md`.

## Mission

Decide whether practitioner search is saturated or whether tool-version drift, environment mismatch, or missing operational detail requires further search or preserved uncertainty.

## Selection rule

Prefer rounds with:

- new operational details or first-hand implementation evidence
- repeated redundancy across independent practitioner sources
- stale docs or version-drift warnings
- benchmark or environment exhaustion
- blocked/dead applied sources that affect confidence

## Finding format

```markdown
### Finding C<n>: <practice saturation finding>
- Saturation round id:
- Source:
- Verbatim quote: "<≤25 words>"
- Practice claim:
- Saturation status: reached | not reached | blocked | uncertain
- Stop implication:
- Practice note:
```

## Drop rules

Drop saturation claims based on repo stars, snippet-only comparisons, one forum thread, or same-vendor repetition.

## Closing

List practitioner stop decisions, remaining implementation gaps, stale-source risks, and environment variables driving continued search.
