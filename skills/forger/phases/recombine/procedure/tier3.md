# RECOMBINE — Tier 3 (transformational, deep only)

**Load only when triggered.** Triggers at step 4 of `procedure/main.md`
when `3 ∈ recombine_tiers_allowed` (deep mode only). Do not load in
quick or standard mode.

Tier 3 proposals challenge a DoW assumption — Boden's "enabling
constraint" of the conceptual space. They are not implementable as
written; they are candidate replans for the next CONTRACT cycle.

---

## Procedure

### T3.1. Pick a DoW assumption worth challenging

Read `dow.assumptions[]`. A Tier 3 candidate is an assumption where:

- the cost of being wrong is high (would invalidate the artifact);
- AND the alternative framing has a concrete shape (not "what if X is
  different?" — "X is different in this specific way, and that would
  let us solve the problem like Y").

Assumptions that fail either test are not Tier 3 material — they are
risk-map entries (OBSERVE territory) or reframes (CONTRACT territory).

### T3.2. Write entries to `tier3_proposals.md` only

Use the Tier 3 schema:

```
## <idea-slug>: <short title>

- assumption_challenged: <dow.assumptions[].id> — <verbatim text>
- alternative_framing: <the proposed reframing>
- cost_of_being_wrong: <what breaks if the alternative is false>
- promoted_at: null
```

`assumption_challenged` must cite an id present in
`dow.yaml::assumptions[]`. `cost_of_being_wrong` is not optional: the
proposal must price the bet before a user can sign off on it.

`promoted_at` starts `null`. Only the user promotes a Tier 3 proposal,
and promotion typically triggers a fresh CONTRACT cycle (not a
re-entry into FIND within the current run).

### T3.3. Surface, do not implement

Tier 3 entries are escalations, not actions. The orchestrator's final
summary lists them for the user; this phase does not act on them.

### T3.4. Do not write to `recombine.md` or `tier2_speculation.md`

Tier 3 content stays in `tier3_proposals.md`. Resume
`procedure/main.md` step 5 (firewall discipline) and step 6 (exit)
when done.
