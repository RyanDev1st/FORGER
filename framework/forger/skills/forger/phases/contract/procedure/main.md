# CONTRACT — main procedure (interactive)

Six steps, in order. Steps 1–5 are interactive; step 6 writes the file.
Each step references the supporting ref you should consult only when its
trigger fires (see `refs/_index.yaml`).

Read `SKILL.md` first (router, gates, self-audit checklist). This file is
the interactive cold path. If no human is in the loop, read
`procedure/autonomous.md` instead.

---

## 1. Vagueness detection

Scan the user input for the **five canonical kinds of vagueness** listed
in `refs/vagueness_detectors.md`:

1. Unclear artifact type
2. Missing success criteria
3. Ambiguous constraints
4. Unstated assumptions
5. Mixed goals

For each category, note whether the user input trips that detector.
Several will usually trip at once; that is normal. The list of tripped
detectors is your agenda for step 2.

If the user input is unusually crisp (rare), it may trip zero detectors.
In that case skip ahead to step 3 (reframe) — you still owe an
alternative framing and a memo, even when nothing else needs clarifying.

## 2. Socratic elicitation

For each tripped detector, generate **1–3 targeted questions** using the
patterns in `refs/socratic_patterns.md` (maieutics / elenchus / aporia /
dialectic). Ask the user **one question at a time**. Update your
internal draft of the DoW after each answer.

- Pick the Socratic pattern that fits the kind of fog you are clearing.
- Do not batch questions. A long list intimidates the user and produces
  shorter, lower-quality answers. Ask, listen, update, ask again.
- Keep a running scratch of the draft DoW as answers arrive.
- When the same question would be needed twice, ask it once and reuse
  the answer.

Stop asking when no high-severity uncertainty remains and the gates of
step 6 would plausibly pass. If a user answer reveals a new vagueness,
loop back into step 1 for that fragment.

## 3. Reframe

Generate **at least one alternative problem framing**, drawing on the
five reframe patterns in `refs/reframe_examples.md` (simplification,
constraint, adjacent, inversion, time). Ask, verbatim:

> "What would have to be true for the simplest possible solution to work?"

Present the original framing and your alternative(s) to the user *briefly*
— two or three sentences each. The user picks one (or sticks with the
original). Capture the outcome in `reframe_memo.md` with these sections:

- `original_framing` — the user's framing, as a short paragraph.
- `alternative_framings` — each alternative as its own bullet; at least
  one entry, schema-enforced.
- `chosen_framing` — the framing you will use going forward.
- `rationale` — one short paragraph on why the chosen framing won.

Reframes that were dropped go in `alternative_framings` (they are
valuable context); the chosen one is restated in `chosen_framing` to
make the DoW self-contained.

## 4. Domain slug

Compute `domain_slug`. Rules:

- kebab-case (`^[a-z0-9-]+$`)
- a noun phrase, not a verb phrase ("medication-dose-calculator", not
  "calculate-medication-dose")
- ≤40 characters
- specific enough to *identify* the domain, generic enough that future
  related tasks can share the same KB entry

Check whether `knowledge/{domain_slug}/index.yaml` exists. The answer
feeds the mode auto-rule in step 5 (its absence implies a novel domain).

## 5. Mode question (asked last)

After steps 1–4, ask **one** plain-language mode question, verbatim:

> Last thing — how careful should I be on this one?
>
> • **Fast** — Quick pass. I lean on what I already know about this area. Good for small tweaks in familiar territory.
>
> • **Normal** — Full check. I pull official docs and community sources, then a second AI reviews my work. Default for most things.
>
> • **Thorough** — Everything Normal does, plus a contrarian sweep and a stricter second opinion. Slower. Use when getting it wrong is expensive.
>
> • **You choose** — I'll pick based on what you described.

Map the answer:

| User answer | `meta.mode` | `meta.mode_picked_by` |
| --- | --- | --- |
| Fast       | `quick`    | `user` |
| Normal     | `standard` | `user` |
| Thorough   | `deep`     | `user` |
| You choose | apply auto-rule (next) | `auto` |

**Auto rule** (full decision tree in `refs/mode_select_heuristic.md`):

- `shortcut_eligible` domain AND no safety-critical failure modes → `quick`
- ≥1 safety-critical failure mode OR novel domain (no `knowledge/{slug}/`
  directory) → `deep`
- else → `standard`

## 5.5. Confirm scope before writing DoW

Before invoking step 6, echo a three-bullet scope summary to the user
and **wait for explicit confirmation** ("yes", "ship it", "looks right"
— or the user explicitly edits the scope). Format:

> Here's what I'll build:
>
> - **Artifact:** {one-line artifact summary, drawn from draft `artifact.description`}
> - **Audience:** {`audience.who` + `audience.use_case`}
> - **Must-haves:** {bullet list of `hard_constraints[].description`}
>
> Confirm to proceed, or tell me what's off.

If the user edits any field, fold the edit into the running draft and
ask the question again. If the user says "looks right" or anything
affirmative, proceed to step 6.

This step exists because socratic clarifications (step 2) and the
reframe (step 3) elicit *fragments*; nothing prior to this point asks
the user "is the assembled whole right?" Without explicit confirmation,
the DoW the agent persists may not match the artifact the user expected.

## 6. Write DoW + telemetry

Open `templates/dow.template.yaml` as your starting structure. Fill
every required field from your running draft. Required fields per the
schema:

- `meta`: `id`, `created_at`, `user_query_verbatim`, `mode`,
  `domain_slug`, and (for gate 5) `mode_picked_by`.
- `artifact`: `type` (enum: code / system / research_report / design /
  spec / other), `description`. `format` is optional but recommended.
- `audience`: `who`, `use_case`.
- `hard_constraints[]`: each has `id`, `description`,
  `verification_method`; `threshold` when numeric.
- `success_criteria_measurable[]`: each has `id`, `metric`, `threshold`,
  `test_method`.
- `success_criteria_subjective[]` (optional): each has `id`, `criterion`,
  `measurement_protocol`.
- `unacceptable_failure_modes[]`: each has `id`, `description`,
  `detection_method`; `safety_critical: true` only when violation could
  harm a person or cause irreversible loss.
- `reframe_memo`: `original_framing`, `alternative_framings` (≥1),
  `chosen_framing`, `rationale`.
- `assumptions[]` (optional): each has `id`, `description`, `severity`
  (trivial/low/medium/high/critical), `status` (unverified / verified /
  waived / invalid).

Write the file. Then **validate** it via
`src/lib/ledger.mjs::validateDoW`:

```js
import { readYaml, validateDoW } from '../../src/lib/ledger.mjs';
const dow = readYaml('workspaces/<slug>/dow.yaml');
const r = validateDoW(dow);
if (!r.valid) { /* surface errors and halt */ }
```

If validation fails, surface the AJV error path and message to the user
and halt — do not silently patch.

Walk the self-audit checklist from `SKILL.md` and append a telemetry
line to `workspaces/{slug}/telemetry.jsonl`:

```json
{
  "phase": "contract",
  "mode": "<mode>",
  "self_audit": {
    "dow_validated": true,
    "hard_constraints_have_verification": true,
    "measurable_criteria_complete": true,
    "reframe_memo_written": true,
    "mode_and_picker_set": true,
    "scope_confirmed": true
  },
  "ts": "<ISO8601>"
}
```

Sub-fields use `true` when the checklist item passed, `false` when it
failed (do not silently omit). Use `null` for items that do not apply
(e.g., `scope_confirmed` is `null` in autonomous mode).

Return control to the orchestrator. The orchestrator routes to FIND.
