# Threshold Finder — 2026-05-19 v27

Parent: ARCHITECTURE.md

## Status
Created v27 variation centered on decision flip points, break-even lines, and measurable thresholds.

## Clean Hierarchy
```text
threshold_finder_2026-05-19_v27/
├── README.md
├── SKILL.md
├── scholar-dive.md
├── community-search.md
├── edge-finder.md
└── variation-pipeline.md
```

## WHY
Original reTruth can say which option or claim is stronger, but many practical answers are threshold-bound. Recommendation changes once scale, cost, latency, confidence, risk, time, or failure rate crosses a line. Threshold Finder drifts by making those flip points explicit.

Chosen because decision support often fails when it gives static advice without saying when the advice stops being true.

## Files
- `SKILL.md` — orchestrator that builds threshold table before recommendation.
- `scholar-dive.md` — academic lane for dose-response, nonlinear effects, sensitivity, and confidence bands.
- `community-search.md` — practitioner lane for scale, cost, latency, reliability, and maintenance breakpoints.
- `edge-finder.md` — edge lane for neglected tipping points, hidden constraints, and adjacent-domain thresholds.
- `variation-pipeline.md` — pipeline, expected gains, risks, and next variations.
