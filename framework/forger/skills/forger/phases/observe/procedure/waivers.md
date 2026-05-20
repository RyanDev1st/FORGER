# OBSERVE — waiver handling (standard / quick only)

**Load only when triggered.** Triggers at step 5 of `procedure/main.md`
when a probe is impossible or cost-prohibitive **and**
`dow.meta.mode` is `standard` or `quick`. Do not load this file in
deep mode — deep forbids waivers entirely (gate 3).

A waiver is a deferred risk, not an erasure. Most waivers escalate to
the user. Use sparingly.

---

## When a waiver is allowed

A waiver is allowed when **all** of these hold:

1. `dow.meta.mode` is `standard` or `quick` (deep forbids).
2. No probe pattern from `refs/probe_design_patterns.md` fits — you
   genuinely have no test environment, no API access, no surrogate
   target, and no acceptable benchmark proxy.
3. The cost of the smallest valid test exceeds the remaining run
   budget. ("Cost" = wall-clock minutes plus API tokens at current
   pricing; document the estimate.)

If only condition 1 holds, you are bypassing a probe lazily. Find a
way to probe.

## Waiver procedure

For each affected assumption:

### W1. Document the attempted designs

Note in the assumption's `waiver_reason` field:

- which probe pattern(s) you considered;
- why each pattern did not fit (no environment, no API, no proxy);
- the estimated cost of the smallest test you could design;
- what fallback assumption the downstream phases will rely on if the
  waiver stands.

### W2. Set status and reason

Set the assumption to `status: waived` and write the prose from W1
into `waiver_reason`. Do not leave `waiver_reason` empty — a waiver
without a reason fails the gate-3 audit on a re-read.

### W3. Escalate to the user

Surface the waiver in the orchestrator return so the user can decide
whether to:

- accept the waiver as-is (most common);
- upgrade the run to `deep` mode, which would re-enter OBSERVE without
  the waiver allowance — at that point you must probe or escalate
  again;
- amend the DoW to remove the assumption (e.g., narrow scope so the
  question stops mattering).

### W4. Resume `main.md`

Return to step 6 of `procedure/main.md` (blocked-claim sweep). The
self-audit at step 7 will count the waiver in
`self_audit.high_critical_assumptions_resolved` (waived counts as
resolved for that field) and in the telemetry `waived` counter.

---

## What is *not* a waiver

A waiver is for **probes you cannot run**. It is not:

- a downgrade of severity (that is a separate decision with its own
  rationale, recorded on the claim/assumption);
- an acceptance test deferral (those live in the DoW addendum mechanism
  in EXECUTE);
- a quiet pass (`status: verified` without evidence) — that is
  falsifying the gate.

If you find yourself reaching for `waived` for any of the above,
re-read this file before proceeding.
