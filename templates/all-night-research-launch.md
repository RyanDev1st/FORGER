Diagnosis updates. Superpowers explains the failure shape.

Revised diagnosis

Superpowers = process discipline (brainstorm → plan → TDD → review). Not research orchestration. Zero lane-spawning, zero source basket, zero HEAD-check, zero CRAAP, zero robustness ladder.

File signature now makes sense: AI invoked brainstorming + writing-plans, those skills enforce 2-1-1-1-style iterative refinement. With no external evidence source plumbed in, refinement loop ate itself. "Evidence" section name-drops Superpowers TDD, Superpowers testing, Superpowers verification, Superpowers plan-review — AI cited its own skill toolbox as evidence. Closed loop confirmed.

Superpowers all night ≠ research all night. Superpowers all night = plan all night.

What superpowers gives you

┌────────────────────────────────┬──────────────────────────────┬────────────────────────┐
│             Skill              │             Does             │
├────────────────────────────────┼──────────────────────────────┼────────────────────────┤
│ brainstorming                  │ explore intent before design │ fet
├────────────────────────────────┼──────────────────────────────┼────────────────────────┤
│ writing-plans                  │ structure multi-step work    │ enf
├────────────────────────────────┼──────────────────────────────┼────────────────────────┤
│ dispatching-parallel-agents    │ fan out independent tasks    │ def
├────────────────────────────────┼──────────────────────────────┼────────────────────────┤
│ subagent-driven-development    │ parallel plan execution      │ man
├────────────────────────────────┼──────────────────────────────┼────────────────────────┤
│ systematic-debugging           │ reproduce → minimise → fix   │ app
├────────────────────────────────┼──────────────────────────────┼────────────────────────┤
│ verification-before-completion │ run commands before "done"   │ HEA
└────────────────────────────────┴──────────────────────────────┴────────────────────────┘

Result: superpowers will plan beautifully. Plan content depends entirely on what you piped in as evidence source. Pipe nothing → plan invents content.

Two-path fix for all-night research on superpowers-only

Path A — bolt research onto superpowers (recommended)

Pair superpowers process with research agent. Research agent fetches. Superpowers structures.

Prompt pattern:

Method (non-negotiable, in order):

PHASE 1 — RESEARCH (no design yet)
Dispatch 3 research-expert subagents in parallel via
dispatching-parallel-agents skill:
  - Agent A: academic / peer-reviewed sources on <<topic>>
  - Agent B: production systems / repos / postmortems on <<topic>>
  - Agent C: contrarian / failed approaches / analogues on <<topic>>

Each agent MUST:
  - return 8-15 findings with URL + verbatim quote (≥10 words)
    + date + reputation tier + one-line relevance
  - use WebSearch + WebFetch, not memory
  - flag any source it could not verify

Wait for all 3 returns before next phase. No design during phase 1.

PHASE 2 — AUDIT
HEAD-check every URL via WebFetch (status code only).
Bigram-grep every quote against page text.
Write audit-log.md with pass/fail/flag per citation.
Discard any citation that fails both checks.

PHASE 3 — ROBUSTNESS LADDER
Group claims by support strength:
  - strong: ≥3 independent sources agree
  - contested: 2 sources disagree
  - weak: 1 source
Drop or downgrade weak claims. Do not synthesize from weak.

PHASE 4 — BRAINSTORMING (now allowed)
Use brainstorming skill ONLY against findings on disk.
Cite finding row IDs in every option considered.
Max 1 round of 2-1-1-1 cadence.
Further rounds require NEW citations, not new reasoning.

PHASE 5 — WRITING-PLANS
Use writing-plans skill to produce final plan.
Every architectural component MUST trace to ≥1 finding row ID.
Reject any component without external grounding.
Cap plan at 1500 lines.                                                                                                                                                 
Path B — use general research stack, skip superpowers brainstorming                                                                                                     
/autoresearch (the actual user-invocable skill on your install) is the research engine. Superpowers brainstorming is the trap.                                          
Invoke autoresearch directly with the question. Skip brainstorming and writing-plans until findings exist on disk.                                                      
Pre-flight checklist (superpowers edition)                                                                                                                              
12 gates. Tuned to your actual toolchain.                                                                                                                               
┌─────┬───────────────────────────────┬───────────────────────────────────────────────┐                                                                                 │  #  │             Gate              │                    Pass =
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 1   │ Question, not goal            │ falsifiable, externally check
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 2   │ Stakes named                  │ downstream decision identifie
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 3   │ Out-of-scope listed           │ 3-5 things AI must not resear
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 4   │ Prior art listed in prompt    │ repo paths + known frameworks
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 5   │ Research agents specified     │ research-expert × 3 minimum
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 6   │ WebSearch + WebFetch explicit │ not "based on training data"
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 7   │ Citations-per-lane floor      │ 8 minimum
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 8   │ Phase order locked            │ research → audit → ladder → b
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 9   │ Audit phase mandatory         │ HEAD + bigram
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 10  │ Brainstorming cap             │ max 1 round 2-1-1-1, only aft
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 11  │ File cap                      │ 1500 lines synthesis
├─────┼───────────────────────────────┼───────────────────────────────────────────────┤                                                                                 │ 12  │ Kill conditions in prompt     │ listed below
└─────┴───────────────────────────────┴───────────────────────────────────────────────┘                                                                                 
Kill conditions (must paste into prompt)                                                                                                                                
TERMINATE if any holds:                                                                                                                                                 - Phase 1 returns < 8 citations per agent.
- Phase 2 audit shows > 30% HEAD or quote failures.                                                                                                                     - Brainstorming begins before audit completes.
- Two consecutive turns add zero new external citations.                                                                                                                - Component named without finding row ID backing it.
- Self-citation detected (skill name cited as evidence).                                                                                                                - 2-1-1-1 cadence runs second round without new citations.
- Synthesis file exceeds 1500 lines.                                                                                                                                    - File grows but unique-URL count stops climbing.
                                                                                                                                                                        Mid-run probes (every ~30 min)
                                                                                                                                                                        ┌──────────────────────────────────────────────┬──────────────┐
│                    Check                     │     Pass     │                                                                                                         ├──────────────────────────────────────────────┼──────────────┤
│ findings.md exists before plan.md            │ yes          │                                                                                                         ├──────────────────────────────────────────────┼──────────────┤
│ audit-log.md exists before brainstorming     │ yes          │                                                                                                         ├──────────────────────────────────────────────┼──────────────┤
│ Unique URL count climbing                    │ yes          │                                                                                                         ├──────────────────────────────────────────────┼──────────────┤
│ Skill-name citations in evidence column      │ zero         │                                                                                                         ├──────────────────────────────────────────────┼──────────────┤
│ Brainstorm options reference finding row IDs │ every option │                                                                                                         └──────────────────────────────────────────────┴──────────────┘
                                                                                                                                                                        Minimum viable launch prompt (superpowers + research-expert)
                                                                                                                                                                        Research question: <<one falsifiable sentence>>.
Stakes: <<downstream decision>>.                                                                                                                                        Out of scope: <<3-5 items>>.
Prior art (cite, don't reinvent): <<paths and frameworks>>.                                                                                                             
Phase order (locked):                                                                                                                                                   1. Dispatch 3 research-expert subagents in parallel
   (academic / production / contrarian). 8-15 cited findings each.                                                                                                      2. Audit: HEAD-check every URL, bigram-match every quote,
   write audit-log.md.                                                                                                                                                  3. Robustness ladder: ≥3 sources = strong, 2 = contested, 1 = weak.
4. Brainstorm using brainstorming skill against findings only.                                                                                                             Max 1 round 2-1-1-1.
5. Plan using writing-plans skill. Every component → finding row ID.                                                                                                       Cap 1500 lines.
                                                                                                                                                                        Kill if: <8 citations per agent, >30% audit fail, brainstorm before
audit, 2 turns without new citations, self-citation, second 2-1-1-1                                                                                                     round without new sources, file > 1500 lines.
                                                                                                                                                                        Output files (absolute paths): findings.md, audit-log.md,
robustness-ladder.md, synthesis.md.                                                                                                                                     
Begin Phase 1. Do not design before findings return.                                                                                                                    
Drop in via /loop 30m <prompt> or as opening turn for autonomous run. Loop now amplifies fetch + audit, not debate.                                                     
Why your previous run produced what it did                                                                                                                              
No phase ordering. No research dispatch. No audit gate. Superpowers brainstorming + writing-plans saw a goal ("design EXECUTE workflow") and applied process discipline to invention, not to evidence. 2-1-1-1 cadence is a brainstorming patithout external evidence, options come from training data + prior turn= recursion.

Fix is upstream of skill choice: research phase must complete before any design skill activates.
