# Signal Refinery — 2026-05-19 v12

Parent: ARCHITECTURE.md

## Status
Variation folder focused on confidence calibration and noisy evidence refinement.

## Scope
Contains rewritten:
- `SKILL.md`
- `scholar-dive.md`
- `community-search.md`
- `edge-finder.md`
- `variation-pipeline.md`

## WHY
Original reTruth filters low-quality evidence, then synthesizes accepted findings. Signal Refinery drifts by treating all surviving findings as noisy signals requiring calibration. It separates signal strength, source reliability, independence, actionability, and uncertainty. Chosen because many topics need calibrated confidence rather than more findings.

## Clean Hierarchy
```text
results/signal_refinery_2026-05-19_v12/
├── SKILL.md
├── scholar-dive.md
├── community-search.md
├── edge-finder.md
└── variation-pipeline.md
```
