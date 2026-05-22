# EXECUTE — Branch C: design (rubric + screenshot review)

**Load only when triggered.** Triggers when
`dow.artifact.type == design`.

The design branch shifts gating from runtime tests (Branch A) and
citation integrity (Branch B) to **rubric scoring** and **surface
asset capture**. Subjective criteria carry through as
`subjective_pending` lines for user review.

---

## Loop

### 1. Generate the design artifact

Generate per `dow.artifact.description` (surfaces, user flows,
asset list). If `dow.artifact.format` is set (e.g. `figma`, `html`,
`react-prototype`), match it.

Each required surface gets its own file in the target location. If
the artifact is interactive (e.g. an HTML prototype), generate one
file per surface plus a flow document tying them together.

### 2. Score against the rubric

Acceptance criteria for designs include **rubric scoring**: each
`dow.success_criteria_measurable` entry carries a `threshold` the
rubric scores against. Walk every criterion:

- Read the criterion's `metric`, `threshold`, `test_method`.
- Apply the test_method (visual inspection, automated layout-check
  tool, user-flow walkthrough).
- Record the score against the threshold.

### 3. Capture screenshots / flow walkthroughs

Each required surface needs a captured screenshot or mockup file in
a documented location (e.g.
`workspaces/{slug}/surfaces/{surface-id}.png`). Each user flow
needs a documented walkthrough (e.g.
`workspaces/{slug}/flows/{flow-id}.md`).

If your environment supports it, use the `playwright-cli` snapshot
tool via the `forger-real-search` skill (it has the cloakbrowser
binary configured). Never spawn `playwright-cli` directly.

### 4. Append acceptance line

Invoke `src/gates/acceptance_test.mjs --workspace <path>`. The gate
writes one line per criterion to `acceptance_results.jsonl`.
Subjective criteria land as `type: subjective_pending` lines with
the measurement protocol carried through.

For each `subjective_pending` line, the executor either:

- **Runs the protocol** if mechanical (e.g. accessibility score from
  an automated tool); or
- **Surfaces the protocol to the user** if review-based (e.g.
  "review this surface and confirm it meets brand guidelines"). The
  surface remains `subjective_pending` until the user resolves it.

### 5. On failure

Rubric failures: re-design the surface or flow until the rubric
score meets the threshold. If you cannot meet the threshold without
changing the DoW criterion itself, escalate per
`refs/escalation_protocol.md`.

Surface-capture failures: if a surface cannot be captured because it
depends on external assets (logos, third-party libraries), document
the dependency in the escalation log and surface it to the user.

---

## Stop conditions

- `src/gates/acceptance_test.mjs --workspace <path>` exits 0 for all
  measurable criteria.
- Every required surface has its asset.
- Subjective criteria are either resolved or explicitly pending user
  review (which is acceptable — the Stop hook only blocks on
  required criteria, not subjective ones).
