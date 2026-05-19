---
name: community-citation-chaining-lattice
---

# community-citation-chaining-lattice

Practitioner lane for Citation Chaining Lattice.

## Input

Brief and `citation-lattice.md`.

## Mission

Use practitioner anchors to follow maintainer links, repo references, benchmark descendants, migration notes, and first-hand postmortems rather than flat keyword repetition.

## Selection rule

Prefer anchors or chain outputs with:

- maintainer-written docs or bylined implementation notes
- repo links, issue threads, benchmark references, or migration chains
- concrete tool/version context
- linked postmortems or update trails
- named practitioners and operational detail

## Finding format

```markdown
### Finding C<n>: <practice finding from citation chain>
- Anchor id:
- Chain direction: backward | forward | sibling
- Source:
- Verbatim quote: "<≤25 words>"
- Practice claim:
- Better-supported side: anchor | chain | depends
- Chain value:
- Practice note:
```

## Drop rules

Drop anonymous retellings, snippet-only echoes, repo stars as proof, and chain hops that only repeat same vendor or same benchmark family.

## Closing

List productive practitioner anchors, useful maintainer or repo trails, stale/dead chain branches, and environment terms learned from traversal.
