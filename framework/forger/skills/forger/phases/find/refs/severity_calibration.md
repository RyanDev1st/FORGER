# Severity Calibration (FIND phase)

Every claim in `claim_ledger.yaml` carries a `severity` value drawn from the
enum `[trivial, low, medium, high, critical]`. The severity is the answer to
a single question: **if this claim is wrong, what fails in the DoW?**

The mapping is mechanical — it depends on which DoW field the claim
*affects*, not on how interesting or surprising the claim is. This file is
the calibration reference: the table below is the rule, the worked examples
below show edge cases.

---

## Severity table

| DoW field the claim affects                                         | Severity |
|---------------------------------------------------------------------|----------|
| `unacceptable_failure_modes[]` with `safety_critical: true`         | critical |
| `hard_constraints[]` (any)                                          | critical |
| `unacceptable_failure_modes[]` with `safety_critical: false`        | critical |
| `success_criteria_measurable[]`                                     | high     |
| `success_criteria_subjective[]`                                     | medium   |
| Background context the artifact needs but no DoW field gates on it  | low      |
| Definitional / obvious to anyone in the domain                      | trivial  |

Rules of thumb:

- A claim that affects two fields takes the **higher** of the two severities.
- A claim that affects no DoW field does not belong in the ledger.
- The `safety_critical: true` row is identical in severity to the other two
  critical rows; the distinction matters for OBSERVE (which probes safety
  claims more aggressively) but not for FIND.
- `trivial` is not "low priority". It means "this claim is true by definition
  and the only reason to record it is for the audit's grep test to land".

---

## Worked examples

### Example 1 — critical (hard constraint)

**DoW excerpt.**
  - hard_constraints:
    - id: hc-1
      description: 'Must not introduce a new runtime dependency.'

**Candidate claim.** "Using the `js-yaml` parser would add a new transitive
dependency that is not already in package.json."

**Verdict.** `severity: critical`. The claim directly affects hard_constraint
hc-1. If wrong (e.g., js-yaml *is* already transitively present), the
implementation choice changes. If right and ignored, the DoW gate fails.

### Example 2 — critical (non-safety failure mode)

**DoW excerpt.**
  - unacceptable_failure_modes:
    - id: ufm-2
      description: 'Markdown output that is silently malformed.'
      safety_critical: false

**Candidate claim.** "The CommonMark spec requires a blank line before a
fenced code block, otherwise some renderers swallow the surrounding text."

**Verdict.** `severity: critical`. The claim describes a known case of
ufm-2 (silently malformed output). The `safety_critical: false` flag does
**not** lower the severity from critical — both critical rows merge here.

### Example 3 — high (measurable success criterion)

**DoW excerpt.**
  - success_criteria_measurable:
    - id: sc-m-1
      metric: 'unit-test coverage'
      threshold: '>= 90% line coverage'
      test_method: 'npm run coverage prints the per-file table'

**Candidate claim.** "Node.js's built-in `node:test` coverage reporter does
not count branches in async generator functions, leading to false-low
coverage numbers in pipelines that use them."

**Verdict.** `severity: high`. The claim affects how we *measure* sc-m-1,
which could cause us to ship a 88% reported / 92% actual artifact and
miss the threshold. High, not critical, because the artifact still works;
only the measurement is at risk.

### Example 4 — medium (subjective success criterion)

**DoW excerpt.**
  - success_criteria_subjective:
    - id: sc-s-1
      criterion: 'The markdown reads naturally in GitHub PR preview.'
      measurement_protocol: 'Eyeball the rendered preview.'

**Candidate claim.** "GitHub Flavored Markdown collapses three or more
consecutive blank lines into one when rendering, so the output looks
different from a local CommonMark preview."

**Verdict.** `severity: medium`. The claim affects sc-s-1 (rendering
quality). Subjective criteria sit one notch below measurable; if wrong, the
artifact still ships but a human reviewer may flag it.

### Example 5 — low / trivial (background context)

**DoW excerpt.** *(no field directly affected)*

**Candidate claim A.** "Node.js streams have existed since Node.js 0.10."

**Verdict A.** `severity: trivial`. Definitional; everyone in the domain
knows this. Record it only if you need the source's URL on file for another
claim to be auditable.

**Candidate claim B.** "Most production Node.js applications use the
streaming API indirectly via libraries like `axios` or `undici` rather than
calling `stream.pipeline` directly."

**Verdict B.** `severity: low`. Background context that shapes the
artifact's audience but doesn't gate any DoW field. Useful framing for the
`mechanism:` text on other claims; record it once, then move on.
