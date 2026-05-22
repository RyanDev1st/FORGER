# RECOMBINE — Tier 2 (speculative, standard / deep)

**Load only when triggered.** Triggers at step 3 of `procedure/main.md`
when `2 ∈ recombine_tiers_allowed` (standard or deep mode). Do not
load in quick mode.

Tier 2 ideas go beyond direct claim evidence but include a concrete
validation plan. They live behind the firewall until promoted.

---

## Procedure

### T2.1. Identify speculative seeds

Primary seeds: claims with `intended_use: tier2_seed` from FIND's
frontier lane (deep mode only — standard mode skips the frontier lane
but may still produce Tier 2 from weak-entailment claims).

Secondary seeds: `broken`-verdict Tier 1 candidates rerouted from
step 2 of main. The speculative version may still have value if a
validation plan can lift it back to Tier 1.

Tertiary seeds: cross-lane tensions surfaced in `find_summary.md` —
combinations where lanes disagreed on the mechanism's applicability.

### T2.2. Write entries to `tier2_speculation.md` only

Use the Tier 2 schema:

```
## <idea-slug>: <short title>

- idea: <prose, 1-3 sentences>
- why_speculative: <what evidence is missing>
- validation_plan: <concrete test whose pass would lift to Tier 1>
- frontier_seed_refs: [<clm-id from frontier lane>, ...]
- promoted_at: null
```

`frontier_seed_refs` cites the `intended_use: tier2_seed` claims FIND's
frontier lane produced. If your mode skipped the frontier lane,
`frontier_seed_refs` can be empty, but then `why_speculative` has to
do the work of explaining why the idea is not yet groundable.

Set `promoted_at: null` on every new entry. Only the orchestrator or
the user sets a timestamp, and only after the validation plan has
actually been run and observed to pass.

### T2.3. Header + line shape discipline

The `## ` header plus the `- idea:` and `- promoted_at:` lines match
the parser shape in `src/hooks/enforce_tier_firewall.mjs`. The firewall
scans these to build its denylist of non-promoted speculative content.
Stray from the shape and the firewall under-protects.

Worked example: `examples/tier2.example.md`.

### T2.4. Do not write to `recombine.md`

Tier 2 content stays in `tier2_speculation.md`. Any cross-pollination
into the Tier 1 file is the firewall's job to block. Resume
`procedure/main.md` step 4 (Tier 3) or step 5 (firewall + exit) when
done.
