---
name: gnosis-claim-cell
version: 1
---

# SKILL.md — Claim-Cell Swarm

## Purpose
Turn broad research prompts into atomic claim cells: small, auditable units with provenance, confidence, contradiction state, and downstream routing.

## Pipeline
1. **Parse brief** into lens question, boundary conditions, and forbidden drift.
2. **Create workspace** under `results/claim_cell_swarm_2026-05-19_v1/`.
3. **Spawn three isolated lanes** with same brief and lane-specific mandate text:
   - `scholar-dive.md` → peer-reviewed claim cells.
   - `community-search.md` → practitioner claim cells.
   - `edge-finder.md` → divergent claim cells.
4. **Validate each lane** with V1–V6:
   - V1 file exists and non-empty.
   - V2 at least 5 claim cells.
   - V3 no top-level refusal.
   - V4 every cell has verbatim quote.
   - V5 every cell has claim type: fact, method, warning, pattern, counterexample.
   - V6 closing block present.
5. **Merge by claim identity**, not source identity. Keep duplicate support as corroboration count.
6. **Build contradiction map**: supports, disputes, narrows, reframes.
7. **Re-fan once** only for unresolved high-value contradictions.
8. **Return synthesis** with claim table, contradiction table, and raw evidence appendix.

## Output Contract
- `synthesis.md`: final cross-lane synthesis.
- `claim-ledger.md`: all accepted claim cells.
- `contradictions.md`: unresolved conflicts and recommended tests.
- Lane files remain unmodified after return.

## Why This Variation
Original architecture is source-lane centered. This drift makes atomic claims primary. It should improve auditability, contradiction handling, and re-use across future prompts.
