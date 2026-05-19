# Tier 2 entry — worked example

This file is a hand-curated example of the Tier 2 entry shape that
RECOMBINE writes into `workspaces/{slug}/tier2_speculation.md`. The
`## ` header plus the `- idea:` and `- promoted_at:` lines match the
parser in `hooks/enforce_tier_firewall.mjs`, so the firewall reads
this shape cleanly when it scans for non-promoted entries.

The example is drawn from the same Node.js streaming workspace used
by `phases/find/examples/claim_ledger.example.yaml`, and builds on
the `tier2_seed` claim about the stream internal state machine.

---

## state-machine-aware-load-tester: Expose stream state transitions to the load-test harness

- idea: |
    Instrument the streaming wrapper so its load test can observe
    internal state transitions of the underlying Node.js streams
    (paused / flowing / ended / errored) and assert on the
    transition sequence rather than only on end-to-end throughput.
    The hypothesis is that most regressions show up as anomalous
    transition patterns before they show up as throughput dips.

- why_speculative: |
    The frontier-lane claim that streams expose a complex internal
    state machine is marked `intended_use: tier2_seed` (entailment:
    speculative). We do not have a directly-supported claim that
    public Node.js APIs surface enough state for the transition
    graph to be reconstructed from outside the runtime. The idea
    rests on an assumption that has not been probed yet.

- validation_plan: |
    Build a minimal harness over a single Readable that subscribes
    to `'data'`, `'pause'`, `'resume'`, `'end'`, `'close'`, and
    `'error'` events plus polls `readable.readableFlowing` and
    `readable.readableEnded` at fixed intervals. Run it against a
    known-good fixture and against a fixture that reproduces the
    `clm-destroyed-writable-leak` regression. Pass condition:
    the harness produces a distinct transition sequence for the
    regression that the analyst can name without seeing the
    fixture. Fail condition: the sequences are indistinguishable,
    meaning public state is too coarse for the assertion strategy.

- frontier_seed_refs: [clm-stream-state-machine-debate]

- promoted_at: null
