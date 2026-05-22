# Blending Patterns (RECOMBINE phase)

Fauconnier and Turner's conceptual blending model gives RECOMBINE a
disciplined frame for producing combinational ideas. Use this
reference to generate Tier 1 candidates and to audit whether an
entry's novelty is honest (emergent features that the inputs do not
have on their own) or fake (features that one input carries and the
blend just re-states).

---

## Four-space model

```
Four-space model:
  - Input Space 1: a known mechanism (from claim_ledger, lane production)
  - Input Space 2: a different known mechanism
  - Generic Space: the abstraction both share
  - Blended Space: the novel construct

For every blend, identify:
  - the shared abstraction
  - which features project from each input
  - which features are emergent in the blend
  - whether emergent features have grounding (Tier 1) or not (Tier 2)
```

The pattern is mechanical: pick two mechanisms with a non-trivial
shared abstraction, project a subset of features from each, and see
what shows up in the blend that neither input had. The work of
RECOMBINE is to do this consciously rather than accidentally.

---

## How to use the model

1. **Pick Input Space 1.** A mechanism from `risk_map.yaml::mechanisms[]`
   with strong claim support. Prefer something concrete (a specific
   API, algorithm, or pattern) over something abstract (a design
   principle).
2. **Pick Input Space 2.** A second mechanism that does not obviously
   belong with the first — cross-domain analogues, claims from a
   different lane, even claims from a different phase of the same
   problem. The further apart Input 1 and Input 2 are, the more
   pressure the generic space has to do; that pressure is what makes
   blends interesting.
3. **Name the Generic Space.** The single abstraction both inputs
   share. If the only thing they share is "they are both code", the
   blend will be uninformative. Push for a structural abstraction:
   "both are pipelines with backpressure", "both are systems that
   degrade under unbounded retries", "both are reductions over a
   stream of events".
4. **Project features.** From each input, pick the two or three
   features that survive the blend. Be explicit about what is
   dropped — if you keep streaming-error-propagation from Input 1
   but drop its Node.js-specific implementation, write that down.
5. **Name emergent features.** What shows up in the blend that
   neither input had on its own? This is the novelty. If you cannot
   name anything emergent, the blend is just one input dressed in
   the other's vocabulary; either re-pick the inputs or accept that
   this is not a Tier 1 candidate.
6. **Audit grounding.** For each emergent feature, ask: is there a
   `clm-*` id that supports it? If yes, the blend qualifies for
   Tier 1 (subject to the mechanism-fit checklist). If the emergent
   feature is genuinely novel but ungrounded, the blend belongs in
   Tier 2 with a `validation_plan` that would ground it.

---

## Worked blends

### Blend 1 — Streaming pipeline + circuit breaker

- **Input Space 1.** `stream.pipeline` error propagation: errors at
  any stage land in the final callback (`clm-pipeline-error-propagation`,
  `clm-pipeline-error-handler-required`).
- **Input Space 2.** Circuit-breaker pattern from the resilience
  literature: after N failures in a window, open the circuit and
  short-circuit downstream calls.
- **Generic Space.** *Error-flow control in a multi-stage system:*
  the system has to decide what happens after a failure, not just
  surface it.
- **Projected features.** From Input 1: centralized error handler
  in the pipeline callback. From Input 2: count of failures over a
  time window plus a state transition (closed → open → half-open).
- **Emergent feature in the blend.** A pipeline whose callback
  carries the breaker state, so the next pipeline invocation either
  runs the chain or short-circuits before opening a stream. Neither
  input had the idea that the breaker state could be threaded
  through the pipeline callback rather than maintained out of band.
- **Grounding audit.** The pipeline-callback half is grounded
  (claim ledger). The breaker half is grounded in general resilience
  literature; the claim that the breaker state can ride on the
  pipeline callback specifically is **not** grounded. Verdict:
  Tier 2, with validation plan *"prototype a pipeline + breaker
  composition; measure overhead vs. an out-of-band breaker on a
  failure-injection benchmark."*

### Blend 2 — Backpressure + rate-limit bucket

- **Input Space 1.** Node.js readable streams pause automatically
  when downstream `.write()` returns false (`clm-backpressure-default`).
- **Input Space 2.** Token-bucket rate limiter: produces tokens at
  a fixed rate; downstream cannot proceed without a token.
- **Generic Space.** *Flow control by feedback from downstream
  capacity:* the producer adjusts its rate based on a signal from
  the consumer.
- **Projected features.** From Input 1: paused-when-full semantics
  driven by writable backpressure. From Input 2: token replenishment
  decoupled from request arrivals.
- **Emergent feature in the blend.** A stream-aware rate limiter
  where the token bucket *is* the writable: each `.write()` consumes
  a token, and the readable upstream pauses when the bucket is
  empty. The blend collapses two layers (rate limiter + stream
  consumer) into one.
- **Grounding audit.** Backpressure semantics are grounded
  (claim ledger). Token-bucket-as-writable is a specific construction
  that is consistent with both inputs but is not directly cited.
  Verdict: Tier 1 if the artifact uses it inside its own boundaries
  (the blend is a local design choice, not a transfer to a new
  domain); Tier 2 if proposed as a public API claim.

### Blend 3 — Stream state machine + property-based testing

- **Input Space 1.** Streams expose a complex internal state machine
  (`clm-stream-state-machine-debate`, `intended_use: tier2_seed`).
- **Input Space 2.** Property-based testing: generate inputs from a
  spec and check that a predicate holds over the output.
- **Generic Space.** *State-graph traversal with assertable
  invariants:* a system has a state space, and there are properties
  that should hold across all reachable states.
- **Projected features.** From Input 1: the stream state graph
  (closed, paused, flowing, ended, errored). From Input 2: a
  generator that produces arbitrary read/write/error sequences plus
  invariants over the resulting state sequence.
- **Emergent feature in the blend.** A property-based test harness
  that drives streams through generated event sequences and checks
  invariants (e.g., "after `end`, no further `data` events"). The
  test harness is a tool, not an artifact feature.
- **Grounding audit.** Input 1 is `tier2_seed` (a frontier-lane
  claim, not directly grounded). Input 2 is well-known but not in
  this workspace's claim ledger. Verdict: Tier 2, with validation
  plan *"build a minimal property-based harness over a single
  Readable; check it catches a known regression from the Node.js
  bug tracker."* If the plan passes and is promoted, the harness
  becomes a grounded testing utility that future Tier 1 ideas can
  rely on.

---

## When the model does not apply

Not every Tier 1 idea is a blend. A direct application of a single
claim to the artifact is fine; it just has to cite ≥ 2 claims (the
direct claim plus its supporting context). Use the four-space model
when the novelty needs an explicit story; do not force it on
straight applications.

The model is also weak for Tier 3 — transformational ideas do not
sit between two inputs in an existing space; they replace the space
itself. For Tier 3, write the proposal directly per
`tier_ladder.md`.
