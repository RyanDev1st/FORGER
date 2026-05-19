---
name: gnosis
description: Fan out three parallel Sonnet subagents — scholar (academic), community (practitioner), edge (fringe) — for any research, brainstorming, or topic-exploration task, then synthesize. Use whenever the user wants to research, brainstorm, dig into a topic, find prior art, scope a paper, gather sources, or hunt for inspiration, even if they don't say "research." Outputs land in `./reTruth/{topic-slug}-{YYYY-MM-DD}/` as `scholar.md`, `community.md`, `edge.md`.
---

# gnosis

Orchestrator skill for the reTruth framework. Spawns three isolated subagents in parallel, each with its own mandate file, each appending to its own output file. Synthesizes after.

## Invocation

- Natural language ("research X for me", "I need ideas on Y", "deep research X, go hard") → trigger `/gnosis <topic>`.
- `/gnosis <topic>` → effort standard (Sonnet + high thinking).
- `/gnosis high <topic>` → effort high (Opus + inherited thinking). `effort` propagates to all subagents.

## Pipeline

### Step 1 — Build the brief

Extract: **Topic** (noun phrase) · **Lens** (user's angle) · **Domain** (coding / health / finance / law / humanities / etc.) · **Effort** (`standard` | `high`).

If domain is unclear, call tool `ask 3 questions` once. Do not interrogate further. Write a one-paragraph brief. All three subagents receive identical text.

### Step 2 — Create the workspace

Slug = topic lowercased, hyphenated, ≤40 chars. Date = local `YYYY-MM-DD`.

```
./reTruth/{slug}-{date}/
├── scholar.md         (empty; written by scholar lane)
├── community.md       (empty; written by community lane)
├── edge.md            (empty; written by edge lane)
├── lead-pool.md       (empty; populated by Step 2.5 scout)
└── contradictions.md  (empty; populated by Step 4c)
```

Collision (same slug + date already exists) → append `-v2`, `-v3`, etc. Record the workspace path for Steps 2.5, 4, 4c, 5.

### Step 2.5 — Scout pass (broad shallow retrieval)

Before spawning lanes, the orchestrator runs a single broad scout to build `<workspace>/lead-pool.md`. The pool is **shared starting context** for all three lanes — not a routing assignment.

Procedure:

1. Run 1–3 broad web searches using the brief's keywords (no lens narrowing).
2. Take the top **N = 20** candidate URLs across searches (deduplicate by host + path stem).
3. Open each candidate with `playwright-cli open <url>` — **10-second page-load timeout per candidate**.
4. For each candidate, append to `lead-pool.md`:
   - Final URL (after redirects)
   - Page title
   - One ≤25-word quote from rendered page text
   - Status: `ok` | `blocked (<reason>)` | `timeout` | `not-opened` (budget exhausted)
5. **Total scout wall-clock budget: ≤3 minutes.** When budget exhausts, stop opening; record remaining candidates with `status: not-opened`. Lanes proceed with the partial pool.
6. Blocked / timeout / not-opened candidates stay in the pool with their status — lanes may still retry via `WebFetch` fallback when they encounter the same URL during their own search.

Lanes are **encouraged but not required** to start from the pool. They keep full search authority and may add their own candidates. The pool is starting context, not a constraint.

`lead-pool.md` minimal format:

```markdown
# Lead pool
_Generated: <YYYY-MM-DD HH:MM>_
_Brief: <one-line restatement>_
_Scout budget: N=20, 10s/page, ≤3min total_

## L01
- URL: <final URL>
- Title: <page title>
- Quote: "<≤25 words from rendered page>"
- Status: ok | blocked (<reason>) | timeout | not-opened
```

### Step 3 — Spawn three subagents in parallel

One turn, three Task calls. Sequential spawning defeats isolation — do not do it.

Each spawn carries:
1. The brief.
2. Full content of the lane mandate (`scholar-dive.md` | `community-search.md` | `edge-finder.md` from this folder).
3. Output file path.
4. Workspace path.
5. Lead-pool path (`<workspace>/lead-pool.md` from Step 2.5).
6. Model + effort: Sonnet + high (default), Opus + inherited (when `/gnosis high`).

You do **not** read mandate files into your own context.

**Spawn template (verbatim):**
```
You are a research subagent in isolated context.
Brief: <brief>
Mandate: <full content of lane mandate file>
Workspace: <reTruth workspace path>
Output file: <workspace>/<scholar|community|edge>.md
Lead-pool: <workspace>/lead-pool.md
Effort: <standard|high>

Read your mandate. Execute every gate in the listed order.
The lead-pool is shared starting context — you may use entries from it or ignore them. You retain full search authority and may add your own candidates not in the pool.
Append each passing finding to your output file immediately — do not buffer.
Every appended finding must include a verbatim quote (≤25 words) supporting the claim.
Floor 5 (counting pivot findings toward floor). Target and ceiling are mode-dependent — your mandate's §1 mode-detection table is authoritative.
Below floor after S5 → run the pivot procedure in your mandate.
Run the QA checklist at the end of your mandate before declaring done.
Do not ask clarifying questions. Note interpretive choices in your output's Closing block.
Stop conditions are in your mandate. Respect them.
```

**Edge-only spawn-payload addition (append to the above template when spawning edge-finder):**
```
You are edge-finder. The lead-pool was built by a broad shallow scout that the other two lanes also see. You MUST add at least one candidate of your own that is not present in lead-pool.md — Edge's structural-edge mandate is incompatible with lead-pool monoculture.
```

### Step 4 — Wait, then validate

Wait until all three Task calls return. Read all three output files from the workspace (chat summaries are not authoritative).

For each lane, run validation in order:

| # | Check | Pass | Fail action |
|---|---|---|---|
| V1 | File exists and non-empty | continue | retry the lane |
| V2 | Finding count ≥ 5 (pivot findings count toward this floor) | continue | retry the lane |
| V3 | No top-level "I cannot" / "I refuse" content | continue | retry the lane |
| V4 | Every finding has a verbatim quote field | continue | mark missing-quote findings, do not retry |
| V5 | Closing block present (Structured Summary + Done) | continue | retry the lane |

### Step 4a — Verification audit (cheap, post-spawn)

See [`./SKILL-synthesis.md` §1](./SKILL-synthesis.md) for the full audit specification (5 checks: HEAD-request, quote-match, edge-bigram, lineage hash, independent-support count). Run once all three lanes pass V1–V5. Flagged findings remain in the workspace files but are excluded from the synthesis "robust" tier.

### Step 4b — Retry (hybrid: inline → delayed → delayed)

If a lane fails V1/V2/V3/V5:

1. **Retry 1 (inline, same turn).** Re-spawn immediately with note: `Previous attempt returned <N> findings or failed V<i>. Floor is 5. Apply pivot if topic is genuinely under-sourced.`
2. **Retry 2 (5-min delay).** Schedule via `ScheduleWakeup(delaySeconds=300)` in /loop mode, otherwise `CronCreate` one-shot. Persist retry counter at `./reTruth/{workspace}/.retry-<lane>`.
3. **Retry 3 (5-min delay).** Same mechanism.
4. **After 3 retries:** report lane as `under-sourced` in synthesis, list partial findings, continue. Codex fallback is opt-in only.

Worst-case wall-clock per lane ≈ 10 min.

### Step 4c — Contradictions matrix

See [`./SKILL-synthesis.md` §2](./SKILL-synthesis.md) for the full spec. The orchestrator builds `<workspace>/contradictions.md` after Step 4a audit passes and before Step 5 synthesis. Conflicts are classified by axis (method / population / timeframe / metric / context / interpretation / source-quality) and tagged (framing / evidence / resolved / unresolved / requires-arbitration).

### Step 5 — Synthesize as robustness_ladder

See [`./SKILL-synthesis.md` §3](./SKILL-synthesis.md) for the full tier definitions and output template. Synthesis output is tiered (Unsupported / Single-source / Independent-corroboration / Stress-survived / Action-grade) followed by Tensions / Pivots taken / Flagged at audit / Discarded / Gaps sections.

Link to all three workspace files. Do not reformat them — subagents own them.

### Step 6 — Re-fan if gaps warrant it

If Step 5 surfaces a real gap, spawn one or more follow-up subagents with tightened briefs targeting the gap. They append a `## Follow-up` section to the existing files. Cap at one re-fan round unless the user requests more.

If you want to re-fan all three on essentially the same brief, the brief was wrong — rewrite it with the user instead.

## Skip conditions

Do **not** use gnosis for:
- Trivial factual lookups ("capital of France")
- Single-source tasks ("summarize this document")
- Tasks where the user has already specified the sources

## Constraints

- Never read the three lane mandate files into your own context. They are subagent material.
- Never let one subagent's findings influence how you brief the others.
- Never collapse a subagent's structured summary and raw evidence appendix in your synthesis — keep both layers.
- Never delete or rewrite a workspace file. Subagents own them.
- Maximum four concurrent threads (orchestrator + 3 subagents). No fan-out beyond four.
