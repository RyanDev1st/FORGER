Parent: DESIGN.md

# FORGER EXECUTE Audit Companion Workflow

## Status

Proposed EXECUTE-only audit companion. It does not change Contract, Find, Observe, Recombine, Grill, or Retain. It audits Phase 5 execution quality after phase-0 intent is known, with no mid-process user interruption unless execution hits a documented stop condition.

Selected design after 2-1-1-1 audit: **Hybrid escrow plus triggered LD**. Evidence Escrow is default proof path; LD debate is triggered escalation; quick proof handles explicit deterministic local criteria.

Prior self-score is invalid. This version treats scoring as an output of repeatable evidence: mechanical gates, acceptance ledgers, reviewer ballots, and weighted comparison across variants.

Operating rule: mechanical proof wins over debate. Debate can expose hidden risk, but it cannot override failing `acceptance_results.jsonl`, acceptance gates, citation audit, or Done Means Ran evidence.

## Scope

This workflow applies only inside FORGER EXECUTE.

It audits three EXECUTE branches:

- `code/system`
- `research_report`
- `design_artifact`

It does not replace:

- `src/gates/acceptance_test.mjs --workspace <path>`
- `src/gates/audit.mjs --workspace <path>` when citations or claims require audit
- `acceptance_results.jsonl`
- Stop-hook Done Means Ran enforcement
- existing branch procedures under `skills/forger/phases/execute/procedure/`

Phase 0 is the only normal user-question point. After phase 0, companion agents must work from artifacts and stop only for:

1. missing required input artifact,
2. ambiguous acceptance criterion that can cause wrong work,
3. unsafe or irreversible action not pre-authorized,
4. repeated mechanical failure after two focused repair loops,
5. evidence that upstream phase output is invalid and needs re-entry.

## Evidence

Reference patterns incorporated:

- Superpowers TDD: red → verify red → green → verify green → refactor, with no implementation before failing test for code/system work.
- Superpowers testing anti-patterns: never test mock behavior, never add production methods only for tests, never mock without understanding real dependencies.
- Superpowers verification-before-completion: no done/fixed/passing claim without fresh command evidence.
- Superpowers plan/spec review: reviewers flag only build-blocking gaps, contradictions, placeholders, and scope drift.
- BMAD: phase-gated artifacts, readiness checks before development, role boundaries, validation reports as first-class outputs.
- OpenSpec: proposal/design/tasks separation, delta-style change control, strict validation, archive-style drift control.

FORGER-specific constraints:

- EXECUTE audit remains subordinate to DoW and acceptance gates.
- Companion roles inspect execution artifacts, not lane mandates.
- Max useful fan-out stays bounded: builder, critic, judge, optional reviewer.
- No mid-process user disturbance after phase 0 unless a stop condition fires.

### Execution modes

| Mode | Use when | Required companion artifacts | LD trigger policy |
| --- | --- | --- | --- |
| quick | criteria explicit, deterministic, local, already passing | compact acceptance proof only | disabled unless gate fails twice |
| standard | normal EXECUTE with one or more non-trivial criteria | world model, evidence escrow, acceptance proof | trigger rules active |
| deep | high risk, cross-artifact dependency, repeated failure, or user requested continuous audit | all companion artifacts | run at least one LD ballot |

Mode cannot lower mechanical gate requirements. Mode only changes audit ceremony.

Artifact minimization rules:

- quick mode merges world model, escrow, and proof into one section,
- standard mode keeps escrow and proof separate,
- deep mode keeps every artifact separate for traceability,
- no mode may skip acceptance gate, citation audit when needed, or Done Means Ran evidence.

### Proof release rules

Proof release decides when EXECUTE may move from work to exit proof. It never changes upstream artifacts; it only decides whether EXECUTE evidence is strong enough to release.

| Mode | Release threshold | Required proof packet | Breaker condition | LD condition |
| --- | --- | --- | --- | --- |
| quick | every explicit local criterion has fresh passing gate evidence | compact packet with positive, drift, and completion proof; negative proof may cite prior passing baseline only when no code/system behavior changed | no breaker tripped, or one breaker tripped once and cleared with fresh evidence | disabled unless same gate fails twice |
| standard | every non-trivial criterion has complete escrow slots | one packet per criterion with negative, positive, drift, and completion proof | all breaker states recorded; any tripped breaker has required action and clear evidence | trigger when strategy conflict, repeated repair, or two breakers hit one criterion |
| deep | every criterion has complete escrow plus reviewer or LD-backed acceptance rationale | full packets plus separate world model, variant log, and acceptance proof | breaker timeline preserved, including cleared breakers | at least one LD ballot before release |

Release blockers:

1. missing artifact branch, criterion source, target path, or verification command,
2. code/system change without RED or equivalent negative behavior proof,
3. proof packet field containing `assumed`, `not run`, `should pass`, or unjustified `N/A`,
4. stale acceptance gate, citation audit, or Done Means Ran evidence,
5. scope drift into Contract, Find, Observe, Recombine, Grill, or Retain,
6. unresolved reviewer blocker, repeated repair failure, or untriaged gate failure.

Release sequence:

1. Confirm phase-0 envelope or upstream DoW provides all release inputs.
2. Build proof packet at criterion granularity for current mode.
3. Run acceptance gate and audit gate when claims or citations require it.
4. Check breaker table before writing final acceptance proof.
5. Trigger LD only if release rules require it.
6. Exit only when acceptance proof cites fresh command evidence and ledger status.

Quick mode may compress all six release steps into one compact proof section. Standard and deep mode must keep criterion traceability visible.

### Deep-mode Trial Court appeal

Trial Court is not a default workflow. It is an appeal layer inside deep mode when proof is mechanically complete but release confidence remains contested. It cannot override failing gates, rewrite acceptance criteria, or ask the user after phase 0.

Appeal trigger matrix:

| Trigger | Required prior evidence | Court question | Allowed verdict |
| --- | --- | --- | --- |
| reviewer blocker after passing gates | reviewer line plus fresh gate result | is blocker decisive for EXECUTE acceptance? | focused repair, release, or EXECUTE blocked |
| unresolved LD warrant clash | LD ballot plus proof packet | which warrant controls release? | release, focused repair, or upstream re-entry |
| repeated repair breaker | two repair attempts plus latest failure/passing evidence | is another EXECUTE repair justified? | focused repair once, LD escalation, or blocked |
| high-risk weak confidence | complete escrow plus risk tier | is proof sufficient for high-risk release? | release or blocked |
| narrative/design persuasion risk | design/research proof plus audit result | does warrant support acceptance without rhetoric? | release, focused repair, or upstream re-entry |

Court evidence limits:

- Defense may cite only proof packets, acceptance results, citation audit, diffs, reviewer approvals, and branch artifacts.
- Prosecution may cite only missing RED proof, unsupported claims, scope drift, stale evidence, gate failures, contradiction, or reviewer blockers.
- Judge must cite mechanical gate state before any rationale.
- No role may introduce new acceptance criteria or preference questions.

Verdict format:

```text
Trial Court verdict: <release | focused repair | LD escalation | upstream re-entry | EXECUTE blocked>
Gate state: <fresh acceptance/audit/Done Means Ran evidence>
Decisive charge: <none or evidence-backed blocker>
Defense warrant: <strongest release proof>
Judge reason: <one sentence>
Next action: <single predeclared action>
```

If verdict is focused repair, the repair must name one criterion and one command to rerun. A second focused-repair verdict for the same criterion becomes EXECUTE blocked or upstream re-entry.



### Companion artifacts

Each EXECUTE run may produce these audit artifacts beside existing execution evidence:

| Artifact | Purpose | Required when |
| --- | --- | --- |
| `execute_world_model.md` | Goal, assumptions, acceptance signals, failure modes, risk tier | companion audit triggers |
| `execute_plan_review.md` | Spec/plan buildability review | plan or acceptance criteria are synthesized |
| `execute_ld_ballot.md` | Affirmative, negative, judge, weighted decision | competing execution strategies exist |
| `execute_variant_log.md` | 2-1-1-1 cadence history | continuous audit is requested |
| `execute_evidence_escrow.md` | criterion-by-criterion proof slots | Evidence Escrow variation is selected |
| `execute_acceptance_proof.md` | final command evidence and ledger status | before EXECUTE exit |


Breaker state is stored inside existing artifacts, not as a new default file:

| Breaker | Stored in | Code/system evidence | Research report evidence | Design artifact evidence |
| --- | --- | --- | --- | --- |
| Readiness | world model or compact proof | criterion, path, test command | claim set, audit command | decision target, acceptance command |
| RED | evidence escrow proof slot | failing test output | unsupported-claim scan | rejected alternative |
| Evidence | proof packet | passing command output | citation audit excerpt | warrant trace |
| Repair | variant log or LD ballot | two failed repair commands | repeated audit failure | repeated acceptance mismatch |
| Scope | drift proof | diff limited to behavior | claims map to sources | decisions stay within constraints |
| Exit | acceptance proof | fresh gate result | fresh audit/gate result | fresh acceptance result |

Breaker state may be one line when clear. Create separate breaker detail only when a breaker trips.

Do not hand-edit `acceptance_results.jsonl`; gate tools own it.

### Phase 0 intake contract

Ask user only for missing execution intent:

- artifact branch: code/system, research_report, or design_artifact,
- acceptance criteria source,
- risk tolerance and irreversible actions,
- verification command or acceptance gate,
- whether companion audit is quick, standard, or deep.

If upstream artifacts already answer these, ask nothing.

Phase 0 must freeze the execution envelope:

| Field | Meaning | If missing after phase 0 |
| --- | --- | --- |
| Objective | artifact outcome, not broad research goal | stop before EXECUTE |
| Acceptance source | DoW line, task, claim ledger, or design criterion | stop or re-enter upstream phase |
| Verification proof | exact gate, audit, test, or manual proof command | stop before implementation |
| Risk tier | low, medium, high | default to medium and require judge review |
| Permission boundary | allowed local edits and forbidden actions | stop before risky action |

After phase 0, the agent must not ask preference questions. It may stop only for defined blockers. Ordinary choices are resolved by artifacts, branch procedure, and lowest-risk reversible action.

### Sealed execution envelope

This is improvement turn 2 in the next 2-1-1-1 cycle. It converts brainstorming and writing-plans discipline into EXECUTE-only autonomy: ask once, seal inputs, then act without preference interruptions.

Envelope contents:

| Slot | Required content | Validation |
| --- | --- | --- |
| Branch | code/system, research_report, or design_artifact | must match branch-specific gate |
| Criterion list | ordered DoW lines or acceptance bullets | every proof packet names one criterion |
| Allowed work area | artifact path or workspace boundary | drift proof must stay inside boundary |
| Proof command | exact command, audit, reviewer, or manual check | completion proof must cite fresh output |
| Blocker taxonomy | missing input, failed gate, scope drift, risk permission, repeated repair | stop message must use one taxonomy item |
| Autonomy policy | quick, standard, or deep | controls ceremony only, never gate strength |

No-disturbance operating rule:

- If envelope answers a choice, use it.
- If envelope lacks a release-critical fact, stop before work.
- If ordinary implementation choice appears, choose smallest reversible action.
- If risk or shared-state action appears, stop for user authorization.
- If evidence conflicts, prefer mechanical gate over reviewer, reviewer over LD rhetoric, LD over preference.

Envelope review gate:

1. Completeness: no required slot blank.
2. Consistency: branch, criterion, and proof command agree.
3. Clarity: each criterion can produce one proof packet.
4. Scope: no slot rewrites upstream phases.
5. YAGNI: no artifact exists only to satisfy audit ceremony.

Failure in any envelope review gate blocks EXECUTE before artifact changes. It does not trigger mid-process questions unless user authorization is only safe next action.

### EXECUTE reviewer gate

This is improvement turn 1 in the next 2-1-1-1 cycle. It imports spec-review and writing-plans discipline into EXECUTE without letting review expand scope or interrupt the user after phase 0.

Run this gate when EXECUTE synthesizes a work plan, rewrites acceptance language into proof packets, or prepares release evidence for standard/deep mode. Skip it in quick mode only when every criterion is explicit, deterministic, local, and already covered by fresh gate output.

| Check | Reviewer asks | Blocking failure |
| --- | --- | --- |
| Completeness | Does every criterion name branch, artifact path, proof command, and expected evidence? | missing slot or placeholder |
| Consistency | Do branch, criterion, proof command, and acceptance gate agree? | code proof used for research/design or mismatched command |
| Clarity | Can an executor produce one proof packet without asking preferences? | ambiguous criterion or subjective success language |
| Scope | Does work stay inside EXECUTE artifact and avoid upstream phase rewrites? | Contract, Find, Observe, Recombine, Grill, or Retain drift |
| YAGNI | Does each companion artifact help release proof? | artifact exists only for ceremony |
| Buildability | Are exact paths, commands, and repair boundaries present? | implementer would need mid-process user choice |
| Verification specificity | Does expected output cite command, audit, reviewer line, or ledger field? | summary-only or assumed evidence |

Reviewer output format:

```text
EXECUTE review: <approved | issues found>
Blocking issue: <none or one criterion/path>
Evidence: <DoW line, proof slot, command, artifact path>
Required action: <fill proof | rerun command | repair criterion | upstream re-entry | block>
```

Reviewer authority limits:

1. reviewer may block release only with exact criterion, path, command, or proof-slot evidence,
2. reviewer may not add new acceptance criteria; new criteria route upstream,
3. reviewer may not ask preference questions after phase 0,
4. reviewer may not override acceptance gate, audit gate, RED integrity, breaker state, or Done Means Ran evidence,
5. reviewer advice without blocking evidence becomes optional repair note, not release blocker.

If reviewer finds one blocking issue, repair only that issue and rerun the same relevant proof. If reviewer finds multiple unrelated blocking issues, convert each to a proof packet gap and clear them in sealed-envelope order. If reviewer conflict remains after proof is complete, trigger LD in standard/deep or Trial Court appeal in deep mode only.

### Proof-command contract

This is improvement turn 2 in the next 2-1-1-1 cycle. It converts writing-plans specificity into an EXECUTE-only command contract: every proof claim names the exact command, expected signal, allowed repair boundary, and stale-evidence rule before work starts.

The contract is sealed after phase 0. If the command is already defined by DoW, gate config, or branch procedure, EXECUTE uses it without asking. If it is missing and release depends on it, EXECUTE stops before artifact changes.

| Slot | Required content | Failure rule |
| --- | --- | --- |
| RED command | command, audit, reviewer line, contradiction scan, or rejected alternative check | missing RED blocks code/system behavior work and blocks research/design synthesis proof |
| Intended RED signal | one sentence naming expected failing behavior, unsupported claim, or violated constraint | wrong failure reason resets proof before repair |
| GREEN command | same command/audit where possible, or branch-specific acceptance gate | different command must justify why same proof cannot turn green |
| Expected GREEN signal | exact pass line, audit field, acceptance result, or reviewer status | summary-only pass claim is invalid |
| Drift command | diff, claim-map check, scope check, or design constraint check | drift failure blocks next criterion |
| Repair boundary | one criterion, one artifact path, one proof packet | broader repair triggers scope breaker or LD |
| Freshness rule | command must run after final artifact change | stale output cannot support release |

Command safety screen:

1. reject destructive commands, broad deletion, force push, credential output, or outbound publishing unless user authorized it in phase 0,
2. reject commands that can pass without touching the target criterion,
3. reject mock-only assertions that prove test wiring instead of behavior,
4. reject research/design audits that count sources without checking claim support,
5. reject commands whose output cannot be mapped into one proof packet slot.

Proof-command loop:

```text
for each criterion:
  run RED command or RED-equivalent audit
  verify failure reason equals intended RED signal
  repair only declared boundary
  run GREEN command
  verify GREEN signal equals expected output
  run drift command
  append fresh command evidence to proof packet
```

No-disturbance handling:

- If command fails for intended reason, repair autonomously.
- If command fails from harness, syntax, missing dependency, or unavailable service, fix setup only until RED can be trusted.
- If command requires risk permission not sealed in phase 0, stop with EXECUTE blocked format.
- If proof command is ambiguous but non-critical, choose smallest local check and record limitation.
- If proof command is ambiguous and release-critical, stop before artifact changes.

This contract makes TDD enforceable beyond code/system without pretending every artifact has unit tests. Research and design still need negative proof, positive proof, drift proof, and completion proof; they just express those through audits, ledgers, warrants, and reviewer lines.

### Evidence chain-of-custody gate

This is improvement turn 1 in the next 2-1-1-1 cycle. It adds custody rules so EXECUTE proof has time order, source, and repair lineage instead of a pile of plausible evidence.

Custody ledger fields:

| Field | Required value | Invalid value |
| --- | --- | --- |
| Criterion | exact DoW line or sealed acceptance bullet | paraphrase that changes obligation |
| Artifact snapshot | path plus local state before repair | unstated current file |
| RED custody | command/audit/reviewer/counterexample captured before repair | failure captured after fix or from harness noise |
| Repair action | smallest change tied to one criterion | broad cleanup or upstream rewrite |
| GREEN custody | same proof source after repair where possible | different easy command without reason |
| Drift custody | diff, claim map, or constraint check after GREEN | no post-repair scope check |
| Release custody | fresh acceptance/audit/Done Means Ran evidence after final change | stale pass output |

Custody order:

```text
seal criterion
capture artifact snapshot
capture RED or RED-equivalent proof
verify intended failure reason
repair declared boundary
capture GREEN proof
capture drift proof
capture release proof
lock proof packet
```

Invalid custody handling:

- If repair happened before valid RED custody, isolate or revert local artifact change and rebuild from valid RED proof.
- If GREEN uses a different command than RED, record why same proof source cannot turn green.
- If drift proof changes criterion language, stop and route upstream.
- If release proof predates final artifact change, rerun gate before exit.
- If evidence source conflicts, mechanical gate wins, then audit, then reviewer, then LD, then narrative.

No-disturbance rule:

Custody gaps do not create preference questions. EXECUTE fills missing local custody when safe, reruns stale commands when safe, and stops only for missing phase-0 facts, risk permission, unavailable required service, scope drift, or repeated repair failure.

Chain-of-custody makes Superpowers RED/GREEN strictness reviewable across all branches: code/system stores failing behavior before code, research_report stores unsupported claim or citation failure before synthesis repair, and design_artifact stores rejected alternative or violated constraint before decision repair.


### Proof replayability gate

This is improvement turn 2 in the next 2-1-1-1 cycle. It tests whether another EXECUTE agent could replay the proof from sealed inputs without trusting executor narrative or asking the user mid-process.

Replay standard:

| Replay item | Must be replayable from | Fails when |
| --- | --- | --- |
| Criterion selection | sealed envelope or DoW | executor chose hidden priority |
| RED proof | proof-command contract and custody ledger | failure reason depends on memory or unstated setup |
| Repair boundary | artifact path plus criterion | repair spans unrelated criteria |
| GREEN proof | same command/audit or justified replacement | pass cannot be reproduced from packet |
| Drift proof | diff, claim map, or constraint check | scope claim lacks command or artifact evidence |
| Release proof | acceptance/audit/Done Means Ran output | output lacks timestamp/order after final change |

Replay procedure:

```text
hide executor rationale
read sealed envelope and proof packet only
reconstruct command order
check RED before repair and GREEN after repair
check drift after GREEN
check release proof after final artifact change
mark packet replayable or blocked
```

Replay blocker taxonomy:

- missing command: proof cannot be rerun or audited,
- missing order: cannot prove RED preceded repair or release proof followed final change,
- missing artifact path: cannot map evidence to EXECUTE output,
- missing expected signal: cannot distinguish intended failure from harness noise,
- missing scope evidence: cannot prove EXECUTE-only boundary,
- narrative dependency: proof requires trusting executor explanation instead of evidence.

Repair rules:

1. Fill replay gaps with fresh local evidence when safe.
2. Rerun stale command evidence after final artifact change.
3. Convert narrative dependency into command, audit, reviewer line, ledger entry, or lab counterexample.
4. If replay gap changes acceptance criterion, route upstream.
5. If replay gap requires unavailable external service or risk permission, stop with EXECUTE blocked format.

Replayability is stricter than completeness. A packet can look complete but fail replay when evidence order is unclear, expected signals are missing, or proof depends on agent memory. EXECUTE exits only when packets are both complete and replayable for the selected mode.


### Rival variation: Failure Injection Board

This is the different-variation turn in the 2-1-1-1 cadence. Instead of asking whether proof packets are complete, EXECUTE deliberately injects controlled failure scenarios against the artifact before release. The board stays EXECUTE-only: it may expose missing proof, weak repair boundaries, or false GREEN evidence, but it cannot rewrite upstream criteria or ask the user after phase 0.

Failure Injection Board model:

| Board element | Rule | EXECUTE-only boundary |
| --- | --- | --- |
| Seed | sealed criterion, proof-command contract, custody ledger, or replay blocker | no new acceptance criteria |
| Injection | smallest mutation, contradiction, missing-source challenge, rejected-design constraint, or negative path | derived only from phase-0 envelope |
| Expected break | predeclared RED or RED-equivalent signal | failure must target acceptance gap, not harness noise |
| Repair window | one criterion and one artifact path | broader repair trips scope or repair breaker |
| Immunity proof | GREEN plus drift proof after repair | stale or narrative-only proof invalid |
| Stop condition | unresolved injected failure, unavailable risk permission, or upstream criterion change | stop with EXECUTE blocked format |

Board procedure:

```text
for each high-risk or recently repaired criterion:
  choose one injection from sealed evidence only
  write expected break before running probe
  run injection probe or audit challenge
  if probe does not break where expected:
    record immunity evidence
  else:
    repair only matching EXECUTE artifact slice
    rerun original proof command
    rerun injection probe
    rerun drift proof
```

Injection types by branch:

| Branch | Injection | Valid RED-equivalent | Invalid injection |
| --- | --- | --- | --- |
| code/system | boundary input, regression reproduction, state transition, permission edge | failing acceptance behavior tied to criterion | import break, syntax failure, artificial mock assertion |
| research_report | unsupported claim challenge, source contradiction, missing quote, citation freshness check | claim cannot survive cited evidence audit | asking for new research scope or changing thesis |
| design_artifact | constraint violation, rejected alternative revival, hidden stakeholder conflict | selected design lacks warrant under sealed constraint | demanding implementation proof or new product goal |

Use Failure Injection Board only when release proof needs adversarial confidence: repeated repair, self-authored proof, high-risk criterion, reviewer dispute, replayability gap, or Black-box Lab counterexample. It is not default quick-mode ceremony.

Failure Injection Board differs from Black-box Acceptance Lab: Lab validates artifact behavior against criteria; Board mutates pressure points to prove repaired criteria resist known failure classes. Lab asks "does artifact satisfy criteria?" Board asks "does proof survive deliberate break attempts?"

Board verdicts:

- immune: injection cannot break criterion and proof remains replayable,
- repaired: injection broke criterion, EXECUTE repaired within boundary, GREEN plus drift proof fresh,
- blocked: injection exposes upstream criterion gap, unavailable permission, or unreplayable proof,
- escalate: same criterion fails two injections or repair boundary expands beyond EXECUTE artifact.
### No-disturbance contract

The companion exists to remove mid-process interruptions, not create more of them.

Allowed autonomous decisions after phase 0:

- choose next acceptance criterion in existing order,
- choose smallest failing test for code/system work,
- choose reviewer prompts from fixed templates,
- choose whether LD audit trigger fires,
- choose between local plan variants using rubric evidence.

Forbidden autonomous decisions:

- changing acceptance criteria,
- expanding scope beyond EXECUTE,
- approving irreversible or shared-state actions,
- treating weak evidence as passing,
- hiding a blocker to preserve flow.

Stop message must name: blocker, missing artifact, attempted evidence, and exact re-entry point.

Stop format:

```text
EXECUTE blocked
Blocker: <one sentence>
Missing/failed artifact: <path or criterion>
Attempted evidence: <command, audit, reviewer, or escrow slot>
Re-entry point: <EXECUTE repair | Contract | Recombine | Grill | user authorization>
Next safe action: <single reversible action>
```

Do not include preference questions in stop messages. Ask only if the re-entry point is user authorization or missing phase-0 input.

### EXECUTE audit loop

1. Load DoW and branch procedure.
2. Select audit mode from phase-0 input and artifact risk.
3. Build `execute_world_model.md` from existing artifacts unless quick mode collapses it into proof.
4. Check implementation readiness:
   - acceptance criteria concrete,
   - expected artifact path known,
   - verification command known,
   - risk tier known,
   - branch procedure selected.
5. If readiness fails, stop or re-enter upstream phase; do not improvise acceptance criteria.
6. Open evidence escrow for each non-trivial criterion.
7. Run branch execution.
8. Fill proof slots as branch work progresses.
9. Apply branch-specific audit:
   - code/system: TDD evidence exists for changed behavior,
   - research_report: citations and claims pass audit gate,
   - design_artifact: decisions trace to evidence and constraints.
10. Run reviewer gate:
   - spec reviewer checks completeness, consistency, clarity, scope, YAGNI,
   - plan reviewer checks spec alignment, decomposition, buildability.
11. Run LD audit only when trigger policy requires it.
12. Run mechanical gates.
13. Write `execute_acceptance_proof.md` from command output and ledger status.

### Reviewer prompts

Spec reviewer prompt:

```text
Review only EXECUTE-phase acceptance readiness. Flag blockers for completeness, consistency, clarity, scope, and YAGNI. Ignore wording preferences. Output Approved or Issues Found with file/criterion references.
```

Plan reviewer prompt:

```text
Review only EXECUTE branch plan buildability. Check spec alignment, task decomposition, proof commands, TDD order, and stop conditions. Approve unless an implementer would build the wrong thing or get stuck.
```

Both reviewers are subordinate to mechanical gates. Approval means "ready to try execution," not "accepted."

### LD audit protocol

Trigger LD audit when:

- acceptance criteria are synthesized,
- failure cost is high,
- execution has two focused repair failures,
- branch depends on multiple upstream artifacts,
- reviewer reports a blocking ambiguity,
- user requested continuous audit.

Roles:

| Role | Job | Cannot do |
| --- | --- | --- |
| Affirmative Builder | defend current execution plan as sufficient | ignore failing gates |
| Negative Critic | prove current plan risks false acceptance or wasted work | invent new requirements |
| Judge | weigh worlds and name required tuning actions | treat ballot as acceptance proof |

Ballot format:

- value: validated delivery,
- criterion: mechanically proven acceptance under adversarial uncertainty,
- affirmative contentions,
- negative contentions,
- clash summary,
- winner,
- weighted score by rubric,
- decisive warrants,
- required tuning actions,
- non-blocking residual risks.

### Weighted rubric

| Category | Weight | Evidence required |
| --- | ---: | --- |
| Mechanical acceptance | 30 | gate command and `acceptance_results.jsonl` status |
| Criteria traceability | 15 | criterion → task → artifact → test/audit line |
| Hidden-risk discovery | 15 | critic found real assumption, edge, or mismatch |
| Review buildability | 10 | plan/spec reviewer approved or listed fixed blockers |
| TDD / proof discipline | 10 | red-green-refactor or branch-equivalent proof |
| Cost proportionality | 10 | no extra debate when deterministic local proof is enough |
| Drift control | 5 | changed scope routed upstream or delta-recorded |
| Stop-condition honesty | 5 | unresolved blockers named, not hidden |

Score claims require cited evidence. No bare numeric score.

### 2-1-1-1 continuous audit cadence

Repeat until mechanical gates pass and judge score is stable enough for risk tier:

1. Improve current plan: tighten acceptance mapping or evidence capture.
2. Improve current plan again: remove ceremony, reduce ambiguity, strengthen stop rules.
3. Different variation: propose a meaningfully different execution audit model.
4. Debate: run Affirmative, Negative, Judge on current vs variation.
5. Compare: table pros/cons, cost, reliability, drift risk, user-disturbance risk.
6. Decide: keep, merge, or replace based on weighted evidence.

Cadence rule: no variation may win unless it preserves no-mid-process-disturbance after phase 0 and remains EXECUTE-only.

Audit cycle state:

| Turn kind | Output | Cannot do |
| --- | --- | --- |
| Improve A | patch current workflow weak spot | invent new architecture |
| Improve B | simplify or harden same workflow | ignore cost |
| Different | create rival model with distinct mechanism | copy current model with new words |
| Debate | LD ballot with clash and warrants | self-score without evidence |
| Compare | weighted matrix across candidates | count vibes as proof |
| Decide | keep / merge / replace plus next action | override mechanical gates |

Decision memory is local to EXECUTE artifact. If cadence discovers upstream ambiguity, stop and route to correct phase; do not solve it inside EXECUTE.

### LD debate: LD-first vs Evidence Escrow

Value: validated delivery.

Criterion: strongest EXECUTE acceptance proof with least user disturbance after phase 0.

Affirmative world: LD-first audit remains primary.

- Contention 1: Strategy risk appears before proof gaps. If multiple implementation paths can satisfy one criterion, debate exposes hidden assumptions before time is spent filling escrow slots.
- Contention 2: Judge ballot creates explicit warrants and required tuning actions. This prevents silent acceptance drift when criteria are synthesized.
- Contention 3: LD-first is cost-aware because it triggers only on ambiguity, high risk, repeated failure, cross-artifact dependency, reviewer blocker, or explicit continuous audit.

Negative world: Evidence Escrow should become default.

- Contention 1: EXECUTE failures are usually proof failures, not philosophy failures. Escrow forces negative proof, positive proof, drift proof, and completion proof before exit.
- Contention 2: Escrow maps directly to TDD and Done Means Ran. It prevents false claims without needing debate for every branch.
- Contention 3: Escrow reduces mid-process disturbance because agents fill slots from artifacts instead of asking preference questions.

Clash:

| Issue | LD-first answer | Escrow answer | Judge note |
| --- | --- | --- | --- |
| Hidden assumptions | stronger before implementation | catches when slot missing | LD wins strategy uncertainty |
| Proof completeness | relies on gate plus reviewer | built into every criterion | Escrow wins routine execution |
| Cost | bounded by triggers | per-criterion overhead | LD cheaper for small tasks |
| TDD fit | requires added evidence packet | native negative/positive proof | Escrow wins code/system |
| No user disturbance | strong if phase 0 complete | stronger for ordinary work | Escrow wins default autonomy |

Judge ballot:

- Winner for default EXECUTE audit: Evidence Escrow.
- Winner for triggered high-uncertainty audit: LD-first.
- Required synthesis: use escrow as default proof ledger; escalate to LD when escrow exposes strategy conflict or trigger rules fire.
- Decisive warrant: EXECUTE phase exists to prove artifact acceptance, so default workflow should optimize proof completeness before adversarial strategy weighing.
- Non-blocking risk: escrow may add ceremony to tiny deterministic tasks; mitigate by allowing quick mode to collapse slots into one acceptance proof when criterion is explicit and local.

### Rival variation: Evidence Escrow audit

This is the required different model in the 2-1-1-1 cadence. Instead of centering debate first, EXECUTE creates an evidence escrow ledger before implementation and releases completion only when each escrow slot has proof.

Escrow slots:

| Slot | Code/system | Research report | Design artifact |
| --- | --- | --- | --- |
| Intent | behavior criterion | claim set | decision target |
| Negative proof | failing test | unsupported-claim scan | rejected alternative |
| Positive proof | passing test | audited citation | selected design warrant |
| Drift proof | diff limited to criterion | synthesis line maps to source | scope unchanged |
| Completion proof | acceptance result | audit result | acceptance result |

Flow:

1. Open escrow from DoW criterion.
2. Fill negative proof before positive proof.
3. Fill positive proof with command or audit evidence.
4. Run drift proof against scope and branch procedure.
5. Release escrow only when all slots are filled.
6. If a slot cannot be filled, stop or re-enter upstream phase.

Strengths:

- removes subjective progress claims,
- fits TDD naturally,
- works without asking user after phase 0,
- catches false acceptance before final gate.

Weaknesses:

- heavier ledger work for small deterministic tasks,
- less useful for pure cleanup with no behavior change,
- still needs LD audit when two valid escrow strategies conflict.

Use Evidence Escrow when execution quality depends on proof completeness more than strategy choice. Use LD-first audit when execution has competing plausible strategies.


### Rival variation: Proof Circuit Breaker audit

This is the next different model in the 2-1-1-1 cadence. Instead of collecting proof continuously, EXECUTE installs circuit breakers at the points where agents usually hallucinate progress: before work starts, before each proof claim, before repair loops, and before exit.

Circuit breakers:

| Breaker | Trips when | Required action |
| --- | --- | --- |
| Readiness breaker | criterion, artifact path, branch, or verification command is missing | stop with EXECUTE blocked format |
| RED breaker | code/system implementation starts without failing behavior proof | revert local implementation and write RED proof |
| Evidence breaker | proof packet uses assumed, not run, should pass, or summary-only evidence | replace with command, audit, reviewer, or ledger evidence |
| Repair breaker | same gate fails twice after focused repairs | trigger LD audit or re-enter upstream phase |
| Scope breaker | work changes acceptance criteria or upstream phase artifacts | stop and route to correct phase |
| Exit breaker | Done Means Ran evidence is stale or absent | rerun gate and rewrite acceptance proof |

Flow:

1. Register breakers from phase-0 envelope and DoW.
2. Run branch execution normally.
3. Check breaker state at every proof boundary.
4. If one breaker trips, perform only its required action.
5. If two breakers trip in the same criterion, escalate to LD audit.
6. If breaker clears, continue without asking user.

Strengths:

- lower ceremony than full escrow for simple work,
- strong at catching false completion language,
- aligns with no-disturbance because breaker action is predeclared,
- turns repeated failure into explicit escalation instead of thrashing.

Weaknesses:

- less complete than escrow for multi-criterion traceability,
- depends on accurate breaker registration in phase 0,
- can miss weak positive evidence when no breaker condition fires.

Use Proof Circuit Breaker when EXECUTE needs guardrails against false progress and repeated repair loops, but full escrow would create too much ledger overhead. Do not use it as default for high-traceability artifacts; use it as quick/standard-mode fallback or as an escalation layer inside Hybrid escrow plus triggered LD.
### TDD evidence contract

For `code/system`, every changed behavior needs an evidence packet:

| Step | Required evidence | Failure meaning |
| --- | --- | --- |
| RED | failing test name and command output | no proof test detects behavior |
| RED check | failure matches intended behavior gap | test may be broken or irrelevant |
| GREEN | minimal implementation diff | solution may be overbuilt |
| GREEN check | same command passes | behavior not proven |
| IMPROVE | refactor only after green | refactor before proof is drift |
| Regression | full relevant suite passes | local fix may break adjacent behavior |

If implementation exists before RED evidence, delete or revert that implementation and rebuild from test evidence. Do not keep it as reference material.

Testing anti-pattern gate blocks EXECUTE exit when:

- assertion only verifies mock calls,
- production code gained test-only API,
- mock omits real dependency fields needed by runtime,
- test passes without exercising user-visible behavior,
- failing test failed for syntax, import, fixture, or harness error.

Non-code branches use equivalent proof packets:

- research_report: claim → citation → audit result → synthesis line,
- design_artifact: constraint → alternative → decision → tradeoff proof.

Proof packet format:

```text
Criterion: <DoW id or acceptance line>
Negative proof: <failing test, unsupported claim scan, rejected alternative>
Positive proof: <passing command, audited citation, selected warrant>
Drift proof: <diff/scope check>
Completion proof: <acceptance gate line or audit result>
```

Packet is invalid if any field says "assumed", "not run", "should pass", or "N/A" without quick-mode justification.

### Branch proof language

TDD vocabulary maps to all EXECUTE branches, but only code/system uses literal tests as RED/GREEN proof. Research and design use equivalent negative and positive proof so the companion stays EXECUTE-only.

| Branch | Negative proof | Positive proof | Drift proof | Completion proof |
| --- | --- | --- | --- | --- |
| code/system | failing behavior test, failing acceptance gate, or regression reproduction | passing test, passing acceptance gate, or verified command output | diff limited to criterion and no unrelated phase edits | fresh acceptance result plus Done Means Ran evidence |
| research_report | unsupported-claim scan, citation failure, contradiction note, or downgraded claim | audited citation, quoted evidence, source ledger link, or claim ledger support | claim set maps to sources and no new unsourced claims appear | audit gate result plus acceptance proof |
| design_artifact | rejected alternative, violated constraint, missing warrant, or decision contradiction | selected warrant tied to constraint, alternative comparison, or reviewer-accepted rationale | design choice stays inside EXECUTE target and does not imply implementation success | acceptance proof plus reviewer or LD-backed rationale when needed |

Branch release language:

- code/system says RED only when failing behavior proof ran before implementation,
- research_report says RED-equivalent when unsupported or contradicted claim is exposed before final synthesis,
- design_artifact says RED-equivalent when a rejected alternative or violated constraint is documented before final decision,
- no branch may claim GREEN without fresh positive evidence,
- no branch may claim REFACTOR/IMPROVE without drift proof showing scope stayed inside EXECUTE.

### RED proof integrity audit

This is improvement turn 1 in the next 2-1-1-1 cycle. It tightens Superpowers-inspired proof without expanding beyond EXECUTE.

RED proof is valid only when it proves the acceptance gap the EXECUTE artifact is about to close. It is invalid when failure comes from syntax, import, harness setup, missing dependency, stale fixture, mocked assertion, or a test-only production hook.

| Branch | Valid RED or RED-equivalent | Invalid RED or RED-equivalent | Required correction |
| --- | --- | --- | --- |
| code/system | failing behavior test, failing acceptance gate, or reproducible bug command tied to one criterion | compile error, missing import, brittle mock expectation, test-only API, or unrelated failing suite | fix harness first, then rerun RED before implementation |
| research_report | unsupported claim scan, failed citation quote check, contradiction against source, or claim ledger gap | vague reviewer discomfort, source count target miss, quote not tied to claim, or invented citation audit | rewrite claim map, then rerun audit on exact claim |
| design_artifact | rejected alternative, violated constraint, missing warrant, or decision contradiction tied to acceptance | taste preference, unstated criterion, broad architecture complaint, or downstream implementation demand | restate constraint from DoW, then rerun design acceptance check |

RED custody rule:

1. Capture failing command, audit, reviewer line, or ledger gap before artifact repair.
2. State expected failure reason in one sentence.
3. Verify failure reason matches criterion, not harness noise.
4. Repair only that criterion.
5. Rerun same command or audit for GREEN proof.
6. Record drift proof before exit.

If implementation or final synthesis already happened before valid RED proof, EXECUTE must revert or isolate that local artifact change, create valid RED proof, then rebuild from the proof. No branch may preserve unproven work as reference material.

### Branch-specific gates

Code/system:

- failing test written before implementation when behavior changes,
- failure is expected, not syntax/import/test harness error,
- implementation is minimal,
- refactor happens only after green,
- mocks represent real dependency shape,
- acceptance gate appends result.

Research report:

- every important claim maps to evidence,
- citations pass audit gate or failure is explicit,
- unsupported claims are removed or downgraded,
- synthesis does not add facts absent from evidence.

Design artifact:

- decision ties to constraints and alternatives,
- tradeoffs are explicit,
- rejected alternatives name reason,
- no design choice claims implementation success.


### Rival variation: Acceptance Kata

This is the different-variation turn in the 2-1-1-1 cadence. Instead of centering proof ledgers, debates, or courts, EXECUTE becomes a kata loop: one criterion at a time, one failing proof, one repair, one passing proof, one refactor/drift check. It borrows TDD discipline but applies it to all EXECUTE artifact branches.

Kata loop:

```text
for each acceptance criterion in sealed envelope order:
  write criterion card
  create RED or RED-equivalent proof
  verify RED fails for intended reason
  repair only that criterion
  verify GREEN with same proof command or audit
  run drift check
  append criterion proof packet
exit only after all cards are green and acceptance gate is fresh
```

Criterion card:

| Field | Rule |
| --- | --- |
| Criterion | copied from sealed phase-0 envelope or DoW |
| Branch | code/system, research_report, or design_artifact |
| RED proof | command, audit, reviewer line, contradiction, or rejected alternative |
| Intended failure | one sentence; must match criterion |
| GREEN proof | same command/audit where possible |
| Drift check | diff, claim map, or design constraint check |
| Exit evidence | acceptance gate, audit gate, or Done Means Ran proof |

Kata strengths:

- makes progress atomic and reviewable,
- prevents broad repairs after vague failures,
- makes RED/GREEN proof natural across research and design branches,
- keeps user undisturbed because criterion order and commands come from sealed envelope,
- gives plan reviewer a buildable sequence instead of a broad release argument.

Kata failure rules:

- wrong RED failure reason resets the card before repair,
- two failed GREEN attempts on one card trips repair breaker,
- drift failure blocks next card until current card is scoped,
- missing criterion card blocks EXECUTE exit,
- new criterion request routes upstream instead of expanding EXECUTE.

Acceptance Kata is a rival default candidate for teams that value strict local progression more than global release argument. It may combine with Evidence Escrow by treating each card as one escrow packet.

### Rival variation: Black-box Acceptance Lab

This is the different-variation turn in the 2-1-1-1 cadence. Instead of trusting proof packets as authored by the executor, EXECUTE treats the artifact as a black box and runs acceptance probes derived from the sealed envelope. The lab never rewrites upstream criteria; it only checks whether the finished EXECUTE artifact behaves like the criteria say it should.

Lab model:

| Lab element | Rule | EXECUTE-only boundary |
| --- | --- | --- |
| Specimen | current EXECUTE artifact | no Contract, Find, Observe, Recombine, Grill, or Retain edits |
| Probe | exact proof command, citation audit, claim challenge, or design constraint check | derived only from sealed phase-0 envelope |
| Blind oracle | expected RED/GREEN/drift signal written before probe result is read | no preference questions after phase 0 |
| Counterexample | smallest observed mismatch between artifact and criterion | repair only matching criterion |
| Release sample | final probe set plus acceptance gate output | cannot override failing mechanical gate |

Flow:

```text
freeze current EXECUTE artifact
derive probe set from sealed criteria and proof-command contract
run probes without reading executor rationale first
record counterexamples before repair
repair only counterexample criterion
rerun same probe until it matches blind oracle
compare proof packets against lab observations
release only when probes, packets, and gates agree
```

Probe examples by branch:

- code/system: run behavior command against public artifact path, not internal helper assertions.
- research_report: challenge one important claim at a time against quoted source and citation audit.
- design_artifact: test selected design against stated constraints and rejected alternatives.

Strengths:

- catches self-confirming proof packets,
- separates artifact behavior from executor narrative,
- makes mock/test-only APIs suspicious by default,
- gives research and design concrete counterexample language,
- preserves no-disturbance because oracle and probes come from sealed envelope.

Failure rules:

- probe cannot invent new acceptance criteria,
- probe mismatch creates focused repair, not broad redesign,
- repeated mismatch on same criterion trips repair breaker,
- lab disagreement with passing gate triggers LD in standard/deep,
- lab cannot release artifact when acceptance gate, audit gate, RED integrity, or Done Means Ran evidence fails.

Black-box Acceptance Lab is a rival default candidate for teams that distrust executor-authored proof. It may combine with Evidence Escrow by making lab observations the independent check on each proof packet.

### LD debate: Hybrid default vs Black-box Acceptance Lab

This is the debate turn in the 2-1-1-1 cadence. Debate question: should EXECUTE keep Hybrid escrow plus triggered LD plus breakers as default, or switch default to Black-box Acceptance Lab?

Value: validated delivery without mid-process disturbance.

Criterion: release only when EXECUTE artifact satisfies sealed acceptance criteria under independent proof, while scope stays inside EXECUTE.

Affirmative: keep Hybrid default.

- Hybrid already requires negative, positive, drift, and completion proof per criterion.
- Proof-command contract now makes each proof slot exact and fresh.
- Reviewer gate catches unclear or unbuildable plans before release proof hardens.
- Breakers stop false progress at readiness, RED, evidence, repair, scope, and exit boundaries.
- LD and Trial Court handle contested release confidence without making every execution black-box lab work.

Negative: switch default to Black-box Acceptance Lab.

- Executor-authored packets can self-confirm; black-box probes test artifact behavior without reading executor rationale first.
- Blind oracle forces expected signals before result interpretation, reducing post-hoc proof narratives.
- Counterexamples are more concrete than broad reviewer objections.
- Mock-only and test-only APIs become suspicious because probes face public artifact behavior.
- Research and design get sharper challenge language: claim contradiction, constraint mismatch, rejected-alternative failure.

Cross-examination:

| Challenge | Hybrid answer | Black-box answer |
| --- | --- | --- |
| How catch self-confirming proof? | reviewer gate, RED integrity, LD, Trial Court | blind probes before rationale review |
| How keep cost proportional? | quick/standard/deep mode controls ceremony | probe set can be sampled from sealed criteria |
| How prevent invented acceptance criteria? | sealed envelope plus scope breaker | probes derive only from sealed criteria |
| How handle non-code artifacts? | branch proof language and audits | claim/design counterexamples |
| How decide contested release? | mechanical gates first, LD or Trial Court after | lab mismatch escalates to LD/deep appeal |

Judge ballot:

- Hybrid wins as default because it is already complete release architecture: proof creation, review, breakers, debate, appeal, and mode control.
- Black-box Acceptance Lab wins as adversarial validation technique because it tests artifact behavior against sealed criteria independently from executor narrative.
- Synthesis: keep Hybrid default; add Black-box Lab as triggered independent validation when proof packets look self-confirming, mock-heavy, reviewer-contested, or high-risk.
- Mechanical gates still outrank both models.


### LD debate: Hybrid default vs Acceptance Kata

This is the debate turn in the 2-1-1-1 cadence. Debate question: should EXECUTE default to Hybrid escrow plus triggered LD plus breakers, or switch default to Acceptance Kata?

Value: validated delivery without mid-process disturbance.

Criterion: every EXECUTE acceptance criterion gets mechanically proven evidence before release, while scope stays inside EXECUTE.

Affirmative: keep Hybrid default.

- Evidence Escrow already captures negative, positive, drift, and completion proof per criterion.
- Circuit breakers block false progress before release, not only after one card fails.
- LD handles strategy conflict and weak warrants that a local kata card may miss.
- Trial Court remains deep-mode appeal for contested release.
- Hybrid scales: quick can compress proof, standard can escrow, deep can debate or appeal.

Negative: switch default to Acceptance Kata.

- Kata gives implementers a buildable sequence: one card, one RED, one repair, one GREEN, one drift check.
- Wrong RED failure reasons are caught before repair, matching Superpowers discipline more tightly.
- Criterion order from sealed envelope prevents mid-process preference asks.
- Reviewers can audit local card completeness faster than a broad release proof.
- Research and design branches gain RED/GREEN language without pretending every proof is a test.

Cross-examination:

| Challenge | Hybrid answer | Kata answer |
| --- | --- | --- |
| How avoid broad vague repair? | repair breaker plus criterion escrow | one-card repair boundary |
| How catch global acceptance fraud? | LD, reviewer, Trial Court appeal | final acceptance gate after all cards |
| How keep cost low? | mode controls ceremony | card loop is small but repeated |
| How prevent RED theater? | RED integrity audit plus breaker | verify intended failure before every repair |
| How handle ambiguous warrants? | triggered LD | escalate from card failure to LD |

Judge ballot:

- Hybrid wins as default release architecture because it covers local proof, global risk, debate, and appeal.
- Acceptance Kata wins as inner execution loop because it makes each criterion buildable and TDD-shaped.
- Synthesis: keep Hybrid as default companion; embed Acceptance Kata as optional standard/deep work rhythm for criterion repair and proof packet creation.
- Mechanical gates still outrank both models.

### Rival variation: Autonomous Trial Court

This is the next different model in the 2-1-1-1 cadence. Instead of making proof slots the center, EXECUTE runs a sealed trial after artifact work: prosecution attacks acceptance, defense proves acceptance, judge releases or blocks. All roles use only phase-0 inputs, DoW, local artifacts, commands, ledgers, and reviewer output. No role asks the user after phase 0.

Trial roles:

| Role | Job | Evidence allowed | Output |
| --- | --- | --- | --- |
| Defense | prove each EXECUTE criterion satisfied | proof packets, acceptance gate, audit gate, diffs, reviewer approvals | release brief |
| Prosecution | find acceptance fraud, weak proof, scope drift, missing RED evidence | same artifacts plus failure logs and unsupported-claim scans | charge sheet |
| Judge | decide release, repair, LD escalation, or upstream re-entry | defense brief, charge sheet, mechanical gate results | verdict |

Trial procedure:

1. Seal phase-0 envelope: branch, acceptance source, risk tolerance, verification command, audit mode.
2. Execute artifact branch normally without mid-process user prompts.
3. Defense writes release brief at criterion level.
4. Prosecution writes charge sheet with only evidence-backed objections.
5. Judge checks mechanical gates first, then weighs briefs.
6. Verdict is one of: release, focused repair, LD escalation, upstream re-entry, or EXECUTE blocked.

Strict gates:

- prosecution must cite artifact path, proof slot, command, gate result, or reviewer line for every charge,
- defense cannot cite intent without command or audit evidence,
- judge cannot release when acceptance gate, citation audit, Done Means Ran, or RED breaker fails,
- focused repair gets one narrow action; repeated repair triggers LD or upstream re-entry,
- trial cannot broaden scope beyond EXECUTE.

Strengths:

- adversarial pressure is stronger than passive escrow,
- no-disturbance stays intact because verdict options are predeclared,
- catches polished but under-proven artifacts,
- maps well to spec-review and plan-review patterns: charge only blocking issues.

Weaknesses:

- higher ceremony than escrow for normal EXECUTE,
- risk of rhetorical theater unless charges require mechanical evidence,
- slower than circuit breakers for obvious false-progress failures,
- needs tight verdict taxonomy to avoid hidden preference questions.

Use Autonomous Trial Court when EXECUTE output is high-risk, reviewer disagreement exists, or acceptance proof can look complete while still hiding weak warrants. Do not use it as default for standard work unless prior runs show escrow misses too many blocking issues.

### LD debate: Hybrid escrow vs Proof Circuit Breaker

Value: validated delivery. Criterion: strongest EXECUTE acceptance proof with least phase-0-afterward disturbance.

Affirmative: keep Hybrid escrow plus triggered LD as default.

Contentions:

1. EXECUTE is proof phase, so default workflow must preserve complete criterion traceability. Escrow slots force every claim through negative, positive, drift, and completion evidence.
2. Triggered LD already covers strategic ambiguity and repeated failure. Circuit breakers add guardrails, but they do not replace proof ledger completeness.
3. Hybrid has better branch coverage: code/system maps to RED/GREEN/regression, research_report maps to unsupported-claim scan/audit, design_artifact maps to alternatives/warrants.

Negative: replace default with Proof Circuit Breaker.

Contentions:

1. Most EXECUTE failures are false-progress failures, not missing ledger rows. Breakers target exact failure points with less ceremony.
2. Breaker actions are predeclared, so no-disturbance is stronger: agent stops or repairs by rule without building extra artifacts.
3. Escrow can become paperwork when mechanical gates are clear; breakers preserve quick proof while still blocking stale Done Means Ran claims.

Cross-examination clash:

| Clash | Hybrid answer | Circuit-breaker answer | Judge note |
| --- | --- | --- | --- |
| Proof completeness | every criterion has slots | only failed boundary gets proof demand | Hybrid wins high-traceability work |
| Ceremony cost | quick mode collapses artifacts | default is lightweight | Circuit breaker wins small tasks |
| Repeated failure | LD trigger after failures | repair breaker trips after two failures | tie; combine mechanisms |
| False completion | completion proof plus Done Means Ran | exit breaker directly targets stale claims | Circuit breaker is sharper guardrail |
| Branch generality | slot table covers three artifact types | breakers are branch-agnostic | Hybrid wins specificity |

Judge ballot:

- Winner for default EXECUTE audit: Hybrid escrow plus triggered LD.
- Winner for low-ceremony failure prevention: Proof Circuit Breaker.
- Required synthesis: keep Hybrid as default; integrate circuit breakers as enforcement rails inside quick and standard modes.
- Decisive warrant: circuit breakers catch when to stop, but escrow proves what passed. EXECUTE exit needs both, with proof completeness ranked higher than minimal ceremony for non-trivial criteria.
- Tuning action: add circuit breakers to decision rule before escrow release and before EXECUTE exit.
- Residual risk: hybrid+circuit-breaker stack may overfit to audit artifacts; anti-ceremony guard must collapse non-decisive artifacts.

### LD debate: Hybrid default vs Autonomous Trial Court

Value: validated delivery. Criterion: strongest EXECUTE acceptance proof with no phase-0-afterward disturbance.

Affirmative: keep Hybrid escrow plus triggered LD plus breakers as default.

Contentions:

1. EXECUTE needs criterion traceability before adversarial performance. Escrow forces every DoW line through negative, positive, drift, and completion proof. Trial Court can expose weak proof, but it starts after artifact work and depends on briefs.
2. Breakers already catch false progress at readiness, RED, evidence, repair, scope, and exit boundaries. Trial prosecution overlaps with breakers but adds ceremony.
3. Triggered LD gives debate only when strategy conflict or repeated failure appears. Trial Court makes adversarial review a new release habit even when gates and escrow are clear.

Negative: replace default with Autonomous Trial Court.

Contentions:

1. Escrow can become checklist compliance. Trial Court forces adversarial review of whether proof persuades, not just whether slots are filled.
2. Prosecution role matches spec-review calibration: flag only blocking issues that would make implementer release wrong artifact. This catches polished but unbuildable proof.
3. Judge verdict gives cleaner stop taxonomy than scattered breaker outcomes: release, focused repair, LD escalation, upstream re-entry, or EXECUTE blocked.

Cross-examination clash:

| Clash | Hybrid answer | Trial Court answer | Judge note |
| --- | --- | --- | --- |
| Criterion traceability | mandatory proof packet per criterion | briefs may reference packets but do not require slot-first workflow | Hybrid wins baseline proof discipline |
| Adversarial pressure | triggered LD and reviewers only on risk | prosecution always attacks release | Trial Court wins high-risk hidden-defect discovery |
| No-disturbance | all actions predeclared after phase 0 | verdict options also predeclared | tie if verdict taxonomy remains fixed |
| Cost proportionality | quick/standard/deep controls ceremony | trial adds three-role ritual | Hybrid wins normal EXECUTE |
| False completion | breakers plus Done Means Ran evidence | judge cannot release without gates | tie; both need fresh command evidence |
| Review buildability | plan/reviewer gates when synthesized | prosecution directly checks buildability | Trial Court wins disputed plans |

Judge ballot:

- Winner for default EXECUTE companion: Hybrid escrow plus triggered LD plus breakers.
- Winner for disputed or high-risk release review: Autonomous Trial Court.
- Required synthesis: keep Trial Court as deep-mode escalation when escrow passes mechanically but reviewer/prosecution-style concerns remain.
- Decisive warrant: EXECUTE exit needs predictable proof before courtroom-style judgment. Trial Court is powerful as appeal court, not as first court.
- Tuning action: add Trial Court trigger to deep mode when proof is complete but acceptance confidence remains contested by reviewer, LD, or repeated blocker history.
- Residual risk: Hybrid default may underuse adversarial review; mitigate with explicit Trial Court trigger instead of default ceremony.

### Comparison: audit variants

| Variant | Reliability | Cost | No-disturbance fit | TDD fit | Drift control | Best use |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| LD-first | high for ambiguous strategy | medium | medium | medium | high | high-risk or conflicting plans |
| Evidence Escrow | high for routine proof | medium-high | high | high | high | default criterion evidence capture |
| Proof Circuit Breaker | high for false-progress prevention | low-medium | high | high for RED/exit discipline | medium | quick/standard guardrail against stale claims |
| Autonomous Trial Court | highest for disputed acceptance | high | high if verdicts fixed | medium-high | high | deep-mode appeal for contested release |
| Hybrid escrow + triggered LD + breakers | highest overall | medium | high | high | highest | standard/deep FORGER EXECUTE |
| Mechanical gates only | medium | low | highest | medium | medium | quick deterministic local tasks |

Weighted result:

| Criterion | Weight | LD-first | Escrow | Circuit breaker | Trial Court | Hybrid + breakers | Gates only |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mechanical acceptance support | 25 | 18 | 23 | 22 | 23 | 25 | 20 |
| Criteria traceability | 15 | 11 | 14 | 10 | 12 | 15 | 10 |
| Hidden-risk discovery | 15 | 14 | 9 | 10 | 15 | 14 | 5 |
| Review buildability | 10 | 8 | 8 | 8 | 10 | 9 | 5 |
| TDD / proof discipline | 10 | 7 | 10 | 9 | 8 | 10 | 6 |
| Cost proportionality | 10 | 7 | 6 | 9 | 5 | 8 | 10 |
| Drift control | 5 | 4 | 4 | 4 | 5 | 5 | 3 |
| Stop-condition honesty | 5 | 4 | 5 | 5 | 5 | 5 | 3 |
| No-disturbance autonomy | 5 | 3 | 5 | 5 | 4 | 5 | 5 |
| Total | 100 | 76 | 84 | 82 | 87 | 96 | 67 |

Comparison decision: keep hybrid as default target. Add Autonomous Trial Court as deep-mode appeal, not replacement. Evidence Escrow remains default proof ledger; LD-first remains triggered strategy debate; circuit breakers guard proof boundaries; Trial Court handles disputed release after proof looks complete; mechanical gates-only remains quick mode for explicit, local, deterministic criteria.

Pros:

- keeps EXECUTE proof-centered,
- preserves no user questions after phase 0,
- uses debate only when it changes outcome,
- adds direct protection against stale Done Means Ran claims,
- gives contested releases a prosecution/defense/judge path,
- maps cleanly to code/system, research_report, and design_artifact.

Cons:

- more artifact names to maintain,
- risk of over-documenting small tasks,
- breaker plus escrow language can duplicate stop conditions,
- Trial Court can become rhetorical theater without evidence-only charges,
- needs clear quick-mode bypass to avoid ceremony.

Mitigation: quick mode may collapse world model, escrow, breaker state, and acceptance proof into one compact proof section when criteria are explicit, deterministic, local, and passing. Standard mode keeps breaker state inside proof packet instead of creating separate artifact unless a breaker trips. Deep mode may trigger Trial Court only when proof is complete but release remains contested by reviewer, LD, repeated breaker history, or high-risk acceptance ambiguity.

### Comparison: Hybrid default vs Acceptance Kata

This is the compare turn in the 2-1-1-1 cadence. It compares the current default against the newest rival after debate.

| Dimension | Hybrid default | Acceptance Kata | Comparative result |
| --- | --- | --- | --- |
| Mechanical acceptance | complete proof packet plus gates | criterion card plus gates | tie when both enforce gates |
| TDD discipline | RED slot and RED breaker | RED verification before every criterion repair | Kata stronger locally |
| Global risk discovery | LD, reviewer, Trial Court appeal | mostly final gate unless escalated | Hybrid stronger globally |
| Buildability | strong but broader artifacts | explicit card loop per criterion | Kata stronger for implementer flow |
| No-disturbance | sealed envelope plus blocker taxonomy | sealed envelope order drives cards | tie |
| Cost control | mode-based ceremony | repeated cards can grow with criteria | Hybrid stronger for large criteria sets |
| Drift control | drift proof plus scope breaker | drift check after every card | tie; Kata catches earlier |
| Review clarity | release proof shows whole case | cards show local proof trail | Kata easier per criterion; Hybrid easier at release |

Weighted comparison:

| Criterion | Weight | Hybrid default | Acceptance Kata | Reason |
| --- | ---: | ---: | ---: | --- |
| Mechanical acceptance support | 25 | 25 | 24 | Kata still needs final release architecture |
| Criteria traceability | 15 | 15 | 15 | both criterion-level |
| Hidden-risk discovery | 15 | 14 | 9 | Kata localism can miss cross-criterion risk |
| Review buildability | 10 | 9 | 10 | cards are easiest to execute |
| TDD / proof discipline | 10 | 10 | 10 | RED integrity makes both strong |
| Cost proportionality | 10 | 8 | 7 | cards repeat for every criterion |
| Drift control | 5 | 5 | 5 | both require drift proof |
| Stop-condition honesty | 5 | 5 | 5 | both use blockers |
| No-disturbance autonomy | 5 | 5 | 5 | both use sealed envelope |
| Total | 100 | 96 | 90 | Hybrid remains stronger default; Kata becomes inner rhythm |

Comparison outcome:

- keep Hybrid default for release-level architecture,
- adopt Acceptance Kata inside standard/deep mode when criterion repair or proof creation needs sharper TDD shape,
- use Kata cards as Evidence Escrow packets when active,
- do not use Kata to bypass LD, Trial Court, breaker, or final acceptance gate,
- do not ask user mid-process; card order comes from sealed envelope.

### Comparison: Hybrid default vs Black-box Acceptance Lab

This is the compare turn in the 2-1-1-1 cadence. It compares the retained default against the newest rival after debate.

| Dimension | Hybrid default | Black-box Acceptance Lab | Comparative result |
| --- | --- | --- | --- |
| Mechanical acceptance | proof packets plus acceptance/audit gates | probes plus acceptance/audit gates | tie when both obey gates |
| Independent validation | reviewer, LD, Trial Court triggers | blind probes before rationale review | Black-box stronger locally |
| Proof creation | escrow builds negative, positive, drift, completion evidence | lab mainly validates finished artifact | Hybrid stronger |
| RED integrity | RED audit, breaker, proof-command contract | blind oracle catches post-hoc RED stories | tie; Black-box catches narrative fraud earlier |
| No-disturbance | sealed envelope plus blocker taxonomy | sealed probes from envelope | tie |
| Cost control | mode-based ceremony | probe design adds repeated validation work | Hybrid stronger |
| Non-code fit | branch proof language and reviewer gate | claim/design counterexamples | Black-box sharper for adversarial checks |
| Release architecture | full default path with escalation and appeal | validation technique needing release wrapper | Hybrid stronger |

Weighted comparison:

| Criterion | Weight | Hybrid default | Black-box Lab | Reason |
| --- | ---: | ---: | ---: | --- |
| Release reliability | 25 | 24 | 21 | lab needs surrounding release architecture |
| Independent fraud detection | 15 | 12 | 15 | blind probes beat executor narrative |
| Proof buildability | 15 | 15 | 10 | escrow and proof-command contract tell executor what to build |
| TDD / RED discipline | 10 | 10 | 10 | both require intended failure before repair |
| Scope control | 10 | 10 | 9 | both sealed; lab probe design can tempt new criteria |
| Cost proportionality | 10 | 9 | 6 | lab adds probe ceremony per contested criterion |
| Research/design challenge quality | 5 | 4 | 5 | counterexamples sharpen non-code validation |
| No-disturbance autonomy | 5 | 5 | 5 | both use phase-0 envelope |
| Integration with LD/Trial Court | 5 | 5 | 3 | Hybrid already owns escalation rules |
| Total | 100 | 94 | 84 | Hybrid remains default; lab becomes trigger |

Comparison outcome:

- keep Hybrid default for release-level EXECUTE companion,
- add Black-box Lab as triggered validation when proof packets look self-confirming, mock-heavy, reviewer-contested, or high-risk,
- use lab counterexamples as proof packet gaps or repair breaker evidence,
- never let lab probes invent new acceptance criteria or bypass gates,
- do not ask user mid-process; probe oracle comes from sealed envelope and proof-command contract.


### LD debate: Hybrid default vs Failure Injection Board

This is the debate turn in the 2-1-1-1 cadence. Debate question: should EXECUTE keep Hybrid escrow plus triggered LD plus breakers as default, or switch default to Failure Injection Board?

Value: validated delivery without mid-process disturbance.

Criterion: release only when EXECUTE proof resists both normal acceptance gates and adversarial failure pressure while staying inside sealed phase-0 scope.

Affirmative: keep Hybrid default.

- Hybrid already carries sealed envelope, proof-command contract, custody, replayability, reviewer gate, breakers, LD, Trial Court, Black-box Lab triggers, and Done Means Ran evidence.
- Release architecture must prove normal correctness before adversarial pressure; Failure Injection Board assumes enough proof structure exists to choose safe injections.
- Hybrid controls cost by mode. Quick mode can exit with local deterministic proof; standard/deep can escalate only when evidence demands it.
- Failure Injection Board is strong at finding brittle proof but weak as default because it can multiply probes and repairs before basic escrow completeness is established.
- EXECUTE-only boundary is safer in Hybrid because scope breaker and upstream re-entry are central, not post-injection consequences.

Negative: switch default to Failure Injection Board.

- Hybrid can still become paperwork: packets complete, commands fresh, reviewer satisfied, yet artifact remains fragile under small adversarial changes.
- TDD spirit is not only proof collection; it is deliberate failure first. Failure Injection Board forces EXECUTE to prove it can watch intended breaks and repair from them.
- Board catches false GREEN evidence earlier than debate because it attacks exact weak points: mocks, unsupported claims, rejected constraints, and replay gaps.
- Board makes no-disturbance stronger by deriving injections from sealed phase-0 inputs instead of asking user for edge cases mid-process.
- For high-risk EXECUTE work, default adversarial pressure gives better release confidence than optional trigger logic that may never fire.

Cross-examination:

| Question | Hybrid answer | Board answer | Judge note |
| --- | --- | --- | --- |
| What prevents ceremony without proof? | mechanical gates, custody, replayability, Done Means Ran | injected failures must produce observable break or immunity | both help; Hybrid broader |
| What prevents scope creep? | scope breaker, sealed envelope, upstream routing | injections derive only from sealed criteria | Hybrid has clearer default stop logic |
| What catches false GREEN? | RED integrity, replayability, Black-box Lab trigger | direct adversarial break attempts | Board stronger as trigger |
| What controls cost? | mode policy and trigger thresholds | high-risk/repaired criteria only if constrained | Hybrid stronger default |
| What fits all branches? | branch proof language plus escrow slots | branch-specific injections | tie when Board is triggered |

Judge ballot:

Hybrid wins default workflow. Failure Injection Board wins adversarial proof-hardening. Default release process must first make proof complete, ordered, replayable, and scoped; Board depends on that structure to avoid random chaos or upstream drift.

Decision from debate:

1. Keep Hybrid escrow plus triggered LD plus breakers as default EXECUTE companion.
2. Adopt Failure Injection Board as triggered adversarial hardening, not release default.
3. Trigger Board when RED integrity is disputed, replayability gap exists, same criterion repairs twice, Black-box Lab finds counterexample, reviewer flags self-confirming proof, or deep mode marks criterion high-risk.
4. Board verdict cannot override failing mechanical gate, audit gate, custody failure, replayability failure, or Done Means Ran requirement.
5. Board may escalate to LD or Trial Court only with sealed evidence and no mid-process user questions.
### Comparison: Hybrid default vs Failure Injection Board

This is the compare turn in the 2-1-1-1 cadence. It compares the retained default against the newest adversarial variation after LD debate.

Weighted comparison:

| Dimension | Weight | Hybrid default | Failure Injection Board | Winner |
| --- | ---: | --- | --- | --- |
| Release completeness | 20 | Covers envelope, escrow, commands, custody, replayability, reviewers, breakers, LD, Trial Court, and acceptance proof | Covers adversarial proof pressure but not full release lifecycle | Hybrid |
| False GREEN detection | 18 | RED integrity, replayability, reviewer skepticism, Black-box trigger | Directly attacks mocks, brittle claims, weak constraints, and replay gaps | Board |
| Scope control | 15 | Scope breaker and upstream routing are central | Injection derivation is sealed but repair can expand under pressure | Hybrid |
| No-disturbance autonomy | 12 | Phase-0 envelope plus blocker taxonomy | Sealed injections avoid mid-process edge-case asks | Tie |
| Cost control | 10 | Mode policy keeps quick path lean | Probe selection can multiply tests/challenges | Hybrid |
| Non-code proof strength | 10 | Branch proof language maps research/design to proof slots | Strong for contradiction, citation, and constraint pressure | Board |
| Replayability | 8 | Explicit replay gate and custody order | Finds replay gaps but depends on existing packet structure | Hybrid |
| TDD spirit | 7 | RED/GREEN discipline generalized across branches | Strongest deliberate-break-first posture | Board |

Score:

| Candidate | Weighted score | Interpretation |
| --- | ---: | --- |
| Hybrid default | 91 | Best release-level companion; complete, scoped, mode-aware, replayable |
| Failure Injection Board | 83 | Best adversarial hardening module; too costly and narrow as default |

Pros and cons:

| Candidate | Pros | Cons |
| --- | --- | --- |
| Hybrid default | complete release architecture; clear gates; strong scope control; works quick/standard/deep; supports all artifact branches | can become proof paperwork unless adversarial triggers fire |
| Failure Injection Board | catches false GREEN; embodies deliberate failure; excellent for high-risk repaired criteria; strong against self-confirming proof | depends on existing proof structure; higher cost; injection design can drift into new criteria if uncontrolled |

Compare outcome:

Keep Hybrid default. Add Failure Injection Board as triggered hardening after proof structure exists. Failure Injection Board should feed evidence into repair breaker, replayability gate, Black-box Lab counterexample handling, LD escalation, or Trial Court appeal. It should not replace escrow, custody, acceptance gates, audit gates, or Done Means Ran.

Integration rule:

```text
if failure_injection_trigger_fires:
  select injection from sealed envelope and proof-command contract
  write expected break before probe
  run injection probe
  if injection exposes failure:
    repair one EXECUTE criterion slice
    rerun original proof command, injection probe, drift proof, and replayability gate
  else:
    record immunity evidence in proof packet
```
### Final decision: keep hybrid escrow plus triggered LD plus breakers

Stay with Hybrid escrow plus triggered LD, and merge Proof Circuit Breakers as enforcement rails. Do not replace escrow with breakers.

Why:

1. Evidence Escrow best matches EXECUTE purpose: prove artifact acceptance criterion by criterion.
2. Triggered LD preserves adversarial strategy review without making debate mandatory ceremony.
3. Proof Circuit Breakers catch false progress at readiness, RED, evidence, repair, scope, and exit boundaries.
4. Quick proof prevents small deterministic tasks from carrying full audit overhead.
5. Phase-0-only boundary remains intact: agents fill evidence from artifacts and stop only on defined blockers.
6. TDD maps cleanly: negative proof is RED, positive proof is GREEN, drift proof is IMPROVE/regression, exit breaker enforces Done Means Ran.

Weighted pros and cons:

| Factor | Pro | Con | Decision weight | Decision |
| --- | --- | --- | ---: | --- |
| Reliability | strongest total proof path, score 96 | more moving parts | 30 | keep hybrid+breakers |
| User disturbance | asks only phase 0; breakers predeclare stop action | stop messages may still happen on blockers | 20 | keep |
| TDD fit | native red/green slots plus RED breaker | non-code branches need equivalent proof language | 15 | keep |
| Cost | debate only on trigger; breakers cheaper than extra reviewers | escrow can feel heavy | 15 | mitigate with quick mode |
| Drift control | scope proof plus scope breaker plus LD escalation | artifact maintenance required | 10 | keep |
| Generality | covers code, research, design | branch-specific examples needed later | 10 | keep |

Decision:

- Default: Evidence Escrow for every non-trivial EXECUTE criterion.
- Enforcement: Proof Circuit Breakers run at readiness, RED, evidence, repair, scope, and exit boundaries.
- Escalation: LD audit only when trigger fires or two breakers trip for same criterion.
- Bypass: quick proof only for explicit, deterministic, local criteria with passing gates and clear breaker state.
- Rejection: LD-first as default loses because it optimizes strategy debate before proof completeness.
- Rejection: breaker-only loses because it catches failure boundaries but does not prove full criterion traceability.
- Rejection: gates-only loses because it misses hidden proof gaps and anti-patterns.

Next retained plan state: implement Hybrid escrow plus triggered LD plus breakers as companion workflow if this plan graduates from report to EXECUTE skill instructions. Autonomous Trial Court is retained as deep-mode appeal, not default path.

Trial Court decision addendum:

| Factor | Hybrid + breakers | Autonomous Trial Court | Weight | Decision |
| --- | --- | --- | ---: | --- |
| Default reliability | complete criterion proof before exit | strongest adversarial release challenge | 25 | hybrid default |
| Hidden defect discovery | LD and reviewers trigger on risk | prosecution attacks every release | 15 | Trial Court for contested release |
| Cost control | quick/standard/deep scales ceremony | high ceremony by default | 15 | hybrid default |
| No-disturbance | phase-0 envelope plus predeclared blockers | fixed verdict taxonomy also avoids asks | 15 | tie |
| TDD proof discipline | RED slot plus RED breaker explicit | prosecution may catch missing RED after fact | 10 | hybrid default |
| Review buildability | plan/reviewer gate when synthesized | prosecution charge sheet directly targets buildability | 10 | Trial Court escalation |
| Drift control | scope proof plus scope breaker | judge blocks out-of-scope verdicts | 5 | tie |
| Operational simplicity | fewer roles in normal path | clearer courtroom mental model but more artifacts | 5 | hybrid default |

Weighted decision: stay with Hybrid escrow plus triggered LD plus breakers. Trial Court joins only as deep-mode appeal when proof is mechanically complete but release confidence is contested.

Acceptance Kata decision addendum:

| Factor | Hybrid default | Acceptance Kata | Weight | Decision |
| --- | --- | --- | ---: | --- |
| Release reliability | full escrow, breakers, LD, appeal | local card proof plus final gate | 25 | hybrid default |
| Local execution discipline | proof slots plus RED breaker | strict RED/GREEN card loop | 20 | Kata as inner rhythm |
| No-disturbance autonomy | sealed envelope plus blocker taxonomy | sealed envelope card order | 15 | tie |
| Hidden-risk coverage | global escalation paths | local criterion focus | 15 | hybrid default |
| Buildability | broader proof architecture | concrete per-card steps | 10 | Kata as inner rhythm |
| Cost control | mode-based ceremony | one card per criterion | 10 | hybrid default |
| Scope control | drift proof plus scope breaker | drift check per card | 5 | tie |

Decision after Acceptance Kata cycle:

1. Stay with Hybrid escrow plus triggered LD plus breakers as release-level EXECUTE companion.
2. Adopt Acceptance Kata as optional standard/deep inner loop for criterion repair and proof packet creation.
3. Treat a Kata card as one Evidence Escrow packet when Kata is active.
4. Do not let Kata bypass RED integrity audit, breaker state, LD trigger, Trial Court appeal, acceptance gate, audit gate, or Done Means Ran proof.
5. Use quick mode without Kata when criteria are explicit, deterministic, local, already passing, and breaker state is clean.
6. Route new criteria or changed acceptance language upstream; do not expand EXECUTE.

Rejected alternatives after this cycle:

- Acceptance Kata as default loses because local card progression can miss cross-criterion acceptance fraud and contested release confidence.
- Trial Court as default loses because every release becomes high-ceremony litigation.
- LD-first as default still loses because strategy debate before proof completeness invites rhetoric.
- Breaker-only still loses because catching invalid proof is not same as building proof.
- Gates-only still loses because passing commands can hide weak RED, stale evidence, or unsupported claims.

Trial Court triggers:

1. reviewer reports blocking issue after gates pass,
2. LD ballot exposes unresolved warrant clash,
3. same criterion hits repair breaker twice but still has plausible release path,
4. high-risk EXECUTE artifact has complete proof but weak acceptance confidence,
5. branch output is persuasive narrative or design rationale where slot compliance can hide bad judgment.

Trial Court non-triggers:

1. quick deterministic local task,
2. clear mechanical gate failure,
3. missing phase-0 input,
4. scope drift that requires upstream re-entry,
5. ordinary escrow slot gap with obvious missing command or audit evidence.

Black-box Acceptance Lab decision addendum:

| Factor | Hybrid default | Black-box Lab | Weight | Decision |
| --- | --- | --- | ---: | --- |
| Release reliability | escrow, reviewer gate, breakers, LD, Trial Court | independent probes plus counterexamples | 25 | hybrid default |
| Fraud detection | RED integrity, proof-command contract, reviewer skepticism | blind oracle catches executor narrative fraud | 20 | Black-box as trigger |
| Proof buildability | exact slots, commands, and repair boundaries | validates after artifact exists | 15 | hybrid default |
| No-disturbance autonomy | sealed envelope and blocker taxonomy | sealed probes and oracle | 15 | tie |
| Cost control | mode-based ceremony | probe design can multiply work | 10 | hybrid default |
| Non-code challenge quality | branch proof language plus audits | concrete claim/design counterexamples | 10 | Black-box as trigger |
| Scope control | scope breaker and upstream routing | probe boundary but criteria temptation risk | 5 | hybrid default |

Decision after Black-box Lab cycle:

1. Stay with Hybrid escrow plus triggered LD plus breakers as release-level EXECUTE companion.
2. Adopt Black-box Acceptance Lab as triggered independent validation, not default workflow.
3. Trigger Black-box Lab when proof packets are self-confirming, mock-heavy, reviewer-contested, high-risk, or based on executor narrative rather than observable artifact behavior.
4. Treat lab counterexamples as proof packet gaps, RED integrity failures, or repair breaker evidence.
5. Require lab probes to derive only from sealed phase-0 envelope and proof-command contract.
6. Do not let lab probes add criteria, bypass acceptance gates, bypass audit gates, bypass Done Means Ran, or ask user mid-process.

Rejected alternatives after this cycle:

- Black-box Lab as default loses because it validates better than it builds; EXECUTE still needs proof creation, review, escalation, and release architecture.
- Executor-authored escrow without black-box trigger loses because self-confirming proof can look complete while missing artifact behavior.
- Reviewer-only validation loses because reviewer text is weaker than probe evidence and mechanical gates.
- Probe-only validation loses because passing probes can still miss stale evidence, missing RED custody, or unresolved gate failures.


Failure Injection Board decision addendum:

| Factor | Hybrid default | Failure Injection Board | Weight | Decision |
| --- | --- | --- | ---: | --- |
| Release reliability | complete escrow, gates, custody, replayability, breakers, and LD path | strong adversarial hardening after proof exists | 25 | hybrid default |
| False-proof detection | catches with RED integrity, reviewer gate, replayability, and Black-box trigger | directly attacks false GREEN, mock-heavy, brittle, or narrative proof | 20 | Board as trigger |
| EXECUTE-only scope | explicit scope breaker, upstream routing, and sealed boundary | sealed injections, but repair pressure can drift | 15 | hybrid default |
| No-disturbance autonomy | phase-0 envelope plus blocker taxonomy | phase-0-derived injections; no mid-process edge-case asks | 10 | tie |
| Cost control | mode-aware ceremony; quick path stays lean | adversarial probes can multiply work | 10 | hybrid default |
| Non-code branch rigor | branch proof language and audit slots | strong contradiction/source/constraint pressure | 10 | Board as trigger |
| TDD inspiration | RED/GREEN mapped across branches | strongest deliberate-failure posture | 10 | Board as trigger |

Weighted decision:

1. Stay with Hybrid escrow plus triggered LD plus breakers as release-level EXECUTE companion.
2. Adopt Failure Injection Board as triggered proof-hardening module, not default workflow.
3. Trigger Board when any of these hold:
   - RED proof integrity disputed,
   - proof packet passes formally but fails replayability,
   - same criterion needed two repairs,
   - Black-box Acceptance Lab finds counterexample,
   - reviewer flags self-confirming, mock-heavy, or narrative-only evidence,
   - deep mode marks criterion high-risk,
   - LD judge asks for adversarial proof instead of more argument.
4. Board output becomes one of four evidence types:
   - immunity evidence in proof packet,
   - repair breaker evidence,
   - replayability gap evidence,
   - LD or Trial Court escalation evidence.
5. Board cannot add criteria, change DoW language, rewrite upstream phases, override failed gates, bypass audit, bypass custody, bypass replayability, or bypass Done Means Ran.

Decision rationale:

Hybrid remains best default because EXECUTE release needs full lifecycle proof: sealed intent, ordered evidence, exact proof commands, fresh acceptance, scope control, and replayability. Failure Injection Board is too narrow and costly as default, but it supplies missing Superpowers spice: deliberate adversarial break attempts after ordinary proof looks green. Best synthesis is Hybrid default with Board trigger.
### Trigger arbitration matrix

This is improvement turn 2 in the next 2-1-1-1 cycle. It prevents audit modules from fighting each other. When multiple EXECUTE triggers fire, the companion chooses the earliest proof-preserving action, not the most dramatic ceremony.

Arbitration principle: repair evidence order before arguing about evidence meaning; prove replay before adding adversarial probes; use debate only when mechanical proof is complete but interpretation remains contested.

| Trigger | First action | May escalate to | Must not do |
| --- | --- | --- | --- |
| phase-0 input missing | stop before artifact change | none until user supplies missing input | infer preferences or ask mid-process later |
| mechanical gate fails | repair EXECUTE artifact and rerun same gate | repair breaker after repeated failure | debate around failing gate |
| scope drift | stop and route upstream | Trial Court only in deep mode if boundary contested and proof complete | patch upstream phase from EXECUTE |
| custody gap | restore order with fresh RED/GREEN/drift/release evidence | replayability gate if order still unclear | accept narrative chronology |
| replayability gap | fill command/order/path/signal gap | Failure Injection Board or Black-box Lab if gap hides false proof | release complete-looking packet |
| escrow slot open | fill missing proof slot | reviewer gate if slot wording ambiguous | run LD before proof exists |
| reviewer blocking issue | repair decisive issue | LD when reviewer and executor disagree on interpretation | add reviewer-preferred scope |
| self-confirming proof | run Black-box Lab probes | Failure Injection Board if counterexample found | trust executor-authored narrative |
| RED integrity dispute | run Failure Injection Board or rebuild RED proof | LD if branch proof semantics contested | continue from invalid RED |
| repeated repair | trip repair breaker and run LD or Board based on failure type | Trial Court in deep mode | keep stacking fixes silently |
| strategy or warrant conflict | run LD audit | Trial Court in deep mode | change criteria to resolve conflict |
| contested release after complete proof | run Trial Court in deep mode | upstream re-entry or EXECUTE blocked | use Trial Court to bypass gate |

Conflict resolution:

1. If any mechanical gate fails, ignore LD, Trial Court, Black-box Lab, and Board release claims until gate reruns clean.
2. If custody and replayability both fail, fix custody first because replay needs ordered evidence.
3. If escrow and reviewer both fail, fill escrow first unless reviewer says criterion wording is impossible to execute.
4. If Black-box Lab and Failure Injection Board both trigger, run Lab first when artifact behavior is unknown; run Board first when RED integrity or repeated repair is the issue.
5. If LD and Trial Court both trigger, run LD first unless proof is complete and only release verdict is contested in deep mode.
6. If any trigger requires changing acceptance criteria, stop and route upstream; EXECUTE cannot solve by rewriting target.

Mode limits:

| Mode | Arbitration limit |
| --- | --- |
| quick | only gate repair, custody freshness, and replay check; escalate to standard if same gate fails twice |
| standard | full arbitration except Trial Court; use LD, Lab, and Board only when triggers fire |
| deep | full arbitration plus Trial Court appeal after proof is complete |
### Rival variation: Proof Budget Auction

This is the different-variation turn in the 2-1-1-1 cadence. Instead of routing by fixed trigger order, EXECUTE assigns a finite proof budget to each criterion and auctions that budget among proof actions. The goal is not cheaper proof; the goal is spending attention where release risk is highest while preserving strict gates.

Proof Budget Auction model:

| Auction element | Rule | EXECUTE-only boundary |
| --- | --- | --- |
| Budget | finite units per criterion based on risk, branch, mode, and recent failures | cannot reduce mandatory gates |
| Bidder | escrow fill, reviewer gate, custody repair, replay check, Black-box Lab, Failure Injection Board, LD, Trial Court | bidders may only use sealed phase-0 inputs |
| Bid | expected risk reduction plus proof cost | no bid may ask user mid-process |
| Allocation | highest risk-reduction per cost after mandatory proof | cannot skip RED, GREEN, drift, completion, audit, or Done Means Ran |
| Stop price | budget exhausted with unresolved blocker | stop with EXECUTE blocked format |

Auction procedure:

```text
for each criterion:
  assign base budget from mode and risk tier
  reserve mandatory budget for RED/GREEN/drift/completion proof
  collect bids from triggered audit modules
  reject bids that add criteria, touch upstream phases, or ask user mid-process
  allocate remaining budget to highest risk-reduction bids
  run selected proof actions in arbitration order
  record spend, result, and residual risk in proof packet
```

Budget table:

| Mode | Base budget | Mandatory reserve | Optional spend |
| --- | ---: | --- | --- |
| quick | 3 | fresh gate, compact proof, drift freshness | same-gate retry only |
| standard | 7 | escrow, custody, replayability, reviewer if needed | Lab, Board, LD when triggers fire |
| deep | 12 | full escrow, custody, replayability, reviewer, at least one LD ballot | Lab, Board, Trial Court, repeated probe hardening |

Bid scoring:

| Bidder | Risk reduced | Cost | Best when |
| --- | --- | ---: | --- |
| custody repair | fake chronology, stale proof | 2 | evidence order unclear |
| replay check | narrative-dependent proof | 2 | another agent could not rerun packet |
| reviewer gate | ambiguous criteria or buildability gaps | 2 | executor might build wrong thing |
| Black-box Lab | artifact does not satisfy sealed behavior | 3 | proof self-confirming or mock-heavy |
| Failure Injection Board | false GREEN under deliberate pressure | 3 | repeated repair or RED dispute |
| LD | interpretation conflict | 4 | strategies disagree after gates pass |
| Trial Court | contested release verdict | 5 | deep mode and proof complete |

Why it is different:

Hybrid default asks, "which trigger fired?" Proof Budget Auction asks, "which proof action buys the most release confidence after mandatory gates?" It makes audit ceremony explicit cost accounting rather than fixed sequence.

Failure modes:

- underfunding: budget too low hides a risky criterion,
- gaming: cheap proof wins over necessary expensive proof,
- false economy: agent treats budget as permission to skip strict gates,
- scoring hallucination: risk-reduction numbers become narrative instead of evidence.

Guardrails:

1. Mandatory proof has first claim on budget.
2. Mechanical gates, audit gates, custody, replayability, and Done Means Ran are non-discountable.
3. Budget can only add proof, not subtract obligations.
4. A blocked mandatory proof ignores remaining budget and stops EXECUTE.
5. Auction score must cite sealed criterion, trigger, expected signal, and exact proof artifact.
### LD debate: Hybrid default vs Proof Budget Auction

This is the debate turn in the 2-1-1-1 cadence. The question is whether the current Hybrid escrow plus triggered LD plus breakers should stay the release-level EXECUTE companion, or whether Proof Budget Auction should become the default routing model.

**Resolution:** EXECUTE should replace fixed trigger routing with Proof Budget Auction.

| Role | Argument |
| --- | --- |
| Affirmative: Proof Budget Auction | Fixed trigger routing treats all proof actions as equally urgent once triggered. Auctioning forces each optional module to name sealed criterion, expected signal, cost, and risk reduction before it consumes EXECUTE attention. This can reduce ceremony while preserving mandatory RED, GREEN, drift, completion, audit, custody, replayability, and Done Means Ran proof. |
| Negative: Hybrid default | Auction scoring adds a new judgment layer exactly where EXECUTE needs fewer subjective judgments. If a gate is mandatory, it cannot be budgeted. If a module is triggered by real risk, delaying it behind cost scoring can turn strict proof into optimization theater. Fixed arbitration is easier to replay and harder to game. |
| Cross-examination | Affirmative wins on attention allocation for optional probes. Negative wins on release safety because hardest failures are not caused by overspending proof effort; they are caused by stale evidence, self-confirming tests, scope drift, and narrative-only completion claims. |
| Judge | Keep Hybrid as default. Adopt Auction only as a meta-audit for optional proof spend after mandatory gates, custody, replayability, and open escrow slots are satisfied. |

Decision from debate:

1. Hybrid default remains release-level EXECUTE companion.
2. Proof Budget Auction cannot replace trigger arbitration because budget scoring is less replayable than fixed blocker order.
3. Auction may run only after mandatory proof is reserved and no mechanical gate, custody gate, replayability gate, or escrow slot is open.
4. Auction bids must cite criterion id, trigger source, expected signal, exact command or artifact, and residual risk if skipped.
5. Any bid that asks user mid-process, changes criteria, touches upstream phases, discounts mandatory proof, or overrides a failed gate is invalid.
6. Auction output is advisory routing evidence, not release evidence.

### Comparison: Hybrid default vs Proof Budget Auction

This is the compare turn in the 2-1-1-1 cadence. Scores measure release usefulness for EXECUTE-only audit, not upstream planning quality.

| Criterion | Weight | Hybrid default | Proof Budget Auction | Notes |
| --- | ---: | ---: | ---: | --- |
| Mechanical proof discipline | 25 | 24 | 22 | Hybrid keeps gate order explicit; Auction preserves mandatory gates but adds cost layer. |
| No-disturbance autonomy | 15 | 14 | 14 | Both use sealed phase-0 envelope and reject mid-process user asks. |
| Replayability | 15 | 14 | 10 | Fixed arbitration is easier for another agent to replay than scored bid choices. |
| Risk targeting | 15 | 12 | 15 | Auction better prioritizes optional proof when many triggers fire. |
| Anti-gaming strength | 10 | 9 | 6 | Auction invites scoring manipulation unless every bid is audited. |
| Cognitive load | 10 | 8 | 6 | Hybrid is easier to teach; Auction adds accounting overhead. |
| EXECUTE-only boundary | 10 | 9 | 8 | Both can stay bounded, but Auction may tempt criteria repricing. |
| **Total** | **100** | **90** | **81** | Hybrid stays default; Auction becomes optional spend router. |

Comparison verdict:

- Hybrid default wins release-level workflow because strict order, replayability, and anti-gaming matter more than proof-effort optimization.
- Proof Budget Auction wins as an optional overload-control layer when standard/deep mode has multiple valid optional probes after mandatory proof is clean.
- Auction score cannot be used as release score; it only explains why optional proof action was selected or skipped.

Integration rule:

```text
if mandatory_proof_clean and optional_triggers_count > 1:
  collect auction bids from optional modules
  reject bids without criterion, trigger, expected signal, exact artifact, and residual risk
  rank by risk reduction per cost
  run selected proof actions in trigger arbitration order
else:
  use fixed trigger arbitration only
```

### Final decision: Hybrid default vs Proof Budget Auction

This is the decision turn in the 2-1-1-1 cadence. The weighted comparison keeps Hybrid default as the EXECUTE release companion and keeps Proof Budget Auction as an optional routing aid.

| Option | Pros | Cons | Weighted result | Decision |
| --- | --- | --- | ---: | --- |
| Hybrid escrow plus triggered LD plus breakers | strict blocker order, easier replay, stronger anti-gaming, clearer Done Means Ran discipline, better custody enforcement | can over-run optional probes when many triggers fire | 90 | stay default |
| Proof Budget Auction | targets optional proof spend, makes skipped probes explicit, useful under audit overload | adds subjective scoring, weaker replay, easier gaming, risks treating release proof as optimization | 81 | keep optional |

Decision:

1. Stay with Hybrid escrow plus triggered LD plus breakers as release-level EXECUTE companion.
2. Keep Trigger arbitration matrix as canonical order for blockers and release gates.
3. Add Proof Budget Auction only after mandatory proof is clean and more than one optional proof trigger remains.
4. Record Auction output as routing rationale inside proof packet, not as acceptance evidence.
5. Reject any Auction bid that weakens RED, GREEN, drift, completion, audit, custody, replayability, Done Means Ran, EXECUTE-only scope, or phase-0-only ask rules.
6. If Auction and Trigger arbitration conflict, Trigger arbitration wins.

Net effect: Hybrid remains spine; Auction becomes load balancer for optional adversarial proof, never judge of release readiness.

### Cadence ledger and audit state

This is improvement turn 1 in the next 2-1-1-1 cadence. EXECUTE keeps a small cadence ledger so continuous audit cannot drift into random ideation, duplicated debate, or upstream phase rewriting.

| Ledger field | Meaning | Gate |
| --- | --- | --- |
| cadence_step | one of improve_1, improve_2, variation, debate, compare, decide | must advance in order |
| subject | current audit target, such as Auction, Board, Trial Court, or reviewer gate | must be EXECUTE-only |
| carried_decision | latest accepted spine and optional modules | cannot contradict prior final decision without new compare and decide turns |
| proof_delta | exact section, rule, or artifact strengthened this turn | must cite plan section or companion artifact |
| verification | schema, presence, ordering, and scope checks run after edit | must be fresh before claiming completion |

Cadence state machine:

```text
improve_1 -> improve_2 -> variation -> debate -> compare -> decide -> improve_1
```

Cadence rules:

1. Improvement turns may only strengthen current selected workflow, not introduce a replacement architecture.
2. Variation turn must be materially different from current spine and must declare failure modes.
3. Debate turn must include affirmative, negative, cross-examination, judge, and decision from debate.
4. Compare turn must use explicit weighted criteria and identify integration rule if loser has useful pieces.
5. Decide turn must choose default, optional module, or rejection, with pros, cons, score, and precedence rule.
6. Any cadence turn that changes acceptance criteria, asks user after phase 0, or touches upstream phases is invalid.

Cadence ledger row format:

```text
Step: <improve_1|improve_2|variation|debate|compare|decide>
Subject: <EXECUTE companion component>
Change: <section or rule changed>
Reason: <proof risk reduced>
Verification: <fresh command or artifact check>
Next: <expected next cadence step>
```

Why this improves the plan: continuous audit becomes mechanically replayable. Another EXECUTE agent can see where the cadence is, why a variation exists, and when a decision is binding without asking the user mid-process.

### Cadence exit gate

This is improvement turn 2 in the 2-1-1-1 cadence. Cadence is not just narrative bookkeeping; EXECUTE release must prove the audit loop itself stayed ordered, scoped, and replayable.

Cadence exit checks:

| Check | Pass condition | Failure action |
| --- | --- | --- |
| state continuity | latest ledger row follows previous cadence step | add missing cadence turn or mark skipped with reason |
| subject continuity | current turn subject matches carried decision or declared new variation | block random architecture drift |
| EXECUTE-only scope | ledger change affects EXECUTE companion only | route upstream if criteria or prior phases changed |
| phase-0 silence | no evidence of mid-process user ask | block release and record no-disturbance breach |
| proof freshness | verification command or artifact check is fresh for current turn | rerun verification before completion claim |
| decision binding | decide turn updates carried decision and precedence rule | block next cycle until binding decision exists |

Cadence exit algorithm:

```text
read latest cadence ledger row
verify step follows previous cadence state
verify subject stays EXECUTE-only
verify no mid-process user ask occurred
verify fresh proof exists for this turn
if current step is decide:
  verify carried decision and precedence rule were updated
if any check fails:
  stop with EXECUTE blocked format
else:
  allow next cadence step or EXECUTE release gate
```

Cadence exit gate joins custody, replayability, and Done Means Ran. It cannot override mechanical acceptance gates, but it can block release claims when continuous audit state is stale or unordered.

### Rival variation: Shadow Executor

This is the different-variation turn in the 2-1-1-1 cadence. Instead of adding more proof modules around the primary executor, EXECUTE runs a sealed shadow executor that independently reconstructs the proof path from phase-0 inputs and existing artifact evidence. The shadow does not edit the artifact. It tries to reproduce the release case from scratch.

Shadow Executor model:

| Element | Rule | EXECUTE-only boundary |
| --- | --- | --- |
| Input | sealed phase-0 envelope, DoW/acceptance criteria, current artifact, proof-command contract | no new user questions |
| Shadow role | independently derive expected RED, GREEN, drift, completion, and blocker checks | cannot change artifact or criteria |
| Output | shadow proof map, mismatch list, missing evidence list, release objection | evidence only, no implementation edits |
| Join point | compare executor proof packet against shadow proof map | mismatches become proof gaps or reviewer blockers |
| Stop condition | shadow cannot reconstruct release case from evidence | EXECUTE blocked until proof packet becomes replayable |

Procedure:

```text
spawn shadow executor with sealed envelope and artifact evidence only
shadow lists criteria and required proof slots
shadow reconstructs expected RED, GREEN, drift, and completion evidence
compare shadow map against executor proof packet
if shadow finds missing or contradictory evidence:
  convert mismatch to escrow gap, replayability gap, or reviewer blocker
else:
  record shadow concurrence as release-supporting evidence
```

Why this is materially different:

- Hybrid default audits proof slots from inside the executor workflow.
- Shadow Executor audits whether an independent agent can reconstruct release readiness without trusting executor narration.
- It tests cognitive replay, not just command replay.

Failure modes:

1. Shadow may duplicate reviewer gate unless mismatch types are strict.
2. Shadow may over-demand proof not required by sealed criteria.
3. Shadow may become second executor by suggesting implementation changes.
4. Shadow cost may be too high for quick mode.

Guardrails:

1. Shadow cannot edit files, criteria, proof commands, or upstream artifacts.
2. Shadow objections must map to one sealed criterion and one proof slot.
3. Shadow cannot block release on style, preference, or new requirement.
4. Shadow concurrence cannot override failed mechanical gates, custody, replayability, audit, or Done Means Ran.
5. Shadow runs only in standard/deep mode or when replayability remains contested after proof packet repair.

### LD debate: Hybrid default vs Shadow Executor

This is the debate turn in the 2-1-1-1 cadence. The question is whether Hybrid escrow plus triggered LD plus breakers should remain the EXECUTE release companion, or whether a sealed Shadow Executor should become the default confidence mechanism.

**Resolution:** EXECUTE should make Shadow Executor the default release companion.

| Role | Argument |
| --- | --- |
| Affirmative: Shadow Executor | Release proof is only trustworthy when an independent agent can reconstruct it without executor narration. Shadow execution catches missing warrants, stale proof, criteria misread, and narrative-only completion better than internal escrow checks. It makes the plan more like TDD: independent RED/GREEN reasoning before trust. |
| Negative: Hybrid default | Shadow Executor is valuable but too expensive and duplicative as default. Hybrid already has escrow, custody, replayability, reviewer gate, Black-box Lab, Failure Injection Board, LD, Trial Court, and cadence exit. Making shadow default adds second-agent ceremony to ordinary EXECUTE and risks subjective overreach. |
| Cross-examination | Affirmative proves cognitive replay gap matters: command replay can pass while rationale remains non-reconstructable. Negative proves defaulting to shadow weakens quick/standard ergonomics and overlaps with existing replayability plus reviewer gates unless tightly triggered. |
| Judge | Hybrid remains default. Shadow Executor becomes triggered independent reconstruction for contested replayability, high-risk deep mode, repeated proof mismatch, or reviewer claim that executor narrative is doing too much work. |

Decision from debate:

1. Keep Hybrid as default release companion.
2. Adopt Shadow Executor as triggered cognitive replay audit, not default workflow.
3. Trigger Shadow when replayability passes mechanically but reviewer, LD, Trial Court, or cadence exit says proof still depends on executor narration.
4. Shadow objections must map to sealed criterion plus proof slot; otherwise discard as scope creep.
5. Shadow concurrence supports release confidence but cannot override gates, custody, replayability, audit, Done Means Ran, or EXECUTE-only boundary.
6. Shadow cannot run in quick mode unless same replayability issue recurs twice.

### Comparison: Hybrid default vs Shadow Executor

This is the compare turn in the 2-1-1-1 cadence. Scores measure release usefulness for EXECUTE-only audit, not abstract elegance.

| Criterion | Weight | Hybrid default | Shadow Executor | Notes |
| --- | ---: | ---: | ---: | --- |
| Mechanical proof discipline | 25 | 24 | 22 | Hybrid keeps blocker order explicit; Shadow adds reconstruction pressure but not new mechanical proof. |
| No-disturbance autonomy | 15 | 14 | 14 | Both use sealed phase-0 envelope and reject mid-process user asks. |
| Replayability | 15 | 13 | 15 | Shadow is strongest at cognitive replay and executor-independence. |
| Anti-gaming strength | 15 | 13 | 12 | Hybrid has multiple hard gates; Shadow helps against narrative gaming but can itself overreach. |
| Cognitive load | 10 | 8 | 5 | Shadow adds another actor and another mismatch interpretation layer. |
| Trigger precision | 10 | 8 | 7 | Hybrid routes clearer by fixed blockers; Shadow best when proof feels narratively over-dependent. |
| EXECUTE-only boundary safety | 10 | 9 | 7 | Shadow more likely to invent extra required proof unless tightly constrained. |
| **Total** | **100** | **89** | **82** | Hybrid stays default; Shadow stays triggered audit. |

Comparison verdict:

- Hybrid default wins release-level workflow because lower ceremony and clearer blocker order matter more on most EXECUTE runs.
- Shadow Executor wins when proof packet is mechanically present but still feels executor-dependent, especially in deep mode or replayability disputes.
- Shadow should remain a targeted reconstruction audit, not default ceremony for every run.

Integration rule:

```text
if replayability_contested_after_mechanical_pass or reviewer_flags_narrative_dependence or deep_mode_high_risk:
  run Shadow Executor
  map each objection to criterion plus proof slot
  convert valid mismatch to escrow gap, replayability gap, or blocker
else:
  use Hybrid default without shadow pass
```

### Final decision: Hybrid default vs Shadow Executor

This is the decision turn in the 2-1-1-1 cadence. Weighted comparison keeps Hybrid as EXECUTE release spine and keeps Shadow Executor as triggered reconstruction audit.

| Option | Pros | Cons | Weighted result | Decision |
| --- | --- | --- | ---: | --- |
| Hybrid escrow plus triggered LD plus breakers | clear blocker order, lower ceremony, better ergonomics, stronger default scope control, easier broad adoption | weaker than Shadow at catching narrative dependence unless trigger fires | 89 | stay default |
| Shadow Executor | best cognitive replay test, strong against executor storytelling, useful when proof packet feels reconstructable only by author | higher cost, overlap risk, more mismatch interpretation, easier scope creep if unconstrained | 82 | keep triggered |

Decision:

1. Stay with Hybrid escrow plus triggered LD plus breakers as release-level EXECUTE companion.
2. Keep Shadow Executor as triggered reconstruction audit for contested replayability and narrative-heavy proof.
3. Trigger Shadow only when mechanical proof is present yet confidence still depends on executor narration, reviewer objection, LD dispute, Trial Court uncertainty, or deep-mode high risk.
4. Convert valid Shadow mismatches into escrow gaps, replayability gaps, or reviewer blockers; discard anything outside sealed criterion plus proof slot.
5. Shadow concurrence raises confidence but never counts as substitute for acceptance gates, custody, replayability, audit, Done Means Ran, or cadence exit gate.
6. If Shadow conflicts with trigger arbitration, trigger arbitration wins.

Net effect: Hybrid stays main engine. Shadow stays independent reconstruction witness, not mandatory ceremony on every EXECUTE run.

### Proof packet handoff contract

This is improvement turn 1 in the next 2-1-1-1 cadence. The Hybrid default now requires every EXECUTE proof packet to be handoff-ready: another agent must be able to replay the release case from sealed inputs without asking the user or trusting executor narration.

| Handoff field | Required content | Reject when |
| --- | --- | --- |
| sealed input reference | phase-0 envelope id, artifact branch, acceptance source, mode, risk limits | field points to upstream rewrite or asks for new intent |
| criterion map | each acceptance criterion mapped to RED, GREEN, drift, and completion slots | criterion has no proof slot or uses summary-only evidence |
| command map | exact verification command, working directory, expected signal, and latest result for each mechanical proof | command missing cwd, expected signal, or fresh result |
| evidence map | artifact path, quote, ledger row, reviewer note, or LD ballot supporting non-code proof | evidence cannot be located from packet alone |
| blocker map | open escrow gaps, breaker trips, reviewer blockers, Shadow mismatches, Trial Court objections | blocker is described without owner, proof slot, or release effect |
| replay note | shortest path for a new agent to rerun or inspect the release case | note depends on author memory or chat-only context |

Handoff readiness is not new acceptance evidence. It is a replayability wrapper around existing EXECUTE proof.

Procedure:

```text
after proof packet assembly:
  enumerate sealed criteria
  attach proof slots and exact evidence handles
  attach commands with cwd, expected signal, and latest result
  attach blockers with release effect
  run handoff self-check as a cold reader
  if any field requires executor memory or a new user ask:
    block EXECUTE as replayability failure
  else:
    mark proof packet handoff-ready
```

Trigger interaction:

1. If handoff check fails because evidence is missing, open Evidence Escrow gap.
2. If handoff check fails because command cannot be replayed, open Proof replayability gap.
3. If handoff check fails because rationale is narrative-dependent, trigger Shadow Executor in standard or deep mode.
4. If handoff check fails because criteria changed, route to upstream phase and stop EXECUTE.
5. If handoff check passes, do not run extra debate solely for ceremony.

Cadence ledger update: `cadence_step=improve_1`, `subject=Hybrid proof handoff`, `proof_delta=proof packet handoff contract`, `verification=schema plus section-order check`.

### Handoff adversary gate

This is improvement turn 2 in the 2-1-1-1 cadence. The proof packet handoff contract becomes harder to game by adding a cold-reader adversary gate inside EXECUTE. The adversary does not propose new work. It tries to break the release case using only sealed inputs and packet evidence.

| Probe | Question | Pass condition | Failure route |
| --- | --- | --- | --- |
| missing-slot probe | Which criterion lacks RED, GREEN, drift, or completion proof? | every sealed criterion has all required slots or explicit branch-specific equivalent | Evidence Escrow gap |
| command-freshness probe | Which mechanical claim depends on stale or partial command output? | every mechanical claim cites fresh command, cwd, expected signal, and result | Proof replayability gap |
| narration-removal probe | What claim fails if executor explanation is deleted? | packet evidence alone supports release case | Shadow Executor trigger |
| scope-boundary probe | Which proof changes criteria, upstream artifacts, or non-EXECUTE phase behavior? | no proof mutates acceptance source or prior phases | upstream route and EXECUTE stop |
| blocker-hiding probe | Which known objection is softened, unnamed, or missing release effect? | every blocker has owner, proof slot, severity, and release consequence | EXECUTE reviewer blocker |
| ceremony probe | Which audit action adds confidence theater but no release signal? | optional action has criterion, trigger, expected signal, and residual risk | drop optional action |

The gate must be run after packet assembly and before final release decision in standard and deep modes. In quick mode it runs only when a proof packet is handoff-ready but one acceptance result has already failed twice.

Adversary output format:

```text
Probe: <probe name>
Criterion: <sealed criterion id or none>
Evidence handle: <command, artifact path, quote, ledger row, reviewer note, or ballot>
Break attempt: <specific way release case could fail>
Verdict: pass | gap | blocker | scope-stop | drop-ceremony
Route: <escrow | replayability | shadow | reviewer | upstream | none>
```

Decision precedence:

1. `scope-stop` beats all release decisions.
2. `blocker` beats optional debate and Auction routing.
3. `gap` must be closed before final decision.
4. `drop-ceremony` removes optional work but does not block release.
5. `pass` adds no new evidence; it only clears the handoff adversary gate.

Cadence ledger update: `cadence_step=improve_2`, `subject=Hybrid proof handoff`, `proof_delta=handoff adversary gate`, `verification=schema plus section-order check`.

### Rival variation: Acceptance Ledger Compiler

This is the different-variation turn in the 2-1-1-1 cadence. Instead of treating proof packets as assembled narrative plus checks, EXECUTE compiles sealed acceptance criteria into a ledger of proof obligations before work begins. The compiler produces a static obligation table, then the executor fills evidence cells. It resembles TDD RED inventory and spec-review completeness checks, but stays EXECUTE-only.

| Compiler stage | Action | Output | Boundary |
| --- | --- | --- | --- |
| criterion parse | read sealed phase-0 envelope and acceptance source | immutable criterion rows | no new user questions |
| obligation expansion | expand each criterion into RED, GREEN, drift, completion, custody, replayability, and blocker cells | proof obligation matrix | no upstream edits |
| branch typing | mark row as code/system, research_report, or design_artifact | branch-specific proof language | no branch conversion mid-run |
| evidence fill | executor attaches command output, quote, artifact handle, reviewer note, ballot, or blocker | ledger cells with handles | no summary-only evidence |
| compile check | verify every required cell is filled or explicitly waived by mode rule | pass, gap, blocker, or scope-stop | mode cannot waive mechanical gates |
| release emit | generate proof packet from ledger, not from prose | handoff-ready packet | narration cannot add missing proof |

Obligation row format:

```text
Criterion: <sealed criterion id>
Branch: code/system | research_report | design_artifact
RED obligation: <required negative proof>
GREEN obligation: <required positive proof>
Drift obligation: <required scope proof>
Completion obligation: <required final proof>
Custody obligation: <required evidence handle>
Replay obligation: <required rerun or inspection path>
Blocker obligation: <known objection or none>
Status: open | filled | waived-by-mode | blocked | scope-stop
```

Why it differs from Hybrid:

1. Hybrid starts with execution proof packet and adds gates around it.
2. Acceptance Ledger Compiler starts with acceptance criteria and generates required proof cells before evidence can be claimed.
3. Hybrid is easier to run by humans; Compiler is harder to game because missing proof is visible as an unfilled cell.
4. Hybrid routes triggers dynamically; Compiler makes most proof debt static and countable.
5. Compiler risks over-formalizing quick mode and turning simple EXECUTE work into spreadsheet ceremony.

Release rule:

```text
compile sealed criteria into obligation rows
fill evidence cells during EXECUTE only
if any required cell is open:
  block release as proof debt
if any cell requires upstream change:
  stop EXECUTE and route upstream
if all required cells are filled:
  emit proof packet from ledger
```

Cadence ledger update: `cadence_step=variation`, `subject=Acceptance Ledger Compiler`, `proof_delta=static proof obligation compiler`, `verification=schema plus section-order check`.

### LD debate: Hybrid default vs Acceptance Ledger Compiler

This is the debate turn in the 2-1-1-1 cadence. The question is whether EXECUTE should keep Hybrid escrow plus triggered LD plus breakers as the release spine, or replace it with Acceptance Ledger Compiler as the default proof engine.

**Resolution:** EXECUTE should replace Hybrid default with Acceptance Ledger Compiler.

**Affirmative Builder:**

Acceptance Ledger Compiler is closer to TDD discipline. It writes the proof obligations before claiming proof, so missing RED, GREEN, drift, completion, custody, replayability, or blocker cells stay visible. It also strengthens spec-review completeness: every sealed criterion becomes a row, every row has required evidence, and release cannot depend on prose polish. For EXECUTE, this makes proof debt countable and prevents late-stage narration from hiding missing acceptance evidence.

**Negative Critic:**

Hybrid should stay default because EXECUTE needs release judgment, not only proof accounting. The Compiler improves completeness but adds front-loaded ceremony and may overfit simple quick-mode work. Hybrid already has escrow, replayability, custody, reviewer, Shadow, Trial Court, Auction, cadence, and adversary gates. Those gates can absorb the Compiler as a packet-generation aid without replacing trigger arbitration. Replacing Hybrid risks making ledger fill status look like release readiness even when reviewer or adversarial context says otherwise.

**Cross-examination:**

| Challenge | Answer | Weight |
| --- | --- | --- |
| Does Compiler improve RED discipline? | Yes. It predeclares negative proof per criterion before evidence claims. | high |
| Does Compiler preserve phase-0-only asks? | Yes if rows derive only from sealed envelope and acceptance source. | high |
| Does Compiler reduce narrative gaming? | Yes. Missing cells are harder to hide than missing prose. | high |
| Does Compiler handle dynamic blockers better than Hybrid? | No. Hybrid trigger arbitration is better for reviewer, Shadow, Trial Court, and breaker conflicts. | high |
| Does Compiler fit quick mode? | Weakly. It risks ceremony unless compacted to mandatory rows only. | medium |
| Can Hybrid use Compiler without replacement? | Yes. Compiler can generate proof packet skeleton, then Hybrid gates decide release. | high |

**Judge:**

Negative wins against full replacement. Affirmative proves the Compiler is valuable, but not that it should become the release spine. Static proof obligations strengthen proof assembly; they do not replace trigger arbitration, release blockers, LD dispute handling, Shadow reconstruction, or cadence exit. Best integration is Compiler as early proof-obligation generator inside Hybrid.

Decision for next compare turn:

1. Hybrid remains candidate default for release spine.
2. Acceptance Ledger Compiler becomes strongest candidate for proof packet generation.
3. Compiler rows must derive only from sealed phase-0 criteria and branch proof language.
4. Compiler pass cannot override failed custody, replayability, reviewer, Shadow, Trial Court, Done Means Ran, cadence, or trigger arbitration gates.
5. Quick mode may use compact Compiler rows only for mandatory proof cells.
6. If Compiler and Trigger arbitration conflict, Trigger arbitration wins until compare/decide says otherwise.

Cadence ledger update: `cadence_step=debate`, `subject=Acceptance Ledger Compiler`, `proof_delta=LD debate against Hybrid default`, `verification=schema plus section-order check`.

### Comparison: Hybrid default vs Acceptance Ledger Compiler

This is the compare turn in the 2-1-1-1 cadence. The comparison separates release-spine responsibility from proof-packet generation so the score does not hide the strongest use of each model.

| Criterion | Weight | Hybrid default | Acceptance Ledger Compiler | Notes |
| --- | ---: | ---: | ---: | --- |
| Release blocker handling | 18 | 17 | 12 | Hybrid handles reviewer, Shadow, Trial Court, breaker, and arbitration conflicts better. |
| Proof completeness | 18 | 15 | 18 | Compiler makes missing RED, GREEN, drift, completion, custody, and replay cells explicit. |
| TDD/spec-review discipline | 15 | 13 | 15 | Compiler predeclares obligations before evidence claims. |
| No-disturbance autonomy | 12 | 11 | 11 | Both derive from sealed phase-0 inputs and reject mid-process asks. |
| Replayability | 12 | 10 | 12 | Compiler emits ledger-backed packet; Hybrid relies on handoff and adversary gates. |
| Dynamic trigger routing | 10 | 9 | 6 | Hybrid trigger arbitration is stronger for live EXECUTE blockers. |
| Quick-mode ergonomics | 8 | 7 | 4 | Compiler risks ceremony unless compacted. |
| EXECUTE-only boundary safety | 7 | 6 | 6 | Both can stay bounded; Compiler must reject upstream row changes. |
| **Total** | **100** | **88** | **84** | Hybrid remains stronger release spine; Compiler is better proof-obligation generator. |

Role-specific result:

| Role | Better option | Reason |
| --- | --- | --- |
| release spine | Hybrid default | stronger arbitration, lower ceremony, better blocker routing |
| proof packet skeleton | Acceptance Ledger Compiler | strongest static completeness and RED-first discipline |
| quick mode | Hybrid default with compact Compiler rows only after failure | avoids spreadsheet overhead for simple EXECUTE |
| standard mode | Hybrid plus Compiler-generated obligation matrix | balances completeness with triggered gates |
| deep mode | Hybrid plus full Compiler matrix, adversary gate, and optional Shadow | maximum replayability without replacing arbitration |

Integration rule:

```text
if mode == quick and no repeated proof failure:
  use Hybrid proof packet with mandatory slots only
else:
  compile sealed criteria into Acceptance Ledger rows
  fill rows during EXECUTE
  emit proof packet from filled rows
  run Hybrid gates and trigger arbitration as release spine

if Compiler row status conflicts with Trigger arbitration:
  Trigger arbitration decides release route
```

Cadence ledger update: `cadence_step=compare`, `subject=Acceptance Ledger Compiler`, `proof_delta=weighted comparison`, `verification=schema plus section-order check`.

### Final decision: Hybrid default vs Acceptance Ledger Compiler

This is the decision turn in the 2-1-1-1 cadence. Keep the Hybrid default as the EXECUTE release spine and adopt Acceptance Ledger Compiler as the proof-obligation generator for standard and deep companion audit. The decision is not a compromise that weakens either pattern: Hybrid owns release routing; Compiler owns proof inventory.

| Decision area | Chosen rule | Reason |
| --- | --- | --- |
| default release spine | Hybrid default | Higher weighted score: 88 vs 84, with stronger blocker handling and dynamic trigger routing. |
| proof packet skeleton | Acceptance Ledger Compiler | Stronger static proof completeness, RED-first discipline, custody cells, and replay cells. |
| quick mode | Hybrid proof packet by default; compact Compiler rows only after repeated proof failure | Prevents spreadsheet ceremony when acceptance is deterministic and local. |
| standard mode | Hybrid plus Compiler-generated obligation matrix | Balances continuous audit with explicit proof debt tracking. |
| deep mode | Hybrid plus full Compiler matrix, handoff adversary gate, and optional Shadow Executor | Maximizes replayability for risky EXECUTE work without replacing arbitration. |
| conflict handling | Trigger arbitration wins over Compiler row status | Live release blockers are more important than static row completeness. |

Final architecture:

```text
phase 0 seals execution envelope
if mode == quick and no repeated proof failure:
  run Hybrid proof packet with mandatory slots
else:
  compile sealed criteria into Acceptance Ledger rows
  fill evidence cells during EXECUTE
  emit proof packet from filled rows

run Hybrid gates as release spine:
  Evidence Escrow
  Proof Circuit Breakers
  Proof-command contract
  Chain-of-custody gate
  Replayability gate
  EXECUTE reviewer gate
  Trigger arbitration
  Done Means Ran
  Cadence exit gate

if any Compiler row conflicts with Trigger arbitration:
  follow Trigger arbitration route
if any row requires upstream artifact change:
  stop EXECUTE and route upstream
if all mandatory gates pass:
  mark EXECUTE proof packet release-ready
```

Non-negotiables:

1. Compiler rows derive only from sealed phase-0 criteria and branch proof language.
2. Compiler pass cannot override custody, replayability, reviewer, Shadow, Trial Court, Done Means Ran, cadence, or trigger arbitration gates.
3. Hybrid gates cannot invent missing acceptance criteria or ask the user mid-process.
4. Both patterns remain EXECUTE-only; upstream defects route out instead of being repaired inside EXECUTE.
5. Narrative confidence never fills an empty proof cell.

Next cadence restarts with two improvement turns. Strongest next improvement target: make Compiler row severity and Trigger arbitration share one blocker vocabulary so conflicts route mechanically instead of by judgment.

### Blocker vocabulary bridge

This is improvement turn 1 in the new 2-1-1-1 cadence. The Acceptance Ledger Compiler and Trigger arbitration matrix now share one blocker vocabulary so EXECUTE routes proof debt mechanically instead of by local judgment.

Compiler rows may name only these blocker classes:

| Blocker class | Compiler row signal | Trigger arbitration route | Release effect |
| --- | --- | --- | --- |
| missing-input | sealed envelope lacks artifact branch, acceptance source, risk limit, mode, or verification gate | phase-0 input missing | stop before artifact change |
| failed-gate | mechanical proof command fails or expected signal absent | mechanical gate fails | repair EXECUTE artifact and rerun same gate |
| scope-drift | row needs changed criteria, upstream artifact edits, or non-EXECUTE behavior | scope drift | stop and route upstream |
| custody-gap | RED, GREEN, drift, or completion proof order missing or unverifiable | custody gap | restore ordered evidence or block |
| replay-gap | command, cwd, expected signal, artifact handle, or inspection path missing | replayability gap | fill replay path or block |
| escrow-gap | required proof cell open without accepted branch-specific equivalent | escrow slot open | fill proof slot or block |
| reviewer-blocker | reviewer objection names decisive acceptance or safety failure | reviewer blocking issue | repair decisive issue or escalate by trigger |
| self-confirming-proof | proof depends on executor narration, mocks, or non-independent inspection | self-confirming proof | run Black-box Lab probe |
| red-integrity-dispute | negative proof was written after repair, tests wrong thing, or branch equivalent is invalid | RED integrity dispute | rebuild RED proof or run Failure Injection Board |
| repeated-repair | same criterion fails after repeated repair attempts | repeated repair | trip repair breaker and route by failure type |
| warrant-conflict | evidence exists but interpretation or tradeoff remains contested | strategy or warrant conflict | run LD audit |
| contested-release | all mechanical proof exists but release remains blocked by conflicting high-risk verdicts | contested release after complete proof | Trial Court only in deep mode |

Severity values are fixed:

| Severity | Meaning | Allowed release effect |
| --- | --- | --- |
| info | explains non-blocking residual risk | release may proceed if all gates pass |
| warn | requires note or follow-up but not proof repair | release may proceed only with residual-risk note |
| block | missing or failed mandatory proof | release stops until repaired |
| scope-stop | requested evidence would mutate upstream or non-EXECUTE scope | EXECUTE stops and routes upstream |

Compiler row status maps to blocker vocabulary:

```text
if status == open:
  classify as escrow-gap unless exact missing cell proves custody-gap or replay-gap
if status == blocked:
  assign one blocker class and severity block
if status == scope-stop:
  assign scope-drift and severity scope-stop
if status == waived-by-mode:
  require mode rule plus info or warn residual-risk note
if status == filled:
  no blocker class unless Trigger arbitration independently fires
```

Routing rule:

```text
for each Compiler row:
  assign blocker class from fixed vocabulary
  assign severity
  map to Trigger arbitration route
  record release effect

if multiple rows fire:
  use Trigger arbitration precedence
if class is unknown:
  block as vocabulary-gap until reclassified or dropped as ceremony
if severity is scope-stop:
  stop EXECUTE before repair
```

This bridge prevents three failure modes:

1. Compiler says row is blocked but Hybrid treats it as optional ceremony.
2. Hybrid trigger fires but Compiler hides issue as open proof debt.
3. Executor invents softer wording to avoid release stop.

Next improvement turn should add a compact row template that includes `blocker_class`, `severity`, `route`, and `release_effect` without making quick mode heavy.

### Compact Compiler row template

This is improvement turn 2 in the 2-1-1-1 cadence. It makes Acceptance Ledger rows runnable without turning quick mode into paperwork. Every row carries enough routing data for Trigger arbitration, but row density changes by mode.

Compact row, used by quick mode only after repeated proof failure:

```text
Criterion: <sealed criterion id>
Branch: code/system | research_report | design_artifact
Required proof: <RED/GREEN/drift/completion slot that failed or is mandatory>
Evidence handle: <command, artifact path, quote, ledger row, reviewer note, or none>
blocker_class: <fixed blocker class or none>
severity: info | warn | block | scope-stop
route: <Trigger arbitration route or none>
release_effect: proceed | proceed-with-note | repair-and-rerun | block | route-upstream
```

Standard row, used for normal EXECUTE:

```text
Criterion: <sealed criterion id>
Branch: code/system | research_report | design_artifact
RED obligation: <negative proof or branch equivalent>
GREEN obligation: <positive proof or branch equivalent>
Drift obligation: <scope proof>
Completion obligation: <final acceptance proof>
Custody obligation: <ordered evidence requirement>
Replay obligation: <rerun or inspection path>
Blocker obligation: <known objection or none>
Evidence handle: <command, artifact path, quote, ledger row, reviewer note, ballot, or none>
blocker_class: <fixed blocker class or none>
severity: info | warn | block | scope-stop
route: <Trigger arbitration route or none>
release_effect: proceed | proceed-with-note | repair-and-rerun | block | route-upstream
Status: open | filled | waived-by-mode | blocked | scope-stop
```

Deep row adds adversarial fields only when trigger fires:

```text
Adversary probe: <Handoff adversary, Black-box Lab, Failure Injection Board, LD, Shadow, Trial Court, or none>
Break attempt: <specific release failure tested>
Counterevidence: <handle or none>
Judge verdict: pass | gap | blocker | scope-stop | drop-ceremony
Residual risk: <info/warn note or none>
```

Mode density rule:

```text
if mode == quick and no repeated proof failure:
  do not compile rows; use mandatory proof packet slots
else if mode == quick and repeated proof failure:
  create compact row only for failed criterion
else if mode == standard:
  create standard rows for all sealed criteria
else if mode == deep:
  create standard rows for all sealed criteria
  add deep fields only for triggered adversarial probes
```

Validation rule:

```text
if blocker_class != none:
  severity, route, and release_effect are required
if severity == block:
  release_effect must be repair-and-rerun or block
if severity == scope-stop:
  route must be scope drift or phase-0 input missing
  release_effect must be route-upstream or block
if release_effect == proceed:
  blocker_class must be none or severity must be info
if route conflicts with Trigger arbitration precedence:
  Trigger arbitration wins
```

This template keeps Superpowers-style discipline: proof cells are explicit, failure states are named before repair, and release claims remain mechanical. It also keeps FORGER autonomy: no row may ask the user after phase 0, and no row may rewrite upstream criteria during EXECUTE.

Next cadence turn: different variation. Good candidate: Proof Type Inference Engine, where EXECUTE infers branch-specific RED/GREEN/drift/completion obligations from sealed criteria before Compiler rows exist.

### Rival variation: Proof Type Inference Engine

This is the different-variation turn in the 2-1-1-1 cadence. Instead of first compiling acceptance criteria into ledger rows, EXECUTE first infers the proof type each sealed criterion needs. The engine acts like a spec-review parser: it classifies what kind of proof would satisfy the criterion before any executor claims success.

Core bet: many EXECUTE failures come from using the wrong proof shape, not from missing proof cells. A research claim gets treated like code test output, a design constraint gets treated like narrative rationale, or a code criterion gets accepted from a screenshot. Proof Type Inference prevents this by assigning proof shape before evidence fill.

Inference table:

| Criterion signal | Inferred proof type | Required RED equivalent | Required GREEN equivalent | Drift check |
| --- | --- | --- | --- | --- |
| contains runnable command, test, build, schema, lint, or CLI output | mechanical-command | failing command, failing repro, or pre-fix failing acceptance gate | fresh passing command with cwd and expected signal | diff limited to criterion |
| contains claim, citation, source, quote, evidence, or report language | evidence-ledger | unsupported claim, failed quote check, contradiction, or source gap | audited quote, source ledger row, or claim ledger support | no new unsourced claims |
| contains architecture, decision, alternative, constraint, tradeoff, or rationale | warrant-comparison | rejected alternative, violated constraint, or missing warrant | selected warrant tied to sealed constraint | no implementation success implied |
| contains user flow, expected behavior, scenario, or black-box outcome | acceptance-probe | failing probe or counterexample | passing sealed-envelope probe | no criteria rewrite |
| contains reviewer objection, risk, safety, or release condition | adversarial-review | named objection or risk hypothesis | reviewer resolution, LD ballot, Trial Court verdict, or risk note | no scope expansion |
| contains handoff, replay, auditability, trace, or reproduction | replay-packet | missing handle, stale command, or cold-reader failure | replayable packet with command/path/signal/handle | no chat-only evidence |

Engine output:

```text
Criterion: <sealed criterion id>
Raw criterion: <verbatim acceptance text>
Inferred proof type: mechanical-command | evidence-ledger | warrant-comparison | acceptance-probe | adversarial-review | replay-packet
Confidence: high | medium | low
Required negative proof: <RED or branch equivalent>
Required positive proof: <GREEN or branch equivalent>
Required drift proof: <scope check>
Required completion proof: <release signal>
Escalation if low confidence: EXECUTE reviewer gate, not user ask
```

Execution rule:

```text
for each sealed criterion:
  infer proof type from criterion text and artifact branch
  assign required negative, positive, drift, and completion proof
  if confidence == low:
    route to EXECUTE reviewer gate with sealed evidence only
  if proof type conflicts with artifact branch:
    prefer explicit sealed acceptance wording over branch default
  pass inferred obligations to Compiler rows or proof packet slots
```

No-disturbance rule:

```text
if inference is ambiguous:
  do not ask user mid-process
  choose strictest proof type that stays EXECUTE-only
  record confidence medium or low
  route ambiguity to reviewer, LD, or blocker vocabulary
```

Strengths:

1. Prevents wrong-proof acceptance before ledger rows exist.
2. Extends TDD RED/GREEN discipline to research and design by proof type, not artifact label alone.
3. Gives plan-review style completeness check before execution claims begin.
4. Reduces ceremony in quick mode because only ambiguous criteria need inference detail.

Weaknesses:

1. Inference can misclassify mixed criteria unless reviewer gate catches it.
2. It does not itself store evidence; Compiler or proof packet still needed.
3. It adds another pre-execution pass that may overlap with Branch proof language.
4. It may over-tighten criteria if strictest-proof fallback fires too often.

Best form if adopted: use Proof Type Inference as a pre-Compiler classifier, not as a release spine. It should feed Acceptance Ledger rows with proof types, then let Hybrid gates route blockers.

Next cadence turn: debate Hybrid+Compiler default vs Proof Type Inference Engine.

### LD debate: Hybrid+Compiler default vs Proof Type Inference Engine

This is the debate turn in the 2-1-1-1 cadence. Question: should Proof Type Inference become the new default EXECUTE release spine, or should it stay a pre-Compiler classifier inside the Hybrid+Compiler default?

#### Affirmative: adopt Proof Type Inference as default spine

Proof Type Inference attacks the earliest failure point: wrong proof shape. Hybrid+Compiler can still compile beautiful rows that ask for the wrong evidence. If a design criterion gets a mechanical-command row, or a research claim gets a warrant-comparison row, every later gate becomes polished error. TDD discipline starts with correct RED shape; spec review starts with correct requirement type. Therefore EXECUTE should infer proof type before any release spine logic.

Affirmative claims:

1. It is more Superpowers-like: first decide what failing proof should look like, then fill evidence.
2. It is less noisy than Compiler for quick mode because obvious proof types can skip full rows.
3. It prevents branch-label overfitting: a design_artifact can still contain mechanical commands, and a code/system artifact can still require warrant proof.
4. It improves reviewer usefulness by giving reviewers a concrete classification to attack.
5. It stays EXECUTE-only because ambiguous classification routes to reviewer/LD/blocker vocabulary, not user asks or upstream rewrites.

Affirmative proposed spine:

```text
phase 0 seals criteria
infer proof type for each criterion
if inference confidence low:
  route to EXECUTE reviewer gate
compile rows only after proof type is fixed
run evidence fill and release gates
```

#### Negative: keep Hybrid+Compiler as default spine

Proof Type Inference is valuable, but it is not a release spine. It classifies obligations; it does not handle blockers, custody order, replay failure, evidence escrow, repeated repair, reviewer conflict, Shadow reconstruction, Trial Court appeal, or Done Means Ran. Making inference the spine risks optimizing for elegant classification while under-specifying release control.

Negative claims:

1. Release failure is broader than wrong proof type; Hybrid already handles live blocker routing.
2. Compiler rows already store obligations, blocker class, severity, route, and release effect; inference should enrich those rows, not replace them.
3. Inference can be wrong; if it owns the spine, misclassification becomes systemic.
4. Trigger arbitration must remain the highest release authority because it sees actual failures, not only criterion text.
5. Quick mode gets worse if every criterion requires classification ceremony before obvious local proof.

Negative integration:

```text
phase 0 seals criteria
if mode != quick or criterion is mixed/ambiguous:
  infer proof type
feed proof type into Compiler row
run Hybrid gates and Trigger arbitration as release spine
```

#### Cross-examination

| Challenge | Answer |
| --- | --- |
| Affirmative asks: How does Hybrid know row asks for right proof? | Negative answers: add inference before Compiler rows, but do not promote classifier to release spine. |
| Negative asks: How does Inference handle failed replay or custody after proof fill? | Affirmative answers: it delegates to gates after classification, which admits it is not complete release spine. |
| Affirmative asks: Does Trigger arbitration operate too late after wrong proof cells exist? | Negative answers: inference can run as early pre-pass; arbitration still handles actual failure precedence. |
| Negative asks: What if inferred proof type conflicts with sealed acceptance wording? | Affirmative answers: prefer sealed wording and route low confidence to reviewer, but this still needs Hybrid blocker vocabulary. |
| Affirmative asks: Can quick mode avoid full Compiler ceremony with inference? | Negative answers: yes, but only as optional classifier for ambiguous quick criteria, not mandatory spine. |

#### Judge ballot

Negative wins against full replacement. Affirmative proves a real gap: Hybrid+Compiler needs proof-type classification before row filling, especially for mixed criteria. But Affirmative does not prove Inference can own release routing. It lacks blocker precedence, repeated repair handling, custody/replay enforcement, and final release authority.

Ruling:

1. Keep Hybrid+Compiler as default EXECUTE release spine.
2. Add Proof Type Inference as pre-Compiler classifier for standard and deep mode.
3. In quick mode, run inference only when criterion is mixed, ambiguous, or proof fails twice.
4. Inference output must populate Compiler row proof obligations and may set initial `blocker_class`, `severity`, `route`, and `release_effect`.
5. Trigger arbitration still wins all conflicts after evidence fill.
6. Low-confidence inference routes to EXECUTE reviewer gate or LD, never to mid-process user ask.

Next cadence turn: compare Hybrid+Compiler default vs Proof Type Inference Engine with weighted pros/cons.

### Comparison: Hybrid+Compiler default vs Proof Type Inference Engine

This is the compare turn in the 2-1-1-1 cadence. Compare the current Hybrid+Compiler default against Proof Type Inference as a possible replacement spine. Scores judge release-spine fitness for EXECUTE only, not general usefulness.

| Criterion | Weight | Hybrid+Compiler default | Proof Type Inference Engine | Winner |
| --- | ---: | ---: | ---: | --- |
| release blocker handling | 18 | 17 | 8 | Hybrid+Compiler |
| proof-type correctness | 16 | 11 | 15 | Inference |
| TDD/spec-review discipline | 14 | 12 | 14 | Inference |
| custody and replay coverage | 14 | 13 | 7 | Hybrid+Compiler |
| no-disturbance autonomy | 10 | 9 | 8 | Hybrid+Compiler |
| EXECUTE-only boundary safety | 10 | 9 | 8 | Hybrid+Compiler |
| quick-mode ergonomics | 8 | 7 | 6 | Hybrid+Compiler |
| integration complexity | 6 | 5 | 4 | Hybrid+Compiler |
| reviewer usefulness | 4 | 3 | 4 | Inference |
| **Total** | **100** | **86** | **74** | **Hybrid+Compiler as spine** |

Proof Type Inference wins the earliest-quality dimension: deciding what kind of RED/GREEN equivalent a criterion needs before evidence fill. That matters because wrong proof shape can make later proof cells look complete while proving the wrong thing.

Hybrid+Compiler wins release control. It already owns blocker vocabulary, severity, route, release effect, custody order, replayability, Evidence Escrow, reviewer gates, Trigger arbitration, Done Means Ran, and cadence exit. Inference can enrich those mechanisms, but cannot replace them without rebuilding most of them.

| Practical decision | Rule |
| --- | --- |
| release spine | keep Hybrid+Compiler default |
| pre-execution classifier | adopt Proof Type Inference before Compiler rows in standard and deep mode |
| quick mode | run inference only for mixed criteria, ambiguous criteria, or proof failure after two attempts |
| low-confidence inference | route to EXECUTE reviewer gate or LD; do not ask user mid-process |
| conflict after evidence fill | Trigger arbitration wins |
| upstream implication | stop EXECUTE and route upstream; do not repair upstream artifacts inside EXECUTE |

Best architecture:

```text
phase 0 seals execution envelope
for each sealed criterion:
  if mode is standard or deep, or criterion is mixed/ambiguous, or proof failed twice:
    infer proof type
    set confidence and required RED/GREEN/drift/completion proof
    if confidence is low:
      route to EXECUTE reviewer gate or LD using sealed evidence only
  compile obligation row or proof packet slot
  fill evidence during EXECUTE

run Hybrid gates as release spine
if inferred proof type conflicts with live Trigger arbitration:
  Trigger arbitration wins
if evidence requires upstream mutation:
  stop EXECUTE and route upstream
```

Weighted result: do not replace the spine. Adopt Proof Type Inference as a pre-Compiler classifier that improves proof shape while Hybrid+Compiler remains the EXECUTE release authority.

### Final decision: Hybrid+Compiler default vs Proof Type Inference Engine

This is the decision turn in the 2-1-1-1 cadence. Keep Hybrid+Compiler as the EXECUTE release spine and adopt Proof Type Inference as an obligation classifier inside that spine. The decision preserves strict gates while fixing the wrong-proof-shape gap found in debate.

| Decision area | Chosen rule | Reason |
| --- | --- | --- |
| release spine | Hybrid+Compiler default | Higher weighted score as release authority: 86 vs 74. It handles blockers, custody, replay, reviewer gates, Trigger arbitration, Done Means Ran, and cadence exit. |
| proof-shape assignment | Proof Type Inference | It prevents row fill from accepting the wrong kind of evidence before execution claims begin. |
| quick mode | no mandatory inference unless criterion is mixed, ambiguous, or proof fails twice | Keeps deterministic local execution light while preserving repair path for unclear proof shape. |
| standard mode | infer proof type before compiling Acceptance Ledger rows | Gives every standard row explicit RED/GREEN/drift/completion obligation shape. |
| deep mode | infer proof type for every sealed criterion, then attach adversarial probes as triggered | Maximizes replayability and reviewer attack surface without replacing release routing. |
| low confidence | route to EXECUTE reviewer gate or LD using sealed evidence only | Maintains no-disturbance contract; no mid-process user ask. |
| conflict handling | Trigger arbitration wins after evidence fill | Live gate failures outrank inferred proof classifications. |
| upstream pressure | stop EXECUTE and route upstream | EXECUTE companion audits execution; it does not rewrite Contract, Find, Observe, Recombine, or Grill outputs. |

Final architecture:

```text
phase 0 seals execution envelope
derive branch proof language

for each sealed criterion:
  if mode == quick and criterion is clear and proof has not failed twice:
    use mandatory proof packet slots directly
  else:
    infer proof type
    assign confidence
    assign RED/GREEN/drift/completion obligations
    if confidence == low:
      route to EXECUTE reviewer gate or LD without user ask
    compile Acceptance Ledger row with inferred proof type

during EXECUTE:
  fill evidence cells in custody order
  map open cells to blocker vocabulary
  run Hybrid gates as release spine

if Trigger arbitration conflicts with inferred proof type or Compiler row:
  follow Trigger arbitration
if evidence requires upstream mutation:
  stop EXECUTE and route upstream
if all mandatory gates pass:
  emit release-ready EXECUTE proof packet
```

Non-negotiables after this decision:

1. Proof Type Inference classifies obligations; it never releases artifacts by itself.
2. Compiler rows store inferred proof type, confidence, proof obligations, blocker class, severity, route, release effect, and evidence handle when rows are active.
3. Hybrid gates remain mandatory release authority in every mode.
4. Low-confidence classification never asks the user mid-process; it routes to reviewer, LD, blocker vocabulary, or scope-stop.
5. EXECUTE-only boundary stays hard: upstream defects route out, not fixed inside EXECUTE.
6. Narrative confidence cannot replace RED, GREEN, drift, completion, custody, or replay proof.

Decision: stay with Hybrid+Compiler as the plan. Keep Proof Type Inference as a required pre-Compiler classifier in standard and deep mode, and as a triggered classifier in quick mode.

### Proof-shape integration map

This is improvement turn 1 in the new 2-1-1-1 cadence. After adopting Proof Type Inference as a classifier, EXECUTE needs a precise map from inferred proof type to Compiler row fields and Hybrid gates. Without this map, inference stays advisory instead of operational.

| Inferred proof type | Compiler row fields to fill | Mandatory Hybrid gate focus | Blocker default if missing |
| --- | --- | --- | --- |
| mechanical-command | RED obligation, GREEN obligation, Replay obligation, Evidence handle | Proof-command contract, Done Means Ran, Replayability gate | failed-gate or replay-gap |
| evidence-ledger | RED obligation, GREEN obligation, Drift obligation, Evidence handle | Evidence Escrow, chain-of-custody, claim/source audit | escrow-gap or custody-gap |
| warrant-comparison | RED obligation, GREEN obligation, Blocker obligation, Completion obligation | EXECUTE reviewer gate, LD if warrant contested | warrant-conflict |
| acceptance-probe | RED obligation, GREEN obligation, Completion obligation, Replay obligation | Black-box Acceptance Lab, Done Means Ran | self-confirming-proof or failed-gate |
| adversarial-review | Blocker obligation, Completion obligation, Evidence handle | reviewer gate, LD, Trial Court if deep and contested | reviewer-blocker or contested-release |
| replay-packet | Replay obligation, Custody obligation, Evidence handle | replayability gate, Handoff adversary gate, Shadow Executor if triggered | replay-gap or custody-gap |

Row materialization rule:

```text
for each inferred proof type:
  fill only row fields required by that proof type
  mark irrelevant fields as waived-by-mode only when mode rule allows it
  assign blocker_class from blocker vocabulary when a required field stays open
  assign severity from missing proof impact
  assign route from Trigger arbitration matrix
  assign release_effect from severity and route
```

Mode pressure rule:

| Mode | Inference detail | Row pressure | Release effect |
| --- | --- | --- | --- |
| quick | only mixed, ambiguous, or twice-failed criteria | compact row for failing criterion only | repair-and-rerun or proceed after mandatory proof packet |
| standard | every sealed criterion gets proof type and confidence | standard rows contain only relevant proof fields | release blocked by any mandatory open field |
| deep | every sealed criterion plus adversarial-probe fields when triggered | standard rows plus deep fields for contested or high-risk proof | release blocked until adversarial verdict passes or routes upstream |

Operational constraints:

1. Inference cannot create new acceptance criteria; it only classifies sealed criteria.
2. Inference cannot waive Hybrid gates; it only selects which gate gets primary focus.
3. A row field marked `waived-by-mode` must cite the mode rule, not executor judgment.
4. If proof type requires evidence unavailable inside EXECUTE, classify as `scope-drift` and stop.
5. If two proof types tie, choose the stricter type that stays EXECUTE-only and route confidence to reviewer/LD.
6. If a later gate disproves inferred type, update the row classification and rerun affected proof only; do not disturb completed unrelated rows.

This makes Proof Type Inference mechanical: it now determines row shape, primary gate focus, default blocker class, and release effect without asking the user mid-process.

### Low-confidence reviewer handoff

This is improvement turn 2 in the new 2-1-1-1 cadence. Proof Type Inference can route low-confidence classifications to reviewer or LD, but that route needs a sealed handoff packet so reviewer judgment stays mechanical and does not reopen user questioning.

Reviewer handoff packet:

```text
Criterion: <sealed criterion id>
Raw criterion: <verbatim sealed acceptance text>
Artifact branch: code/system | research_report | design_artifact
Candidate proof types: <ranked list with confidence>
Proposed strictest EXECUTE-only proof type: <type>
Why ambiguous: <mixed signal, missing signal, branch conflict, or gate conflict>
Allowed evidence sources: <sealed artifacts, current diff, commands, ledgers, reviewer notes>
Forbidden action: user ask | upstream rewrite | new criteria invention
Reviewer task: approve proof type | choose stricter type | classify scope-stop | trigger LD
Reviewer output: proof type, confidence, blocker_class, severity, route, release_effect
```

Reviewer decision table:

| Reviewer finding | Required output | Route | Release effect |
| --- | --- | --- | --- |
| candidate type is sufficient | approved proof type plus confidence | continue Compiler row fill | proceed if later gates pass |
| stricter type needed but EXECUTE-local | replacement proof type plus required obligations | update row and rerun affected proof | repair-and-rerun |
| criterion mixes independent proof types | split proof obligations inside same sealed criterion | compile sibling row obligations without new criteria | block until all siblings filled |
| ambiguity is interpretive, not mechanical | warrant-conflict | LD audit | block or proceed-with-note by LD result |
| required evidence needs upstream mutation | scope-drift | stop EXECUTE | route-upstream |
| proof depends on executor narration | self-confirming-proof | Black-box Acceptance Lab | block until independent probe passes |

LD escalation packet:

```text
Question: <single proof-type or warrant conflict>
Sealed criterion: <verbatim text>
Affirmative option: <proof type or route A>
Negative option: <proof type or route B>
Evidence allowed: <sealed evidence handles only>
Decision required: proof type | blocker route | scope-stop
No user question allowed: true
Upstream edit allowed: false
```

Handoff invariants:

1. Reviewer receives only sealed evidence and current EXECUTE artifact state.
2. Reviewer cannot invent criteria, soften proof obligations, or ask the user mid-process.
3. Reviewer may split obligations inside a sealed criterion, but may not split scope into new upstream work.
4. LD may resolve classification conflict, but Trigger arbitration still wins after evidence fill.
5. Scope-stop is success for boundary safety, not execution failure.
6. Handoff output must be written back into the Compiler row before any release claim.

This turns ambiguity into a bounded review task: low-confidence inference gets reviewer attack, not user disturbance or narrative executor judgment.

### Rival variation: Execution State Machine

This is the different-variation turn in the 2-1-1-1 cadence. Instead of treating EXECUTE audit as rows plus gates, model it as a finite state machine. Every criterion moves through named states; every transition requires proof. This makes disturbances, retries, blockers, and release claims impossible unless state transition rules allow them.

Core bet: EXECUTE failure often comes from hidden state drift. A criterion is half-repaired, reviewer-blocked, replay-stale, or scope-stopped, but the narrative still says progress. A state machine removes narrative state by forcing one visible state per criterion.

| State | Meaning | Allowed next states | Required proof to enter |
| --- | --- | --- | --- |
| sealed | criterion captured from phase 0 envelope | inferred, scope-stopped | sealed criterion id and branch |
| inferred | proof type and confidence assigned | row-compiled, reviewer-review, scope-stopped | inference packet or reviewer handoff |
| reviewer-review | low-confidence or contested proof type under review | inferred, ld-review, scope-stopped | reviewer decision packet |
| ld-review | warrant or proof-type conflict under LD | inferred, blocked, scope-stopped | LD ballot |
| row-compiled | Compiler row or proof packet slot created | red-proven, blocked, scope-stopped | row with obligations and blocker vocabulary |
| red-proven | negative proof or branch equivalent accepted | green-proven, red-rebuild, blocked | RED integrity evidence |
| red-rebuild | RED proof invalid or late | red-proven, blocked, scope-stopped | rebuilt RED proof |
| green-proven | positive proof accepted | drift-proven, blocked | fresh GREEN evidence |
| drift-proven | scope and artifact drift checked | replay-proven, scope-stopped, blocked | diff/scope or claim-set proof |
| replay-proven | cold rerun or inspection path exists | reviewer-cleared, blocked | command/path/signal/handle |
| reviewer-cleared | reviewer gate passes or non-blocking note recorded | release-ready, ld-review, blocked | reviewer verdict |
| blocked | mandatory proof missing or failed | red-rebuild, row-compiled, scope-stopped | blocker_class, severity, route, release_effect |
| scope-stopped | proof needs upstream mutation or missing phase-0 input | terminal | scope-stop route |
| release-ready | all mandatory gates passed | terminal | completion proof packet |

Transition law:

```text
for each sealed criterion:
  hold exactly one state
  allow transition only if required proof exists
  reject transition if it asks user mid-process
  reject transition if it mutates upstream phase output
  write transition proof to Compiler row or proof packet
  if Trigger arbitration fires:
    override next state with blocked, scope-stopped, ld-review, or reviewer-review
```

Global release rule:

```text
release-ready only if every criterion is release-ready
scope-stopped terminal means EXECUTE boundary preserved, not failure to hide
blocked terminal is forbidden unless user explicitly stops the run
narrative progress cannot advance state
```

Strengths:

1. Makes every criterion status visible and singular.
2. Prevents skipped RED, drift, replay, and reviewer gates by illegal transition.
3. Turns repeated repair into explicit blocked or red-rebuild state instead of vague retry loops.
4. Works well with no-disturbance contract because user asks are not legal transitions after phase 0.
5. Makes handoff easy: cold reader can resume from state plus transition proof.

Weaknesses:

1. More procedural than Compiler rows; may feel heavy in quick mode.
2. Does not choose proof type as well as Proof Type Inference unless integrated.
3. Does not score release risk; it only controls legal movement.
4. Requires careful state names or agents may cargo-cult state changes without proof.

Best form if adopted: use Execution State Machine as a state overlay for Compiler rows in standard/deep mode, not as replacement for Hybrid release gates. Hybrid still owns arbitration; state machine owns legal criterion progression.

### LD debate: Hybrid+Compiler+Inference default vs Execution State Machine

This is the debate turn in the 2-1-1-1 cadence. Question: should Execution State Machine become the EXECUTE release spine, or stay a state overlay under the current Hybrid+Compiler+Inference default?

#### Affirmative: adopt Execution State Machine as release spine

Execution State Machine should become the spine because it makes illegal progress impossible. Hybrid+Compiler+Inference has strong parts, but it still lets agents narrate across rows and gates. State machine forces every criterion into one visible state and requires proof for every transition. This is closer to TDD discipline: RED cannot become GREEN unless transition proof exists; GREEN cannot become done without drift, replay, and reviewer states.

Affirmative claims:

1. It gives the clearest cold-reader handoff: criterion state plus transition proof.
2. It prevents skipped gates by construction, not by reviewer memory.
3. It makes repeated repair, red rebuild, blocked, and scope-stopped explicit terminal or repair states.
4. It enforces no-disturbance contract because user asks are illegal transitions after phase 0.
5. It treats scope-stop as valid terminal boundary preservation, not a vague failure.

Affirmative spine:

```text
phase 0 seals criteria
create state record per criterion
transition only with proof
block illegal transition
release only when all criteria enter release-ready
```

#### Negative: keep Hybrid+Compiler+Inference as default spine

Execution State Machine is useful, but it is not a complete release spine. It controls movement; it does not decide proof type, score evidence quality, resolve warrant conflicts, map blockers to release effects, or arbitrate live gate conflicts. Hybrid+Compiler+Inference already has release authority, proof inventory, proof-shape classification, blocker vocabulary, and trigger precedence. State machine should make progression explicit inside that architecture, not replace it.

Negative claims:

1. State is not proof quality. A criterion can be in green-proven with weak evidence unless Hybrid gates inspect evidence.
2. State machines need proof-type input; Proof Type Inference already solves that earlier problem.
3. Trigger arbitration must remain superior because real failures can override planned state transitions.
4. Quick mode gets too procedural if every clear criterion becomes a full state record.
5. Compiler rows already store obligations and blockers; adding state as a field is cheaper than making state the whole workflow.

Negative integration:

```text
phase 0 seals criteria
infer proof type when required
compile rows or proof packet slots
attach state only for standard/deep or troubled quick criteria
run Hybrid gates and Trigger arbitration as release spine
```

#### Cross-examination

| Challenge | Answer |
| --- | --- |
| Affirmative asks: How does Hybrid stop narrative progress across half-filled rows? | Negative answers: add state field and illegal-transition checks to Compiler rows; no need to replace release spine. |
| Negative asks: How does State Machine choose correct RED/GREEN proof shape? | Affirmative answers: it consumes Proof Type Inference before transition checks, which admits it needs current classifier. |
| Affirmative asks: Does Trigger arbitration fire too late after bad state transition? | Negative answers: transition checks run before state movement, and Trigger arbitration still handles live failures after proof attempts. |
| Negative asks: What handles reviewer conflict beyond state names? | Affirmative answers: reviewer-review and ld-review states, but verdict routing still needs blocker vocabulary and Hybrid gates. |
| Affirmative asks: Is release-ready clearer than many gates? | Negative answers: yes for visibility, but release-ready must be computed from gates, not substitute for them. |

#### Judge ballot

Negative wins against full replacement. Affirmative proves a real gap: current plan can benefit from a single visible state per criterion and legal transition checks. But Affirmative does not prove State Machine can own release authority. It depends on Proof Type Inference for proof shape, Compiler rows for obligations, blocker vocabulary for routing, and Hybrid gates for arbitration.

Ruling:

1. Keep Hybrid+Compiler+Inference as default EXECUTE release spine.
2. Adopt Execution State Machine as a state overlay for standard and deep mode.
3. In quick mode, add state only when proof fails twice, inference confidence is low, or reviewer/LD route triggers.
4. State transition proof must write back into Compiler row or proof packet.
5. Trigger arbitration can override any proposed transition.
6. `scope-stopped` remains terminal boundary-preserving state, not a failure to conceal.

### Comparison: Hybrid+Compiler+Inference default vs Execution State Machine

This is the compare turn in the 2-1-1-1 cadence. Compare current Hybrid+Compiler+Inference default against Execution State Machine as a possible replacement spine. Scores judge EXECUTE release-spine fitness, not usefulness as an overlay.

| Criterion | Weight | Hybrid+Compiler+Inference default | Execution State Machine | Winner |
| --- | ---: | ---: | ---: | --- |
| release blocker handling | 16 | 15 | 10 | Hybrid+Compiler+Inference |
| legal progression clarity | 14 | 10 | 14 | State Machine |
| proof-type correctness | 12 | 11 | 7 | Hybrid+Compiler+Inference |
| custody and replay enforcement | 12 | 11 | 10 | Hybrid+Compiler+Inference |
| no-disturbance autonomy | 10 | 9 | 9 | tie |
| EXECUTE-only boundary safety | 10 | 9 | 9 | tie |
| quick-mode ergonomics | 8 | 7 | 4 | Hybrid+Compiler+Inference |
| reviewer and LD routing | 8 | 7 | 6 | Hybrid+Compiler+Inference |
| cold-reader handoff | 6 | 4 | 6 | State Machine |
| integration complexity | 4 | 3 | 2 | Hybrid+Compiler+Inference |
| **Total** | **100** | **86** | **77** | **Hybrid+Compiler+Inference as spine** |

State Machine wins two important dimensions: legal progression clarity and cold-reader handoff. It makes hidden drift harder because each criterion has one visible state and every transition needs proof.

Hybrid+Compiler+Inference wins release-spine fitness. It already decides proof shape, compiles obligations, maps blockers, routes reviewer/LD outcomes, preserves evidence custody, enforces replay, and lets Trigger arbitration override live conflicts. State Machine needs those mechanisms to mean anything beyond state labels.

| Practical decision | Rule |
| --- | --- |
| release spine | keep Hybrid+Compiler+Inference default |
| state visibility | add State Machine as overlay when rows are active |
| quick mode | no state record unless proof fails twice, inference confidence is low, or reviewer/LD triggers |
| standard mode | add `state` and `allowed_next_states` to active Compiler rows |
| deep mode | require transition proof for adversarial probe states too |
| release-ready state | computed from Hybrid gates, never manually assigned |
| conflict handling | Trigger arbitration can override transition target |

Best integration:

```text
if mode == quick and criterion remains clear:
  use proof packet slots without state overlay
else:
  infer proof type
  compile row obligations
  attach state field
  permit transition only when required proof exists
  write transition proof to row

run Hybrid gates as release spine
compute release-ready from passed gates
if Trigger arbitration fires:
  override state target with blocker route
```

Weighted result: do not replace the spine. Adopt Execution State Machine as a visibility and legal-transition overlay for standard/deep rows and troubled quick criteria.

### Final decision: Hybrid+Compiler+Inference default vs Execution State Machine

This is the decision turn in the 2-1-1-1 cadence. Keep Hybrid+Compiler+Inference as the EXECUTE release spine and adopt Execution State Machine as a state overlay for active rows. The decision adds visible criterion state without weakening proof-shape classification, blocker routing, or Trigger arbitration.

| Decision area | Chosen rule | Reason |
| --- | --- | --- |
| release spine | Hybrid+Compiler+Inference default | Higher weighted score: 86 vs 77, with stronger proof type, blocker, and release authority coverage. |
| state model | Execution State Machine overlay | Stronger legal progression clarity and cold-reader handoff. |
| quick mode | no state overlay unless proof fails twice, inference confidence is low, or reviewer/LD triggers | Avoids ceremony for deterministic local execution. |
| standard mode | active Compiler rows include `state`, `allowed_next_states`, and `transition_proof` | Makes row progression explicit without replacing rows. |
| deep mode | adversarial probes also require state transitions and transition proof | Prevents hidden movement through Shadow, LD, Trial Court, or Handoff adversary gates. |
| release-ready | computed only from passed Hybrid gates and filled mandatory rows | Prevents manual release-ready assignment. |
| conflict handling | Trigger arbitration overrides proposed transitions | Live gate failures outrank planned state flow. |
| boundary handling | `scope-stopped` is terminal boundary-preserving state | EXECUTE stops instead of repairing upstream artifacts. |

State fields when row overlay is active:

```text
state: sealed | inferred | reviewer-review | ld-review | row-compiled | red-proven | red-rebuild | green-proven | drift-proven | replay-proven | reviewer-cleared | blocked | scope-stopped | release-ready
allowed_next_states: <state list from transition table>
transition_proof: <evidence handle proving last transition>
transition_blocker: <blocker_class or none>
```

Final operating rule:

```text
if row overlay is inactive:
  use existing proof packet slots and Hybrid gates
else:
  require legal transition before row status changes
  write transition_proof before marking new state
  compute release-ready from Hybrid gate results
  let Trigger arbitration override illegal or stale transition targets

if transition needs user input after phase 0:
  block transition and route by blocker vocabulary
if transition needs upstream artifact mutation:
  mark scope-stopped and stop EXECUTE
```

Non-negotiables after this decision:

1. State Machine never releases artifacts by itself.
2. `release-ready` is derived, not assigned by executor narration.
3. State transitions require evidence handles and row/proof-packet writeback.
4. Quick mode stays rowless and stateless unless trouble triggers overlay.
5. `scope-stopped` preserves EXECUTE boundary and must not be hidden as failure.
6. Trigger arbitration remains final authority for conflicts.

Decision: stay with Hybrid+Compiler+Inference as the plan. Add Execution State Machine as optional/required overlay by mode: off by default in quick, on for standard/deep active rows, mandatory for troubled quick criteria.


### State overlay validation rules

This is improvement turn 1 after the Execution State Machine decision. The overlay is useful only if state changes are mechanically checked, so every active state row must prove both the new state and the legality of the transition. Narrative progress is ignored.

| Field | Required validation | Release effect if invalid |
| --- | --- | --- |
| `state` | value is one allowed state and matches latest accepted proof handle | block row |
| `allowed_next_states` | list matches transition table for current state and mode | block transition |
| `transition_proof` | evidence handle exists, is fresh, and proves the last transition | block row |
| `transition_blocker` | `none` or valid blocker vocabulary class with severity, route, and release effect | route by Trigger arbitration |
| `release-ready` | derived only from passed Hybrid gates and filled mandatory rows | reject manual assignment |
| `scope-stopped` | includes upstream dependency or missing phase-0 input as reason | terminal route-upstream |

Validation order:

```text
for each active Compiler row:
  validate state value
  validate allowed_next_states from transition table
  validate transition_proof freshness and custody
  validate transition_blocker against blocker vocabulary
  if proposed state is release-ready:
    recompute from Hybrid gate results instead of accepting row text
  if proposed transition asks user after phase 0:
    reject transition and route blocker
  if proposed transition mutates upstream phase output:
    mark scope-stopped
  if Trigger arbitration fires:
    override proposed state with arbitration route
```

Validator output:

```text
criterion_id: <sealed id>
previous_state: <state>
proposed_state: <state>
transition_allowed: true | false
proof_handle: <handle or missing>
blocker_class: <class or none>
route: continue | repair-and-rerun | reviewer-review | ld-review | scope-stop
release_effect: proceed | block | route-upstream
```

Rules:

1. State validation cannot add criteria or broaden EXECUTE scope.
2. Missing transition proof is a blocker, not a reason to ask the user mid-process.
3. `release-ready` must be recomputed after validation; stored row text is advisory only.
4. `scope-stopped` is valid terminal output when required proof lives upstream.
5. Quick mode runs this validator only when the overlay is triggered by failure, low confidence, reviewer, or LD.
6. Standard and deep mode run this validator before every release claim.

### Transition replay checkpoint

This is improvement turn 2 after the Execution State Machine decision. State validation proves one transition; replay checkpoint proves the whole criterion path can be reconstructed from sealed inputs and evidence handles without executor memory.

| Replay target | Required check | Fails as |
| --- | --- | --- |
| state path | every recorded transition has previous state, proposed state, and allowed transition | replay-gap |
| proof chain | each transition proof handle resolves to custody-preserved evidence | custody-gap |
| blocker route | every blocked or scope-stopped step maps to blocker vocabulary and Trigger arbitration | blocker-mismatch |
| no-disturbance | replay contains no user ask after phase 0 | no-disturbance-breach |
| EXECUTE boundary | replay contains no upstream mutation as repair | scope-drift |
| release derivation | replay recomputes release-ready from gates, not row assertion | self-confirming-proof |

Replay protocol:

```text
for each active criterion:
  rebuild state path from sealed criterion and row history
  resolve every transition_proof handle
  replay blocker routes through Trigger arbitration
  recompute release-ready from Hybrid gates
  compare recomputed terminal state to recorded terminal state
  if mismatch exists:
    classify blocker and route without asking user
```

Replay packet:

```text
criterion_id: <sealed id>
sealed_branch: code/system | research_report | design_artifact
state_path: <ordered states>
proof_handles: <ordered handles>
recomputed_terminal_state: release-ready | blocked | scope-stopped
recorded_terminal_state: <state>
mismatch: none | replay-gap | custody-gap | blocker-mismatch | no-disturbance-breach | scope-drift | self-confirming-proof
route: continue | repair-and-rerun | reviewer-review | ld-review | scope-stop
release_effect: proceed | block | route-upstream
```

Rules:

1. Replay uses sealed phase 0 inputs, Compiler rows, proof packets, and evidence handles only.
2. Replay cannot ask the user, invent criteria, or repair upstream artifacts.
3. Replay mismatch blocks release until repaired or scope-stopped.
4. Deep mode runs replay for every criterion before cadence exit.
5. Standard mode runs replay for every active Compiler row before release claim.
6. Quick mode runs replay only after overlay trigger, reviewer route, LD route, or repeated proof failure.

### Rival variation: Acceptance Proof Linter

This is the different-variation turn in the 2-1-1-1 cadence. Instead of making rows, states, and replay the main discipline, this rival treats EXECUTE as a lintable proof document: every criterion must pass a static and dynamic proof lint before release gates run.

Core bet: most EXECUTE failures are proof-smell failures before they are state-machine failures. If proof packets are linted like code, weak RED proof, self-confirming GREEN proof, missing custody, and scope creep are caught earlier with less ceremony.

| Lint rule | Detects | Required route |
| --- | --- | --- |
| `no-orphan-criterion` | sealed criterion has no proof packet, Compiler row, or state record | block |
| `red-before-green` | positive proof exists without earlier negative proof or branch equivalent | red-rebuild |
| `no-self-confirming-green` | executor narrative is only positive proof | Black-box Acceptance Lab |
| `fresh-proof-only` | proof handle predates latest artifact change | repair-and-rerun |
| `custody-required` | evidence handle missing source, command, quote, or replay path | custody-gap |
| `scope-fence` | proof requires Contract/Find/Observe/Recombine/Grill mutation | scope-stop |
| `no-release-by-assertion` | release-ready appears without recomputed Hybrid gate pass | block |
| `no-midstream-question` | proof path depends on user answer after phase 0 | blocker route |

Linter protocol:

```text
for each sealed EXECUTE criterion:
  collect proof packet, Compiler row, state path, and evidence handles
  run proof-smell lint rules
  classify each lint failure using blocker vocabulary
  route failures through Trigger arbitration
  only after lint passes, run Hybrid release gates
```

Linter output:

```text
criterion_id: <sealed id>
lint_status: pass | fail
failed_rules: <rule list>
blocker_class: <class or none>
route: continue | red-rebuild | repair-and-rerun | reviewer-review | ld-review | scope-stop
release_effect: proceed | block | route-upstream
evidence_handles_checked: <count>
```

Why this is genuinely different:

1. Hybrid+Compiler+Inference asks what proof is required, then fills and gates it.
2. State Machine asks what legal progress happened, then validates transitions.
3. Acceptance Proof Linter asks whether the proof artifact has disqualifying smells before deeper release ceremony.

Best form if adopted:

```text
phase 0 seals criteria
for each criterion:
  build minimal proof packet or Compiler row
  run Acceptance Proof Linter
  if lint fails:
    route by blocker vocabulary and Trigger arbitration
  else:
    run proof type inference, state validation, replay, and Hybrid gates as needed by mode
```

Risks:

1. Lint rules can become style checks unless each maps to release effect.
2. Lint pass can create false confidence if it replaces evidence replay.
3. Deep research/report criteria may need branch-specific lint rules to avoid code-test bias.
4. Quick mode benefits most, but standard/deep still need Hybrid gates for final authority.

### LD debate: Hybrid+Compiler+Inference+State default vs Acceptance Proof Linter

This is the debate turn in the 2-1-1-1 cadence. Question: should Acceptance Proof Linter replace the current Hybrid+Compiler+Inference+State default, or become an early proof-smell gate inside it?

Affirmative claim: Acceptance Proof Linter should become the spine because lintable proof smells are cheaper and earlier than row/state/replay ceremony.

Affirmative arguments:

1. It catches common EXECUTE failures before expensive gates: orphan criteria, GREEN-before-RED, stale proof, scope drift, and release assertion.
2. It is easiest to run in quick mode because it needs proof artifacts, not full state overlay.
3. It matches Superpowers discipline: failing proof shape blocks implementation-like progress immediately.
4. It gives reviewers concrete rule names instead of vague concerns.
5. It reduces narrative loopholes because every smell maps to blocker vocabulary and release effect.

Negative claim: Acceptance Proof Linter is a strong preflight gate, but it cannot replace the current spine because lint pass is not proof completion.

Negative arguments:

1. Lint rules detect proof smell, not proof truth. A packet can pass lint and still contain weak evidence.
2. It depends on sealed criteria, proof packets, blocker vocabulary, Trigger arbitration, and Hybrid gates it claims to replace.
3. It does not infer branch-specific proof type; Proof Type Inference still decides whether command, ledger, warrant, probe, review, or replay proof is required.
4. It does not prove legal progression; State overlay still prevents hidden movement between RED, GREEN, drift, replay, blocked, and scope-stopped states.
5. It risks style-check theater unless every lint failure routes through existing release authority.

Cross-examination:

| Challenge | Affirmative answer | Negative response |
| --- | --- | --- |
| Can lint replace evidence replay? | It catches missing replay handles early. | Missing handle detection is not replay; Transition replay still proves reconstruction. |
| Can lint replace inference? | Branch-specific lint rules can imply proof type. | Implied proof type is weaker than explicit inference and confidence routing. |
| Can lint preserve no-disturbance? | `no-midstream-question` blocks user asks. | Good, but blocker routing still comes from default spine. |
| Can lint release quick mode alone? | For deterministic criteria, lint plus compact packet may suffice. | Release still requires Hybrid gate and Done Means Ran evidence. |
| Can lint protect EXECUTE boundary? | `scope-fence` routes scope-stop. | Correct as early detector, not final boundary authority. |

Judge ballot:

Negative wins against replacement. Acceptance Proof Linter finds real weakness: current plan checks many failures after row/state machinery begins. Early proof-smell detection improves speed and reviewer clarity. But linter depends on proof type, custody, blocker routing, state legality, replay, and Hybrid release gates for final authority.

Ruling:

1. Keep Hybrid+Compiler+Inference+State as EXECUTE release spine.
2. Adopt Acceptance Proof Linter as preflight gate before expensive state/replay work when proof artifacts exist.
3. In quick mode, linter may be the first escalation detector after compact proof packet creation.
4. In standard/deep, linter runs before release claim and before replay, but cannot waive replay or Hybrid gates.
5. Every lint failure must map to blocker vocabulary and Trigger arbitration.
6. Linter cannot ask user mid-process, invent criteria, or repair upstream artifacts.

### Comparison: Hybrid+Compiler+Inference+State default vs Acceptance Proof Linter

This is the weighted compare turn in the 2-1-1-1 cadence. Scores are intentionally not perfect: the linter is strong as early proof-smell detector, but weaker as release authority.

| Criterion | Weight | Hybrid+Compiler+Inference+State default | Acceptance Proof Linter | Winner |
| --- | ---: | ---: | ---: | --- |
| release blocker handling | 16 | 15 | 10 | Hybrid default |
| proof-smell detection speed | 14 | 10 | 14 | Linter |
| proof-type correctness | 12 | 11 | 7 | Hybrid default |
| legal progression clarity | 10 | 9 | 5 | Hybrid default |
| custody and replay enforcement | 10 | 9 | 6 | Hybrid default |
| no-disturbance autonomy | 9 | 8 | 8 | tie |
| EXECUTE-only boundary safety | 9 | 8 | 8 | tie |
| quick-mode ergonomics | 8 | 6 | 8 | Linter |
| reviewer clarity | 6 | 5 | 6 | Linter |
| integration complexity | 6 | 4 | 5 | Linter |
| **Total** | **100** | **85** | **77** | **Hybrid default as spine** |

Interpretation:

1. Acceptance Proof Linter wins speed, quick-mode ergonomics, reviewer clarity, and lower ceremony.
2. Hybrid+Compiler+Inference+State wins release-critical categories: blockers, proof type, legal progression, custody, and replay.
3. Ties on no-disturbance and EXECUTE boundary are real only if lint failures route through blocker vocabulary and Trigger arbitration.
4. Linter cannot score higher on release authority because lint pass is not proof completion.

Best integration:

```text
phase 0 seals execution envelope
for each sealed criterion:
  create proof packet or Compiler row shell
  run Acceptance Proof Linter as early proof-smell gate
  if lint fails:
    map failed rule to blocker vocabulary
    route through Trigger arbitration
  else:
    run proof type inference as mode requires
    validate state overlay when active
    replay transition path when required
    run Hybrid gates as release authority
```

Mode placement:

| Mode | Linter role | Release effect |
| --- | --- | --- |
| quick | first escalation detector after compact packet exists | fail routes to overlay or blocker; pass still needs mandatory proof packet |
| standard | preflight before release claim and before replay | fail blocks row until repaired or routed |
| deep | preflight plus adversarial lint expansion for contested proof | fail can trigger reviewer, LD, Trial Court, or scope-stop |

Weighted result: do not replace the spine. Adopt Acceptance Proof Linter as early proof-smell gate ahead of state/replay work, with all failures mapped to blocker vocabulary and Trigger arbitration.

### Final decision: Hybrid+Compiler+Inference+State default vs Acceptance Proof Linter

This is the decision turn in the 2-1-1-1 cadence. Keep Hybrid+Compiler+Inference+State as the EXECUTE release spine and adopt Acceptance Proof Linter as an early proof-smell gate. Weighted comparison favors the current spine 85 vs 77 because linter speed does not equal release authority.

| Decision area | Chosen rule | Reason |
| --- | --- | --- |
| release spine | Hybrid+Compiler+Inference+State default | Higher weighted score and stronger blocker, proof-type, state, custody, replay, and release authority coverage. |
| linter role | early proof-smell gate | Catches orphan criteria, stale proof, self-confirming proof, scope drift, and release assertion before expensive replay. |
| quick mode | run after compact proof packet exists or after trouble trigger | Keeps quick mode light while catching proof smells before escalation. |
| standard mode | run before release claim and before replay | Prevents stale or malformed rows from reaching replay ceremony. |
| deep mode | run base linter plus adversarial lint expansion on contested proof | Gives reviewers and LD concrete rule failures before verdict. |
| failure routing | every lint failure maps to blocker vocabulary and Trigger arbitration | Lint is diagnostic; routing remains governed by existing release spine. |
| release-ready | never granted by lint pass | Passing lint only permits deeper gates; Hybrid gates still compute release readiness. |
| boundary handling | `scope-fence` failure becomes `scope-stopped` | EXECUTE stops and routes upstream instead of repairing upstream artifacts. |

Pros kept from Acceptance Proof Linter:

1. Faster detection of malformed proof packets.
2. Better reviewer vocabulary through named lint rules.
3. Strong quick-mode escalation signal.
4. Earlier defense against GREEN-before-RED and self-confirming proof.

Cons that prevent replacement:

1. Lint pass does not prove evidence truth.
2. Linter cannot infer proof type with confidence by itself.
3. Linter cannot prove legal state progression.
4. Linter cannot replay custody chain or compute release readiness.

Final operating rule:

```text
phase 0 seals execution envelope
for each sealed criterion:
  create compact proof packet or Compiler row shell
  run Acceptance Proof Linter when mode or trigger requires it
  if lint fails:
    map failed rule to blocker vocabulary
    route through Trigger arbitration
    do not ask user mid-process
    do not mutate upstream artifacts
  if lint passes:
    continue to proof type inference, state validation, replay, and Hybrid gates as required
  compute release-ready only from passed Hybrid gates and filled mandatory obligations
```

Non-negotiables:

1. Acceptance Proof Linter never releases artifacts by itself.
2. Lint failures block or route; they do not invite mid-process user questions.
3. `scope-fence` failure becomes `scope-stopped`, not an EXECUTE-local repair request.
4. Linter output must write back into proof packet, Compiler row, or state record before release claim.
5. Trigger arbitration remains final authority over lint failure routes.
6. Hybrid gates remain final release authority in every mode.

Decision: stay with Hybrid+Compiler+Inference+State as the plan. Add Acceptance Proof Linter as a mode-gated early proof-smell gate: light in quick, mandatory before release claim in standard, adversarially expanded in deep.

### Acceptance Proof Linter rule registry

This is improvement turn 1 after the Acceptance Proof Linter decision. The linter needs a rule registry so rules stay mechanical, branch-aware, mode-aware, and routed through EXECUTE-only blockers instead of becoming subjective review comments.

| Rule id | Applies to | Mechanical predicate | Default blocker | Default route |
| --- | --- | --- | --- | --- |
| `no-orphan-criterion` | all branches | sealed criterion lacks proof packet, Compiler row, or state record | missing-proof | repair-and-rerun |
| `red-before-green` | all branches | positive proof timestamp/order precedes accepted negative proof | red-rebuild | repair-and-rerun |
| `no-self-confirming-green` | all branches | positive proof is executor narration without independent command, citation, warrant, reviewer, or probe | self-confirming-proof | reviewer-review |
| `fresh-proof-only` | all branches | proof handle predates latest artifact or claim-set change | stale-proof | repair-and-rerun |
| `custody-required` | all branches | evidence handle lacks command/source/quote/path/replay metadata required by branch proof language | custody-gap | repair-and-rerun |
| `scope-fence` | all branches | proof requirement mutates Contract, Find, Observe, Recombine, Grill, or phase 0 criteria | scope-drift | scope-stop |
| `no-release-by-assertion` | all branches | `release-ready` appears without recomputed Hybrid gate pass | self-confirming-proof | repair-and-rerun |
| `no-midstream-question` | all branches | proof path depends on user answer after phase 0 | no-disturbance-breach | reviewer-review |
| `quote-backed-claim` | research_report | claim marked supported without audited quote or source ledger link | escrow-gap | repair-and-rerun |
| `warrant-has-alternative` | design_artifact | selected warrant lacks rejected alternative or constraint tie | warrant-conflict | ld-review |
| `command-has-exit` | code/system | command proof lacks exit code, output signal, or rerun path | failed-gate | repair-and-rerun |

Registry schema:

```text
rule_id: <stable lint id>
branches: code/system | research_report | design_artifact | all
modes: quick | standard | deep | all
predicate: <mechanical yes/no check>
requires_handles: <evidence handle fields>
blocker_class: <blocker vocabulary class>
route: continue | repair-and-rerun | reviewer-review | ld-review | scope-stop
release_effect: proceed | block | route-upstream
waivable: false | mode-rule-only
```

Mode policy:

| Mode | Registry subset | Waiver rule |
| --- | --- | --- |
| quick | base all-branch rules plus branch rule when compact packet exists | only mode-rule-only rules may defer to standard trigger |
| standard | all base and branch-specific rules for active rows | no waiver for mandatory proof, custody, scope, or release rules |
| deep | standard rules plus adversarial variants for contested proof | no waiver; failure can escalate to reviewer, LD, Trial Court, or scope-stop |

Rules:

1. Every lint rule must have a mechanical predicate and blocker mapping.
2. Rule failure cannot ask the user mid-process.
3. Rule failure cannot authorize upstream repair inside EXECUTE.
4. Branch-specific rules extend branch proof language; they do not create new acceptance criteria.
5. New lint rules require default route, release effect, and evidence handle requirements before use.
6. Trigger arbitration overrides registry route when live gate evidence conflicts with default routing.
### Acceptance Proof Linter writeback protocol

This is improvement turn 2 after the Acceptance Proof Linter decision. The registry defines what failed; writeback defines where the failure becomes durable so EXECUTE cannot pass by losing lint state between preflight, replay, reviewer, and release gates.

| Lint result field | Write target | Required content | Release effect if missing |
| --- | --- | --- | --- |
| `rule_id` | proof packet and Compiler row | stable registry id plus branch and mode | block row |
| `predicate_result` | proof packet | pass, fail, or not-applicable with evaluated evidence handle | block if fail lacks route |
| `failed_handle` | Evidence Escrow and replay packet | command/source/quote/path/replay metadata that caused failure | custody-gap |
| `blocker_class` | blocker ledger and state record | blocker vocabulary class, severity, and default route | route through Trigger arbitration |
| `arbitrated_route` | state record | final route after Trigger arbitration override | block transition if absent |
| `repair_attempt` | Compiler row history | rerun command, reviewer verdict, LD ballot, or scope-stop reason | block release-ready |
| `release_effect` | release summary | proceed, block, or route-upstream | reject release claim |

Writeback order:

```text
for each linted criterion:
  write rule_id and predicate_result to proof packet
  attach failed_handle or passing handle to Evidence Escrow
  if predicate failed:
    map rule to blocker vocabulary
    run Trigger arbitration
    write arbitrated_route to state record
    append repair_attempt or scope-stop reason to Compiler row history
    block release-ready until route resolves
  if predicate passed:
    mark lint-pass as permission to continue, not release proof
  include lint outcome in transition replay packet
```

Writeback invariants:

1. A lint pass is never a positive proof; it only permits the next EXECUTE gate.
2. A lint failure is durable only after proof packet, Compiler row, state record, and replay packet agree on route and release effect.
3. Missing lint writeback is itself a `custody-gap` and blocks release.
4. No writeback step may ask the user after phase 0.
5. No writeback step may mutate Contract, Find, Observe, Recombine, Grill, or sealed acceptance criteria.
6. `scope-fence` writeback records `scope-stopped` as terminal route-upstream, not failed EXECUTE repair.
7. Trigger arbitration can override default registry route, but the override must be written before replay.
8. Hybrid gates remain final release authority even when every lint row passes.

### Rival variation: Execution Contract Court

This is the different-variation turn after two Acceptance Proof Linter improvements. Instead of treating EXECUTE as a proof pipeline with lint and replay, Execution Contract Court treats each sealed criterion as a mini contract dispute: claimant asserts release readiness, respondent attacks proof sufficiency, and court issues a binding EXECUTE-only order.

Core bet: EXECUTE fails when proof obligations are scattered across packets, ledgers, states, and reviewers. A court model forces every criterion into one adversarial case file with claims, exhibits, objections, rulings, and terminal order.

| Court role | EXECUTE equivalent | Allowed input | Forbidden action |
| --- | --- | --- | --- |
| claimant | executor | sealed criterion, proof packet, Compiler row, evidence handles | invent criteria or ask user after phase 0 |
| respondent | adversarial reviewer | same sealed case file plus lint, replay, and blocker records | mutate upstream phase outputs |
| clerk | ledger compiler | case index, exhibits, timestamps, routes | decide release readiness |
| judge | release arbiter | claimant/respondent briefs, Hybrid gate results, Trigger arbitration | override mechanical failed gate with narrative |

Case file schema:

```text
case_id: <sealed criterion id>
branch: code/system | research_report | design_artifact
claim: <release-ready assertion being tested>
exhibits: <proof handles, lint results, replay packet, state path>
objections: <blocker vocabulary entries>
rulings: <objection sustained | overruled with mechanical reason>
terminal_order: release-ready | repair-and-rerun | reviewer-review | ld-review | scope-stopped
release_basis: <Hybrid gate result and mandatory row coverage>
disturbance_check: no post-phase-0 question used
scope_check: no upstream mutation used
```

Court procedure:

```text
for each sealed EXECUTE criterion:
  clerk opens case file from sealed envelope
  claimant submits release-ready argument with exhibits
  respondent files objections using blocker vocabulary only
  judge sustains any objection proven by lint, replay, custody, state, or Hybrid gate evidence
  judge overrules only when mechanical evidence contradicts objection
  Trigger arbitration resolves route conflicts
  terminal_order is written to state record and release summary
```

Why this differs from current spine:

1. Current spine is pipeline-first: proof packet → linter → inference → state → replay → Hybrid gates.
2. Court model is dispute-first: one case file aggregates all proof and objections before terminal order.
3. Current spine optimizes mechanical progression; court model optimizes adversarial clarity and reviewer handoff.
4. Current spine can feel fragmented; court model gives one auditable artifact per criterion.
5. Court model risks ceremony overhead and duplicated state unless tightly generated from existing ledgers.

EXECUTE-only guardrails:

1. Court can only rule on sealed EXECUTE criteria.
2. Court cannot amend Contract, Find, Observe, Recombine, Grill, phase 0 inputs, or acceptance criteria.
3. Court cannot ask user mid-process; missing jurisdiction becomes blocker route or `scope-stopped`.
4. Court cannot mark release-ready unless Hybrid gates and mandatory proof rows pass.
5. Court records upstream defects as `scope-stopped` terminal orders, not EXECUTE repair tasks.

Potential adoption shape:

- quick: no court by default; generate case file only after repeated proof failure.
- standard: generate court view from existing proof packet, linter writeback, state, and replay records before release claim.
- deep: run full claimant/respondent/judge adversarial pass for contested criteria.

### LD debate: Hybrid+Compiler+Inference+State+Linter default vs Execution Contract Court

Question: should Execution Contract Court replace the current EXECUTE spine, or become a generated adversarial view over the existing spine?

| Role | Argument | Evidence standard | Weakness admitted |
| --- | --- | --- | --- |
| Affirmative: Court replaces spine | Court gives each criterion one case file with claimant, respondent, exhibits, objections, rulings, and terminal order. This is easier to review than many distributed ledgers. | Every release claim must survive objections backed by lint, replay, custody, state, and Hybrid gate evidence. | Court risks duplicating proof/state machinery and can become ceremony-heavy in quick/standard mode. |
| Negative: current spine remains | Current spine already has proof generation, type inference, state validation, replay, lint writeback, blocker routing, and Hybrid final authority. Court cannot replace these without rebuilding them under legal labels. | Release-ready remains computed only from passed Hybrid gates and filled mandatory rows. | Current spine can feel fragmented unless reviewer-facing summaries are generated. |
| Judge | Court is strongest as generated adversarial presentation layer, not release spine. It should consume existing proof packet, Compiler row, lint writeback, state record, replay packet, and Hybrid result. | A ruling is valid only when every objection maps to blocker vocabulary and Trigger arbitration result. | Generated court view must not create new acceptance criteria or hide unresolved blocker rows. |

Cross-examination:

| Challenge | Court answer | Spine answer | Ruling |
| --- | --- | --- | --- |
| Which system prevents release by narrative assertion? | Objections expose unsupported claims. | `no-release-by-assertion`, state validation, replay, and Hybrid gates mechanically block. | spine stronger because block is mechanical before argument. |
| Which system handles reviewer handoff better? | One case file is clearer for humans and subagents. | Existing ledgers are complete but scattered. | court stronger as presentation layer. |
| Which system preserves EXECUTE-only boundary? | Jurisdiction rules can mark `scope-stopped`. | `scope-fence`, Trigger arbitration, and state terminal order already enforce boundary. | tie if court is generated from existing routes; court loses if it invents jurisdiction. |
| Which system supports quick mode? | Court should stay off unless repeated failure. | Current compact proof + linter trigger already fit quick mode. | spine stronger. |
| Which system supports deep adversarial audit? | Court format naturally frames claimant/respondent/judge. | LD, reviewer, Trial Court, replay, and linter already provide adversarial gates. | court useful as consolidated deep-mode artifact. |

Judge ruling:

1. Do not replace Hybrid+Compiler+Inference+State+Linter with Execution Contract Court.
2. Adopt Court only as generated adversarial view over existing EXECUTE records.
3. Court view may be mandatory in deep mode for contested criteria and optional in standard mode before release review.
4. Quick mode should create Court view only after repeated proof failure or user-requested deep audit.
5. Court cannot issue `release-ready`; it can only present court-style ruling derived from Hybrid gate result.
6. Court objections must map to blocker vocabulary and Trigger arbitration.
7. Court cannot ask user after phase 0 or repair upstream phases.
8. Missing exhibits become custody-gap, not narrative excuse.

Operational consequence: keep current spine. Add Court as reviewer-facing synthesis for contested/deep criteria when fragmented proof makes human or subagent review harder.

### Comparison: Hybrid+Compiler+Inference+State+Linter default vs Execution Contract Court

This is the weighted compare turn for the Execution Contract Court rival. Scores are deliberately non-perfect: both designs solve part of EXECUTE, but neither eliminates proof risk, scope ambiguity, or reviewer overhead.

| Criterion | Weight | Hybrid+Compiler+Inference+State+Linter default | Execution Contract Court | Winner |
| --- | ---: | ---: | ---: | --- |
| mechanical release authority | 16 | 15 | 9 | Hybrid default |
| proof obligation completeness | 13 | 12 | 10 | Hybrid default |
| adversarial reviewer clarity | 12 | 8 | 12 | Court |
| blocker routing precision | 11 | 10 | 8 | Hybrid default |
| evidence custody and replay | 10 | 9 | 7 | Hybrid default |
| EXECUTE-only boundary safety | 9 | 8 | 8 | tie |
| no-disturbance autonomy | 8 | 8 | 7 | Hybrid default |
| quick-mode ergonomics | 7 | 6 | 4 | Hybrid default |
| deep-mode contested review | 7 | 6 | 7 | Court |
| integration complexity | 7 | 4 | 5 | Court |
| **Total** | **100** | **86** | **77** | **Hybrid default as spine** |

Score rationale:

- Hybrid default wins mechanical release authority because release-ready is recomputed from gates, not argued from case narrative.
- Hybrid default wins proof completeness because Compiler rows, proof type inference, linter writeback, state validation, and replay each cover a different failure class.
- Court wins adversarial reviewer clarity because claimant/respondent/judge framing is easier for humans and subagents to audit.
- Court loses quick-mode ergonomics because case files add ceremony before proof failure justifies it.
- Court loses custody/replay because it depends on underlying exhibits; without existing spine, it must rebuild ledger machinery.
- Tie on EXECUTE-only boundary only if Court jurisdiction is generated from sealed criteria and blocker routes; manual Court authorship would lose.

Compare result:

Hybrid+Compiler+Inference+State+Linter remains stronger as release spine. Execution Contract Court is valuable as generated adversarial review surface, especially for deep mode, contested criteria, and fragmented evidence handoff. It should not own release computation.

### Final decision: Hybrid+Compiler+Inference+State+Linter default vs Execution Contract Court

Decision: stay with Hybrid+Compiler+Inference+State+Linter as the EXECUTE release spine. Add Execution Contract Court only as a generated adversarial review view for contested, deep-mode, or fragmented-evidence criteria.

| Decision area | Chosen rule | Why |
| --- | --- | --- |
| release spine | Hybrid+Compiler+Inference+State+Linter | Weighted score 86 vs 77; stronger mechanical release authority, blocker routing, proof completeness, custody, replay, quick-mode fit. |
| Court role | generated adversarial view | Court improves reviewer clarity without taking ownership of release computation. |
| quick mode | disabled unless repeated proof failure | Keeps quick path compact; avoids court ceremony before evidence says it is needed. |
| standard mode | optional reviewer-facing synthesis | Useful when proof artifacts are fragmented, but not mandatory for every criterion. |
| deep mode | required for contested criteria | Claimant/respondent/judge framing strengthens adversarial audit where risk justifies ceremony. |
| release-ready authority | Hybrid gates only | Court ruling can present release basis but cannot create it. |
| objection routing | blocker vocabulary plus Trigger arbitration | Court objections must become existing blocker routes, not new free-form outcomes. |
| upstream defects | `scope-stopped` terminal order | Court jurisdiction preserves EXECUTE-only boundary and routes upstream defects out of EXECUTE. |

Weighted pros:

- Hybrid spine has higher mechanical confidence: proof obligations, lint, state, replay, and Hybrid gate authority are already explicit.
- Court has higher review readability: one case file per criterion helps reviewers understand contested proof.
- Combining them gives best shape: machine-owned release computation plus human-readable adversarial case view.

Weighted cons:

- Hybrid spine remains complex and needs generated summaries to avoid reviewer fatigue.
- Court can become theatrical if authors write arguments manually instead of generating from proof records.
- Court must not duplicate or fork state; it must reference existing proof packet, Compiler row, linter writeback, state record, replay packet, and Hybrid result.

Final operating rule:

```text
for each sealed EXECUTE criterion:
  run Hybrid+Compiler+Inference+State+Linter spine as release authority
  if mode is deep and criterion is contested:
    generate Execution Contract Court view from existing records
  if mode is standard and proof is fragmented:
    optionally generate Court view for reviewer handoff
  if mode is quick and proof fails repeatedly:
    generate Court view only after escalation trigger
  Court objections map to blocker vocabulary and Trigger arbitration
  Court cannot ask user after phase 0
  Court cannot mutate upstream phases or sealed criteria
  Court cannot issue release-ready except as presentation of Hybrid result
```

Non-negotiables:

1. Court is generated from EXECUTE records, never manually authored as new proof.
2. Court never creates, amends, or deletes acceptance criteria.
3. Court never asks user mid-process.
4. Court never repairs upstream phase output.
5. Court terminal orders must match state record and replay packet.
6. Hybrid gates remain final release authority in every mode.
7. `scope-stopped` remains valid terminal boundary state, not hidden failure.

### Execution Contract Court handoff packet

This is improvement turn 1 after the Execution Contract Court decision. Since Court is a generated adversarial view, reviewers need a strict packet format that prevents free-form legal theater and keeps all rulings tied to existing EXECUTE proof records.

| Packet field | Source of truth | Required proof | Failure route |
| --- | --- | --- | --- |
| `case_id` | sealed criterion id | phase 0 envelope reference | scope-stop if absent |
| `claimant_brief` | proof packet and Compiler row | negative proof, positive proof, drift proof, completion proof | repair-and-rerun if incomplete |
| `respondent_objections` | linter writeback, replay packet, blocker ledger | blocker class, evidence handle, severity, route | reviewer-review if unmapped |
| `exhibit_index` | Evidence Escrow | handle, command/source, timestamp, quote/path, replay metadata | custody-gap |
| `state_path` | Execution State Machine | ordered state transitions with transition proof | block transition |
| `arbitration_record` | Trigger arbitration | default route, override if any, final route | block release-ready if missing |
| `judge_order` | Hybrid gate result | release basis or terminal blocker | reject if manually assigned |
| `scope_jurisdiction` | sealed EXECUTE envelope | no upstream mutation, no post-phase-0 question | scope-stopped |

Generated packet shape:

```text
court_packet:
  case_id: <sealed criterion id>
  branch: code/system | research_report | design_artifact
  claimant_brief:
    negative_proof: <handle>
    positive_proof: <handle>
    drift_proof: <handle>
    completion_proof: <handle>
  respondent_objections:
    - blocker_class: <vocabulary class>
      evidence_handle: <handle>
      route: <arbitrated route>
  exhibit_index: <Evidence Escrow handles>
  state_path: <ordered transitions>
  arbitration_record: <Trigger arbitration output>
  judge_order: release-ready | repair-and-rerun | reviewer-review | ld-review | scope-stopped
  release_basis: <Hybrid gate result or blocker reason>
  scope_jurisdiction: pass | scope-stopped
```

Packet generation rules:

1. Generate Court packet only from existing proof packet, Compiler row, linter writeback, state record, replay packet, blocker ledger, Evidence Escrow, and Hybrid result.
2. If any required source is missing, record missing source as blocker; do not fill from executor memory.
3. Reviewer may challenge packet mapping, but cannot add new acceptance criteria.
4. Judge order must match Hybrid gate result or terminal blocker route.
5. Court packet cannot ask user after phase 0.
6. Court packet cannot mutate upstream phase artifacts.
7. `scope-stopped` packet is valid completion of EXECUTE jurisdiction, not hidden failure.
8. Packet is reviewer-facing evidence synthesis, not release authority.

### Execution Contract Court consistency check

This is improvement turn 2 after the Execution Contract Court decision. Because Court packets are generated summaries, EXECUTE needs a consistency check that proves the packet mirrors existing records instead of becoming a parallel truth source.

| Consistency check | Compare | Pass condition | Failure route |
| --- | --- | --- | --- |
| `case-id-match` | Court `case_id` vs sealed criterion id | exact match | scope-stop |
| `proof-handle-match` | claimant proofs vs proof packet and Compiler row | every handle exists and branch proof type matches | custody-gap |
| `objection-route-match` | respondent objections vs blocker ledger and Trigger arbitration | blocker class, severity, route, release effect match | reviewer-review |
| `exhibit-custody-match` | exhibit index vs Evidence Escrow | every exhibit has source/command, timestamp, quote/path, replay metadata | repair-and-rerun |
| `state-order-match` | Court state path vs Execution State Machine | same ordered states and transition proofs | block transition |
| `replay-terminal-match` | judge order vs transition replay packet | terminal order equals replay result | ld-review |
| `hybrid-release-match` | release basis vs Hybrid gate result | release-ready appears only when Hybrid gates pass | reject release claim |
| `jurisdiction-match` | scope jurisdiction vs sealed EXECUTE envelope | no upstream mutation and no post-phase-0 question | scope-stopped |

Consistency protocol:

```text
for each generated Court packet:
  compare case_id to sealed criterion id
  compare claimant proof handles to proof packet and Compiler row
  compare objections to blocker ledger and Trigger arbitration output
  compare exhibits to Evidence Escrow custody fields
  compare state path to Execution State Machine record
  compare judge order to replay terminal state
  compare release basis to Hybrid gate result
  compare jurisdiction to sealed EXECUTE envelope
  if any mismatch exists:
    classify mismatch as blocker
    route through Trigger arbitration
    block Court packet from reviewer handoff until corrected or scope-stopped
```

Mismatch packet:

```text
court_mismatch:
  case_id: <sealed criterion id>
  check_id: <consistency check id>
  expected_record: <source of truth handle>
  court_value: <packet value>
  mismatch_class: case-drift | proof-drift | route-drift | custody-gap | state-drift | replay-drift | release-drift | jurisdiction-breach
  blocker_class: <blocker vocabulary class>
  arbitrated_route: <final route>
  release_effect: block | route-upstream
```

Consistency rules:

1. Court packet is invalid if any source-of-truth record disagrees with it.
2. Court packet mismatch cannot be fixed by editing Court prose alone; source record or generation mapping must explain the correction.
3. Court packet cannot ask user after phase 0 to resolve mismatch.
4. Court packet cannot repair upstream phases to resolve jurisdiction mismatch.
5. `release-ready` mismatch always blocks release claim and reruns Hybrid gate computation.
6. `scope-stopped` mismatch routes upstream and ends EXECUTE jurisdiction for that criterion.
7. Reviewer handoff may include mismatch packet, but must label Court packet non-authoritative until mismatch resolves.
8. Trigger arbitration remains final route authority for every mismatch.

### Rival variation: Execution Flight Recorder

This is the different-variation turn after two Execution Contract Court improvements. Instead of treating EXECUTE as proof pipeline or court case, Execution Flight Recorder treats every criterion as an append-only event stream that can reconstruct how release readiness was reached or blocked.

Core bet: EXECUTE failures hide in lost transitions, overwritten proof, stale reruns, and undocumented arbitration. A flight recorder makes every proof event append-only, replayable, and tamper-evident.

| Event type | Captures | Required fields | Forbidden content |
| --- | --- | --- | --- |
| `criterion-sealed` | phase 0 acceptance item enters EXECUTE | criterion id, branch, mode, sealed source | new or rewritten criteria |
| `negative-proof-recorded` | RED or branch-equivalent proof | handle, timestamp, expected failure, verifier | executor narration only |
| `positive-proof-recorded` | GREEN or branch-equivalent proof | handle, timestamp, command/source/warrant, result | proof without RED lineage |
| `lint-event` | Acceptance Proof Linter result | rule id, predicate result, blocker route | subjective comments without predicate |
| `state-transition` | Execution State Machine move | from, to, transition proof, allowed_next_states | illegal state jump |
| `arbitration-event` | Trigger arbitration decision | default route, override, final route, reason | free-form route outside vocabulary |
| `replay-event` | transition replay result | recomputed terminal state, mismatch class, release effect | unreplayable summary |
| `court-view-generated` | reviewer-facing court packet | source record hashes, consistency check result | manually authored ruling |
| `terminal-order` | criterion exits EXECUTE | release-ready, blocked, repair route, or scope-stopped | release-ready without Hybrid gates |

Append-only event schema:

```text
event_id: <monotonic criterion-local id>
criterion_id: <sealed criterion id>
event_type: <known event type>
branch: code/system | research_report | design_artifact
mode: quick | standard | deep
input_refs: <prior event ids and evidence handles>
output_refs: <new proof, state, route, replay, or court handles>
mechanical_result: pass | fail | blocked | route-upstream
release_effect: proceed | block | route-upstream
hash_prev: <previous event hash>
hash_self: <event hash>
```

Flight Recorder procedure:

```text
for each sealed EXECUTE criterion:
  append criterion-sealed event
  append every proof, lint, state, arbitration, replay, court, and terminal event
  reject any event that rewrites earlier events
  reject release-ready terminal event unless Hybrid gates pass
  replay event stream before final release summary
  if replay diverges from current records:
    classify blocker and route through Trigger arbitration
```

Why this differs from current spine:

1. Current spine is artifact-first: proof packet, Compiler row, state record, replay packet, Court packet.
2. Flight Recorder is event-first: every artifact becomes result of an immutable event sequence.
3. Current spine optimizes gate clarity; Flight Recorder optimizes forensic replay and tamper resistance.
4. Current spine can detect mismatches; Flight Recorder can explain when mismatch entered history.
5. Flight Recorder risks log volume and implementation overhead if used for every quick-mode criterion.

EXECUTE-only guardrails:

1. Recorder starts only after phase 0 envelope seals criterion.
2. Recorder cannot create or alter acceptance criteria.
3. Recorder cannot ask user after phase 0; missing input becomes blocker event.
4. Recorder cannot mutate Contract, Find, Observe, Recombine, or Grill artifacts.
5. Upstream defect becomes `scope-stopped` terminal event with route-upstream effect.
6. `release-ready` event is valid only when Hybrid gate event proves release authority.

Potential adoption shape:

- quick: record only criterion-sealed, compact proof, terminal-order, and escalation events.
- standard: record all proof, lint, arbitration, replay, and terminal events.
- deep: record full stream plus Court generation and consistency-check events for contested criteria.

### LD debate: Hybrid+Compiler+Inference+State+Linter+Court default vs Execution Flight Recorder

This is the debate turn for the Execution Flight Recorder rival variation. The question is not whether event history is useful; it is whether event history should replace the current EXECUTE release spine.

**Affirmative: adopt Flight Recorder as the spine.** The current spine is strong at checking present artifacts, but it can still hide when a bad proof entered the process. Flight Recorder makes every proof, lint, transition, arbitration, replay, court generation, and terminal order append-only. That gives EXECUTE a single chronological truth source, exposes overwritten proof, and makes post-hoc audit stronger than comparing scattered records.

**Negative: keep current spine as release authority.** Flight Recorder explains history, but history is not judgment. It does not by itself infer proof shape, compile obligations, lint proof smells, validate legal state transitions, arbitrate blockers, or prove release gates. If adopted as the spine, EXECUTE risks optimizing for complete logs rather than correct release decisions. It also adds ceremony to quick mode, where compact proof and escalation triggers are enough.

**Cross-examination.**

- Affirmative asks: if current records disagree, how does the spine identify the exact moment of drift?
- Negative answers: replay and consistency checks detect drift; Flight Recorder can improve diagnosis, but diagnosis still routes through Trigger arbitration and Hybrid gates.
- Negative asks: can Flight Recorder decide `release-ready` without Compiler obligations, linter predicates, state validation, and Hybrid gate proof?
- Affirmative answers: no; it can only prove event lineage and replayability. Release judgment still needs existing gates.

**Judge ruling.** Keep Hybrid+Compiler+Inference+State+Linter+Court as the EXECUTE release spine. Adopt Execution Flight Recorder as an append-only audit substrate for standard/deep mode and escalated quick-mode criteria. Recorder events may become source material for replay, Court consistency, and custody checks, but they do not replace proof obligations, lint rules, state legality, Trigger arbitration, or Hybrid release authority.

Operating rule:

```text
for each sealed EXECUTE criterion:
  keep Hybrid+Compiler+Inference+State+Linter+Court as release authority
  append Flight Recorder events when mode or escalation requires event lineage
  reject any event that rewrites criteria or upstream phase output
  route missing phase 0 input or upstream defect as scope-stopped
  use event replay to diagnose drift timing, not to waive gates
  compute release-ready only from Hybrid gate proof and mandatory obligations
  let Trigger arbitration decide final blocker route
```

Non-negotiables:

1. Flight Recorder never creates or edits criteria.
2. Flight Recorder never asks user after phase 0.
3. Flight Recorder never mutates Contract, Find, Observe, Recombine, or Grill artifacts.
4. Flight Recorder cannot release by chronology; `release-ready` requires Hybrid gate proof.
5. Event-stream mismatch is a blocker routed through Trigger arbitration.
6. `scope-stopped` remains valid EXECUTE terminal state for upstream defects.
7. Quick mode records only compact lineage unless escalation triggers fire.

### Comparison: Hybrid+Compiler+Inference+State+Linter+Court default vs Execution Flight Recorder

This is the comparison turn after the Flight Recorder debate. Scores are intentionally non-perfect: both designs solve real EXECUTE problems and both introduce failure modes.

| Criterion | Weight | Hybrid+Compiler+Inference+State+Linter+Court default | Execution Flight Recorder | Winner |
| --- | ---: | ---: | ---: | --- |
| mechanical release authority | 15 | 14 | 7 | Hybrid default |
| event lineage and forensic replay | 14 | 9 | 14 | Flight Recorder |
| proof obligation completeness | 12 | 11 | 8 | Hybrid default |
| blocker routing precision | 11 | 10 | 8 | Hybrid default |
| custody and tamper resistance | 10 | 8 | 10 | Flight Recorder |
| EXECUTE-only boundary safety | 9 | 8 | 8 | tie |
| no-disturbance autonomy | 8 | 8 | 7 | Hybrid default |
| quick-mode ergonomics | 7 | 6 | 4 | Hybrid default |
| reviewer clarity | 7 | 7 | 6 | Hybrid default |
| integration complexity | 7 | 4 | 5 | Flight Recorder |
| **Total** | **100** | **85** | **77** | **Hybrid default as spine** |

**Reading of score.** Flight Recorder wins where EXECUTE needs chronology: finding when drift entered, proving records were not overwritten, and replaying event lineage. It loses where EXECUTE needs release judgment: proof-shape inference, obligation coverage, state legality, and final release gating.

**Best adoption shape.**

- quick: compact lineage only; add full recorder after repeated proof failure or contested evidence.
- standard: record proof, lint, arbitration, replay, and terminal events for active criteria.
- deep: record full stream, Court generation, consistency checks, and mismatch packets.

**Comparison ruling.** Flight Recorder should not replace current spine. It should become an optional-to-required audit substrate by mode and trigger: light in quick, default in standard, full in deep. Hybrid gates remain final release authority; Trigger arbitration remains final route authority; upstream defects still terminate as `scope-stopped`.

### Final decision: Hybrid+Compiler+Inference+State+Linter+Court default vs Execution Flight Recorder

Decision: stay with Hybrid+Compiler+Inference+State+Linter+Court as the EXECUTE release spine. Adopt Execution Flight Recorder as mode-scaled audit substrate, not replacement authority.

**Why this wins.** Current spine makes release decisions; Flight Recorder makes release history replayable. EXECUTE needs both, but release judgment must stay with proof obligations, lint predicates, legal state transitions, replay, Court consistency, Trigger arbitration, and Hybrid gates. Event lineage strengthens those gates only when it feeds them.

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Replace spine with Flight Recorder | strongest chronology, best drift timestamping, tamper-evident record | weak release judgment, high quick-mode overhead, risks log-completeness theater | reject |
| Keep spine and ignore Flight Recorder | lowest complexity, preserves existing release authority | loses forensic drift timing, weaker custody history, harder contested review | reject |
| Keep spine and add mode-scaled Flight Recorder | preserves release authority, adds event lineage, supports Court/replay/custody, adapts by mode | more artifacts in standard/deep, needs event schema discipline | adopt |

**Adopted operating shape.**

```text
phase 0 seals EXECUTE envelope
for each sealed criterion:
  run Hybrid+Compiler+Inference+State+Linter+Court spine as release authority
  if mode is quick:
    record criterion-sealed, compact proof, terminal-order, and escalation events
  if mode is standard:
    record proof, lint, arbitration, replay, and terminal events
  if mode is deep:
    record full stream including Court generation and consistency checks
  if event replay diverges from current records:
    classify blocker and route through Trigger arbitration
  if event implies upstream mutation or missing upstream repair:
    write scope-stopped terminal event with route-upstream effect
  compute release-ready only from Hybrid gate proof and mandatory obligations
```

**Release authority chain.**

1. Acceptance Ledger Compiler defines obligations.
2. Proof Type Inference selects proof shape.
3. Acceptance Proof Linter detects proof smells.
4. Execution State Machine validates legal progress.
5. Transition replay recomputes terminal state.
6. Execution Contract Court presents contested evidence.
7. Flight Recorder proves event lineage and drift timing.
8. Trigger arbitration decides blocker route.
9. Hybrid gates decide `release-ready`.

**Non-negotiables.**

1. Flight Recorder is append-only; no event rewrites earlier proof or criteria.
2. Event chronology is not release proof by itself.
3. No post-phase-0 user asks.
4. No mutation of Contract, Find, Observe, Recombine, or Grill artifacts.
5. Upstream defects become `scope-stopped`, not EXECUTE-local repairs.
6. Mismatch between event stream and current records blocks release until routed.
7. Hybrid gates remain final release authority in every mode.

Next cadence state: decision complete. Repeat cycle with two improvement turns against the adopted spine plus mode-scaled Flight Recorder substrate.

### Flight Recorder event admission gate

This is improvement turn 1 after adopting Flight Recorder as mode-scaled audit substrate. The failure being closed: append-only history is only useful if bad events cannot enter the stream as trusted records.

Admission gate runs before any Flight Recorder event is appended. It validates event shape, lineage, branch scope, mode policy, and release authority boundaries. Failed admission creates a blocker event only when the blocker event itself passes the minimal admission shape; otherwise EXECUTE marks the criterion `blocked` and routes by Trigger arbitration from existing records.

| Admission check | Predicate | Failure class | Route |
| --- | --- | --- | --- |
| `known-event-type` | event type is in Flight Recorder registry | event-shape-gap | repair-and-rerun |
| `criterion-is-sealed` | criterion id exists in phase 0 sealed envelope | scope-drift | scope-stop |
| `branch-matches-envelope` | event branch equals sealed branch | jurisdiction-breach | scope-stop |
| `mode-allows-event` | event type is allowed by quick, standard, or deep policy | mode-policy-breach | reviewer-review |
| `input-refs-exist` | every input ref resolves to prior event or Evidence Escrow handle | custody-gap | repair-and-rerun |
| `monotonic-event-id` | event id increases within criterion stream | event-order-gap | repair-and-rerun |
| `hash-links` | `hash_prev` equals previous accepted event hash | tamper-gap | reviewer-review |
| `no-upstream-mutation` | event does not modify Contract, Find, Observe, Recombine, or Grill | scope-drift | scope-stop |
| `release-authority-fence` | `terminal-order: release-ready` references Hybrid gate proof | self-confirming-proof | repair-and-rerun |
| `no-midstream-question` | event does not depend on user input after phase 0 | no-disturbance-breach | reviewer-review |

Admission protocol:

```text
for each proposed Flight Recorder event:
  validate event_type against registry
  validate criterion_id against sealed EXECUTE envelope
  validate branch and mode against sealed criterion policy
  resolve every input_ref and output_ref allowed by event type
  verify event_id monotonicity and hash_prev linkage
  reject upstream mutation and post-phase-0 user dependency
  if event is release-ready terminal-order:
    require Hybrid gate proof and mandatory obligation coverage
  if admission fails:
    classify blocker and route through Trigger arbitration
    do not append trusted event except minimal blocker record
  if admission passes:
    append event and update hash_self
```

Mode policy:

- quick admits `criterion-sealed`, compact proof, `terminal-order`, and escalation events only.
- standard admits proof, lint, arbitration, replay, and terminal events.
- deep admits full stream including Court view and consistency-check events.
- any mode admits `scope-stopped` terminal event when upstream defect or jurisdiction breach is proven.

Release effect: admission pass only means event can enter lineage. It is not positive proof, not release proof, and not permission to skip Compiler, Linter, State, Replay, Court, Trigger arbitration, or Hybrid gates.

### Flight Recorder replay audit

This is improvement turn 2 after adopting Flight Recorder as mode-scaled audit substrate. The failure being closed: admitted events can still become decorative unless EXECUTE proves the event stream reconstructs the same terminal state as the live proof records.

Replay audit rebuilds criterion state from admitted Flight Recorder events, then compares the rebuilt path to Compiler rows, proof packets, linter writeback, state records, Court packets, Evidence Escrow, and Hybrid gate output. It explains where drift entered history without letting history override release gates.

| Replay check | Rebuild from event stream | Compare against | Failure class | Route |
| --- | --- | --- | --- | --- |
| `sealed-start` | first event is `criterion-sealed` | phase 0 envelope | scope-drift | scope-stop |
| `proof-lineage` | negative and positive proof events in legal order | proof packet and Compiler row | red-green-order-gap | repair-and-rerun |
| `lint-lineage` | lint events match rule registry and predicates | linter writeback | lint-drift | repair-and-rerun |
| `state-lineage` | state-transition events form legal path | Execution State Machine | state-drift | block transition |
| `arbitration-lineage` | arbitration events use vocabulary and final route | Trigger arbitration ledger | route-drift | reviewer-review |
| `court-lineage` | Court generation cites source record hashes | Court packet and consistency check | court-drift | ld-review |
| `custody-lineage` | every referenced evidence handle resolves | Evidence Escrow | custody-gap | repair-and-rerun |
| `terminal-lineage` | terminal event matches recomputed route | replay packet and Hybrid gate output | release-drift | reject release claim |

Replay protocol:

```text
for each criterion with admitted Flight Recorder events:
  load sealed criterion from phase 0 envelope
  sort admitted events by monotonic event_id
  verify hash chain from first event through terminal event
  rebuild proof lineage, lint lineage, state path, arbitration route, and court view
  resolve all Evidence Escrow handles referenced by events
  recompute terminal route from rebuilt lineage
  compare rebuilt route to live replay packet and Hybrid gate output
  if rebuilt lineage diverges from live records:
    locate earliest divergent event
    classify mismatch and route through Trigger arbitration
    block release-ready until repair, reviewer, LD, or scope-stop route resolves
  if rebuilt lineage matches live records:
    mark Flight Recorder replay as custody support only
```

Replay packet:

```text
flight_replay:
  criterion_id: <sealed criterion id>
  mode: quick | standard | deep
  event_count: <admitted event count>
  hash_chain: pass | fail
  rebuilt_state_path: <ordered states>
  rebuilt_route: continue | repair-and-rerun | reviewer-review | ld-review | scope-stop | release-ready
  live_route: <route from current records>
  earliest_divergence: none | <event_id>
  divergence_class: none | proof-drift | lint-drift | state-drift | route-drift | court-drift | custody-gap | release-drift | scope-drift
  arbitrated_route: <Trigger arbitration result>
  release_effect: proceed | block | route-upstream
```

Mode scaling:

- quick replay audits only compact lineage and escalation events.
- standard replay audits every admitted proof, lint, arbitration, replay, and terminal event.
- deep replay audits full event stream plus Court generation and consistency checks.

Release effect: Replay pass strengthens custody and forensic confidence, but does not release criterion. Replay fail blocks or routes. `release-ready` still requires Hybrid gate proof, filled mandatory obligations, and no unresolved Trigger arbitration blocker.

### Rival variation: Execution Proof Firewall

This is the different-variation turn after two Flight Recorder improvements. Instead of treating EXECUTE as proof pipeline, court case, or event stream, Execution Proof Firewall treats EXECUTE as a boundary appliance: every proof artifact must pass strict ingress, internal, and egress filters before it can influence release state.

Core bet: EXECUTE failures often happen when invalid proof crosses a boundary too early: upstream assumptions enter as criteria, executor narrative enters as evidence, reviewer opinion enters as gate result, or release summary exits before mechanical proof is complete. Firewall design makes every boundary crossing explicit and deny-by-default.

| Firewall zone | Allows | Denies | Failure route |
| --- | --- | --- | --- |
| `ingress` | sealed phase 0 criteria, branch, mode, accepted verification command | rewritten criteria, upstream repair requests, post-phase-0 questions | scope-stop or reviewer-review |
| `proof-intake` | negative proof, positive proof, drift proof, completion proof with handles | executor narration, stale command output, unsupported claims, warrantless design choices | repair-and-rerun |
| `proof-transform` | Compiler obligations, proof type inference, linter predicates, state transitions | proof shape guessing, skipped RED equivalent, illegal state jump | block transition |
| `adversarial-review` | reviewer packets, LD ballots, Court views generated from records | free-form reviewer authority, new criteria, upstream edits | ld-review or scope-stop |
| `lineage` | admitted Flight Recorder events and replay packets | rewritten event history, broken hash chain, unowned evidence handle | reviewer-review |
| `egress` | release summary derived from Hybrid gates and resolved blockers | release-ready by assertion, unresolved blockers, scope drift hidden as success | reject release claim |

Firewall packet:

```text
proof_firewall:
  criterion_id: <sealed criterion id>
  branch: code/system | research_report | design_artifact
  mode: quick | standard | deep
  zone: ingress | proof-intake | proof-transform | adversarial-review | lineage | egress
  input: <artifact or evidence handle attempting to cross zone>
  allow_rule: <mechanical rule id>
  deny_rule: <mechanical rule id or none>
  decision: allow | deny | quarantine
  blocker_class: <blocker vocabulary class or none>
  route: continue | repair-and-rerun | reviewer-review | ld-review | scope-stop | reject release claim
  release_effect: proceed | block | route-upstream
```

Firewall procedure:

```text
for each sealed EXECUTE criterion:
  pass phase 0 inputs through ingress zone
  pass proof handles through proof-intake zone
  pass derived records through proof-transform zone
  pass reviewer and Court packets through adversarial-review zone
  pass Flight Recorder events through lineage zone
  pass release summary through egress zone
  if a zone denies crossing:
    quarantine artifact from release calculation
    classify blocker and route through Trigger arbitration
    never ask user after phase 0
    never mutate upstream artifacts
  if all required zones allow:
    continue to Hybrid gate release authority
```

Why it differs from current spine:

- Current spine is obligation-first: compile, infer, lint, state, replay, review, decide.
- Flight Recorder is event-first: append, hash, replay, locate drift.
- Proof Firewall is boundary-first: deny invalid artifacts from crossing into release authority.
- Current spine explains what proof is required.
- Firewall explains what proof is forbidden from influencing release.

EXECUTE-only guardrails:

1. Firewall starts only after phase 0 envelope seals criterion.
2. Firewall cannot create, edit, or delete acceptance criteria.
3. Firewall cannot ask user after phase 0; missing data becomes denied crossing.
4. Firewall cannot repair Contract, Find, Observe, Recombine, or Grill.
5. Upstream defect becomes `scope-stopped` or `route-upstream`, never EXECUTE-local repair.
6. Firewall allow decision is not release proof; Hybrid gates remain final authority.

Potential adoption shape:

- quick: ingress, proof-intake, and egress filters only unless escalation triggers fire.
- standard: all zones active for every non-trivial criterion.
- deep: all zones active plus adversarial attempts to smuggle invalid proof across each boundary.

### LD debate: Hybrid+Compiler+Inference+State+Linter+Court+Flight Recorder default vs Execution Proof Firewall

This is the debate turn for the Execution Proof Firewall rival variation. The question is not whether deny-by-default boundaries help; it is whether boundary filtering should replace the current EXECUTE release spine.

**Affirmative: adopt Proof Firewall as the spine.** The current spine has many strong gates, but invalid proof can still appear inside the system before later gates reject it. Firewall moves the strongest control to every boundary: ingress, proof intake, proof transform, adversarial review, lineage, and egress. Deny-by-default makes release contamination harder because bad artifacts never become trusted inputs for release calculation.

**Negative: keep current spine as release authority.** Firewall is excellent at excluding invalid artifacts, but exclusion is not construction. It does not compile proof obligations, infer proof shape, build RED/GREEN equivalents, validate legal state progress, replay accepted lineage, or decide contested evidence. If Firewall becomes the spine, EXECUTE risks becoming a checkpoint maze that blocks bad proof but cannot prove good work is complete.

**Cross-examination.**

- Affirmative asks: if an executor narrative enters proof packet before linter catches it, has contamination already shaped later records?
- Negative answers: yes, and Firewall can reduce that risk as an early intake filter; but release still depends on Compiler, Linter, State, Replay, Court, Recorder, Trigger arbitration, and Hybrid gates.
- Negative asks: can Firewall produce a complete proof packet for code/system, research_report, or design_artifact?
- Affirmative answers: no. Firewall can allow or deny boundary crossings; it cannot generate branch-specific negative, positive, drift, and completion proof.
- Affirmative asks: does current spine have a single named place where forbidden proof influence is rejected before transformation?
- Negative answers: not as one explicit model. That is Firewall's useful contribution: a boundary policy layer before and between existing gates.

**Judge ruling.** Keep Hybrid+Compiler+Inference+State+Linter+Court+Flight Recorder as the EXECUTE release spine. Adopt Execution Proof Firewall as deny-by-default boundary layer around the spine: ingress before criteria enter EXECUTE, proof-intake before proof becomes obligations, proof-transform before derived records affect state, adversarial-review before reviewer/Court outputs influence routing, lineage before Recorder events affect replay, and egress before release summary leaves EXECUTE.

Operating rule:

```text
for each sealed EXECUTE criterion:
  keep current spine as release authority
  run Proof Firewall zones before each boundary crossing
  quarantine denied artifacts from release calculation
  map denied crossings to blocker vocabulary
  route denied crossings through Trigger arbitration
  never ask user after phase 0
  never mutate upstream phase output
  compute release-ready only from Hybrid gate proof and mandatory obligations
```

Non-negotiables:

1. Firewall cannot create or edit criteria.
2. Firewall cannot repair upstream phases.
3. Firewall cannot release by allow decision.
4. Denied crossing is blocker evidence, not proof deletion.
5. Quarantined artifacts may be shown in reviewer or Court packets as rejected evidence.
6. `scope-stopped` remains correct terminal route for upstream defects.
7. Hybrid gates remain final release authority; Trigger arbitration remains final route authority.

### Decision rule

Default path: Hybrid escrow plus triggered LD. This is improvement turn 1 in the next 2-1-1-1 cycle: the rule now routes custody, replayability, Black-box Lab, and Failure Injection Board evidence before release.

```text
if explicit_local_deterministic_criteria and gates_pass and no_breaker_tripped:
  use quick proof and exit EXECUTE
else if phase_0_input_missing:
  stop with EXECUTE blocked format
else if mechanical_gate_fails:
  repair EXECUTE artifact and rerun gate
else if scope_drift_detected:
  stop and route to correct upstream phase
else if custody_gap_detected:
  restore RED-before-repair, GREEN-after-repair, drift-after-GREEN order or block
else if proof_replayability_fails:
  fill replay gap with fresh evidence or stop with EXECUTE blocked format
else if escrow_slot_open:
  fill missing proof or stop with blocker
else if black_box_lab_trigger_fires:
  run sealed-envelope probes and treat counterexamples as proof gaps or repair breaker evidence
else if failure_injection_trigger_fires:
  run sealed failure injection and record immunity, repair, block, or escalation verdict
else if reviewer_has_blocking_issue and gates_pass and deep_mode:
  run Trial Court appeal on reviewer blocker
else if reviewer_has_blocking_issue:
  tune decisive blocker and rerun gate
else if ld_trigger_fires:
  run LD audit and tune decisive warrants
else if trial_court_trigger_fires and deep_mode:
  run Trial Court appeal using sealed evidence only
else:
  exit EXECUTE with acceptance proof
```

Decision precedence:

1. missing phase-0 input, failed mechanical gate, and scope drift block release before any debate,
2. custody and replayability gaps block release before escrow completion claims,
3. escrow gaps are repaired before reviewer, LD, Trial Court, Black-box Lab release claims, or Failure Injection Board release claims,
4. Black-box Lab validates artifact behavior when proof is self-confirming, reviewer-contested, mock-heavy, or high-risk,
5. Failure Injection Board hardens proof after structure exists, especially after RED disputes, replay gaps, repeated repairs, or Black-box counterexamples,
6. LD resolves strategy or warrant conflict during EXECUTE,
7. Trial Court is deep-mode appeal for contested release after proof is otherwise complete,
8. quick mode never uses Trial Court unless user explicitly selected deep-mode audit.

Risk tier thresholds:

| Risk tier | Minimum judge score | Extra condition |
| --- | ---: | --- |
| low | 75 | no critical risks, no custody gap, no replay blocker |
| medium | 85 | no high unresolved risks, lab triggers cleared or documented unnecessary |
| high | 92 | reviewer approval plus clean mechanical gates, replayable proof, and cleared adversarial triggers |

### Anti-patterns

- Auditing phases other than EXECUTE in this companion workflow.
- Treating LD score as proof when gates failed.
- Asking user after phase 0 for ordinary implementation choices.
- Using debate to rewrite acceptance criteria instead of re-entering upstream phases.
- Testing mocks instead of behavior.
- Adding production hooks only to satisfy tests.
- Producing plans with placeholders, TODOs, or hidden context.
- Running unbounded debate after scores plateau.
- Reporting done without fresh command output.
- Creating separate artifacts when quick-mode compact proof is enough.
- Keeping implementation written before RED evidence.
- Filling escrow slots with summaries instead of command, audit, or reviewer evidence.

Anti-ceremony guard:

```text
if audit_artifact_does_not_change_decision and gate_evidence_is_clear:
  collapse it into compact proof
else:
  keep separate artifact
```

## Next

1. Replace shallow companion draft with this EXECUTE-only audit workflow.
2. Add schema or test coverage only if this workflow becomes machine-read by FORGER tools.
3. Run `npm test` from `framework/forger`.
4. Run `npm run validate:schemas` from `framework/forger`.
5. If adopted into skills, patch only EXECUTE phase files and keep mechanical gates authoritative.
