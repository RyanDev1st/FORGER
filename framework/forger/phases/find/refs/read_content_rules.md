# Progressive Read Rules — SKIM → SCAN → DEEP

Companion reference for `_lib/read_progressive.mjs`. Every page-content fetch
in FORGER (FIND lanes, OBSERVE fact-gap probes, EXECUTE evidence-checks) goes
through three gated stages with explicit token budgets and explicit promotion
criteria. The point is to stop early when the page is clearly off-topic and
spend the full budget only when the page is actually load-bearing for a claim.

## The three stages

| Stage | Cost (token budget) | Inputs | What you get |
| --- | --- | --- | --- |
| **SKIM** | ≤ 500 | raw HTML via cheap fetch | title, h1-h3, first paragraph, last paragraph |
| **SCAN** | ≤ 2000 | `playwright-cli snapshot` (accessibility tree) | every heading, the paragraph after each heading, code blocks, tables, image refs |
| **DEEP** | ≤ 6000 | same snapshot, reader-mode stripped | full prose with nav/footer/ads dropped, image refs with adjacency to surrounding paragraphs |

Total per-page budget defaults to 6000 tokens. Visual content (alt-text and
captions) is surfaced *inside the DEEP return* at no extra token cost — the
snapshot has already captured it.

## Promotion criteria (encoded in `shouldPromote`)

### SKIM → SCAN: promote when **any** of

- Title contains a tokenized substring of `claim_target` (case-insensitive, stopwords filtered).
- Any h1-h3 contains a tokenized substring of `claim_target`.
- The first paragraph carries ≥2 named entities (capitalized non-stopwords) **or** numerical values.

Otherwise: STOP. Return the SKIM blob with `stage_reached: 'skim'`. Token cost
is at most 500 — you saved the SCAN and DEEP budget for a page that mattered.

### SCAN → DEEP: promote when

- Any heading-paragraph pair contains a candidate verbatim quote (≥10 words **and** ≥1 entity from the `claim_target` token set, OR a heading-keyword hit on the claim target).

Otherwise: STOP at SCAN. Tokens used so far ≤ 2500. You have headings + first
paragraphs + code/table/figure refs — enough for many citation-grade probes
without paying the DEEP cost.

### DEEP visual surfacing (no extra fetch, no extra budget)

When DEEP prose contains any of the regex triggers
`/see figure|see fig\.|figure \d+|pipeline|architecture|as shown|algorithm \d+|equation \d+/i`
**and** the snapshot has image refs, the return blob carries `images[]` with
adjacency to surrounding paragraphs. **No extra vision tokens are spent at
this layer.** The caller decides whether to spend vision-model tokens on a
specific figure. Default: don't. Opt-in only when the prose explicitly cites
the figure as the source of an algorithm, pipeline, architecture, or equation.

## Worked example: "Three.js InstancedMesh performance"

Suppose the FIND production lane is searching for performance characteristics
of `THREE.InstancedMesh` to ground a hard_constraint on draw-call budgets.
The lane fetches `https://threejs.org/manual/...InstancedMesh.html` via the
`forger-real-search` skill.

1. **SKIM** (≤ 500 tokens). Title: "InstancedMesh". h2: "Performance
   considerations". → keyword "InstancedMesh" matches the claim_target token
   set. **Promote to SCAN.**
2. **SCAN** (≤ 2000 tokens). Heading "Performance considerations" followed by
   a paragraph that contains "draw calls", "10,000 objects", "80% improvement"
   — entities + numerics, ≥10 words. **Promote to DEEP.**
3. **DEEP** (≤ 6000 tokens, reader-mode stripped). Full prose of the
   Performance section. Image ref: instancing-diagram.png with adjacency to
   the paragraph that says "pipeline below". `images[]` carries `{alt, src,
   surfaced: true}`. The caller (the lane) decides whether to fetch the
   diagram via a vision tool.

Total token cost ≈ 500 + 2000 + 3500 ≈ 6000.

## Anti-pattern: paying DEEP cost for an off-topic page

If SKIM hits "Vintage tea cup collection guide" and the claim_target is
"Three.js InstancedMesh performance", `shouldPromote(skim)` returns
`{promote: false, reason: 'off-topic skim signal'}`. **Stop at 500 tokens.**
Do not let SCAN or DEEP run. The lane's volume contract is about
*citation-worthy claims*, not bytes consumed.

## When to spend vision tokens on a figure (caller decision)

Default: don't spend vision tokens.

Spend them only when **both** apply:

- The DEEP prose explicitly references the figure as the source of an
  algorithm, pipeline, architecture diagram, or equation.
- The figure's alt-text and caption are insufficient to ground the claim.

If the alt-text already says "pipeline diagram of the FORGER 7-phase
sequence", you don't need the image — quote the alt-text and move on.

## Failure modes

| Failure | Behavior |
| --- | --- |
| Network timeout at SKIM | return `{error: 'timeout', stage_reached: 'pre-skim'}` |
| JS-rendered page with empty static HTML at SKIM | return `{flag: 'js-rendered'}`; caller may decide to promote to SCAN anyway (the snapshot will render) |
| Reader-mode strip drops all content | DEEP returns `{text: '', images: [...]}` — caller flags as `reader-mode-failed`, may fall back to raw snapshot text |

## v0.1 honest limits

- Reader-mode strip is a regex on class/id/role: drops nav/footer/ad/cookie/banner/sidebar/menu. It will miss bespoke layouts. Future v0.2 may use a real Readability port if needed.
- Token estimate is `ceil(length / 4)`. Approximate. We never spend on a real tokenizer here.
- SKIM HTML parsing uses simple regex (no jsdom). Intentional — keeps the cost predictable and the lib dependency-free.

## Cross-references

- `_lib/read_progressive.mjs` — implementation.
- `skills/real_search/SKILL.md` — the skill that calls this library.
- `_lib/playwright.mjs` — `headRequest` (used before SKIM) and the snapshot wrapper underneath SCAN/DEEP.
