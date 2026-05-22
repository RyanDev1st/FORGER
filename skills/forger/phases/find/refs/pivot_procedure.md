# Pivot Procedure (FIND phase)

A lane is **under-sourced** when it has exhausted its honest search budget
(30 minutes elapsed, or three consecutive empty searches, or the obvious
queries have all been tried) and still sits below its floor:

- production: 5 claims
- community: 5 claims
- frontier:  3 claims

When this happens, the lane runs the pivot procedure below. The point of the
pivot is not to *fake* coverage — it is to find a **proxy topic** that still
informs the DoW, so the OBSERVE phase has *something* to probe instead of a
blank ledger. A lane that pivots is honest about it: the pivot is flagged in
the closing block.

This procedure has **five numbered steps**. Run them in order; you may exit
early if you reach the floor before step 5.

---

## Step 1 — Diagnose the gap honestly

Before pivoting, confirm the gap is real. Read your own search history and
answer:

- Did I search the canonical sources for this lane? (For production: vendor
  docs, peer-reviewed venues, vendor RFCs. For community: Stack Overflow tag
  pages, GitHub Issues with the right labels, the top subreddits. For
  frontier: critique sections, debates, cross-disciplinary analogues.)
- Did I search using both the user's vocabulary *and* the domain's
  vocabulary? (The user may say "stream", the domain may say "pipe".)
- Did I follow internal links 1-2 hops deep, or did I only read titles?
- Did I rule out a source because of a flag the audit gate would not have
  flagged (e.g., "I didn't like the author")?

If any answer is "no", **go back and do that first**. The pivot is a last
resort; most of the time the gap closes when the search is genuinely
exhausted, not just felt-exhausted.

## Step 2 — Identify a proxy topic that still informs the DoW

A proxy topic is a different question whose answer still constrains the DoW
the user gave you. Examples:

- DoW asks about library X version 5; X v5 is too new to have community
  evidence yet → pivot to X v4 evidence + the v4-to-v5 changelog.
- DoW asks about a specific algorithm A in domain D; A is obscure → pivot to
  a more popular algorithm B in domain D that solves the same sub-problem,
  and look for evidence about D's general behavior.
- DoW asks about edge-case behavior of API X under condition C; condition C
  is undocumented → pivot to the *general* behavior of API X under any
  documented condition, and treat the gap as an OBSERVE probe candidate.

A proxy topic is **not** a tangent. The test: can you, in one sentence,
explain how a claim from the proxy topic would change the implementation of
the original artifact? If yes, the proxy is legitimate. If no, find a
different proxy.

## Step 3 — Pivot and search the proxy

Run the same search workflow you ran for the original topic, with the proxy
as the search target. Use the same source criteria for your lane —
production sources are still production sources, community sources still
community sources. Apply the same quality rubric.

Time-box: 10 minutes for the proxy search. The proxy is a recovery
mechanism, not a full second pass.

## Step 4 — Tag pivoted claims explicitly

Every claim that comes from the proxy topic — not the original DoW topic —
gets a `notes` line in its source entry (or a brief mention in the claim's
`mechanism` field) noting the pivot. Example mechanism text:

  "Pivoted from X v5 to X v4 because v5 has no community evidence yet.
   v4 behavior under load is the closest available proxy; OBSERVE should
   probe whether v5 inherits this behavior."

Severity and entailment are scored normally — the fact of pivoting does not
change either dimension. A `directly_supported` claim about a proxy topic is
still `directly_supported`; the *connection to the DoW* is what's weakened,
and the `mechanism` field captures that weakness.

## Step 5 — Write the closing block honestly

Append (or update) the lane's `# ---LANE_SUMMARY---` block at the bottom of
`source_ledger.yaml` with:

  pivot_taken: true
  pivot_proxy_topic: '<short phrase identifying the proxy>'
  under_sourced: <true|false depending on whether the pivot reached the floor>

If after the proxy search the lane is **still** below floor, set
`under_sourced: true`. The orchestrator will see this and either:
- (production / community) treat the lane as under-sourced and continue;
- (frontier) treat the lane as silently pivoted and continue without
  blocking.

The orchestrator never punishes a lane for an honest pivot. The failure
mode the orchestrator punishes is *silent* under-coverage — claims that
pretend to address the DoW but actually drift to an unrelated topic. The
closing block is the contract that prevents that.

---

## Worked pivots

### Pivot A — production lane, fast-moving library

**Original DoW.** "Build an OAuth2 token-refresh helper using the new
WorkOS Node SDK v3.0 alpha."

**Honest search.** The vendor docs page exists, but it is a stub. There are
no peer-reviewed papers, no merged PRs that exercise the alpha API, no
working OSS repos that have integrated v3.0 yet.

**Proxy topic.** WorkOS Node SDK v2.x — the most recent stable line —
combined with the v2-to-v3 migration guide. v2 has a working integration in
several published repos and a few WorkOS engineering blog posts.

**Why this is a legitimate proxy.** v3.0 alpha's auth surface is a
near-superset of v2.x; the migration guide enumerates the differences. A
claim from v2.x carries forward to v3.0 unless the migration guide flags
that surface as changed.

**Closing block.**
  pivot_taken: true
  pivot_proxy_topic: 'WorkOS Node SDK v2.x + v2→v3 migration guide'
  under_sourced: false
  notes: |
    No production-grade v3.0 alpha evidence exists yet. v2.x patterns
    transfer except where the migration guide flags otherwise. OBSERVE
    should probe each v2-sourced claim against the v3.0 alpha binary.

### Pivot B — community lane, undocumented condition

**Original DoW.** "Handle the case where AWS Lambda's RDS Proxy returns an
empty connection pool during a cold start."

**Honest search.** AWS forum threads talk about cold starts and connection
pools separately, but the intersection is not a documented condition.
Stack Overflow questions on the exact intersection get zero answers.

**Proxy topic.** Two adjacent topics: (1) general AWS Lambda cold-start
behavior with VPC-attached functions; (2) general RDS Proxy connection-pool
exhaustion under any cause.

**Why this is a legitimate proxy.** The empty-pool-during-cold-start failure
is a composition of two known failures. Evidence about each component
constrains how the artifact should retry, log, and surface the error, even
without a single source that names the exact intersection.

**Closing block.**
  pivot_taken: true
  pivot_proxy_topic: 'Lambda VPC cold-start + RDS Proxy pool exhaustion (composed)'
  under_sourced: false
  notes: |
    Direct evidence on the intersection does not exist. Pivoted to the two
    component failures and synthesized. OBSERVE should add a probe that
    forces the intersection in a staging environment, so the next run of
    this DoW can have direct evidence.
