# Shortcut eligibility (RETAIN phase)

A domain becomes shortcut_eligible when:
  - tasks_shipped >= 3 (lifetime)
  - last 3 task statuses are all 'shipped'
  - last_updated_at within last 90 days

When eligible:
  - FIND can serve from cache if coverage >= 0.80
  - Quick mode is offered as the auto-rule answer

When ineligibility re-triggers:
  - first 'escalated' or 'abandoned' in a row breaks the streak;
    shortcut_eligible reverts to false
  - 3 new consecutive 'shipped' tasks restore it

---

## Why these three conditions

`shortcut_eligible: true` on a domain index unlocks two cost
reductions: FIND can answer from `knowledge/{domain}/claim_ledger.yaml`
without spinning up search lanes (if the cache covers at least 80% of
the DoW criteria), and the mode router defaults to **quick** mode for
new tasks in the domain. Both shortcuts skip work that the framework
normally insists on, so the eligibility bar has to be evidence of a
domain that the framework genuinely understands.

The three conditions encode three different forms of that evidence:

- **`tasks_shipped >= 3` (lifetime).** A single shipped task in a
  domain is not enough signal — a one-off success can ride on the
  back of a hand-crafted DoW. Three lifetime ships is the minimum
  sample size where "we know how to do this kind of task" becomes
  credible, in the same way three repro runs in OBSERVE constitute
  the minimum for a Tier-1 mechanism claim.
- **Last 3 task statuses are all `shipped`.** Lifetime success rate
  is the wrong lens — it never adjusts to recent regressions. The
  rolling-3 window is the leading indicator: if the last three
  outcomes are all ships, the domain is currently working; if any
  of the last three escalated or was abandoned, the domain is
  currently regressing and the shortcut is suspended until the
  streak rebuilds.
- **`last_updated_at` within last 90 days.** A domain that has not
  seen any task for 90 days is stale: the world it modelled has had
  three months to move, and the cached claims are approaching their
  default TTL. Falling out of the 90-day window suspends the
  shortcut until a fresh task either re-validates the cache (via a
  shipped task) or refreshes the claims that have expired.

The conjunction is strict on purpose: any of the three failing
flips eligibility off.

---

## What "eligible" unlocks

### FIND from cache (coverage >= 0.80)

When a new task in the domain enters CONTRACT, the orchestrator can
ask FIND to serve its evidence from the per-domain claim cache rather
than spinning up subagent lanes. The threshold for skipping live
search is **80% coverage** of the DoW's `success_criteria_measurable`
and `hard_constraints` — i.e., 80% of those criteria are already
addressed by a non-expired claim in
`knowledge/{domain}/claim_ledger.yaml`. If coverage is below 80%, the
orchestrator runs live FIND for the uncovered criteria and merges the
new evidence with the cache hits.

Below the 0.80 threshold, the shortcut does not engage even if
`shortcut_eligible: true` — the eligibility flag and the coverage
threshold are independent gates.

### Quick mode is the auto-rule answer

The mode router defaults to **quick** when proposing a mode for a new
task in a shortcut-eligible domain. The user can override (and deep
mode is always available on request), but the auto-rule answer that
the orchestrator surfaces in CONTRACT is "quick", with the rationale
"three recent ships in this domain on the shortcut-eligible path".

Quick mode itself does not relax gates that affect correctness; it
reduces volume targets, retry budgets, and re-entry caps. The
eligibility flag is what makes that relaxation defensible: the
domain has demonstrated it doesn't need the wider net.

---

## How ineligibility re-triggers

### Streak break — one failure flips the flag off

The check is "last 3 task statuses are all `shipped`". The first
non-`shipped` outcome (an `escalated` or `abandoned` task) lands as
one of the last 3, which means the all-shipped check fails. The
tool's behavior in this case follows from its current code path:

> `tools/update_kb.mjs` checks the last 3 telemetry lines after
> appending the new one. If all three are `shipped`, it sets
> `shortcut_eligible: true`. If they are not all `shipped`, the
> tool leaves the flag at its prior value.

In other words, the **tool sets the flag true** but does not
explicitly set it false. Therefore, the documented behavior of "first
non-`shipped` task flips it off" requires one extra rule: **a non-
`shipped` task must also reset `shortcut_eligible` to false on the
index**. That reset is the symmetric counterpart of the set, and the
documented behavior depends on it.

If the tool is later extended to perform the symmetric reset
automatically, the rule becomes mechanical. Until then, RETAIN
authors should be aware that a domain that flipped to eligible in
the past may need a manual reset on the next non-shipping task if
the tool has not yet been updated to handle the negative case.

### Restoration — three new consecutive ships

Once eligibility is off, three new `shipped` outcomes in a row land
in the last-3 telemetry window and the tool's last-3 check fires the
true-set on the third ship. The path to restoration is mechanical
and identical to first-time qualification.

### 90-day staleness — independent of streak

The 90-day `last_updated_at` window is enforced at **read time** by
the consumer of `index.yaml` (the orchestrator, when deciding
whether to engage the shortcut), not at write time by
`tools/update_kb.mjs`. A domain whose `last_updated_at` is 91 days
old still has `shortcut_eligible: true` on disk; the orchestrator
treats it as not-eligible at read time. The next task in the
domain refreshes `last_updated_at` to "now" on its RETAIN, restoring
eligibility automatically if the other two conditions hold.

---

## Connection to `tools/update_kb.mjs`'s last-3 check

`tools/update_kb.mjs` performs the eligibility computation on every
run, after appending the current task's telemetry line. The relevant
lines:

```js
const tel = readJsonl(telPath);
const last3 = tel.slice(-3);
if (last3.length === 3 && last3.every(l => l.status === 'shipped')) {
  idx.shortcut_eligible = true;
}
```

Implications for the retro author:

- The flag is **computed**, not authored. Setting
  `shortcut_eligible: true` on the retro itself does not flip the
  domain flag — only the tool does that, based on the telemetry
  trail. The `shortcut_eligible` field on the retro is a snapshot
  of what the *task* believes about its outcome at retro time; the
  domain-level decision is the tool's.
- A new domain's first ship cannot trigger eligibility: the tool
  requires `last3.length === 3`. A second ship still cannot — the
  third ship is the earliest possible flip.
- The check is **strict equality on `'shipped'`**. Any other status
  string (including the legacy `success` if a retro was hand-edited)
  fails the check.

The asymmetry described under "streak break" above lives in this
code path: the conditional sets `idx.shortcut_eligible = true` but
has no else-branch that sets it false. The intended semantics
documented at the top of this file (a single failure flips it off)
assume a forthcoming change that adds the negative case, or a
manual reset on the index when a non-ship occurs.
