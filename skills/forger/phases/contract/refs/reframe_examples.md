# Reframe Examples (CONTRACT phase)

Step 3 of the CONTRACT procedure generates **at least one alternative
problem framing** and asks the user to pick. The point is to make the chosen
framing intentional, and to give the orchestrator something concrete to
remember in `reframe_memo.md`.

The five patterns below cover most useful reframes. For each:
- the **original framing** (typical user input),
- the **alternative framing** the assistant proposes,
- **what would need to be true** for the alternative to work (gating
  conditions you can verify),
- **when to prefer** the alternative.

These map to the question stem "what would have to be true for the simplest
possible solution to work?" which the procedure invokes verbatim.

---

## 1. Simplification reframe — pick the cheaper mechanism

**Original framing.** "Train a CNN on customer reviews so we can score the
sentiment of each one."

**Alternative framing.** "Score each review with a lexicon (positive-word
count minus negative-word count) and only escalate to a learned model when
the lexicon is unsure."

**What would need to be true for the alternative to work.**
- The review corpus uses fairly standard English (lexicon coverage is high).
- Per-review error tolerance is moderate, not paper-grade.
- The team can produce or borrow a domain-tuned lexicon in under a day.
- Throughput requirements rule out training-and-serving a CNN cheaply.

**When to prefer.** The user implicitly assumed they needed a heavyweight
mechanism because heavyweight mechanisms are fashionable. The simpler one
is often within an acceptable accuracy gap, ships in hours instead of weeks,
and is auditable. Always offer the simplification reframe when the original
framing names a specific complex technology unprompted.

---

## 2. Constraint reframe — name the property, not the implementation

**Original framing.** "It must run on-device on our iPad fleet."

**Alternative framing.** "It must respond within 100 ms end-to-end, and no
customer data may leave the kiosk. *Where* the compute happens is an
implementation choice we make after measuring."

**What would need to be true for the alternative to work.**
- The user's real concern is latency + data residency, not the literal
  hardware.
- A regional gateway that does not log requests is acceptable as a "does not
  leave the kiosk" surrogate.
- The team is willing to revisit deployment topology if measurements demand
  it.

**When to prefer.** The original constraint named *how* something must be
done (a deployment choice). The alternative restates the constraint as *what
property must hold*, freeing the build to pick the cheapest topology that
satisfies it. Almost always worth offering when the user names a specific
runtime, language, or platform inside a constraint.

---

## 3. Adjacent reframe — different problem class

**Original framing.** "Build a multi-label classifier that tags each support
ticket with the relevant product area."

**Alternative framing.** "Build a retrieval system that finds the three most
similar past tickets; the human agent picks the right area from those."

**What would need to be true for the alternative to work.**
- The corpus of past tickets is large enough that meaningful nearest
  neighbours exist (typically thousands per area).
- Human agents are already in the loop and would not object to seeing three
  suggestions instead of one tag.
- Cold-start areas (new products with no history) can be handled by a
  manual override or a small bootstrap rule.

**When to prefer.** Classifiers fail catastrophically on new classes;
retrieval degrades gracefully. Offer the adjacent reframe whenever the
domain has long-tail or evolving categories, or when the user is going to
keep humans in the workflow anyway.

---

## 4. Inversion reframe — remove the failure mode, not add the feature

**Original framing.** "Add a 'live activity feed' to the dashboard so users
see what their teammates are doing."

**Alternative framing.** "Find out why users feel out of touch with their
teammates' work and remove *that*. Maybe daily summary emails. Maybe a
weekly review meeting. Maybe inline comments on the artifacts themselves."

**What would need to be true for the alternative to work.**
- The team can spend an hour interviewing five existing users to identify
  the real source of the felt gap.
- The user (the requester) is open to "we built nothing, and the problem
  went away" as a legitimate outcome.
- The dashboard's UX budget is genuinely scarce — adding a feed has real
  cost.

**When to prefer.** The original framing prescribes a *feature* without
having localised the *failure mode*. The inversion reframe asks "what is the
unacceptable_failure_mode this is really aimed at?" and shops for cheaper
ways to suppress it. Strongly worth offering whenever a request is phrased
as "add X" without an underlying metric.

---

## 5. Time reframe — relax the temporal envelope

**Original framing.** "I need a real-time risk dashboard that updates as
trades come in."

**Alternative framing.** "I need a near-real-time risk view, refreshed at a
500 ms cadence, with a hard guarantee that no figure is older than one
second when shown."

**What would need to be true for the alternative to work.**
- The decisions the dashboard supports do not actually happen sub-second.
  (Traders confirming reading the screen, not algorithms trading from it.)
- A 500 ms cadence with bounded staleness is reachable on existing
  infrastructure; sub-100 ms is not.
- The user can live with a visible "last updated 0.7 s ago" annotation in
  place of a literal streaming feed.

**When to prefer.** "Real-time" is one of the most overloaded words in
software. Most "real-time" asks are really "fresh enough" with a bounded
staleness contract. Offer the time reframe whenever you spot the word
"real-time", "live", or "instant" without a number attached.
