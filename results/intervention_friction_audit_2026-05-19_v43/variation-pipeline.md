# Variation Pipeline — Intervention Friction Audit

Parent: ARCHITECTURE.md

## Status
Created v43 variation centered on converting theoretical intervention value into friction-adjusted action value.

## Pipeline
1. Parse brief into proposed intervention, claimed upside, adoption surface, implementation prerequisites, coordination actors, operational load, switching costs, maintenance burden, and friction-induced failure modes.
2. Spawn three isolated lanes.
3. Force each lane to emit friction cards instead of generic findings.
4. Validate friction source, benefit erosion mechanism, recommendation, source, quote, measurement needed, decision impact, and confidence.
5. Audit URLs, quote matches, friction labeling consistency, and Edge redundancy.
6. Build friction map:
   - adoption friction
   - coordination friction
   - migration friction
   - compliance friction
   - training friction
   - tooling friction
   - maintenance friction
   - incentive friction
   - measurement friction
   - rollback friction
7. Synthesize after adjusting claimed benefit by friction cost and rollout risk.
8. Re-fan only when one friction class controls whether current action should proceed.

## WHY
Intervention Friction Audit improves reTruth by challenging recommendations at the point where plans meet deployment. Many interventions are evidence-supported but lose value through poor uptake, high coordination cost, training load, compliance burden, maintenance drag, or incentive mismatch.

## Difference From Original
Original architecture evaluates evidence strength and lane convergence. Intervention Friction Audit evaluates survivability through adoption and operation, making implementation cost first-class evidence rather than a late caveat.

## Expected Benefit
- Fewer recommendations that work only on paper.
- Better staging and rollback guidance.
- More realistic adoption plans.
- Clearer distinction between evidence-supported and deployable.

## Tradeoff
Can make recommendations more conservative. Best for organizational change, policy design, product rollouts, technical migrations, process interventions, and safety-critical adoption; less useful for low-friction factual decisions.

## Main Risk
Over-penalizing interventions before adaptation or staged rollout can reduce friction. Mitigation: every friction downgrade must include a redesign, staging, or measurement path when plausible.

## Next Variation Ideas
1. Temporal Drift Tracker: monitor how fast evidence relevance decays after publication or deployment.
2. Confidence Budget Allocator: spend research effort only where uncertainty changes action.
3. Implementation Surface Minimizer: redesign recommendations to reduce required actors, steps, and dependencies.
