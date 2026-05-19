Parent: ARCHITECTURE.md

# Why This Variation — Premortem Failure Oracle v79

## Status

v79. Search-first, browser-read, failure-anticipation gated.

## Scope

This variation extends v78 by moving failure learning earlier. Instead of waiting for after-action review, it asks what would make the synthesis fail before the answer is finalized.

## Evidence

- Atlassian premortem page was opened with `playwright-cli`; visible title confirmed the source.
- Atlassian text said a premortem helps teams prepare for every twist and turn before a project starts.
- Atlassian text instructed teams to consider what could go wrong and what could go right.
- Atlassian text said risk data such as cost or time should be added when available.
- HBR Project Premortem page was opened with `playwright-cli`; visible title confirmed the source.
- HBR text said projects fail at a spectacular rate.
- HBR text said too many people are reluctant to speak up during planning.
- HBR text said safe dissent by knowledgeable people can improve a project’s chance.
- Asana premortem page was opened with `playwright-cli`; visible title confirmed updated 2025 source.
- Asana text said imagining the project has failed helps brainstorm honestly without overconfidence.
- Asana text said cross-functional partners identify risks from different perspectives.

## Rationale

reTruth’s biggest enemy is plausible success language hiding fragile assumptions. Premortem Failure Oracle forces the framework to attack its own likely failure before presenting confidence. This matches the user’s concern that AI can waste days on ideas that sound creative but do not work.

The variation also complements v78. v78 learns after a run; v79 predicts failure before final synthesis. Together they create a before-and-after correction loop.

## Tradeoff

Better risk discovery and stronger dissent handling, but more adversarial overhead. If overused, premortems can slow low-risk scans or over-weight unlikely risks.

## Next

1. Add risk severity scoring after calibration: likelihood, impact, detectability, reversibility.
2. Pair with Need-to-Knowledge Broker so solution-first failure modes are caught early.
3. Pair with Community lane repo checks to verify whether imagined implementation failures already happened in real projects.
