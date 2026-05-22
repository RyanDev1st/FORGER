# FORGER documentation

Start here.

---

## Read this first

If you read one doc:

→ **[What is FORGER?](01-what-is-forger.md)** — plain-language overview, the failure mode it targets, the philosophy in short.

---

## The full set

| # | Doc | What's in it | Read it if you want to... |
| --- | --- | --- | --- |
| 1 | [What is FORGER?](01-what-is-forger.md) | Framing, problem, philosophy, what it is and is not | Understand the thing in 10 minutes |
| 2 | [How it works](02-how-it-works.md) | Architecture, BDI split, the agent/harness boundary, what flows between phases | Get the architectural tour |
| 3 | [The seven phases](03-phases.md) | Per-phase reference, gates, and the EXECUTE sub-pipeline in full | Know what each phase actually does |
| 4 | [Demos](04-examples.md) | Full walkthroughs of CONTRACT, FIND, OBSERVE, RECOMBINE, GRILL, EXECUTE, RETAIN | See it in motion with real inputs/outputs |
| 5 | [Usage](05-usage.md) | Install, init, modes, CLI reference, troubleshooting | Run it on your project |
| 6 | [Architecture](06-architecture.md) | Plugin filesystem, schemas, hook contracts, audit internals, KB structure | Understand the implementation or extend it |

---

## Reading paths

**I just want to evaluate this thing.**
1. [What is FORGER?](01-what-is-forger.md)
2. [Demos](04-examples.md)
3. Decide.

**I want to use it on my project.**
1. [What is FORGER?](01-what-is-forger.md)
2. [Usage](05-usage.md)
3. [The seven phases](03-phases.md) when something surprises you

**I want to understand the design.**
1. [What is FORGER?](01-what-is-forger.md)
2. [How it works](02-how-it-works.md)
3. [The seven phases](03-phases.md)
4. [Architecture](06-architecture.md)

**I want to contribute.**
1. [Architecture](06-architecture.md)
2. [FORGER_FLAWS](../framework/FORGER_FLAWS.md)
3. Look at the open issues

---

## Legacy docs

- [framework/FORGER.md](../framework/FORGER.md) — the long-form philosophical foundation. Most of its content has been distilled into docs 1–6 above. Kept for reference and full citations to Sartori, Wallas, Boden, Fauconnier-Turner, EvolveMem, RECAP, Nous, and the BDI-LLM literature.

---

## Status

The architecture is locked. The packaging is being rebuilt against the Claude Code plugin layout. The current install path uses a local marketplace shim; the npm path lands in v0.2. See [FORGER_FLAWS](../framework/FORGER_FLAWS.md) for the open list.
