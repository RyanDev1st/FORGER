# Feynman Gate Template (OBSERVE phase)

The Feynman gate is a writing exercise that doubles as a comprehension
test. You write a short explanation of the domain in plain language; if
you cannot, you have not internalized the FIND material well enough to
proceed to RECOMBINE.

The file you produce is `workspaces/{slug}/ground_truth_brief.md`. It
must hit two hard requirements:

- **≥ 200 words** after stripping markdown syntax;
- **every jargon term defined inline** the first time it appears.

This file is the template: section headers in the order you should use,
the content requirement for each section, and a worked snippet showing
the inline-definition rule in action.

---

## Required sections (in order)

### 1. `# Ground truth brief: <domain_slug>`

The H1 carries the `dow.meta.domain_slug` value verbatim. This makes
the file self-identifying when RECOMBINE pulls it back in.

### 2. `## What this domain is`

Two to four sentences. Answer the question *if a smart person who has
never heard of this area asked me what it is, what would I say?* No
jargon allowed in this section without an inline definition. The point
is to anchor the reader in the right mental neighborhood before any
specialist words show up.

### 3. `## How the core mechanism works`

The longest section. Walk through the **single most important causal
process** the FIND ledger names — the thing that, if you got it wrong,
the artifact would fail in a load-bearing way. Use the
`risk_map.yaml::mechanisms[]` entries you wrote in OBSERVE step 1 as
your raw material, but explain them in prose, not by re-listing the
mechanism IDs. Every jargon term defined inline the first time it
appears.

If you cannot describe the mechanism without leaning on undefined
specialist terms, the Feynman gate is failing — go back to step 1 of
OBSERVE and re-read the claims that anchor those terms.

### 4. `## How it fails`

One to three paragraphs. Walk through the failure modes from
`risk_map.yaml::known_failure_modes[]` and the DoW's
`unacceptable_failure_modes[]`. For each failure: what trips it, what
the consequence looks like, how the artifact would notice. Plain
language; no "see ufm-2" cross-references. If a failure mode requires
a specialist term to describe, define it inline.

### 5. `## What I'm still uncertain about`

A short list — three to six bullets is typical. Each bullet names one
thing the FIND ledger left ambiguous, weakly supported, or
contradicted. This section is the human-readable preview of the
risk map you are about to build (or just built); it should map roughly
one-to-one onto the `assumptions[]` entries with `severity` ∈
{medium, high, critical}.

A bullet here is fine in the form *"I don't know whether X holds under
condition Y; if it doesn't, the artifact would have to do Z."* That
shape forces the uncertainty to name its own consequence.

---

## The inline-definition rule

Every specialist term gets a one-clause definition the **first time**
it appears in the brief. Subsequent uses do not need to repeat the
definition. The definition does not have to be rigorous; it has to be
true enough to anchor the reader.

The shape is: `<term> (<short definition>)`, no quote marks, no
hyperlinks. Examples of the rule in action:

> Node.js streams (chained I/O objects that pass data in chunks rather
> than loading whole files into memory) handle backpressure
> (the downstream telling the upstream "slow down, I am full")
> automatically when you use `pipe()` instead of manual `.on('data')`
> wiring.

> The `commonmark` parser (the reference implementation of the
> CommonMark markdown spec) refuses unfenced code blocks that mix
> indentation styles, so the formatter has to emit consistent
> four-space-or-tab leading whitespace.

The rule has one exception: a term that appears in the H1
(`<domain_slug>`) is allowed to appear once before its inline
definition, because the H1 carries it for self-identification rather
than for explanation.

---

## What the gate is not

- **Not a glossary.** Do not write a "Terms" section at the end. The
  inline definitions are the glossary.
- **Not a citation page.** Do not paste `src-*` URLs. RECOMBINE has the
  source ledger; the Feynman brief is for internalization, not for
  audit trail.
- **Not padded.** Two hundred words is the floor, not the target. A
  brief that hits 200 by restating the same idea four times will be
  re-failed on the next reader pass.
- **Not first-person reflection.** Do not write "I learned that..." or
  "It surprised me that...". Use the third person describing the
  domain, except in the "still uncertain about" bullets where naming
  the uncertainty in the first person ("I don't know whether...") is
  acceptable.

If the brief reads like a textbook excerpt that a domain expert could
have written without ever reading the FIND ledger, the gate passes.
If it reads like a list of the FIND ledger's claim_text fields, the
gate fails.
