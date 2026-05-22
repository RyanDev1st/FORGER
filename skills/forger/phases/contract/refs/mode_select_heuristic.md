# Mode Select Heuristic (CONTRACT phase)

Step 5 of the CONTRACT procedure asks the user how careful FORGER should be:

> **Fast** / **Normal** / **Thorough** / **You choose**

When the user picks an explicit answer, you write it directly to `meta.mode`
with `meta.mode_picked_by: user`. When they pick **"You choose"** (or when
running in autonomous mode without a human), apply the decision tree below
and write `meta.mode_picked_by: auto`.

---

## Decision tree (apply in order; first match wins)

```
1. KB has knowledge/{domain_slug}/index.yaml AND shortcut_eligible = true
   AND no unacceptable_failure_modes has safety_critical: true
   → quick

2. ≥1 unacceptable_failure_mode marked safety_critical
   OR knowledge/{domain_slug}/ does not exist
   → deep

3. otherwise → standard

Annotations:
- "Familiar domain" = KB exists AND last_updated_at < 90d
- "Novel domain" = KB does not exist
- User can always override by stating Fast/Normal/Thorough explicitly
```

---

## Notes on each branch

**Rule 1 (quick).** Quick mode trusts the existing knowledge base for the
domain. It is only safe to take when the domain has been worked recently
*and* nothing in the DoW carries safety risk. A safety-critical failure mode
always disqualifies quick mode, even in a familiar domain, because the cost
of a stale fact is higher than the saving from skipping a full FIND pass.

**Rule 2 (deep).** Deep mode runs all three FIND lanes (production,
community, frontier), forbids waivers on high/critical assumptions in
OBSERVE, and adds a blind adversarial reviewer in GRILL. Trigger it when the
artifact must not fail in a particular way (safety-critical) *or* when there
is no prior local knowledge to fall back on (novel domain). Both conditions
flag deep; either alone is sufficient.

**Rule 3 (standard).** The fallback. Runs production + community lanes in
FIND, allows waivers in OBSERVE, single adversarial reviewer in GRILL.
This is the right answer for most familiar-domain non-safety-critical work
when shortcut eligibility has not (yet) been earned.

**User override.** A user choosing Fast / Normal / Thorough explicitly bypasses
this tree entirely. Record `meta.mode_picked_by: user`. Do not second-guess
the user even if the heuristic disagrees — the heuristic exists to make a
default decision, not to overrule a present human.

---

## Worked examples

The four examples below show concrete DoW-shaped inputs and the mode the
heuristic chooses. Each describes what the user said, what the resulting DoW
looks like in the relevant fields, and which rule fires.

### Example A — quick (familiar, no safety risk)

> "Add a `--format=markdown` flag to my existing CLI tool. It already
> supports JSON output. Same project, same conventions, same tests."

Relevant DoW shape:
- `meta.domain_slug: cli-output-formatting`
- `knowledge/cli-output-formatting/index.yaml`: exists, `shortcut_eligible: true`,
  `last_updated_at` is 14 days ago.
- `unacceptable_failure_modes[]`: one entry — "regression in existing JSON
  output" — `safety_critical: false`.

Rule 1 fires: KB exists, shortcut_eligible, no safety-critical FMs.
**→ quick.**

### Example B — deep (familiar domain, but a safety-critical FM)

> "Add a dosage-calculation feature to the existing nursing-aid CLI I
> shipped last month."

Relevant DoW shape:
- `meta.domain_slug: nursing-aid-cli`
- `knowledge/nursing-aid-cli/index.yaml`: exists, `shortcut_eligible: true`,
  `last_updated_at` is 23 days ago.
- `unacceptable_failure_modes[]`: includes "calculates a clinically unsafe
  dose for any input within documented ranges" — `safety_critical: true`.

Rule 1 is blocked by the safety-critical FM. Rule 2 fires (≥1 safety-critical
FM). **→ deep.** Familiarity does not buy us out of caution when the failure
mode could harm a person.

### Example C — deep (novel domain, no safety risk)

> "Write a research report on the current state of small open-weights
> language-model fine-tuning for low-resource languages."

Relevant DoW shape:
- `meta.domain_slug: low-resource-llm-finetuning`
- `knowledge/low-resource-llm-finetuning/`: does NOT exist.
- `unacceptable_failure_modes[]`: includes "report claims a technique works
  for language X when it does not", `safety_critical: false`.

Rule 1 fails (no KB). Rule 2 fires (novel domain). **→ deep.** Novel-domain
research always benefits from the frontier lane plus the blind reviewer; the
cost of an undetected mis-claim in a survey is high.

### Example D — standard (familiar domain, not yet shortcut-eligible)

> "Add a CSV import path to the expense-tracker prototype I worked on twice
> last quarter."

Relevant DoW shape:
- `meta.domain_slug: expense-tracker`
- `knowledge/expense-tracker/index.yaml`: exists, `tasks_shipped: 2`,
  `shortcut_eligible: false` (needs 3).
- `unacceptable_failure_modes[]`: "loses or corrupts a row during import",
  `safety_critical: false`.

Rule 1 fails (shortcut_eligible is false). Rule 2 fails (no safety-critical
FM, KB exists). Rule 3 fires. **→ standard.** The domain is familiar but
hasn't earned the cache yet; run a normal pass and let RETAIN promote it.
