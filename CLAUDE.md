# reTruth — product workspace

Project memory for Claude Code and other agents. Loaded every session. Keep **under 200 lines**, signal-dense, and verifiable. Update this file when layout, commands, or rules change. 

<!-- Maintainer: add path-scoped rules under .claude/rules/ when this file grows. -->

## Mission

Build a framework that empowers AIs to explore, learn, and synthesize knowledge across the internet with human-like discernment and creativity. 

| In scope | Out of scope (unless user says otherwise) |
| --- | --- |
| Implementation, integration, release-quality behavior | Toy or simulated backends (label test fixtures explicitly) |
| Research notes for rationale and citations | Secrets in repo, commits, or chat |

## Repository map

| Path | Purpose |
| --- | --- |
| `CLAUDE.md` | Team agent instructions (this file) |
| `README.md` | Project overview |
| `ARCHITECTURE.md` | High-level synthesis of architecture and lanes |
| `reTruth/` | Framework container — holds skill, mandates, calibration examples, and topic workspaces |
| `reTruth/_archive/gnosis-v1/` | Archived gnosis v1 (replaced by `framework/forger/skills/forger/phases/find/`) |
| `framework/FORGER.md` | Research notes pushed to GitHub to demonstrate the framework's grounding (not agent-facing) |
| `framework/forger/_archive/` | Historical build-spec snapshots (e.g. `design-2026-05-19.md`); not agent-facing |
| `framework/forger/SKILL.md` | FORGER orchestrator skill (single agent loop, drives 7-phase pipeline) — agent source of truth |
| `framework/forger/skills/forger/phases/` | Per-phase skills (contract / find / observe / recombine / grill / execute / retain) |
| `framework/forger/skills/forger/modes/` | Mode configs (quick / standard / deep) |
| `framework/forger/skills/real_search/` | Cross-phase callable browser-driven page-read protocol |
| `framework/forger/schemas/` | JSON Schemas (YAML) for DoW, ledgers, risk map, failure hypotheses, probes, retro notes |
| `framework/forger/src/lib/` | Shared helpers (config, ledger I/O, KB, playwright, reviewer router) |
| `framework/forger/src/gates/` | Phase-exit validators (agent-invoked; block phase exit on failure) |
| `framework/forger/src/cli/` | Agent-invoked utilities (filter, probe, update_kb; never block) |
| `framework/forger/src/hooks/` | Harness-invoked hooks registered in settings.json (tier firewall, post_code, done-means-ran) |
| `framework/forger/knowledge/{domain}/` | Persistent per-domain knowledge base — version-tracked |

**Root policy:** only `CLAUDE.md`, `README.md`, `Summary.md`, `.gitignore`, and documented config files at repo root. All other artifacts live under their respective feature directories.

## Default workflow

Follow Anthropic’s **explore → plan → implement → verify** loop. Skip planning only when the change is one file and one obvious edit.

1. **Explore (read-only):** read relevant paths; state assumptions if anything is ambiguous.
2. **Plan:** list files to touch, verification commands, and risks. Confirm scope with the user when requirements are unclear.
3. **Implement:** minimal diff; match existing naming and patterns.
4. **Verify:** run commands in **Verification**; report pass/fail with command output summarized.
5. **Report:** update or create a report per **Reports** when the task produces findings, plans, or milestone status.

## Product principles

### File size (hard cap)

- No source file may exceed **200 lines** (imports and blank lines count). Exception: data; lane / skill mandate specs in `framework/forger/skills/forger/phases/`, including `framework/forger/skills/forger/phases/find/lanes/`, and `framework/forger/SKILL.md` (sub-agent and orchestrator definitions, ≤1500 lines).
- If a change would exceed the applicable cap: split into additional files in the **same feature folder** (next section). Never bypass the cap with comments or string concatenation.

### Feature folders (colocation)

- One capability → **one directory** with a short domain name (≤3 words, `snake_case` or `kebab-case`).
- All code for that capability stays in that folder. New capability → new folder. Extending a capability → existing folder only.
- Do not scatter the same feature across repo root and unrelated siblings.

### Workspace hygiene (required before “done”)

1. No new root-level files except those listed in **Repository map**.
2. No `_copy`, `_old`, `temp`, or duplicate scripts.
3. Every new path is referenced by code, tests, or docs in the same change set.
4. New top-level or feature folder → add one row to **Repository map** in this file in the same change set.

### Reports (required layout)

- Path: `<scope-dir>/YYYY-MM-DD-<topic>-<artifact>.md`
- Allowed `<scope-dir>`: specific documentation or reporting directories.
- Line 1: `Parent: <relative-path>` or `Parent: none`
- Sections in order: **Status**, **Scope**, **Evidence** (commands + outcomes), **Next** (numbered list)
- Same topic + same calendar date → append to the existing file **or** supersede as `…-v2.md` with a link to the prior file. Do not create a parallel sibling for the same topic.

## Verification

Claude performs best with explicit success criteria. Before claiming completion:

| Check | Command / rule |
| --- | --- |
| Lint / typecheck | Use project-standard commands when present; do not invent new tooling |
| Behavior | State expected output; if tests do not exist, give a manual repro the user can run |
| UI (if applicable) | Screenshot or browser snapshot compare against stated expectation |

If verification fails, fix or report the failure with the failing command and error excerpt. Do not claim “done” on assumptions.

## Engineering

- **Secrets:** never paste keys, cookies, tokens, or private URLs. Before any commit, confirm `.gitignore` covers `.env`, `*.pem`, and ephemeral locks.
- **Dependencies:** prefer existing stack; justify new dependencies in the PR or report.
- **Real backends:** integrations must hit real services or documented local runtimes—not silent mocks—in production paths.

## Orchestration (multi-agent)

See `framework/forger/SKILL.md` and each phase's `skills/forger/phases/*/SKILL.md` for the current pipeline.
Multi-agent fan-out happens only inside FIND (mode-aware: 1, 2, or 3 lanes)
and inside GRILL (1 reviewer in standard, 2 in deep). Max 4 concurrent
threads. Orchestrator never reads lane mandates directly — they are
filesystem-injected at subagent spawn time.

- After tasks are **confirmed with the user**, respond **AYE** once that turn (team convention).
- RTK (token reduction) hooks: `~/.claude/RTK.md`

## Git and delivery

- **Commit** every turn.
- **Push / PR** only when the user explicitly requests it.
- Commit messages: conventional, scoped, one logical change per commit; subject states *why*.
- Never commit secrets, `.env`, or large generated artifacts unless they are intentional, documented fixtures.

## Maintaining this file

Add a rule here when Claude makes the **same mistake twice** or you repeat the same correction across sessions. Remove stale rows from **Repository map** when folders are deleted. Prefer `.claude/rules/<topic>.md` with `paths:` frontmatter for file-type-specific rules instead of growing this file past 200 lines.

# playwright-cli usage
When using playwright-cli, NEVER use the --browser flag (e.g., do not use --browser=chrome). The environment is pre-configured with a custom stealth binary. Use playwright-cli open <url> directly.

Do not write custom Node.js scripts using child_process to interact with playwright-cli. Use the standard commands provided in your SKILL.md (e.g., playwright-cli --raw eval "...").