# TDD Micro-Cycle (EXECUTE phase, code/system branch)

The EXECUTE phase walks every DoW criterion through one disciplined
test-driven cycle. The cycle is small on purpose: one criterion, one
test, one minimal change. Anything larger gives the failing test
nothing concrete to discriminate, and turns "the test passed" into a
weaker signal than "the test passed *because of the change I just
made*". This file is the verbatim shape SKILL.md (`procedure`,
Branch A) refers to, plus the expanded guidance that makes the steps
land cleanly when followed.

---

## Canonical cycle

```
For each next success_criteria_measurable not yet passing:

  1. RED:    write the failing test that asserts the criterion
             run it; confirm it fails for the right reason
  2. GREEN:  write the minimal code to pass the test
             save the file (PostToolUse fires post_code.mjs)
             run the test; confirm it passes
  3. IMPROVE:refactor only what touches the test you just passed
             re-run the test; must still pass

  4. Invoke src/gates/acceptance_test.mjs --workspace <path>
     This updates acceptance_results.jsonl.

  5. If acceptance fails:
       2 inline retry attempts (web-search the error if library-specific)
       3rd retry → escalate

  6. If acceptance passes: commit and loop to next criterion.
```

The block above is the **load-bearing** description. Do not paraphrase
it inside SKILL.md or hooks; reference this file instead.

---

## Step-by-step guidance

### Step 1 — RED: write the failing test

The test asserts the criterion verbatim. The `criterion_id` from the
DoW becomes the test name or test id so the link from
`acceptance_results.jsonl` back to the test source survives later
grep. The expected value comes from the criterion's `threshold`
field; the actual value comes from running the system under test.

#### "Failing for the right reason" — definition

A red bar is only useful if it fires for **the assertion you wrote**.
The wrong-reason failures to rule out before you accept a red:

- **Compile / import / syntax errors.** The test file did not run at
  all. Fix the broken import or the missing dependency first, then
  re-run to get the assertion-driven failure.
- **Fixture not found.** The test references a file or fixture that
  has not been created yet. Create the fixture first; a red caused by
  a missing fixture cannot drive minimal-code design.
- **Network timeouts or third-party flake.** Mark the test as
  `requires_live_dep` and stub the call, or skip the criterion and
  flag it for fact-gap re-entry if the missing fact is *what the
  dependency was supposed to return*.
- **Wrong assertion altogether.** The test asserted a related but
  not-the-criterion property. Rewrite the assertion to match the
  DoW threshold exactly; "close enough" is the slow road to a green
  test that proves nothing.

Only when the failure is the **expected assertion firing because the
behavior the criterion demands is absent** is the RED valid. The
single best discriminator: change the assertion to its negation and
see the test go green. If it does, the assertion was real.

### Step 2 — GREEN: write the minimal code to pass

#### "Minimal" — definition

Minimal means:

- The smallest change that turns the **specific failing test** green.
- No unrelated cleanup, no opportunistic refactor, no "while I'm in
  here" additions, no premature parameterization.
- No new public API surface beyond what the test exercises.
- No new module-level imports unless the test cannot pass without
  them.

When you find yourself adding code the failing test does not exercise,
stop and ask: would the test still fail if I removed this line? If
the answer is no, the line is not minimal and belongs to a later
cycle. The same rule rejects "speculative generality" — abstractions
introduced because a future criterion might need them. Every future
criterion gets its own RED-GREEN-IMPROVE cycle; speculative
generality from earlier cycles always collides with what the next
cycle actually demands.

Save the file. The PostToolUse hook `src/hooks/post_code.mjs` fires
automatically. Today that hook validates workspace YAMLs against the
schemas; DESIGN §13 carries a deferred extension to dispatch a per-
language linter (`npm run lint` on package.json, `ruff` on
pyproject.toml, etc.) and the matching test runner. Treat the hook
output as authoritative — a schema or linter complaint must be fixed
in the same cycle, not deferred.

Run the test. Confirm it passes. If it does not, you have not written
the minimal change yet; iterate within the cycle, do not move on.

### Step 3 — IMPROVE: refactor only what touches the test

Refactor means:

- Rename a variable inside the change you just made.
- Extract a helper that the just-passed test still exercises.
- Inline a constant that the test now pins.
- Tighten a type or narrow a return value that the test depends on.

Refactor does **not** mean:

- Editing modules the just-passed test does not exercise.
- Adding new branches, new validation, new options.
- Sweeping reformatting of files unrelated to the cycle.
- Changing test names or test files other than the one you just
  brought green.
- Anything that would introduce scope creep — a different criterion's
  test going red because of this refactor is a discipline failure,
  not a useful signal.

Re-run the just-passed test. It must still pass. Re-run the whole
test suite if the touched code is shared (lib code, base classes); a
green-on-this-test-but-red-on-its-neighbor refactor is rolled back,
not committed.

### Step 4 — Acceptance gate

Invoke `src/gates/acceptance_test.mjs --workspace <path>`. The gate reads
`workspaces/{slug}/dow.yaml`, runs `test_method` for each measurable
criterion, runs `verification_method` for each hard constraint, runs
`detection_method` for each unacceptable failure mode (passing iff it
does *not* trigger), and writes a `subjective_pending` line per
subjective criterion. The result is one new line per criterion in
`workspaces/{slug}/acceptance_results.jsonl`. The latest line per
`criterion_id` wins; older lines are kept for audit.

### Step 5 — Failure retry policy

- **Retry 1 (inline).** Re-run the failing command. Many test
  failures on first run are flaky in ways the second run resolves:
  filesystem race, port collision, partially written fixture from
  the previous cycle.
- **Retry 2 (inline + web search if library-specific).** If a stack
  frame names a third-party library, a documented version mismatch,
  or an error code that has known matches, do a targeted web search
  for the exact error string before the retry. Cite the URL you
  followed in the cycle's commit message; this is small-scale
  grounding even inside EXECUTE.
- **Retry 3 → escalate.** No 4th inline attempt. Choose between
  fact-gap re-entry (the criterion needs a missing fact, not a code
  fix) and escalation per `refs/escalation_protocol.md`. A 3rd
  consecutive failure is the signal that the diagnosis is wrong, not
  that one more retry will land.

### Step 6 — Commit on green

Commit when the cycle's test is green and `acceptance_results.jsonl`
shows the criterion `passed: true` on its latest line. The commit
message names the criterion id and the test that closed it. Then
loop to the next criterion.

---

## Anti-patterns to avoid

- **Writing many failing tests up front.** Each RED is paired with
  exactly one GREEN. Mass-RED loses the discriminating signal.
- **Skipping the IMPROVE step.** Code that "passes the test but is
  ugly" silently raises the cost of every future cycle that touches
  it; refactor inside the cycle, not "later".
- **Editing the test to make it pass.** The test is the
  criterion's contract. Editing it is editing the DoW — which is
  immutable inside the run.
- **Skipping the gate invocation after green.** A green test is
  necessary but not sufficient; `acceptance_results.jsonl` is the
  artifact the Stop hook reads, and a green test without a passing
  acceptance line still blocks completion.
