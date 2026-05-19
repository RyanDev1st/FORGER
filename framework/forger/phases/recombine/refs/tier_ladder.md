# Tier Ladder (RECOMBINE phase)

Margaret Boden's three creativity tiers, mapped to the three RECOMBINE
output files. Use this reference to decide where a candidate idea
belongs and what the disposition rule is for each tier.

---

## The mapping

```
Tier 1 — Combinational creativity (Boden)
  Novel combinations of familiar grounded elements. Mechanism-fit verified.
  Source lineage complete.
  SAFE TO EXECUTE.

Tier 2 — Exploratory creativity (Boden)
  Extends beyond direct evidence within an existing conceptual space.
  Requires validation_plan. Frontier lane is the primary seed source.
  SAFE TO EXPLORE; not safe to ship without validation.

Tier 3 — Transformational creativity (Boden)
  Challenges a DoW assumption (the "enabling constraint" in Boden's sense).
  Requires explicit user promotion.
  ESCALATE; do not implement without sign-off.
```

---

## Tier 1 — Combinational creativity

A Tier 1 idea is a new arrangement of elements that already have
audit trails in `claim_ledger.yaml`. The novelty is in the combination,
not in any individual element.

**Output file.** `workspaces/{slug}/recombine.md`. Always produced.
**Disposition.** Safe to hand to GRILL and EXECUTE without
additional user sign-off.

**Promotion rule.** Every entry must pass the five-question
mechanism-fit checklist (`mechanism_fit_checklist.md`) with
`fit_verdict ∈ {ok, partial}`, and must cite ≥ 2 `claim_ids` in
`claim_refs[]`.

**Practical notes.**
- A Tier 1 idea that uses only one claim is a restatement of the
  source, not a recombination. Add a second supporting claim or
  drop it.
- A `partial` verdict is acceptable when the source/target
  mismatch is bounded *and* explicitly named in `transfer_risks`.
  "We assume the difference does not matter" is not a bounded
  mismatch.
- Combinations that recombine claims from different lanes (production
  + community + frontier) tend to score higher on novelty than
  same-lane combinations; reach for cross-lane elements first.

---

## Tier 2 — Exploratory creativity

A Tier 2 idea extends beyond what the claim ledger directly supports,
but stays inside the conceptual space the DoW defines. The novelty is
in reaching for evidence that does not yet exist; the discipline is
that a concrete test would either fetch that evidence or refute the
idea.

**Output file.** `workspaces/{slug}/tier2_speculation.md`. Produced
only if `2 ∈ recombine_tiers_allowed` (standard or deep mode).
**Disposition.** Safe to explore. **Not** safe to ship — the firewall
hook blocks any non-Tier-2 write that overlaps a non-promoted Tier 2
entry by ≥ 60% bigrams.

**Promotion rule.** Every entry must carry a `validation_plan` that
is operationally concrete: a specific probe, prototype, or experiment
whose pass condition is well-defined. "Try it and see" is not a
validation plan. `frontier_seed_refs` should cite any `clm-*` ids
from the frontier lane whose `intended_use: tier2_seed` motivated the
entry.

**Lifting to Tier 1.** When the `validation_plan` is run and passes,
the orchestrator or user sets `promoted_at` to an ISO-8601 timestamp.
Promotion removes the entry from the firewall's denylist. The next
RECOMBINE pass (or an immediate Tier 1 write under user direction)
can then incorporate the now-grounded material.

**Practical notes.**
- A Tier 2 entry is not a Tier 1 entry with weaker evidence. It is a
  *bet* on what could be ground if you ran the test. Write it as a
  bet.
- The frontier lane is the primary seed source because its
  `intended_use: tier2_seed` claims are pre-marked as speculative;
  but a Tier 2 idea can also come from re-combining production /
  community claims in a way that introduces an untested boundary.
- `why_speculative` and `validation_plan` are different fields.
  `why_speculative` explains what is missing; `validation_plan`
  explains how to get it.

---

## Tier 3 — Transformational creativity

A Tier 3 proposal does not live inside the DoW's conceptual space.
It challenges one of the DoW's assumptions — Boden's "enabling
constraint" of the space itself. The novelty is in proposing a
different space; the discipline is in pricing the bet before anyone
commits to it.

**Output file.** `workspaces/{slug}/tier3_proposals.md`. Produced
only if `3 ∈ recombine_tiers_allowed` (deep mode only).
**Disposition.** Escalate. The orchestrator surfaces Tier 3
proposals to the user at run end. Implementation requires an
explicit user `promoted_at`, and promotion typically triggers a
fresh CONTRACT cycle on the new framing.

**Promotion rule.** Every entry must name the DoW assumption it
challenges (`assumption_challenged`), state the alternative framing
(`alternative_framing`), and price the bet (`cost_of_being_wrong`).
A Tier 3 entry without all three is a complaint about the DoW, not a
proposal.

**Practical notes.**
- A Tier 3 entry is fundamentally a question to the user: *would
  you rather solve a different problem?* If the answer is "no, the
  current DoW is right", the proposal stays parked but is not
  thrown away — it lives in `tier3_proposals.md` as a retro artifact
  for the next time the DoW is up for revision.
- `cost_of_being_wrong` is the field that prevents tier 3 from being
  free. If the alternative framing is wrong and the team has
  rebuilt around it, what has to be undone? If the answer is "very
  little", the bet may be cheap enough to take without sign-off; if
  the answer is "everything", the bet needs a strong defence.
- Tier 3 proposals are rare. A deep-mode run that produces zero
  Tier 3 entries is normal; a run that produces five is a sign that
  RECOMBINE has drifted into complaint mode.

---

## Cross-tier dynamics

- Tier 2 entries that pass their `validation_plan` get promoted and
  can be cited by a future Tier 1 entry.
- Tier 3 entries that get user sign-off trigger a fresh CONTRACT
  cycle; the new DoW reframes the conceptual space and the next
  RECOMBINE works inside it.
- Tier 1 entries that fail in GRILL or EXECUTE go to RETAIN as
  retro hypotheses; they do not slide backwards to Tier 2. The
  ladder runs in one direction.

The firewall hook (`hooks/enforce_tier_firewall.mjs`) is the only
mechanism that prevents Tier 2/3 material from contaminating Tier 1
silently. Treat it as load-bearing.
