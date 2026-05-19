Parent: ARCHITECTURE.md

# Why This Variation — Need-to-Knowledge Broker v77

## Status

v77. Search-first, browser-read, knowledge-broker gated.

## Scope

This variation extends v76 by turning grounded creativity into a transfer pipeline: need first, existing knowledge second, invention only when needed, stakeholder path before impact.

## Evidence

- RAMESES Project page was opened with `playwright-cli`; visible title confirmed the source.
- RAMESES page text said it contains publication/reporting standards, quality standards, resources, and training materials.
- Need to Knowledge article was opened with `playwright-cli`; visible title confirmed the source.
- Need to Knowledge text warned that supply-push models create technical answers in search of a market question.
- Need to Knowledge text said innovation projects may first look to publication databases and patent repositories.
- Need to Knowledge text said valid and reliable existing knowledge can bypass new research and save time and money.
- Need to Knowledge text said new research may be needed to reconcile conflicting findings or fill gaps.
- Need to Knowledge text referenced six key stakeholder groups for generating and transferring knowledge.
- Need to Knowledge text listed knowledge translation, technology transfer, and commercial transaction as transmission mechanisms.
- PMC mirror candidate returned reCAPTCHA, showing accessible-index and browser-read paths can diverge.

## Rationale

The user’s core failure case is AI inventing non-working solutions instead of learning grounded truth and working projects first. Need-to-Knowledge Broker attacks the cause: solution-first reasoning. It forces the orchestrator to ask whether there is a real need, whether existing knowledge already solves it, who must adopt it, and how it transfers into use.

This also fits reTruth as general research and ideation, not just coding. Many bad ideas fail because they start with technique rather than need, ignore reusable prior work, or skip the stakeholder path from knowledge to impact.

## Tradeoff

Better anti-supply-push discipline and stronger implementation realism, but more upfront bookkeeping around need statements, stakeholders, and transfer paths.

## Next

1. Add source-class defaults for patents, repositories, datasets, prototypes, and stakeholder evidence.
2. Combine with Evidence Freshness Clock so reusable existing knowledge is not stale.
3. Combine with Incentive Bias Ledger to detect when stakeholder or market evidence is sponsor-shaped.
