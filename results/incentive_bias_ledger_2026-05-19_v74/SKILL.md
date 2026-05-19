---
name: incentive-bias-ledger
---

# incentive-bias-ledger

Search-first gnosis variation that tracks incentives, funding, disclosure, and outcome stakes before weighting evidence.

## Invocation

Use when sources may be shaped by financial, institutional, reputational, vendor, advocacy, or contrarian incentives.

## Core drift

Original gnosis filters source quality per lane. This variation adds an incentive-bias ledger before synthesis so claims are weighted by who benefits, what was disclosed, and how incentives could alter design, reporting, or omission.

## Evidence used for this variation

Browser-read and indexed sources:

- Cochrane Chapter 7 was opened with `playwright-cli`; visible page title confirmed focus on bias and conflicts of interest among included studies.
- Cochrane Chapter 7 indexed text said conflicts can affect design, conduct, analysis, reporting, directness, heterogeneity, risk of bias, and missing results.
- Cochrane Chapter 7 indexed text discouraged adding conflicts directly to risk-of-bias assessment because conflicts may affect more than individual trial estimates.
- Cochrane Chapter 7 indexed text said conflicts may affect decisions not to publish negative trials or unfavourable results.
- ICMJE indexed text said authors must disclose relationships and activities that might bias or be seen to bias work.
- ICMJE indexed text said articles should declare support sources, sponsor names, funder roles, restrictions, and data access.
- CRAAP guide candidate returned 404, showing generic credibility guides may be unstable support sources.

## Pipeline

### Step 1 — Parse incentive risk

Extract topic, likely stakeholders, who benefits from each claim direction, harm domain, vendor/industry exposure, and advocacy pressure.

### Step 2 — Search broad lead pool

Collect supportive, critical, null, failure, and edge-analogue leads.

### Step 3 — Browser-read candidates

Open candidates with `playwright-cli`. Capture final URL, title, quote, source class, disclosure/funding signals, and role of source in claim chain.

### Step 4 — Build `incentive-ledger.md`

```markdown
### Source I<n>: <source or claim cluster>
- Final URL:
- Source class:
- Browser status:
- Verbatim quote: "<≤25 words>"
- Claim direction:
- Beneficiary:
- Funding/support disclosed:
- Relationship/activity disclosed:
- Funder or platform role:
- Incentive vector: financial | institutional | reputational | vendor | advocacy | contrarian | unknown
- Bias pathway: design | conduct | analysis | reporting | omission | framing | none visible
- Weight effect: upgrade | neutral | downgrade | exclude
- Route hint: scholar | community | edge | re-check | discard
```

### Step 5 — Assess bias pathway

Separate incentives from proof of falsehood. Ask how incentives could plausibly affect:

- question framing
- source inclusion
- study or benchmark design
- analysis choices
- publication or omission
- interpretation and marketing

### Step 6 — Route by incentive type

- Scholar gets funding, author conflicts, trial/reporting bias, missing-results risk, and institutional synthesis conflicts.
- Community gets vendor docs, sponsored benchmarks, maintainer incentives, platform lock-in, consultancy incentives, and product marketing routes.
- Edge gets contrarian incentives, reputation markets, persecution framing, audience capture, and structurally grounded outsider claims.

### Step 7 — Weight claims

Do not auto-drop for incentives. Downgrade when incentive pathway plausibly affects claim; exclude when disclosure is absent, source is self-serving, and independent corroboration fails.

### Step 8 — Synthesis

Return:

1. Findings by lane.
2. Incentive vectors shaping evidence.
3. Claims downgraded or excluded due to bias pathway.
4. Claims retained despite incentives because independent evidence supports them.
5. Unknown-disclosure gaps.

## Why this variation

Search-first pipelines can verify whether sources exist but still underweight why sources say what they say. Incentive Bias Ledger keeps credibility tied to incentives, disclosures, and plausible bias pathways.
