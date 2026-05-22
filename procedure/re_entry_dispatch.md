# Orchestrator — fact-gap re-entry dispatch

**Load only when triggered.** Triggers at step 8 of `procedure/main.md`
when EXECUTE returns with a `fact-gap` status and writes
`workspaces/{slug}-{date}/dow_addendum_{n}.yaml`. Do not load on a
clean EXECUTE exit.

The orchestrator orchestrates the re-entry; EXECUTE wrote the
addendum, FIND will append to the ledgers, EXECUTE will resume on the
same criterion. The orchestrator counts re-entries and enforces the
cap.

---

## Procedure

### R1. Count existing addendum files

Count `dow_addendum_*.yaml` files in the workspace. The current
re-entry counter `{n}` is the highest suffix observed.

If `n > 2`: do not re-enter. Skip to R5 (escalate).

### R2. Validate the addendum EXECUTE wrote

Load `workspaces/{slug}-{date}/dow_addendum_{n}.yaml`. Validate
against `schemas/definition_of_works.schema.yaml` via
`src/lib/ledger.mjs::validateDoW`. If invalid: halt and surface the
AJV error to the user. Do not silently patch — EXECUTE wrote a
malformed addendum and the bug is upstream.

### R3. Re-invoke `forger-find` in re-entry mode

Invoke `forger-find` with:

- the workspace path;
- a flag (or env var) indicating re-entry mode + the addendum filename;
- the mode (verbatim from `dow.meta.mode`).

FIND detects re-entry mode by the addendum file's presence and loads
`framework/forger/skills/forger/phases/find/procedure/re_entry.md` instead of `main.md`. The
re-entry procedure spawns the production lane only with target=3, no
frontier, no KB shortcut. New entries get the `re_entry: {n}` tag.

**Phase-exit waits** (re-entry-specific):

- `workspaces/{slug}-{date}/source_ledger.yaml` has new entries
  tagged `re_entry: {n}`.
- `workspaces/{slug}-{date}/claim_ledger.yaml` has new entries
  tagged `re_entry: {n}`.
- `workspaces/{slug}-{date}/find_summary.md` has a new section
  "## Re-entry {n}".
- `src/gates/audit.mjs --workspace <path>` exit 0 (re-runs over the
  full ledgers, not just new entries).

### R4. Resume EXECUTE on the failing criterion

Re-invoke `forger-execute` with the workspace path. EXECUTE detects
the resumption (the addendum file plus the updated ledgers) and
returns to the failing criterion. The branch loop runs again with
the new evidence available.

Return to step 9 of `procedure/main.md` (RETAIN) on a clean EXECUTE
exit. Loop back to step R1 of this file if EXECUTE returns another
`fact-gap` with a new `dow_addendum_{n+1}.yaml`.

### R5. Escalate on cap exceeded

If `n > 2` at R1, or EXECUTE returns a third fact-gap after two
re-entries: emit a summary with `status: escalated` and stop.
Include in the summary:

- the workspace path;
- the criterion that could not close;
- the contents of the latest `dow_addendum_*.yaml` (what the agent
  thought was missing);
- a one-line reason why this requires user attention (e.g., "topic
  is genuinely under-sourced after 2 augmentations" or "addendum
  shape diverged from DoW criteria").

The orchestrator does not retry past the cap. Either the user
upgrades the mode (deep mode tightens the FIND re-entry behavior),
amends the DoW (CONTRACT cycle), or accepts the open risk.
