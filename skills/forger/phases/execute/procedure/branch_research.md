# EXECUTE — Branch B: research_report (ledger-coverage check)

**Load only when triggered.** Triggers when
`dow.artifact.type == research_report`.

The research-report branch shifts the gating from runtime tests
(Branch A) to **citation integrity**. Every claim in the report
must trace to a `claim_ledger.yaml` entry with strong entailment.
The acceptance gate runs the audit over the report's citations
rather than a test suite.

---

## Loop

### 1. Draft sections

Draft sections per the artifact specification embedded in
`dow.artifact.description` (section list, target length, audience).

If `dow.artifact.format` is set (e.g. `markdown`, `pdf`,
`html-single-page`), match it. Sections without a specified format
default to markdown.

### 2. Cite every claim

Each section's claims must reference `claim_ledger.yaml` entries
with `entailment: directly_supported`. **No critical claim may sit
at `weakly_supported` or lower in the report.** A claim with weaker
entailment must either be:

- **Strengthened** — re-cite a stronger source via fact-gap re-entry
  (load `procedure/fact_gap_re_entry.md`), then return; or
- **Dropped** — remove the claim from the report and note the
  removal in your escalation log if it was load-bearing.

Quote format: inline link with the source's id, e.g.
`[per the IEEE 802.11 spec, ¶4.2.1](#clm-1234)`. The id matches the
`clm-*` id in `claim_ledger.yaml`.

### 3. Run audit

Run `src/gates/audit.mjs --workspace <path>` on the report. The
audit grep-checks each section's cited claim against the ledger:

- Every `clm-*` reference resolves;
- Every quoted snippet matches the ledger's `verbatim_quote`;
- Every cited URL HEAD-responds 2xx/3xx.

Audit failures must be fixed before invoking the acceptance gate.

### 4. Append acceptance line

Invoke `src/gates/acceptance_test.mjs --workspace <path>` to write
one line per criterion to `acceptance_results.jsonl`. Acceptance
criteria for reports typically include:

- **Ledger coverage** — every section has ≥1 claim cite;
- **No broken citations** — audit must exit 0;
- **No critical claim at weak entailment** — re-checked per section.

### 5. On failure

If a section is short on cited claims and the missing facts are real
(not a sourcing-discipline failure), load
`procedure/fact_gap_re_entry.md`. The re-entry narrows on the
specific topic the section needs more sources for.

If the failure is editorial (a section is just under length, a
heading is misnamed), fix it inline and re-run the acceptance gate.

---

## Stop conditions

- `src/gates/acceptance_test.mjs --workspace <path>` exits 0.
- Fact-gap re-entry fires.
- Escalation fires.
