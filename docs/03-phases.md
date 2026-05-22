# The seven phases

This is the per-phase reference. Each section covers: what the phase does, what it reads and writes, what the gate is, and where to find the demo.

For the framework-level tour, see [How FORGER works](02-how-it-works.md). For full walkthroughs, see [Demos](04-examples.md).

---

## Pipeline at a glance

```text
  CONTRACT → FIND → OBSERVE → RECOMBINE → GRILL → EXECUTE → RETAIN
   (intent) (ground) (probe)   (create)  (attack)  (build)  (persist)
       │       │        │         │         │        │         │
       ▼       ▼        ▼         ▼         ▼        ▼         ▼
     DoW   ledgers  risk map  proposals  hypotheses  artifact   KB
                              (tiered)
```

Each phase has one job. No phase is allowed to do another phase's job.

---

## Phase 0: CONTRACT — clarify intent

### Purpose
Turn a vague user request into a machine-readable Definition of Works that every later phase will obey.

### Reads
- User prompt (text)
- Optional: prior `definition_of_works.yaml` if re-running

### Writes
- `definition_of_works.yaml`
- `reframe_memo.md`

### What happens

```text
┌────────────────────────────────────────────────────────────┐
│                  CONTRACT (Phase 0)                        │
│                                                            │
│  User input ──▶ ┌─────────────────────┐                    │
│                 │ Vagueness detection │                    │
│                 │ • unclear artifact  │                    │
│                 │ • missing success   │                    │
│                 │ • ambiguous limits  │                    │
│                 │ • mixed goals       │                    │
│                 └──────────┬──────────┘                    │
│                            ▼                               │
│              ┌──────────────────────────┐                  │
│              │ Socratic elicitation     │                  │
│              │ • maieutics              │                  │
│              │ • elenchus               │                  │
│              │ • aporia                 │                  │
│              │ • dialectic              │                  │
│              └──────────┬───────────────┘                  │
│                         ▼                                  │
│              ┌──────────────────────────┐                  │
│              │ Problem reframing        │                  │
│              │ • simpler version?       │                  │
│              │ • are constraints real?  │                  │
│              │ • adjacent framing?      │                  │
│              └──────────┬───────────────┘                  │
│                         ▼                                  │
│              ┌──────────────────────────┐                  │
│              │ Write DoW + reframe memo │                  │
│              └──────────┬───────────────┘                  │
│                         ▼                                  │
│              ┌──────────────────────────┐                  │
│              │ Schema gate              │                  │
│              │ (mechanical validation)  │                  │
│              └──────────────────────────┘                  │
└────────────────────────────────────────────────────────────┘
```

### Gate
`definition_of_works.yaml` validates against the schema. Every hard constraint has a verification method. Every success criterion has a measurable threshold and a test method.

### Modes
- **Interactive**: agent asks clarification questions, waits for answers
- **Autonomous**: agent fills the contract with conservative assumptions, tags each as a risk

### Demo
See [Demos: CONTRACT](04-examples.md#contract-demo).

---

## Phase 1: FIND — ground in live sources

### Purpose
Build a Source Ledger and Claim Ledger from the live internet using a stealth browser. Not search-API snippets. Real pages.

### Reads
- `definition_of_works.yaml`
- `knowledge/<domain>/` if the domain has prior runs

### Writes
- `source_ledger.yaml` (one entry per source)
- `claim_ledger.yaml` (one entry per claim, severity-tagged)
- `ground_truth_brief.md` (draft)

### Lanes

| Lane | Targets |
| --- | --- |
| **Production** | Official docs, peer-reviewed papers, repos with active CI, conference proceedings |
| **Community** | GitHub Issues, Stack Overflow, Reddit, HN, named-byline practitioners |
| **Edge** *(deep mode only)* | Refutation papers, contrarian essays, cross-domain analogues, outlier benchmarks |

Each lane runs as a subagent with its own mandate. Lanes operate in isolation; they do not see each other's outputs during fan-out.

### Source quality dimensions
LLM scores each surviving source on six axes:

- Authority — is this source recognised in its domain?
- Recency — is it current, given the domain's drift rate?
- Reproducibility — can claims be independently verified?
- Implementation relevance — how directly does it inform the build?
- Independence — original source or derivative?
- Conflict of interest — does the source have incentives to mislead?

### Claim severity

| Severity | Required support |
| --- | --- |
| Trivial | No citation needed |
| Low | One source |
| Medium | Source + reasoning |
| High | Source + probe (or human waiver) |
| Critical | Source + probe + acceptance test (or human waiver) |

### Entailment status
Every claim is tagged: `directly_supported`, `weakly_supported`, `extrapolated`, `contradicted`, `unverified`, or `speculative`. Critical claims with `weakly_supported` or worse are blocked.

### Gate
`audit.sh` runs after the lanes return. It HEAD-checks every URL and greps every verbatim quote against the page text. Dead links and missing quotes flag the finding (do not delete it). The schema gate validates ledger format.

### Demo
See [Demos: FIND](04-examples.md#find-demo).

---

## Phase 2: OBSERVE — internalise and probe

### Purpose
Convert the ledger into mechanism understanding, identify risky assumptions, and run probes to falsify them.

### Reads
- `source_ledger.yaml`, `claim_ledger.yaml`, `ground_truth_brief.md` (draft)

### Writes
- `ground_truth_brief.md` (final)
- `risk_map.yaml`
- `probe_results.jsonl`

### The Feynman gate
The agent explains the domain in plain terms, defining every term it uses. If the explanation breaks, the agent has not internalised the material. Re-read sources, re-attempt explanation.

### Risk map
Every unverified assumption is listed with severity and required resolution.

### Probes
For every `high` or `critical` assumption, the agent writes the smallest test that can falsify it. A probe can be:
- A short script testing API behaviour
- A repo clone + test suite run
- A targeted benchmark
- A prototype function with measured output

### Gate
**Zero unresolved high or critical assumptions without either a passed probe or a documented human waiver.** This is the probe gate. It is the architectural expression of Sartori's proper basing relation: you cannot claim to understand something you have not tested.

### Demo
See [Demos: OBSERVE](04-examples.md#observe-demo).

---

## Phase 3: RECOMBINE — tiered creative blending

### Purpose
Produce candidate designs by combining verified elements. Speculative ideas are allowed but firewalled.

### Reads
- `ground_truth_brief.md`, `risk_map.yaml`, `probe_results.jsonl`

### Writes
- `proposals/tier1.md` (grounded, executable)
- `proposals/tier2.md` (speculative, firewalled)
- `proposals/tier3.md` (transformational, requires human promotion)

### Mechanism-fit test
For every proposed combination, the agent answers: *does the causal mechanism that made this work in the source domain still apply in the target domain?*

Two true claims combined into a false idea is the classic grounded-hallucination failure. The mechanism-fit test is the gate that catches it.

### Tiers

| Tier | Description | Can it enter EXECUTE? |
| --- | --- | --- |
| **Tier 1** | Combines proven elements; full source lineage; mechanism-fit passed | Yes |
| **Tier 2** | Extends beyond direct evidence; includes a validation plan | Only after validation passes |
| **Tier 3** | Challenges domain assumptions | Only with explicit human approval |

### Gate
Tier 2/3 proposals are written to separate files. The pipeline reads only `tier1.md` for EXECUTE input. Anything that smells speculative but is tagged Tier 1 fails the schema gate.

### Demo
See [Demos: RECOMBINE](04-examples.md#recombine-demo).

---

## Phase 4: GRILL — falsification review

### Purpose
A reviewer from a different model family attacks the proposal. The reviewer does not score. It hunts for failure modes.

### Reads
- `proposals/tier1.md`, `source_ledger.yaml`, `claim_ledger.yaml`

### Writes
- `failure_hypotheses.yaml`
- `review_report.md`

### Reviewer architecture

| Mode | Reviewers |
| --- | --- |
| `standard` | Single cross-model reviewer (different family from executor) |
| `deep` | Cross-model + blind reviewer (sees only the DoW, does its own independent search) |

The reviewer router lives at `src/lib/reviewer_router.mjs`. Adapters: OpenAI, Gemini, cross-account Anthropic. The router refuses to spawn a reviewer from the same family as the executor.

### Failure hypothesis format

```yaml
- id: fh-3
  claim: "MobileNetV3 small fits in <100ms on Pixel 7"
  what_would_make_it_fail: "Thermal throttling under sustained 30fps video"
  evidence_required: "5-minute sustained run on Pixel 7 with thermal logging"
  severity_if_wrong: critical
  confidence: medium-high
  status: open
```

### Resolution required
The executor must resolve every hypothesis:

| Status | Means |
| --- | --- |
| `accepted` | Hypothesis is plausible; add a test to acceptance suite |
| `rejected` | Counter-evidence from Source Ledger; cite the entry |
| `escalated` | Cannot resolve without human; pipeline pauses |

### Gate
Zero hypotheses in `status: open`. All are `accepted`, `rejected`, or `escalated`.

### Demo
See [Demos: GRILL](04-examples.md#grill-demo).

---

## Phase 5: EXECUTE — build, run, fix, prove

The center of gravity. This is where Wallas's *verification* stage becomes concrete.

### Purpose
Build the artifact. Prove it works against the DoW. No "I think it works." Run it.

### Reads
- `proposals/tier1.md`, `failure_hypotheses.yaml`, `definition_of_works.yaml`

### Writes
- `artifact/*` (the actual code/report/design)
- `test_log.jsonl`
- `acceptance_report.md`

### The sub-pipeline

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXECUTE SUB-PIPELINE                                  │
│                                                                              │
│   Enter: Tier-1 proposal + DoW + resolved hypotheses                         │
│                                                                              │
│            ┌─────────────────────────────┐                                   │
│            │ Compile Acceptance Suite    │                                   │
│            │ • DoW success_criteria      │  ← every test traces to a         │
│            │ • DoW hard_constraints      │     DoW id                        │
│            │ • Accepted failure hypos    │                                   │
│            │ • Regression tests from KB  │  ← prior failures in this domain  │
│            └──────────────┬──────────────┘                                   │
│                           │                                                  │
│                           ▼                                                  │
│            ┌─────────────────────────────┐                                   │
│            │ Order tests by risk         │                                   │
│            │ (critical → high → medium)  │                                   │
│            └──────────────┬──────────────┘                                   │
│                           │                                                  │
│                           ▼                                                  │
│         ┌─────────────────────────────────────┐                              │
│   ┌────▶│  TDD MICRO-CYCLE (per behaviour)    │                              │
│   │     └──────────────┬──────────────────────┘                              │
│   │                    ▼                                                     │
│   │     ┌─────────────────────────────────────┐                              │
│   │     │ 1. Write failing test               │                              │
│   │     │    (or load the next planned one)   │                              │
│   │     └──────────────┬──────────────────────┘                              │
│   │                    ▼                                                     │
│   │     ┌─────────────────────────────────────┐                              │
│   │     │ 2. Write minimal code to pass       │                              │
│   │     └──────────────┬──────────────────────┘                              │
│   │                    ▼                                                     │
│   │     ┌─────────────────────────────────────┐                              │
│   │     │ 3. post_code.sh hook                │                              │
│   │     │    • linter                         │                              │
│   │     │    • full test suite                │                              │
│   │     │    • coverage delta                 │                              │
│   │     └──────────────┬──────────────────────┘                              │
│   │                    │                                                     │
│   │     pass ─────┐    │     fail (≤2 attempts)                              │
│   │               │    └──────────────────┐                                  │
│   │               ▼                       ▼                                  │
│   │     ┌────────────────────┐  ┌─────────────────────┐                      │
│   │     │ 4. Log delta:      │  │ Patch + retry       │                      │
│   │     │   what changed,    │  │ (LLM proposes fix)  │                      │
│   │     │   why, evidence    │  └──────────┬──────────┘                      │
│   │     └─────────┬──────────┘             │                                 │
│   │               │                        ▼                                 │
│   │               │             fail again (≥3 attempts)                     │
│   │               │             ┌──────────────────────────────┐             │
│   │               │             │ 1. Web-search exact error    │             │
│   │               │             │    via cloakbrowser           │            │
│   │               │             │ 2. Read top 3 results         │            │
│   │               │             │ 3. Try fix derived from real  │            │
│   │               │             │    sources                    │            │
│   │               │             └──────────────┬───────────────┘             │
│   │               │                            │                             │
│   │               │              fail again ───┤                             │
│   │               │                            ▼                             │
│   │               │                  ┌──────────────────┐                    │
│   │               │                  │   ESCALATE       │                    │
│   │               │                  │   • human review │                    │
│   │               │                  │   • or abort run │                    │
│   │               │                  └──────────────────┘                    │
│   │               ▼                                                          │
│   │     ┌─────────────────────────────────────┐                              │
│   │     │ More behaviours in this batch?      │                              │
│   │     └──────┬──────────────────────┬───────┘                              │
│   │            │ yes                  │ no                                   │
│   └────────────┘                      ▼                                      │
│                            ┌──────────────────────┐                          │
│                            │ Run full acceptance  │                          │
│                            │ suite (every test    │                          │
│                            │ from compile step)   │                          │
│                            └──────────┬───────────┘                          │
│                                       │                                      │
│                       all pass ───┐   │   any fail ──┐                       │
│                                   ▼   ▼              ▼                       │
│                         ┌──────────────────┐ ┌────────────────────┐          │
│                         │  DONE MEANS RAN  │ │ Treat first failure │         │
│                         │  acceptance_     │ │ as next test in TDD │         │
│                         │  report = green  │ │ micro-cycle         │         │
│                         │  → RETAIN        │ └─────────────────────┘         │
│                         └──────────────────┘                                 │
│                                                                              │
│  Hard rules:                                                                 │
│  • The agent cannot claim completion with a red acceptance suite             │
│  • Tier 2/3 ideas cannot enter this loop without explicit promotion          │
│  • Every failed-then-fixed bug leaves behind a permanent regression test     │
│  • If execution is structurally impossible, document why and escalate;       │
│    do not silently succeed                                                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### What "Done Means Ran" looks like per artifact type

| Artifact | Done means |
| --- | --- |
| Code / system | Artifact executed successfully AND acceptance tests pass |
| Research report | Every claim ledger-verified with `directly_supported`; zero critical claims at `weakly_supported` or worse |
| Design | Rubric satisfied AND screenshots match spec AND user-flow review passed |
| Any | If execution is impossible: reason documented, alternative verification protocol passed, escalation noted |

### Gate
`acceptance_report.md` has every DoW criterion green, every accepted failure hypothesis green, every regression test green. No skipped tests. No `xfail` without an open issue.

### Demo
See [Demos: EXECUTE](04-examples.md#execute-demo).

---

## Phase 6: RETAIN — persist and self-evolve

### Purpose
Bank wins, bank failures, set TTLs, generate shortcuts.

### Reads
- `acceptance_report.md`, `source_ledger.yaml`, `failure_hypotheses.yaml`, `risk_map.yaml`

### Writes
- `knowledge/<domain>/working_architectures.md`
- `knowledge/<domain>/failure_memory.yaml`
- `knowledge/<domain>/source_quality.yaml`
- `knowledge/<domain>/runs.jsonl` (appended)
- `retro_note.md`

### What gets stored

| Category | What | TTL |
| --- | --- | --- |
| Proven claims | Passed probes + passed acceptance | Domain-dependent (ML libs: 6 months; OS APIs: 18 months) |
| Working architectures | Patterns that delivered green acceptance, with version pins | Until version pin invalidates |
| Failure memory | Assumptions that proved wrong, with the lesson | Permanent (failures are more durable than successes) |
| Source quality | Per-source authority + recency + reproducibility scores | Re-evaluated on every cite |

### Self-evolution trigger
After three successful runs in the same domain (`runs.jsonl` has 3+ green entries), the framework auto-generates a Quick Forge shortcut for that domain:

- FIND reads cached `source_ledger.yaml` instead of running the lanes
- OBSERVE skips probes that already passed for the same assumptions
- EXECUTE seeds the acceptance suite with prior regression tests

Token cost typically drops ~60% on the fourth run onward.

### Demo
See [Demos: RETAIN](04-examples.md#retain-demo).

---

## What can interrupt the pipeline

| Trigger | Phase | Behaviour |
| --- | --- | --- |
| Schema validation fails | Any | Pipeline pauses, agent fixes, retries |
| Lane returns under floor | FIND | Pivot to adjacent topic (flagged), or escalate after 3 retries |
| Probe gate fails | OBSERVE | Cannot proceed without probe or waiver |
| Tier 3 idea wants execution | RECOMBINE | Pause for human approval |
| Open failure hypothesis | GRILL | Cannot proceed until resolved |
| Acceptance suite red | EXECUTE | Re-enter TDD with failure as next test |
| Agent session limit hit | Any | Workspace state on disk; resume from last gate next session |

The pipeline is resumable because every important piece of state is a file, not memory.

---

## Next

- [Demos](04-examples.md) — concrete walkthroughs of each phase
- [Architecture](06-architecture.md) — plugin filesystem, schemas, audit internals
