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
| `reTruth/skills/gnosis/SKILL.md` | Gnosis orchestrator skill (pipeline: parse → spawn → validate → audit → synthesize → re-fan) |
| `reTruth/skills/gnosis/SKILL-synthesis.md` | Orchestrator companion: Step 4a audit (HEAD + quote + bigram + lineage + independence), Step 4c contradictions stub, Step 5 robustness_ladder synthesis |
| `reTruth/skills/gnosis/scholar-dive.md` | Academic lane mandate (peer-reviewed sources, source basket, CRAAP gate) |
| `reTruth/skills/gnosis/community-search.md` | Practitioner lane mandate (war stories, debates, datasets, domain classification) |
| `reTruth/skills/gnosis/edge-finder.md` | High-variance lane mandate (contrarian, analogues, anti-redundancy bigram check) |
| `reTruth/skills/gnosis/references/` | Reserved for skill-local calibration examples (currently empty; seeded manually) |
| `reTruth/references/examples/` | Hand-curated example outputs used by lane subagents as quality targets |

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

- No source file may exceed **200 lines** (imports and blank lines count). Exception: data; lane / skill mandate specs in `reTruth/skills/gnosis/` (sub-agent definitions, ≤500 lines).
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

- **Architecture:** The orchestrator (`SKILL.md`) **never** reads lane mandate files directly; they are injected into subagents at spawn time to keep context clean.
- **Workflow:** Enforce the orchestrator pipeline: parse → spawn → validate → synthesize → re-fan.
- **Subagent lanes:** Spawn up to 3 parallel lanes: `scholar-dive` (academic), `community-search` (practitioner + datasets/repos), and `edge-finder` (high-variance/anti-redundancy).
- **Return Format:** All lanes strictly enforce a two-part return format: structured summary + raw evidence appendix, with a verbatim quote per finding for the audit hook.
- **Volume contract:** Floor 5, target 8–10, ceiling 12–15 per lane. Below floor → pivot strategy (related researchable topic, flagged).
- **Retry:** Hybrid — attempt 1 inline same turn, attempts 2 and 3 delayed 5 min each via harness scheduler. After 3 failures lane is `under-sourced` and run continues.
- **Verification audit:** HEAD-request each cited URL; curl + grep the verbatim quote against page text. Failures flag findings (do not delete). Spawns no extra subagents.
- After tasks are **confirmed with the user**, respond **AYE** once that turn (team convention).
- **Max four concurrent threads** (orchestrator + 3 subagents). Do not fan out beyond four.
- After 3 inline retries the lane is reported `under-sourced` and the run continues with partial results. Codex fallback (`codex-rescue`) is opt-in only — invoke explicitly when the user requests it.
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