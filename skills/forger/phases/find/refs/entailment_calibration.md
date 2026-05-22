# Entailment Calibration (FIND phase)

Every claim in `claim_ledger.yaml` carries an `entailment` value drawn from
the enum `[directly_supported, weakly_supported, extrapolated, contradicted,
unverified, speculative]`. The entailment is the answer to a single question:
**what is the relationship between the claim_text I am writing and the
verbatim_quote I captured from the page?**

This is the honesty axis of the ledger. The verbatim_quote is what the
source actually said; the claim_text is what you, the subagent, are
asserting. Entailment grades the gap. The decision tree below is the rule;
the worked examples show one case per category.

---

## Decision tree

Walk the tree top-to-bottom. The first matching node is the answer. Do not
skip nodes — the tree is ordered by strength of entailment, from strongest
(directly_supported) to weakest (speculative).

```
Q1. Have I checked the claim_text against the verbatim_quote at all?
    NO  → entailment: unverified
          (you owe yourself a follow-up; do not exit the lane with
           unverified claims unless absolutely necessary)
    YES → continue.

Q2. Is the claim about a future state, a hypothetical, or a "could happen"?
    YES → entailment: speculative
          (frontier lane claims often land here by design)
    NO  → continue.

Q3. Does the verbatim_quote *contradict* the claim_text? (i.e., the quote
    says something incompatible with what the claim asserts)
    YES → entailment: contradicted
          (still record it — contradictions are valuable input to OBSERVE;
           flag in your closing block notes)
    NO  → continue.

Q4. Does the verbatim_quote *literally state* the claim? Allow rewording,
    paraphrase, and re-ordering — but the propositional content must match.
    YES → entailment: directly_supported
    NO  → continue.

Q5. Does the verbatim_quote *imply* the claim — i.e., a domain-competent
    reader would conclude the claim from the quote, but the quote does not
    state it outright?
    YES → entailment: weakly_supported
    NO  → continue.

Q6. Does the claim *extend the quote's scope* — applying the quote to a
    case the quote does not address (different version, different platform,
    different population, different magnitude)?
    YES → entailment: extrapolated
    NO  → you have a claim_text that has no relationship to the quote.
          Either rewrite the claim_text to match what the quote actually
          says, or capture a different quote that actually supports the
          claim. Do not record this entry.
```

The tree is deliberately strict on Q4 (`directly_supported`). A claim that
"feels" supported but isn't literally in the quote should be
`weakly_supported`. Honesty here pays off in OBSERVE — claims labeled
`weakly_supported` or worse become candidates for probes.

---

## Worked examples (one per category)

### Example 1 — directly_supported

**Claim.** "stream.pipeline forwards errors from any stream in the chain to
the final callback."

**Verbatim quote.** "pipeline forwards errors to the callback"

**Walk.** Q1 yes (checked). Q2 no. Q3 no. Q4 yes — the quote literally
states the claim. **→ directly_supported.**

### Example 2 — weakly_supported

**Claim.** "Calling stream.pipeline with only two streams is equivalent to
piping with `.pipe()` plus a centralized error handler."

**Verbatim quote.** "pipeline is a wrapper around pipe that forwards errors"

**Walk.** Q1 yes. Q2 no. Q3 no. Q4 no — the quote does not literally state
the two-stream equivalence. Q5 yes — a domain reader could derive the
claim from "wrapper around pipe that forwards errors". **→ weakly_supported.**

### Example 3 — extrapolated

**Claim.** "The pipeline-forwards-errors guarantee applies the same way in
Node.js 16 LTS as it does in current Node.js."

**Verbatim quote.** "pipeline forwards errors to the callback" (from current
Node.js docs).

**Walk.** Q1 yes. Q2 no. Q3 no. Q4 no — the current docs do not say anything
about 16 LTS. Q5 no — the quote is silent on the version question. Q6 yes —
the claim extends the quote to a version the quote does not address.
**→ extrapolated.** (You should also flag the claim with a note that an
LTS-specific source would strengthen it.)

### Example 4 — contradicted

**Claim.** "Backpressure in Node.js streams must be implemented manually by
the consumer."

**Verbatim quote.** "pipe handles backpressure automatically"

**Walk.** Q1 yes. Q2 no. Q3 yes — the quote contradicts the claim.
**→ contradicted.** Record the claim and the quote; this is the kind of
input OBSERVE most wants to see. Flag in the closing block: "production lane
captured a contradicted claim — pipe handles backpressure automatically, not
manually".

### Example 5 — unverified

**Claim.** "The new HTTP/3 transport in undici does not yet support stream
trailers."

**Verbatim quote.** *(none captured; the subagent inferred this from a
linked changelog header but did not capture the changelog text)*

**Walk.** Q1 no — the claim was never checked against a verbatim_quote.
**→ unverified.** Action: either grep the changelog, capture the quote, and
re-grade; or drop the claim. Exiting the lane with `unverified` is allowed
but flagged in the closing block.

### Example 6 — speculative

**Claim.** "A future Node.js release may add native async-iteration support
to all built-in streams, which would let us drop the wrapper layer."

**Verbatim quote.** "the working group is considering native async-iter
support for all streams"

**Walk.** Q1 yes. Q2 yes — the claim is about a future state. **→
speculative.** Frontier-lane claims often land here. Useful as a
`tier2_seed` because it shapes what OBSERVE should look for over time.
