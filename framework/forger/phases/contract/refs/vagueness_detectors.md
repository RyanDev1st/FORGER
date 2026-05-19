# Vagueness Detectors (CONTRACT phase)

A user query is **vague** when there is not yet enough information to write a
machine-readable Definition of Works (DoW) without inventing facts. Vagueness
is not failure — it is the normal starting state. Your job in step 1 of the
CONTRACT procedure is to *detect* which kinds of vagueness exist, so step 2
(socratic elicitation) knows what to ask.

This file lists the **five canonical categories** scanned in step 1. For each:
- a one-line definition,
- 2-3 example user phrases that should trip the detector,
- 2 sample clarification questions you can ask,
- the **DoW field** that ends up populated once the clarification lands.

---

## 1. Unclear artifact type

**Definition.** The query does not pin down *what kind of thing* you are being
asked to produce — code, a system, a research report, a design, a spec, or
something else. Often the noun is missing or generic ("a thing", "something").

**Example phrases that trip it:**
- "build something for tracking expenses"
- "I want a tool that does X"
- "help me with our deployment problem"

**Sample clarification questions:**
- "Is the output a runnable program, a written analysis, a design mockup, or
  a written spec for someone else to build?"
- "When you say 'tool', do you mean a CLI, a web app, a library, or a script
  I should hand back as text?"

**DoW field populated.** `artifact.type` (enum: code / system / research_report
/ design / spec / other) and `artifact.description`. Also `artifact.format`
when the user names a runtime or shape (e.g., "a Node.js CLI").

---

## 2. Missing success criteria

**Definition.** The query says what to build but not how to recognise it works.
There are no numbers, no thresholds, no test descriptions — only adjectives.

**Example phrases that trip it:**
- "make it good"
- "should be fast"
- "as accurate as possible"

**Sample clarification questions:**
- "What is the *one* number we care about, and what value would make you
  consider it shipped? (e.g., latency under 100 ms, accuracy above 0.85)"
- "How would I prove to you, on a Tuesday afternoon, that this works? What
  command or check would we run?"

**DoW field populated.** `success_criteria_measurable[]` (each entry needs
`metric`, `threshold`, `test_method`). Sometimes also
`success_criteria_subjective[]` when the standard is genuinely judgmental
(e.g., "reads naturally"), in which case `measurement_protocol` captures the
rubric.

---

## 3. Ambiguous constraints

**Definition.** The query asserts constraints in word form ("must be fast",
"must be small", "must be secure") without a measurable bound or verification
method. These look like requirements but cannot be checked.

**Example phrases that trip it:**
- "must run on the laptop"
- "needs to be lightweight"
- "should be secure"

**Sample clarification questions:**
- "When you say 'fast', what is the largest latency you can tolerate, and on
  what hardware?"
- "What would 'secure enough' look like — protected against accidental
  misuse, against opportunistic attackers, or against a determined adversary?"

**DoW field populated.** `hard_constraints[]` (each entry needs `description`
and `verification_method`; `threshold` when numeric). Often also pulls one
constraint into `unacceptable_failure_modes[]` if violation is unsafe (e.g.,
"must never lose data" → failure mode with `detection_method`).

---

## 4. Unstated assumptions

**Definition.** The query uses domain jargon, platform names, library
choices, or organisational facts without grounding them. The assistant could
silently guess wrong about any of them. Watch for proper nouns and
acronyms the user has not explained.

**Example phrases that trip it:**
- "wire it up to our prod database"
- "add this to the React app"
- "should respect the SLA"

**Sample clarification questions:**
- "Which database engine and version is 'our prod database'? (Or: what
  schema should I assume?)"
- "Is there an existing project I should land this in — and if so, what's its
  current stack and where do I find it?"

**DoW field populated.** Primarily `audience.who` and `audience.use_case`
(who reads or runs the artifact, in what context). Newly-surfaced
assumptions that you cannot verify before writing the DoW go into
`assumptions[]` with `status: unverified` and an honest `severity`. Anything
load-bearing should also become a `hard_constraint` (with a verification
method that confirms the assumption).

---

## 5. Mixed goals

**Definition.** The query packs two or more objectives that may conflict, or
that should be sequenced rather than tackled together. Conjunctions ("and",
"but also", "plus") and lists are the most common surface signs.

**Example phrases that trip it:**
- "I want a fast search **and** a beautiful UI **and** offline support"
- "rewrite the auth layer **but also** fix the slow queries"
- "make a calculator that's accurate **and** explains its work to non-experts"

**Sample clarification questions:**
- "If we can only nail one of these on the first pass, which one matters most
  to you, and why?"
- "Do these have to ship together, or could we sequence them — one DoW per
  goal?"

**DoW field populated.** Usually this *splits* into multiple DoWs (one per
goal) rather than expanding fields inside a single DoW. If the user insists
on one DoW, the secondary goals land as `success_criteria_subjective[]`
(softer expectations) while the primary goal owns the
`success_criteria_measurable[]` slots. The conflict itself becomes an
explicit entry in `reframe_memo.alternative_framings` — "do A first, then B"
is a legitimate alternative framing.
