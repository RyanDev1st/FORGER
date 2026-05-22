# Mechanism-Fit Checklist (RECOMBINE phase)

For every Tier 1 idea, answer all five questions. If any answer is "I don't know" → cannot promote to Tier 1.

1. Source-domain mechanism: how did this work in the source it came from?
2. Target-domain mechanism: how would it work here?
3. Transfer evidence: which claim_ids in claim_ledger support that the
   mechanism transfers?
4. Transfer risks: under what conditions would the transfer fail?
5. Fit verdict: ok / partial / broken — based on the four answers above.

A "broken" verdict cannot be Tier 1. Reroute to Tier 2 with explicit
validation_plan if speculative version still has value.

---

## What the verdicts mean

- **ok** — All four prior answers are concrete. The source mechanism
  and the target mechanism share the same causal shape, the transfer
  is anchored by ≥ 1 claim_id, and the failure conditions are
  bounded (a reader can list them in one sentence each). Safe for
  `recombine.md`.
- **partial** — The source and target mechanisms share *most* of the
  causal shape, but one feature (boundary condition, throughput
  regime, data shape, error semantics) is different and the transfer
  evidence does not fully cover it. The idea is still Tier 1 if the
  difference is bounded and the carrying claim explicitly addresses
  the divergence. If you find yourself writing "we assume the
  difference does not matter," the verdict is `broken`, not `partial`.
- **broken** — At least one of the four prior answers is "I don't
  know" or hand-wave-only. The idea cannot be Tier 1. Reroute to
  Tier 2 with a `validation_plan` that, if it passed, would replace
  the unknown answer with a real one.

---

## Why the rule is strict

The whole point of FORGER is that grounded ideas inherit the trust
audit of the claims they cite. A Tier 1 idea whose mechanism-fit
block contains an "I don't know" is laundering speculation as
grounded work — once it gets to EXECUTE, the test surface has no way
to catch the hidden assumption, and the failure shows up at the
acceptance test as a load-bearing surprise. Catching it here costs
five minutes. Catching it in EXECUTE costs the whole run.

The "I don't know → cannot promote" rule is not a stylistic
preference. It is the only thing that keeps the firewall load-bearing.

---

## Worked examples

### Example A — verdict: ok

**Idea sketch.** Use `stream.pipeline` to wire an upstream HTTP body
through a transform stream into a writable file, so error
propagation is handled centrally.

```
mechanism_fit_check:
  source_domain_mechanism: |
    stream.pipeline forwards errors from any stream in the chain to
    the final callback, so callers do not wire .on('error') on every
    stage.
  target_domain_mechanism: |
    The streaming upload artifact will compose HTTP source +
    gzip transform + S3 writable through pipeline. Errors at any
    stage land in one handler that calls the user's promise reject.
  transfer_evidence: [clm-pipeline-error-propagation, clm-pipeline-error-handler-required]
  transfer_risks: |
    Fails if the writable destination swallows errors silently (some
    older S3 SDK adapters do this); also fails if the callback is
    omitted entirely.
  fit_verdict: ok
```

All four prior answers are concrete; transfer evidence cites two
existing `clm-*` ids; transfer_risks lists bounded failure conditions
the artifact can guard against. Safe for Tier 1.

### Example B — verdict: broken

**Idea sketch.** Use the stream state-machine model to inspect
streaming bugs during a load test, exposing the internal transition
graph to the test harness.

```
mechanism_fit_check:
  source_domain_mechanism: |
    A blog post argues that streams expose a complex internal state
    machine and that most streaming bugs in practice come from
    misreading state transitions.
  target_domain_mechanism: |
    The artifact would expose the state machine to the test harness
    and assert on transition sequences.
  transfer_evidence: [clm-stream-state-machine-debate]
  transfer_risks: |
    I don't know whether the public Node.js API exposes enough state
    to make the transition graph observable from outside a debugger.
  fit_verdict: broken
```

`transfer_risks` contains "I don't know", which is the rule
violation. Reroute to Tier 2: write a `validation_plan` such as
*"clone the artifact prototype, add a state-transition logger using
`stream.Readable.prototype._read` hooks, observe whether the
transition graph reconstructs cleanly from public state alone."* If
that plan passes, the idea can be re-evaluated for Tier 1 promotion.
