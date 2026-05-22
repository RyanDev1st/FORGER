---
name: forger-real-search
description: |
  Canonical browser-driven search + page-read protocol for FORGER. Wraps
  playwright-cli + cloakbrowser, enforces no --browser flag and no custom
  child_process wrappers, applies progressive read-content rules (SKIM →
  SCAN → DEEP) with token budget. Invoke from FIND lane subagents and from
  OBSERVE/EXECUTE fact-gap probes for every page fetch.
---

## Identity

You are the **forger-real-search** skill: a single-purpose, callable wrapper
around browser-driven page reads. You are **not** a lane and you are **not**
the FIND orchestrator. You are invoked by FIND lane subagents (production,
community, frontier) and by OBSERVE/EXECUTE fact-gap probes whenever any
caller needs the *content* of a page to ground a claim.

Your job is to enforce the two hard project rules around browser usage and to
apply the progressive read protocol so callers never accidentally pay DEEP
read cost for an off-topic page.

You do not pick search queries, you do not decide which claim to ground, and
you do not write to ledgers. You receive a URL + claim target + budget, and
you hand back a structured result.

---

## When to invoke

Invoke `forger-real-search` for **every URL fetch that touches a remote page
and reads content**:

- FIND lane subagents reading candidate pages for claim extraction.
- OBSERVE fact-gap probes pulling a single page to ground one assumption.
- EXECUTE evidence checks that need a verbatim quote from a live page.

Do **not** invoke it for:

- HEAD-only liveness checks — use `src/lib/playwright.mjs::headRequest` directly.
- Pages already inside the local KB (`knowledge/{domain_slug}/`) — those are
  cached and trusted.

---

## Inputs

```yaml
url:           <required, http(s) URL>
claim_target:  <required, string>   # what claim are we trying to ground?
budget_tokens: <optional, default 6000>
```

The caller passes these three fields. The skill never accepts auth cookies,
headers, or session tokens — if a page is gated, return early with the
appropriate failure mode.

---

## Hard rules (verbatim, blocking)

These rules are blocking. Violating them means the run is invalid.

1. **No `--browser` flag.** Use `playwright-cli` or `playwright-cli snapshot`
   directly. The local stealth binary is pre-configured via
   `.playwright/cli.config.json` (written by `src/dev/setup_browser.mjs`).
   Never pass `--browser=chrome`, `--browser=chromium`, or similar.
2. **No custom `child_process` wrappers.** Do not write Node scripts that
   spawn `playwright-cli` themselves. Use the standard commands surfaced by
   `src/lib/playwright.mjs` (`headRequest`, `openPageViaPlaywrightCli`) and the
   stage helpers in `src/lib/read_progressive.mjs` (`skim`, `scan`, `deep`,
   `readWithBudget`). Those are the only sanctioned entry points.
3. **Verbatim quote rule.** Every quote captured for a claim must be ≤25 words
   and **must be present in the fetched page text** (grep test:
   `src/lib/playwright.mjs::grepQuote`). If you cannot grep it, you cannot use
   it — drop the quote, do not paraphrase and pretend it was literal.

---

## Procedure

### Step 1 — Liveness check (cheap)

Call `src/lib/playwright.mjs::headRequest(url)`. Require a 2xx or 3xx status.
On 4xx/5xx/network failure, return early with reason; do not spawn the
browser.

```js
const head = await headRequest(url);
if (head.status === 0 || head.status >= 400) {
  return { error: `dead URL (${head.status || head.error})`, stage_reached: 'pre-skim' };
}
```

### Step 2 — SKIM (≤ 500 tokens)

Call `src/lib/read_progressive.mjs::skim(url)`. Returns title, h1-h3, first and
last paragraph. Cost is one cheap HTML fetch.

Decision via `shouldPromote(skim_result, claim_target)`:

- promote=true → continue to SCAN.
- promote=false → return SKIM blob now, mark `stage_reached: 'skim'`.

See `skills/forger/phases/find/refs/read_content_rules.md` for promotion criteria.

### Step 3 — SCAN (≤ 2000 tokens, cumulative ≤ 2500)

Call `src/lib/read_progressive.mjs::scan(url)`. Uses the snapshot from
`playwright-cli snapshot <url>` (the accessibility tree). Returns every
heading + paragraph + code/table/figure block.

Decision via `shouldPromote(scan_result, claim_target)`:

- promote=true and `tokens_used < budget_tokens` → continue to DEEP.
- promote=false → return SCAN blob, `stage_reached: 'scan'`.

### Step 4 — DEEP (≤ remaining budget, cumulative ≤ 6000)

Call `src/lib/read_progressive.mjs::deep(url)`. Full reader-mode prose with
nav/footer/ads stripped. Returns text + images (alt-text + adjacency to
prose). No extra fetch — the snapshot already had everything.

### Step 5 — Visual content surfacing (no extra budget)

`src/lib/read_progressive.mjs::annotateVisuals(deep_result)` flags an image as
**surfaced** when prose contains
`/see figure|see fig\.|figure \d+|pipeline|architecture|as shown|algorithm \d+|equation \d+/i`
AND the snapshot already captured image refs. **No extra tokens are spent at
this layer.** The caller decides whether to spend vision-model tokens on a
specific figure.

### Step 6 — Quote candidates

For each promoted stage, extract up to 5 candidate quotes:

- ≤ 25 words.
- Each quote must pass `grepQuote(page_text, quote)`.
- Drop the quote if grep fails (do not paraphrase).

---

## Outputs

```yaml
stage_reached:   'pre-skim' | 'skim' | 'scan' | 'deep'
text:            <prose or '' depending on stage>
images:          [{alt, src, surfaced?}]   # only populated at DEEP
candidate_quotes: [<string>, ...]          # passed grepQuote
tokens_used:     <int>
trace:           [{stage, tokens}, ...]
error?:          <string>                  # set on failure mode
flag?:           <string>                  # 'js-rendered' | 'reader-mode-failed'
```

Callers may treat `error` as terminal; `flag` is informational and the caller
decides how to proceed.

---

## Failure modes

| Condition | Behavior |
| --- | --- |
| `playwright-cli` missing from PATH | return `{error: 'playwright-cli not installed; run npm run setup:browser'}` |
| HEAD returns 4xx/5xx or network error | return `{error: 'dead URL (<status>)', stage_reached: 'pre-skim'}` |
| SKIM/SCAN/DEEP network timeout | return `{error: 'timeout', stage_reached: <last_completed>, partial_text?}` |
| JS-rendered page with empty static HTML at SKIM | return SKIM blob with `flag: 'js-rendered'`; caller may decide whether to force SCAN |
| Reader-mode strip dropped everything | DEEP returns `{text: '', flag: 'reader-mode-failed'}` |
| Quote fails grepQuote | drop that quote silently; do not return it |

The skill never deletes findings — it surfaces flags and lets the caller
(the lane or OBSERVE probe) decide what to do.

---

## Cross-references

- `src/lib/playwright.mjs` — `headRequest`, `openPageViaPlaywrightCli`, `grepQuote`.
- `src/lib/read_progressive.mjs` — `skim`, `scan`, `deep`, `shouldPromote`, `readWithBudget`, `annotateVisuals`.
- `skills/forger/phases/find/refs/read_content_rules.md` — full promotion criteria, worked example, anti-pattern.
- `src/dev/setup_browser.mjs` — opt-in installer for cloakbrowser + `.playwright/cli.config.json`.
