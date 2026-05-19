# TTL defaults (RETAIN phase)

default_ttl_days: 90  (general technical claims)

Override suggestions:
  - 30   fast-moving libraries (frontend frameworks, model versions)
  - 60   evolving standards
  - 180  language/runtime fundamentals
  - 365  algorithmic / mathematical claims
  - never (use 9999) — definitional / mathematical proofs

Setting:
  - retro_note.ttl_overrides: { claim_id: days_override }
  - index.default_ttl_days for the whole domain

---

## How TTL is applied

`tools/update_kb.mjs` stamps every proven claim it merges with an
`expires_at` ISO-8601 timestamp computed as `now + ttl_days`. The
lookup order is:

1. `retro_note.ttl_overrides[claim_id]` — per-claim override from the
   retro this task is persisting.
2. `knowledge/{domain}/index.yaml.default_ttl_days` — per-domain
   default, settable by maintainers when the domain's nature is
   stable enough (math) or volatile enough (a vendor SDK on a
   weekly release cadence) to deviate from the framework default.
3. Framework default — **90 days**.

The first lookup that returns a value wins. Source rows are stamped
with their own TTL from `source_ledger_entry.ttl_days` (default 90),
independent of the claim TTL — a long-lived claim can sit on a short-
lived source (a vendor blog post may rot before the underlying claim
does), in which case a future FIND will need to re-cite the claim.

When a claim's `expires_at` passes, the next FIND in the domain
treats the claim as **stale**: it remains in the ledger for audit,
but the FIND-from-cache shortcut does not count it toward coverage,
and the orchestrator may schedule a refresh probe before relying on
it again. The decay path is passive — RETAIN does not delete expired
claims, and TTL does not affect the current task's exit.

---

## Override suggestions — extended rationale

### 30 days — fast-moving libraries

Anything whose public surface changes on a monthly cadence: most
frontend frameworks (React, Vue, Svelte release notes), inference
SDKs and model versions (`claude-*`, `gpt-*`, `gemini-*`), serverless
runtimes that ship breaking semver-minors, infra-as-code providers
mid-major-version. A claim about a specific API shape, deprecation
notice, or runtime behavior in this category is more likely than not
to be stale at the 90-day mark. 30 days roughly matches the average
release cadence and forces a re-cite at the moment a refresh is
genuinely cheap.

### 60 days — evolving standards

W3C, WHATWG, and ECMA drafts pre-stage; RFC drafts; OWASP top-N
revisions; OpenAPI / GraphQL spec revisions; security advisories that
get superseded by patches. These move slower than vendor SDKs but
faster than language fundamentals. 60 days is a compromise: long
enough to amortize the cost of an audit refresh, short enough that
a major revision in the interim still triggers a re-cite.

### 180 days — language/runtime fundamentals

Established language semantics (closures, async, GC behaviour at the
documented level), stable runtime API contracts (Node.js fs, Python
stdlib, Go stdlib), database query semantics from a stable major
version. These can change but rarely do; 180 days reduces re-cite
churn without straying into "we assume nothing ever changes"
territory.

### 365 days — algorithmic / mathematical claims

Complexity bounds, formal correctness proofs of well-known
algorithms, settled performance characteristics of canonical data
structures. The underlying truth doesn't expire; what can expire is
the *citation* (a paper moves URLs, a blog rots). A 365-day TTL
hedges against citation rot, not the math itself.

### never (use 9999) — definitional / mathematical proofs

Definitions of standard mathematical objects, fully proven theorems
in mature subfields, immutable physical constants, axiomatic
definitions in the source-of-truth standard for a topic. Setting TTL
to 9999 effectively pins the claim until a maintainer manually
expires it.

---

## Worked example — three `ttl_overrides` entries

A task ships in a domain that mixes a fast-moving library claim, a
language-fundamental claim, and a mathematical claim. The retro
includes:

```yaml
ttl_overrides:
  clm-react-19-actions-shape: 30      # React 19 actions API is new and moving
  clm-node-stream-pipeline-error: 180 # Node.js core fs/stream semantics, stable
  clm-bigo-binary-search: 365         # O(log n) binary search, math claim
```

What the tool does with these:

- For `clm-react-19-actions-shape`: stamps `expires_at = now + 30d`.
  The next domain task starts in 31 days; FIND finds the claim
  expired, the cache-shortcut path skips it for coverage, the
  orchestrator schedules a refresh probe before relying on the React
  19 actions claim.
- For `clm-node-stream-pipeline-error`: stamps `expires_at = now +
  180d`. Six months of free reuse before a refresh is even
  considered. Realistic for a stable Node.js core API.
- For `clm-bigo-binary-search`: stamps `expires_at = now + 365d`.
  Effectively pinned for the year. If a citation rots inside the
  year, the audit during the next task using the claim will catch
  the broken URL and trigger an explicit refresh — the TTL stays out
  of the way.

The remaining proven claims (not in `ttl_overrides`) inherit
`index.default_ttl_days` (or 90 days framework default if the index
hasn't been overridden). A claim that should expire on the framework
default never needs an entry in `ttl_overrides`.

---

## When to set `index.default_ttl_days` instead

A per-domain default beats a per-claim override when **most** claims
in the domain belong to the same TTL bucket. Examples:

- A `frontend-framework-X` domain whose every claim is React-version-
  specific: set `default_ttl_days: 30` on the index and let claims
  inherit it, only override the rare cross-version-stable claim.
- A `pure-math-foo` domain whose claims are nearly all theorems: set
  `default_ttl_days: 365` (or 9999) on the index, override the rare
  software-implementation citation.

When the domain is mixed, the per-claim override path is preferable;
when the domain is uniform, the per-domain default is cheaper and
clearer.
