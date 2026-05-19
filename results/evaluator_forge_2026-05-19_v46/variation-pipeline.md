# Variation Pipeline: Evaluator Forge

## Status

Complete v46 variation package.

## Source basis

- Original reTruth architecture: three isolated lanes, verification audit, validation gates, re-fan behavior.
- Search-first requirement from user.
- Current best-practice patterns from Haystack and DSPy docs: modular search components, reusable pipelines, retrieval evaluation, and optimization against explicit metrics.

## Core drift

Evaluator Forge inserts metric-driven evaluation between retrieval and synthesis. Each lane must score itself before orchestrator accepts its findings. This makes weak retrieval obvious early.

## Pipeline

1. Parse brief into topic, lens, output goal, domain, effort, exclusions.
2. Write shared `metrics.md` rubric before any lane search.
3. Spawn three lanes in parallel with rubric attached.
4. Each lane performs query planning, candidate retrieval, source selection, and finding extraction.
5. Each lane scores retrieval breadth, source precision, quote strength, claim novelty, lane fit, and synthesis utility.
6. Any lane averaging below 2 runs repair pass targeted at weakest metric.
7. Orchestrator validates findings, quote presence, and evaluation table existence.
8. Cross-lane evaluation identifies duplicates, misclassifications, weak utility findings, and re-fan targets.
9. Verification audit checks links and quote matches.
10. Synthesis uses only adequately scored findings; weak signals move to appendix.

## Why this variation

Many research systems fail quietly: they retrieve shallow but plausible sources, then polish them into confident prose. Metric-first evaluation counters that. Instead of only asking “did lane finish?”, Evaluator Forge asks “was lane retrieval any good?” before answer gets synthesized.

## Expected strengths

- Better visibility into retrieval quality.
- Stronger gating against polished junk.
- Cleaner re-fan targeting.
- More decision-useful synthesis.
- Good fit for iterative improvement loops.

## Tradeoffs

- More overhead per lane.
- Self-scoring can be gamed if prompts weak.
- Slightly slower than plain search-first fan-out.

## Best use

Use for broad research, ambiguous strategic questions, and domains where low-quality web retrieval can look deceptively complete.
