# EXECUTE — Branch A: code / system (TDD micro-cycles)

**Load only when triggered.** Triggers when
`dow.artifact.type ∈ {code, system}`. Default branch for `spec` and
`other` types as well.

Follow `refs/tdd_micro_cycle.md` verbatim for each criterion. The
short form below is the loop shape; the ref carries the
RED-GREEN-IMPROVE discipline and the anti-patterns to avoid.

---

## Loop (per criterion)

### 1. Pick the next open criterion

Pick the next entry from `dow.success_criteria_measurable`,
`dow.hard_constraints`, or `dow.unacceptable_failure_modes` whose
latest `acceptance_results.jsonl` line is missing or `passed: false`.

### 2. RED

Write a failing test that asserts the criterion. Run it. Confirm it
fails **for the right reason** — the assertion under test fires, not
a syntax or import error. A test that fails for the wrong reason
gives false confidence on the next pass.

### 3. GREEN

Write the minimal code to pass the test. Save the file. The
PostToolUse hook `src/hooks/post_code.mjs` fires automatically (linter
for YAML artifacts today; multi-language linter + per-language test
runner per the deferred dispatch). Run the test; confirm it passes.

### 4. IMPROVE

Refactor only what touches the test you just passed. Re-run the
test; it must still pass. **No scope creep** — no edits to modules
whose tests you have not just turned green.

### 5. Append acceptance line

Invoke `src/gates/acceptance_test.mjs --workspace <path>`. The gate
appends one line per criterion to `acceptance_results.jsonl`. The
just-tested criterion should land `passed: true` on the latest line.

### 6. On failure (retry policy)

Two inline retry attempts. If the error message is library-specific
(a stack frame names a third-party package, a documented behavior
diverges from runtime reality), search the web for the exact error
**before** the retry. The web search must route through the
`forger-real-search` skill (see `skills/real_search/SKILL.md`); never
spawn `playwright-cli` directly.

On the 3rd failure: either trigger fact-gap re-entry (load
`procedure/fact_gap_re_entry.md`) if the failure is a missing fact,
or escalate per `refs/escalation_protocol.md` if the failure is a
stuck implementation bug.

### 7. On success

Commit. Loop to the next criterion.

---

## Stop conditions

- `src/gates/acceptance_test.mjs --workspace <path>` exits 0 (all
  required criteria pass). Return to `procedure/main.md` step D3.
- Fact-gap re-entry fires. Return after `dow_addendum` is closed.
- Escalation fires. Return to `procedure/main.md` step "On escalation".

---

## Anti-patterns to avoid

- Writing the GREEN code before the RED test exists ("speculative
  implementation").
- Refactoring during GREEN ("I'll just clean this up while I'm here").
- Skipping the wrong-reason check in RED.
- Editing acceptance_results.jsonl by hand to "fix" a flake.
- Bypassing post_code.mjs by writing files outside the tracked paths.

The full anti-pattern list with examples lives in
`refs/tdd_micro_cycle.md`.
