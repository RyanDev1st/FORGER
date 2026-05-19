# gnosis — synthesis half

Companion file to `./SKILL.md`. The orchestrator reads this file when it reaches Step 4a, Step 4c, or Step 5 of the gnosis pipeline. Lane subagents do not read this file — they read their lane mandate only.

Contents:

- §1 — Step 4a verification audit
- §2 — Step 4c contradictions matrix (P2 stub; full spec lands in P3)
- §3 — Step 5 synthesis as robustness_ladder

---

## §1 — Step 4a verification audit (cheap, post-spawn)

Run once all three lanes pass Step 4 V1–V5. Five checks, all bash-cheap.

1. **HEAD-request each URL.** 200 / 301 / 302 → ok. 404 / 410 / timeout → flag `⚠ link-dead`.
2. **Quote-match.** `curl` the page text (no JS render), grep the verbatim quote literally. Match → ok. Miss → flag `⚠ quote-not-found`.
3. **Bigram anti-redundancy (Edge only).** Stopword-stripped bigrams from each Edge finding (claim + source title) vs the combined bigram set from `scholar.md` + `community.md`. Overlap ≥ 30% → flag `⚠ redundant-with-other-lane`. (TODO: tune threshold against real runs.)
4. **Lineage hash (NEW in P2).** For each finding, derive a lineage key from the most upstream identifier the finding records. Priority order: DOI → PMID → arXiv ID → canonical publisher URL (host + path stem) → normalized URL host → SHA-1 of normalized claim text. Group findings sharing the same lineage key. If a single lineage key has ≥ 3 findings across the corpus (scholar + community + edge), flag the cluster `⚠ echo-source` and downgrade non-originating findings within the cluster to `Triangulation: lineage-echo`. The originator (first publication date, or lowest-ID member when dates are equal) keeps its tier.
5. **Independent-support count (NEW in P2).** After lineage grouping, count distinct lineage keys supporting each cross-lane claim. The count is the input to Step 5's tier promotion. Specifically: claims with independent-support ≥ 2 across ≥ 2 lanes qualify for `Independent-corroboration` tier or higher; claims with one lineage key qualify only for `Single-source` tier.

Flagged findings remain in the workspace files but are excluded from the synthesis "robust" tier.

The bash script implementing checks 1–5 is still TODO per the existing audit-hook infrastructure noted in earlier plans. Until it ships, the orchestrator runs these checks inline using `Bash` with `HEAD` requests + `curl` + `grep` + simple shell hashing (sha1sum or shasum), and prints a one-line audit summary per finding.

## §2 — Step 4c contradictions matrix

After Step 4a audit passes, before Step 5 synthesis, build `<workspace>/contradictions.md` to surface cross-lane conflicts explicitly. The matrix is the structured input to Step 5's `Tensions` section.

Procedure:

1. Scan the three lane files (`scholar.md`, `community.md`, `edge.md`) for claims that directly conflict — same fact, opposing readings; or same fact with incompatible conditions.
2. For each conflict, classify the **axis**:
   - **method** — different study or evidence method (RCT vs cohort vs survey vs anecdote vs benchmark)
   - **population** — different subject groups, regions, or system scales
   - **timeframe** — different time windows or eras
   - **metric** — different success / effect / outcome measure
   - **context** — different operating conditions, deployment environments, or assumptions
   - **interpretation** — same underlying data, different reading
   - **source-quality** — one source out-tiered by the other per audit/G-gates
3. Tag each conflict:
   - **framing conflict (drop)** — same fact phrased oppositely; no real disagreement; exclude from synthesis Tensions.
   - **evidence conflict (keep)** — genuine empirical or structural disagreement; keep.
   - **resolved** — one side carries clearly stronger evidence per Step 4a audit or G-gate output.
   - **unresolved** — both sides survive audit; no clear adjudicator from available evidence.
   - **requires-arbitration** — needs domain expert input or re-fan; flag for Step 6 candidacy.

`contradictions.md` format:

```markdown
# Contradictions matrix
_Built: <YYYY-MM-DD HH:MM>_

## C01
- Claim A: <one-line>
- Claim B (conflict): <one-line>
- Lanes: scholar+community | scholar+edge | community+edge | all-three
- Axis: method | population | timeframe | metric | context | interpretation | source-quality
- Tag: framing | evidence | resolved | unresolved | requires-arbitration
- Notes: <one-line; what tipped the classification>

## C02
...
```

Synthesis consumption rules:

- Rows tagged `framing conflict (drop)` are excluded from Step 5's Tensions section.
- Rows tagged `evidence conflict` and `unresolved` are listed in Tensions with one-line summaries.
- Rows tagged `resolved` are folded into the appropriate `robustness_ladder` tier (with the stronger side promoted, the weaker side moved to `Discarded` with reason).
- Rows tagged `requires-arbitration` are listed in Tensions AND trigger Step 6 re-fan candidacy.

If no cross-lane conflicts are detected, `contradictions.md` records a single line `none-detected` and Step 5 omits the Tensions section.

## §3 — Step 5 synthesis as robustness_ladder

Replace the prior freeform synthesis with a tiered output. Every cross-lane claim is placed into exactly one tier:

| Tier | Promotion rule | Evidence required |
|---|---|---|
| **Unsupported** | failed audit (`⚠ link-dead` OR `⚠ quote-not-found` OR domain-harm gate G7 dropped) | n/a — flagged, not promoted |
| **Single-source** | passed audit AND independent-support count = 1 | one verified verbatim quote from one lineage key |
| **Independent-corroboration** | independent-support ≥ 2 AND across ≥ 2 lanes AND no two ⚠ CRAAP axes | two verified verbatim quotes from two distinct lineage keys |
| **Stress-survived** | Independent-corroboration tier AND every supporting finding recorded `Strongest attack` ≥ 5 words AND `Revision action: keep` AND no G7 downgrade | as above plus a recorded critique passed by the lane itself |
| **Action-grade** | Stress-survived tier AND (`Authority: A*/A` or equivalent tier-1) AND `Replication status` ∈ {replicated, validated} AND `Assumption ledger` lists no unmet preconditions | as above plus replication evidence and ledger-clear preconditions |

Synthesis output order:

1. **Action-grade claims** — short list; user can act on these now.
2. **Stress-survived claims** — strong; user can act with caveats listed.
3. **Independent-corroboration claims** — promising; needs domain check before action.
4. **Single-source claims** — useful but fragile; flag explicitly.
5. **Unsupported / dropped** — list with one-line reason (link-dead, quote-not-found, domain-harm fail).
6. **Tensions** — cross-lane disagreement. P2 lists informally inside this section. P3 routes through `contradictions.md`.
7. **Pivots taken** — any lane that ran its pivot procedure, with proxy topic noted.
8. **Flagged at audit** — counts of `⚠ link-dead`, `⚠ quote-not-found`, `⚠ redundant-with-other-lane`, `⚠ echo-source`. List only if > 0.
9. **Discarded** — what you cut as truly redundant after preserving consensus counts (one line each).
10. **Gaps** — what all three lanes together did not cover.

Link to all three workspace files. Do not reformat them — subagents own them.

Tier promotions require the corresponding evidence. An Independent-corroboration claim with no recorded critique cannot be promoted to Stress-survived; the `Critique` block per finding is mandatory per the lane mandate (shipped in P1). Use the tier as the structural anchor; freeform prose is acceptable inside each tier section but the tier headings themselves are fixed.

---

This file is orchestrator-only. Lane subagents read only their own lane mandate.
