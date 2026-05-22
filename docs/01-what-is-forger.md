# What is FORGER?

A short answer, a longer answer, and an honest one.

---

## The short answer

FORGER is a harness around an LLM agent that refuses to let the agent declare success until the work has been grounded in live sources, attacked by a cross-model reviewer, and actually executed against acceptance tests.

It is a seven-phase pipeline. Each phase has a deterministic gate. The gates are the product.

---

## The problem it exists to solve

Modern LLMs have a specific, repeatable failure mode that is not a bug, it is the shape of their training. Ask one to design a non-trivial system and you get:

- Plausible architecture
- Real-looking citations
- Internally consistent reasoning
- An artifact that does not work when you try to build it

The APIs were renamed two years ago. The benchmark numbers came from a retracted paper. The cited repository was deprecated in 2022. The agent does not know any of this because its training data is a snapshot of a world that has moved on, and its built-in web search returns sanitised snippets instead of the actual page.

Researchers have a name for it. Chacón Sartori called it the **Bidirectional Coherence Paradox** in 2026: the phenomenon where an agent's internal coherence systematically diverges from empirical reality, so that *the more coherent the explanation, the more convincing the hallucination*.

You have seen this. You asked for a facial emotion recognition system. You got a confident write-up. You tried to build it. You wasted three days on a sandcastle.

FORGER targets that exact failure. Not "AI hallucination" in the abstract. The specific shape of failure where the output passes every soft check and then fails contact with the real world.

---

## The philosophy in plain terms

Humans do not create from nothing. A mathematician learns calculus first, solves a few hundred problems, reads proofs by Euler and Gauss, and only then writes original theorems. A chef cooks classical dishes fifty times each before inventing fusion. The order matters. Skip the grounding step and you do not get creativity, you get noise that sounds like creativity.

LLMs skip the grounding step because nothing stops them. FORGER stops them.

The principles, stated bluntly:

1. **Training data is an orientation device, never a source of truth.** Anything load-bearing has to come from a live source consulted today.
2. **Inspiration must come from real work.** Live GitHub issues, current docs, working repositories with active CI. Not summaries. Not snippets. The actual pages.
3. **Creativity is combination, not conjuration.** Boden's taxonomy distinguishes combinational, exploratory, and transformational creativity. All three start from existing material. FORGER's RECOMBINE phase makes that explicit.
4. **Verification is a separate phase from creation.** The same model that generated the idea is not allowed to grade it. A different model family attacks it in GRILL.
5. **An explanation is not enough. The action must happen.** Done Means Ran. If the code did not execute and pass, the task is not done.
6. **Knowledge must self-evolve.** Every successful run feeds the KB. After three runs in a domain, the framework starts skipping steps it has already paid for.

---

## What FORGER is **not**

| It is not | Because |
| --- | --- |
| A correctness oracle | It catches a specific shape of failure. Plenty of bugs live outside that shape. |
| A creativity suppressor | Speculative ideas are allowed. They live in Tier 2/3 and are firewalled from execution, not deleted. |
| A multi-agent system | Anthropic's own research showed multi-agent setups burn 3–10× the tokens without proportional gains. FORGER is one capable agent + one cross-model reviewer. |
| Useful for trivial tasks | A typo fix does not need a seven-phase pipeline. Use `quick` mode, or skip the framework. |
| Magic | If your goal is poorly defined and you skip CONTRACT, the rest of the pipeline cannot save you. |

---

## Who it is for

FORGER is built for the moment when:

- You want to ship something non-trivial with an agent and trust the result
- Manual verification of the agent's output costs more than running a longer pipeline
- You are doing research synthesis where every claim must trace to a source
- You want to run agents overnight and read the artifact in the morning without flinching

It is not built for pair-programming small refactors, generating boilerplate, or writing throwaway scripts. There are simpler tools for that.

---

## The Epistemic Triangle, very briefly

Sartori's framework says judging an AI's epistemic position takes three criteria, not one:

| Leg | Question | Where FORGER tests it |
| --- | --- | --- |
| **Coherence** | Does the explanation hold together? | RECOMBINE (mechanism-fit), GRILL (reasoning attack) |
| **Grounding** | Does it match physical reality? | FIND (live sources), OBSERVE (runtime probes), EXECUTE (acceptance) |
| **Proper basing** | Does the explanation actually link to the action? | `audit.sh` (claim-to-source traces), EXECUTE (Done Means Ran) |

A coherent explanation alone is not enough. Grounded sources alone are not enough. The connection between the two has to survive scrutiny too. FORGER's phases map onto these three legs deliberately, not by accident.

---

## What you get when it works

A successful FORGER run produces, at minimum:

- The artifact (code, report, design)
- A passing acceptance suite tied to the original Definition of Works
- A Source Ledger: every claim, every URL, every verbatim quote, every entailment status
- A Claim Ledger: severity-tagged, with entailment statuses
- A Risk Map: which assumptions were probed and which were waived (with reason)
- A Reframe Memo: the original framing, the alternative, why we picked one
- A retro note in the knowledge base for future runs

If you re-run a similar task next week, the framework reads its own memory and goes faster.

---

## Next

- [How FORGER works](02-how-it-works.md) — the architecture in detail
- [The seven phases](03-phases.md) — per-phase reference and the EXECUTE sub-pipeline
- [Demos](04-examples.md) — walkthroughs of CONTRACT, FIND, GRILL, EXECUTE
