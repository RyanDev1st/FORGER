# Subphase B3 — Walking Skeleton

Used when OBSERVE's risk_map has any entry tagged `new_component`,
`new_integration`, or `no_prior_calibration`. Builds the thinnest
end-to-end slice with build + deploy/run mechanics, captures a RED
integration test, then hands off to B1 per component.

Source: Freeman & Pryce, *Growing Object-Oriented Software, Guided
by Tests* (GOOS), chapter 10 — *"A 'walking skeleton' is an
implementation of the thinnest possible slice of real functionality
that we can automatically build, deploy, and test end-to-end."*

---

## Three things produced (in order)

### 1. Thinnest end-to-end slice

A single integration test that exercises the artifact end-to-end
with a hard-coded happy path. The test exists; it fails. That
failure is the walking-skeleton RED.

Examples by artifact type:

- **API service.** One endpoint, hard-coded response. Test fires
  HTTP request; expects 200 + literal body.
- **CLI.** One subcommand, hard-coded output. Test invokes binary;
  expects exit 0 + literal stdout.
- **Library.** One exported function, hard-coded return value. Test
  imports; expects equality with literal.
- **Web UI.** One route, one element. Playwright test loads URL;
  expects element to be visible.

The slice is intentionally trivial. The point is to make build,
deploy, and test infrastructure exist before any feature depth.

### 2. Build + deploy/run mechanics

The smallest plumbing required for the slice to run:

- Directory structure.
- Build script (`npm run build`, `cargo build`, `pip install -e .`).
- Deploy command (or local run command for non-deployed artifacts).
- CI hook (only if `dow.hard_constraints` includes a CI gate).

No optimization. No layout polish. Make it run.

### 3. Walking-skeleton test added to acceptance

Add the integration test to the acceptance suite. It becomes part
of `acceptance_results.jsonl` from cycle 1.

**DoW immutability constraint (F9):** The walking-skeleton test is
not a DoW criterion; the executor adds it as a `subjective_pending`
line in `acceptance_results.jsonl`. It is visible to the user but
does not gate completion under `enforce_done_means_ran.mjs` (which
checks only `measurable`, `hard_constraint`, `failure_mode` types).

If the user wants the walking-skeleton test to gate completion,
they amend the DoW at CONTRACT time — escalate via
`refs/escalation_protocol.md` with trigger `reframe_required`.

---

## Gates (B3-specific, before entering B1 loop)

| # | Gate | Mechanism |
|---|------|-----------|
| 1 | Integration test file exists at declared path | file check |
| 2 | Integration test runs (exits non-zero on RED) | execution check |
| 3 | Build + deploy/run script exists and executes | script check |
| 4 | One `subjective_pending` line for the walking-skeleton test in `acceptance_results.jsonl` | jsonl grep |

If any gate fails, repair before entering B1.

## Handoff to B1 (or B2 then B1)

For each DoW criterion that maps to an inside component:

1. Enter `refs/tdd_micro_cycle.md` cycle on that criterion.
2. After each criterion turns green, **re-run the walking-skeleton
   integration test** to surface drift early.
3. If the walking-skeleton test starts failing because of a
   component change, treat as a regression — fix in the current
   cycle, do not defer.

If the inside criteria themselves have ordering or count that
matches B2's trigger (3+ criteria, explicit dependencies), the
router may chain B3 → B2 → B1. In that case B3 produces the
skeleton first, then B2 decomposes the inside-out work, then B1
loops per task.

## Anti-patterns

- Building a "real" feature in the walking skeleton. The slice is
  trivial on purpose; feature depth comes from B1 cycles afterward.
- Skipping the re-run of the integration test after each B1 cycle.
- Adding the walking-skeleton test as a `measurable` line by
  hand-editing `dow.yaml` (immutable inside the run).
- Using B3 for bugfixes in an existing artifact (use B1 directly).
- Adding more than one integration test in the skeleton (one slice,
  one test; more slices come from per-criterion cycles).

## When NOT to use B3

- Bugfix in code that already has an integration test passing.
- Refactor where build + deploy mechanics already exist.
- Research_report or design branch (their own procedures handle
  integration concerns).
- Quick mode (router disables B3 in quick).
