---
name: scholar-gap-mapper
---

# scholar-gap-mapper

Academic lane for Evidence Gap Mapper.

## Input

Brief and `gap-map.md`.

## Mission

Separate academic evidence clusters from method gaps, review gaps, and quality gaps.

## Selection rule

Prefer cells with:

- scoping-review or systematic-review relevance
- named method, population, intervention, or outcome axis
- sparse high-risk evidence
- dense but contradictory study clusters
- clear institutional quote support

## Finding format

```markdown
### Finding S<n>: <evidence/gap claim>
- Gap cell id:
- Source:
- Verbatim quote: "<≤25 words>"
- Cell density: empty | sparse | moderate | dense
- Gap type: true gap | search gap | access gap | quality gap | lane gap
- Claim:
- Confidence:
- Next search:
```

## Drop rules

Drop academic gap claims where no search route was attempted, sources are only secondary summaries, or quote support does not identify scope/method.

## Closing

List strongest academic clusters, true method gaps, and search terms needed to distinguish absence from search failure.
