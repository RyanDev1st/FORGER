---
name: gnosis-context-domain-router
---

# Gnosis — Context Domain Router v81

## Status

v81. Search-first, browser-read, context-domain gated.

## Purpose

Run reTruth as a grounded research and ideation framework that first classifies the problem context, then chooses lane behavior that matches reality instead of forcing every topic through one universal research pattern.

## Pipeline

1. Parse brief into question, decision pressure, stakeholder risk, time pressure, and uncertainty type.
2. Search broad lead pool before lane fan-out: domain guidance, working examples, failures, repositories, datasets, and decision-context frameworks.
3. Open candidate sources directly with `playwright-cli`; record final URL, visible title, browser status, and a verbatim quote.
4. Build `domain-ledger.md` before convergence.
5. Classify each claim or subproblem as clear, complicated, complex, chaotic, or disorder.
6. Route by domain: clear uses best-practice verification, complicated uses expert analysis, complex uses experiment/probe, chaotic uses stabilizing action and fast evidence, disorder splits into smaller domain-classified parts.
7. Spawn lane mandates with domain tags so each lane searches with correct response mode.
8. Synthesize only after domain mismatch risks are resolved or preserved.

## Domain ledger

```markdown
### Domain D<n>: <subproblem or claim cluster>
- Final URL:
- Source class: framework | evidence | artifact | failure | practitioner | blocked
- Browser status: opened | blocked | dead | mismatch
- Verbatim quote: "<≤25 words>"
- Subproblem:
- Domain: clear | complicated | complex | chaotic | disorder
- Why this domain:
- Wrong-response risk: overthinking routine | expert theater | premature best practice | no stabilizing action | unresolved disorder
- Required response: sense-categorize-respond | sense-analyze-respond | probe-sense-respond | act-sense-respond | decompose
- Route hint: scholar | community | edge | split | synthesize
```

## Gates

- No robust tier if a complex problem is treated as clear best practice.
- No robust tier if disorder remains undecomposed.
- Domain decision must cite a source or artifact signal, not vibes.
- Required response must match selected domain.
- Dead, blocked, or mismatched sources count as source-quality signals only.

## Lane prompts

Spawn three lane mandates with brief, `domain-ledger.md`, and domain tags. Each lane returns structured findings plus raw evidence appendix.

## Synthesis rule

Final synthesis must include:

1. domain-classified subproblems
2. claims downgraded due to domain mismatch
3. probes/tests needed for complex claims
4. stabilizing actions needed for chaotic claims
5. residual disorder requiring decomposition
