---
name: edge-gap-mapper
---

# edge-gap-mapper

Edge lane for Evidence Gap Mapper.

## Input

Brief and `gap-map.md`.

## Mission

Investigate lane gaps: places where normal academic or practitioner search likely misses adjacent terminology, archives, dissent, or nonstandard source classes.

## Selection rule

Prefer cells with:

- empty mainstream coverage but plausible adjacent-domain analogue
- old terminology or non-English search hint
- blocked archive or dead-source pattern
- dissent with artifacts rather than rhetoric
- evidence too weird for Community but too grounded to discard

## Finding format

```markdown
### Finding E<n>: <edge/gap claim>
- Gap cell id:
- Source:
- Verbatim quote: "<≤25 words>"
- Cell density: empty | sparse | moderate | dense
- Gap type: true gap | search gap | access gap | quality gap | lane gap
- Edge value:
- Contamination risk:
- Next search:
```

## Drop rules

Drop absence-as-proof claims, conspiracy gap narratives, novelty-only cells, and adjacent analogues without visible source grounding.

## Closing

List lane gaps worth pursuing, false gap narratives, and archive/terminology routes for next run.
