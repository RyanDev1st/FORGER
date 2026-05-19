# FORGER

Test-gated, execution-centric framework for grounded AI creativity.

- **Spec:** `DESIGN.md` (this directory). Source of truth.
- **Research notes:** `../FORGER.md` (sibling, condensed research).

## Install

```bash
cd framework/forger
npm install
npm run validate:schemas
npm test
npm run install:plugin -- --dry-run     # preview hook merge
npm run install:plugin                  # actually merge into ~/.claude/settings.json
```

## Use

Inside Claude Code:

```
/forger <task description>             # full pipeline
/forger:contract <task description>    # CONTRACT phase only (writes a DoW)
```

The framework will:
1. CONTRACT — clarify intent via socratic dialogue + reframe + mode pick.
2. FIND — fan out research lanes (mode-aware), build source + claim ledgers.
3. OBSERVE — internalize, probe high/critical assumptions.
4. RECOMBINE — produce Tier 1 ideas + (optional) Tier 2 speculation.
5. GRILL — cross-model adversarial review via priority gate.
6. EXECUTE — TDD micro-cycles + acceptance suite + Done-Means-Ran gate.
7. RETAIN — persist proven claims + failed assumptions to the KB.

## Configuration

Copy `.env.example` to `.env` and uncomment any API keys you have. The
reviewer router picks the highest-priority working key that differs from the
current session's provider. With no keys, falls back to a Claude Code
subagent spawn with a different model in the same family.

## Layout

See `DESIGN.md` §4.
