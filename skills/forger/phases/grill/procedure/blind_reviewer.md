# GRILL — blind reviewer pass (deep mode only)

**Load only when triggered.** Triggers at step 5 of `procedure/main.md`
when `mode == deep` (equivalently `mode.grill_blind_reviewer == true`).
Do not load in quick or standard mode.

The blind reviewer sees only the DoW — no proposal, no source ledger,
no risk map. Its hypotheses surface what the non-blind reviewer's
exposure to the proposal might have anchored away. Divergences
between the two sets are signal about blind spots in the non-blind
review.

---

## Procedure

### B1. Compose the blind adversary prompt

Read `refs/blind_adversary_mandate.md` verbatim. Concatenate with
**only** `workspaces/{slug}/dow.yaml` as the user prompt.

Do not include `source_ledger.yaml`, `claim_ledger.yaml`,
`risk_map.yaml`, or `recombine.md`. The whole point is the reviewer
generates hypotheses against the DoW alone, without seeing what's
been grounded or proposed.

### B2. Invoke the reviewer (blind)

Call
`src/lib/reviewer_router.mjs::invokeReviewer(systemPrompt, dowOnly, {blind: true})`.
Capture `{tier, response, reviewer_meta}`.

The router selects from the same provider pool as the non-blind call.
Tier requirements for deep mode: `≥ good`. If the router cannot
reach a `good` or `best` tier provider, escalate to the user rather
than fall through to `acceptable` — deep mode's blind requirement is
a hard floor.

### B3. Parse blind response

Parse the reviewer's YAML list response identically to step 4 of
`procedure/main.md`. The one difference:

- Tag every entry with `blind: true` (versus `blind: false` for the
  non-blind set).

Append the parsed entries to the same
`workspaces/{slug}/failure_hypotheses.yaml` file. Do not write to a
separate file; the audit + resolution loop walk one list.

### B4. Resume `main.md` step 6

Return to step 6 of `procedure/main.md` (resolution loop). The
resolution loop walks all entries — blind and non-blind together —
in severity order. The blind-vs-non-blind tag is metadata for later
audit (and for the deep-mode gate 4 check that ≥1 entry has
`blind: true`).

---

## Why a blind pass

A reviewer that sees the proposal can be anchored by it — its
critiques tend to refine what's already on the page. A blind
reviewer must imagine what could go wrong from the DoW alone, which
catches a different class of failure: ones the proposal silently
skipped past, not ones the proposal handled poorly.

Cheap divergence test: count entries where the blind reviewer flagged
a failure mode the non-blind reviewer did not. That count is a noisy
signal of blind-spot density in the proposal. RETAIN can later
correlate the count with downstream EXECUTE failures.
