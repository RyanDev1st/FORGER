---
name: gnosis-assumption-testing-matrix
---

# Gnosis — Assumption Testing Matrix v80

## Status

v80. Search-first, browser-read, riskiest-assumption gated.

## Purpose

Run reTruth as a grounded research and ideation framework that identifies hidden assumptions before synthesis, ranks them by importance and evidence, and blocks robust claims until critical low-evidence assumptions are tested or downgraded.

## Pipeline

1. Parse brief into claim candidates, possible recommendations, stakeholder effects, and likely hidden assumptions.
2. Search broad lead pool before lane fan-out: methods, working examples, failures, repositories, datasets, stakeholder evidence, and assumption-testing guidance.
3. Open candidate sources directly with `playwright-cli`; record final URL, visible title, browser status, and a verbatim quote.
4. Build `assumption-ledger.md` before convergence.
5. Score each assumption by importance and existing evidence.
6. Route riskiest assumptions to lanes: Scholar for method and evidence assumptions, Community for implementation and adoption assumptions, Edge for weird, neglected, or socially uncomfortable assumptions.
7. Require search attempt for every critical assumption with weak or unknown evidence.
8. Synthesize only after critical assumptions are passed, tested, downgraded, rejected, or visibly preserved as risk.

## Assumption ledger

```markdown
### Assumption A<n>: <assumption>
- Final URL:
- Source class: evidence | test | artifact | behavior | data | blocked
- Browser status: opened | blocked | dead | mismatch
- Verbatim quote: "<≤25 words>"
- Assumption:
- Importance: low | medium | high | critical
- Existing evidence: none | weak | moderate | strong | unknown
- Risk level: low | medium | high | critical
- Test type: prototype | one-question survey | data mining | research spike | source triangulation | repo check
- Evidence to collect:
- Gate decision: pass | test | downgrade | reject | re-search
- Route hint: scholar | community | edge | synthesize
```

## Gates

- No robust tier if a critical assumption has weak, none, or unknown evidence and no test path.
- Assumptions must be written as falsifiable statements, not vague worries.
- Evidence must support or weaken the assumption directly.
- Dead, blocked, or mismatched sources count as access/source-quality signals only.
- Test type must match assumption kind: behavior needs behavior evidence, feasibility needs artifact or research-spike evidence, adoption needs stakeholder evidence.

## Lane prompts

Spawn the three lane mandates with the brief and `assumption-ledger.md`. Each lane returns structured findings plus raw evidence appendix.

## Synthesis rule

Final synthesis must include:

1. assumptions passed by evidence
2. assumptions requiring tests
3. assumptions downgraded or rejected
4. residual critical assumptions
5. recommendation changes caused by assumption testing
