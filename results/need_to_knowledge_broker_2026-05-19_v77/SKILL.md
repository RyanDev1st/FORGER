Parent: ARCHITECTURE.md

# Gnosis — Need-to-Knowledge Broker v77

## Status

v77. Search-first, browser-read, knowledge-broker gated.

## Scope

This variation treats reTruth as a broker between need, knowledge, invention, implementation, and delivery. It blocks technical answers that are searching for a market question.

## Pipeline

### Step 1 — Search first

Search for needs, existing knowledge, patents/repos/datasets, working prototypes, stakeholder constraints, and delivery channels. Snippets only seed candidates.

### Step 2 — Browser-read candidates

Open every candidate with `playwright-cli`. Record visible title, final URL, browser status, and one verbatim quote.

### Step 3 — Build `ntk-ledger.md`

```markdown
### Broker N<n>: <need or knowledge object>
- Final URL:
- Source class: need | publication | patent | repo | dataset | prototype | stakeholder | market | blocked
- Browser status: opened | blocked | dead | mismatch
- Verbatim quote: "<≤25 words>"
- NtK phase: need | existing-knowledge | invention | development | implementation | impact
- Need statement:
- Knowledge already exists: yes | no | partial | unknown
- Stakeholders affected:
- Transfer mechanism: knowledge translation | technology transfer | commercial transaction | community adoption | unknown
- Gate decision: pass | fill-gap | adapt-existing | reject | re-search
- Route hint: scholar | community | edge | synthesize
```

### Step 4 — Need gate

Do not generate solution ideas until a source-backed need exists. Reject supply-push ideas where technical answers seek a question.

### Step 5 — Existing-knowledge gate

Before new invention, search publications, repositories, patents, datasets, and working examples. If valid knowledge exists, adapt instead of reinventing.

### Step 6 — Stakeholder gate

Map who must use, maintain, approve, pay for, or be affected by the output. Missing stakeholders become gaps, not assumptions.

### Step 7 — Transfer gate

Classify how knowledge moves into use: translation, technology transfer, commercial transaction, or community adoption.

### Step 8 — Impact gate

Synthesize only candidates with need fit, existing-knowledge status, stakeholder path, and transfer mechanism.

## Validation gates

- No need evidence means no solution synthesis.
- Existing working knowledge beats fresh invention.
- Stakeholders must be named or logged as unknown.
- Transfer path must be explicit before deliverable tier.
- Rejected supply-push ideas remain in ledger.

## Closing

Return need map, existing knowledge map, invention gaps, stakeholder gaps, transfer paths, rejected supply-push ideas, and impact-ready candidates.
