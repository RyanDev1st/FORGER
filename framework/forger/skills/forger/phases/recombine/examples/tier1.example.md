# Tier 1 entry — worked example

This file is a hand-curated example of the Tier 1 entry shape that
RECOMBINE writes into `workspaces/{slug}/recombine.md`. Use it as a
quality target. The example is drawn from the same Node.js streaming
workspace used by `skills/forger/phases/find/examples/claim_ledger.example.yaml`.

---

## pipeline-with-central-error-channel: Pipeline-routed errors as the streaming wrapper's only failure surface

idea: |
  Compose the artifact's HTTP-to-S3 streaming path entirely through
  `stream.pipeline`, with a single callback that handles every error
  from every stage. The artifact never wires `.on('error')` on
  individual stages, so the unhandled-error failure mode the DoW
  forbids is unreachable by construction.

addresses_dow_criteria: [hc-1, ufm-2]

claim_refs: [clm-pipeline-error-propagation, clm-pipeline-error-handler-required, clm-pipeline-arity]

mechanism_fit_check:
  source_domain_mechanism: |
    Node.js documentation and a Stack Overflow consensus answer both
    establish that `stream.pipeline` forwards errors from every stage
    to the final callback, and that omitting the callback leaves
    errors unhandled (which crashes the process under default
    settings). The arity claim adds that `pipeline` accepts an
    arbitrary number of streams between source and destination.

  target_domain_mechanism: |
    The streaming wrapper composes (HTTP body Readable) → (gzip
    Transform) → (S3 multipart Writable) inside a single
    `pipeline(src, gzip, dst, cb)` call. The `cb` is wired to the
    caller's Promise resolve/reject. There is no other error
    surface in the wrapper; every error path goes through `cb`.

  transfer_evidence: [clm-pipeline-error-propagation, clm-pipeline-error-handler-required]

  transfer_risks: |
    Fails if (a) the S3 multipart Writable swallows errors silently
    rather than emitting `'error'` — older AWS SDK adapters were
    known to do this; the artifact guards by integration-testing
    error emission. Also fails if a refactor accidentally drops the
    callback argument and the pipeline becomes unhandled; the
    artifact guards by a static check that every `pipeline(` call
    site has ≥ 2 arguments where the last is a function.

  fit_verdict: ok

notes: |
  This entry is the spine of the wrapper. Other Tier 1 entries
  (encoding handling, backpressure measurement) plug into the
  pipeline assembled here rather than competing with it.
