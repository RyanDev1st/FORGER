Parent: ARCHITECTURE.md

# Variation Pipeline — Incentive Bias Ledger v74

## Status

v74. Search-first, browser-read, incentive-aware.

## Scope

This variation adds an incentive ledger before synthesis so source weighting accounts for funding, disclosure, beneficiary, and plausible bias pathway.

## Pipeline

1. Parse incentive risk, stakeholders, claim beneficiaries, harm domain, and advocacy/vendor pressure.
2. Search broad lead pool for supportive, critical, null, failure, and edge leads.
3. Open candidates directly with `playwright-cli`.
4. Build `incentive-ledger.md` with source class, claim direction, beneficiary, disclosure, funder role, incentive vector, bias pathway, and weight effect.
5. Assess how incentives could plausibly alter design, conduct, analysis, reporting, omission, or framing.
6. Route by lane:
   - scholar = funding, conflicts, trial/reporting bias, missing results
   - community = vendor docs, benchmarks, platform incentives, maintainer/product pressure
   - edge = contrarian incentives, audience capture, reputation markets, outsider stakes
7. Weight claims without auto-dropping conflicts.
8. Exclude only when incentive pathway is material and independent corroboration fails.
9. Synthesize retained, downgraded, excluded, and unknown-disclosure claims.

## Audit checks

- Incentive presence does not equal falsehood.
- Bias pathway must be named.
- Disclosure gaps are preserved.
- Self-serving claims need independent corroboration before robust tier.

## Evidence

- Cochrane Chapter 7 was browser-opened and visibly titled around bias and conflicts of interest among included studies.
- Cochrane Chapter 7 indexed text said conflicts can affect design, conduct, analysis, reporting, directness, heterogeneity, risk of bias, and missing results.
- Cochrane Chapter 7 indexed text discouraged adding conflicts directly to risk-of-bias assessment because effects can extend beyond individual trial estimates.
- Cochrane Chapter 7 indexed text said conflicts may affect non-publication of negative or unfavourable results.
- ICMJE indexed text said authors should disclose relationships and activities that might bias or be seen to bias work.
- ICMJE indexed text said articles should declare support sources, sponsor names, funder roles, restrictions, and data access.
- CRAAP guide candidate returned 404 and was treated as unstable support-source evidence.

## Next

1. Test on vendor-heavy topics with sponsored benchmarks.
2. Combine with contradiction matrix when incentive gradients explain disagreement.
3. Add lane-specific incentive vectors after empirical calibration.
