# Failure Hypothesis Template (GRILL phase)

This is the canonical shape of a single entry in `workspaces/{slug}/failure_hypotheses.yaml`. The file itself is a YAML list; each list item is one entry. Validate with `_lib/ledger.mjs::validateFailureHypothesis` (compiled from `schemas/failure_hypothesis.schema.yaml`). Fields below mirror the schema one-for-one.

---

## Required fields

```yaml
- id: fh-<short-slug>
  # Stable identifier for this hypothesis. Lowercase kebab-case. Used as
  # the cross-reference target from probes, acceptance tests, and the
  # grill_report.md summary. Pick a slug that describes the concern, not
  # a sequence number, so the report reads cleanly.

  hypothesis: |
    One-sentence statement of what could go wrong. Phrase it as a
    falsifiable claim, not as a worry. ("Pipeline backpressure regresses
    under burst load above 1 MB/s" beats "Backpressure might be a problem.")

  what_disproves: |
    The evidence that would convince you the hypothesis is wrong.
    Concrete and observable: a probe output, a benchmark measurement, a
    citation in the existing claim_ledger. If you cannot name what
    would disprove it, the hypothesis is not falsifiable and should be
    dropped or rewritten before it lands in the file.

  minimal_test: |
    The smallest test that would settle the hypothesis. Usually a
    single command (probe, benchmark, parse check) or a single
    acceptance test rather than a multi-step plan. The test surface
    that EXECUTE will run sits downstream of this field.

  severity_if_wrong: high
  # enum: low | medium | high | critical. The cost of being wrong about
  # this hypothesis (NOT the cost of the hypothesis itself). Gate 2 in
  # SKILL.md requires every entry with severity_if_wrong in {high,
  # critical} to resolve to accepted_test_added,
  # rejected_with_counter_evidence, or escalated by exit.

  confidence: 3
  # integer 0-5. How confident the reviewer is that the hypothesis is
  # real, not how worried the executor should be. A 5 means "I am
  # nearly certain this fails as described"; a 0 means "I cannot rule
  # it out but have no positive evidence."

  status: accepted_test_added
  # enum: open | accepted_test_added | rejected_with_counter_evidence |
  # escalated. open is only legal mid-resolution; gate 2 forbids any
  # open entry at GRILL exit.
```

## Reviewer-meta fields

```yaml
  reviewer_provider: anthropic
  # The provider string from _lib/reviewer_router.mjs adapters: one of
  # openai | google | anthropic | xai | mistral | qwen | glm | kimi |
  # deepseek (or subagent_fallback). Written by the orchestrator at
  # parse time from invokeReviewer's reviewer_meta.provider.

  reviewer_model: claude-opus-4-7
  # Free-form model identifier as returned by the adapter
  # (reviewer_meta.model). Used by RETAIN to learn which model
  # families catch which classes of failure.

  reviewer_tier: best
  # enum: best | good | acceptable | weak. Recorded directly from the
  # invokeReviewer return. Gates 4 reads this:
  # - quick    : any tier
  # - standard : >= acceptable
  # - deep     : >= good, and >= 1 entry with blind: true

  blind: false
  # boolean. true only for entries produced by step 5 of GRILL
  # (deep-mode blind reviewer with refs/blind_adversary_mandate.md);
  # false for everything else. Default per schema is false.
```

## Resolution-outcome fields

Populate based on the status the executor sets in step 6 of GRILL.

```yaml
  resolution_test_id: at-pipeline-burst-1mb
  # Required pairing for status: accepted_test_added. References the
  # acceptance-test or probe id the executor added to address the
  # hypothesis. Schema does not enforce the pairing; SKILL.md does.

  counter_evidence_refs: [clm-pipeline-error-propagation, clm-undici-pipeline-fix]
  # Required pairing for status: rejected_with_counter_evidence. Lists
  # the claim_ids (or src-ids) from the workspace ledgers that
  # contradict the hypothesis. Each ref must exist in
  # claim_ledger.yaml or source_ledger.yaml.
```

## Worked example — one accepted entry, end-to-end

```yaml
- id: fh-backpressure-burst-regression
  hypothesis: |
    Sustained throughput drops below the 1 MB/s threshold during burst
    inputs because the inserted gzip Transform does not yield to the
    event loop on every chunk.
  what_disproves: |
    A 60-second benchmark at burst input shape (5 ms gap, 10 ms gap,
    50 ms gap interleaved) records p95 throughput >= 1 MB/s and event
    loop lag p95 <= 25 ms.
  minimal_test: |
    node tools/probe.mjs --workspace <path> --assumption-id fh-backpressure-burst-regression
    --type benchmark --cmd 'node bench/burst_throughput.mjs --duration 60'
  severity_if_wrong: high
  confidence: 3
  reviewer_provider: anthropic
  reviewer_model: claude-opus-4-7
  reviewer_tier: best
  blind: false
  status: accepted_test_added
  resolution_test_id: at-burst-throughput-p95
```

The example sits inside `examples/failure_hypotheses.example.yaml` alongside three more entries spanning the other resolution outcomes.
