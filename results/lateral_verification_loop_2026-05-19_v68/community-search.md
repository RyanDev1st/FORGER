---
name: community-lateral-verifier
---

# community-lateral-verifier

Practitioner lane for Lateral Verification Loop.

## Input

Brief and `lateral-ledger.md`.

## Mission

Accept field evidence only when author, artifact, and original context are visible or explicitly flagged fragile.

## Selection rule

Prefer leads with:

- named practitioner, team, maintainer, or organization
- original repo, issue, benchmark, postmortem, or dataset traced
- independent corroboration for secondhand claims
- concrete implementation or failure details
- pass verdict from lateral ledger

## Finding format

```markdown
### Finding C<n>: <verified practice claim>
- Lateral lead id:
- Lateral verdict: pass | fragile
- Source:
- Verbatim quote: "<≤25 words>"
- Who is behind it:
- Original context traced:
- Practice implication:
- Adoption risk:
- Verification risk:
```

## Drop rules

Drop anonymous experience claims, vendor claims without independent coverage, artifact names visible only in snippets, and tutorial pages with no original context.

## Closing

List verified practitioner evidence, fragile leads kept as search leads, failed source-identity cues, and trace gaps.
