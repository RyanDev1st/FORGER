# Demos

Concrete walkthroughs of each phase using one continuous example: building a real-time facial emotion classifier for iOS. Same example you saw teased in the README, here in full.

These transcripts are abridged for readability. Real runs are longer (FIND alone produces 30+ ledger entries in standard mode). Where commands or YAML are shown, they are real — copy-paste runnable inside an active FORGER workspace.

---

## The seed prompt

```
forger run "Build a real-time facial emotion classifier for iOS"
```

Everything below is what happens inside that one command.

---

## CONTRACT demo

### User prompt
> Build a real-time facial emotion classifier for iOS.

### What FORGER does

The CONTRACT agent does not start coding. It scans the prompt for vagueness and finds five things:

1. **Unclear artifact type.** "Classifier" — Swift package? Standalone app? Core ML model file? Server with iOS client?
2. **Missing latency target.** "Real-time" — 30fps? 60fps? Anything under 200ms?
3. **Ambiguous accuracy bar.** No mention of which dataset or which threshold.
4. **Unstated constraints.** On-device or cloud-backed? iOS version floor? iPad? VisionOS?
5. **Missing failure modes.** What is the worst thing the classifier could do?

### Clarification dialogue (interactive mode)

```
> The emotion classifier — what gets installed at the end?
  [a] A Swift Package that exposes a `classify(image:) -> Emotion` API
  [b] A standalone demo app
  [c] A Core ML model file + minimal sample code
  [d] Something else
< a

> Latency budget. Real-time can mean many things.
  [a] <16ms (60fps target)
  [b] <33ms (30fps target)
  [c] <100ms (per-frame, with frame skipping allowed)
  [d] <500ms (single shot per user action)
< c

> Hardware floor. What is the oldest iPhone this must run on?
  [a] iPhone 13 (A15)
  [b] iPhone 15 (A17)
  [c] iPhone 11 (A13)
  [d] Don't care
< a

> Privacy. Network access during inference?
  [a] Strict on-device, zero network
  [b] On-device default, opt-in cloud fallback
  [c] Cloud-only
< a

> Accuracy bar. Which dataset and what threshold?
  [a] FER+ test set, ≥0.70
  [b] AffectNet-8, ≥0.65
  [c] Your own labelled set (provide path)
  [d] Don't care, ship the demo
< a

> One unacceptable failure mode I want to lock in:
  Crash on any input image regardless of resolution. OK to lock?
< yes

> Another: classifier outputs the same label for >70% of distinct test images
  (collapsed output). Lock this too?
< yes
```

### Reframe memo

Before finalising, CONTRACT writes:

```markdown
# Reframe memo — 2026-05-22

## Original framing
On-device Core ML facial emotion classifier, FER+ ≥0.70 accuracy, <100ms p95,
iPhone 13+.

## Alternative framing considered
Apple Vision facial landmark detection + rule-based action-unit → emotion
mapping. Zero ML training. Smaller binary. Tier-1 grounded path (Vision is
documented, Action Units are well-studied).

## Trade-off
- ML path: better generalisation, larger binary (~25 MB), slower to ship
- Vision+rules: smaller (~0 MB extra), faster to ship, lower accuracy ceiling

## Decision
User picked ML path. Reframe documented and rejected with reason:
"User explicitly wants ML pipeline for portfolio reasons."

If EXECUTE fails on size or accuracy, this memo is the fallback.
```

### Output: Definition of Works

```yaml
# .forger/workspaces/emotion-2026-05-22/definition_of_works.yaml
artifact:
  type: code
  language: swift
  package: swift-package
  description: "Swift Package exposing classify(image:) -> Emotion for on-device real-time facial emotion classification"

audience:
  who: "Indie iOS developer building a journaling app"
  use_case: "Tag journal entries with coarse emotion label"

hard_constraints:
  - id: c1
    rule: "Zero network calls during inference"
    verification: "Network proxy logs zero outbound traffic during 60s session"
  - id: c2
    rule: "p95 latency under 100ms on iPhone 13"
    verification: "XCTest performance run, 1000 frames"
  - id: c3
    rule: "Runs on iOS 17+, iPhone 13+"
    verification: "CI matrix"

success_criteria:
  - id: s1
    metric: "Accuracy on FER+ test set"
    threshold: ">= 0.70"
    test_method: "scripts/eval_fer_plus.swift"
  - id: s2
    metric: "Model file size"
    threshold: "< 30 MB"
    test_method: "stat artifact/Models/emotion.mlmodel"

unacceptable_failure_modes:
  - id: u1
    rule: "Crash on any image input regardless of resolution"
  - id: u2
    rule: "Collapsed output: same label for >70% of distinct test inputs"

work_mode: standard

reframe:
  alternative: "Apple Vision landmark + Action Unit → rule-based emotion mapping"
  status: rejected
  reason: "User wants ML pipeline for portfolio; reframe noted for fallback"
```

The DoW is now signed. Every subsequent phase reads from it.

---

## FIND demo

### What FORGER does

FIND opens two parallel lanes (Production and Community in standard mode). Each lane is a subagent driving `playwright-cli` with `cloakbrowser`.

Production lane targets queue:
- Apple developer docs for Core ML and Vision
- Papers on facial emotion recognition from 2024–2026
- GitHub repos with CI badges and recent commits

Community lane targets queue:
- GitHub Issues on FER libraries (DeepFace, fer, RMN)
- Stack Overflow threads on Core ML quantisation
- Reddit r/MachineLearning + r/iOSProgramming threads

### Sample source ledger entries

```yaml
# .forger/workspaces/emotion-2026-05-22/source_ledger.yaml
- id: src-1
  lane: production
  url: https://developer.apple.com/documentation/coreml/converting-trained-models-to-core-ml
  domain: developer.apple.com
  fetched_at: 2026-05-22T10:14:22Z
  authority: high
  recency: 2025-11
  reproducibility: verified
  independence: original
  conflict_of_interest: low
  relevance: implementation_blueprint

- id: src-7
  lane: community
  url: https://github.com/serengil/deepface/issues/1207
  domain: github.com
  fetched_at: 2026-05-22T10:16:08Z
  authority: high       # repo with active CI, named maintainers
  recency: 2025-11
  reproducibility: verified
  independence: original
  conflict_of_interest: low
  relevance: critical_gotcha

- id: src-14
  lane: production
  url: https://arxiv.org/abs/2403.11215
  domain: arxiv.org
  fetched_at: 2026-05-22T10:19:41Z
  authority: medium     # not peer-reviewed yet
  recency: 2024-03
  reproducibility: claims_only   # no code released
  independence: original
  conflict_of_interest: low
  relevance: benchmark_comparison
```

### Sample claim ledger entries

```yaml
# .forger/workspaces/emotion-2026-05-22/claim_ledger.yaml
- id: cl-3
  source_id: src-7
  quote: "FER backend returns logits, not softmaxed probabilities."
  severity_for_dow: critical    # affects s1 (accuracy measurement)
  entailment: directly_supported
  affects: [s1]
  notes: "If we use FER backend as a baseline comparison, must apply softmax before metric."

- id: cl-9
  source_id: src-14
  quote: "MobileNetV3-Small reaches 71.2% on FER+ with 8-bit quantisation at 28 MB."
  severity_for_dow: high       # affects s1 and s2
  entailment: weakly_supported  # arxiv, no released code
  affects: [s1, s2]
  notes: "Numbers from paper without released code. Treat as hint, not commitment."

- id: cl-22
  source_id: src-1
  quote: "Use coremltools.optimize.coreml.linear_quantize_weights for post-training quantisation"
  severity_for_dow: high
  entailment: directly_supported
  affects: [s2]
```

### Audit hook output

```
$ .forger/hooks/audit.sh
Checking 27 sources, 41 claims...

✓ 27/27 URLs live (HEAD 200)
✓ 39/41 verbatim quotes located in page text
⚠ 2/41 quotes not found (likely JS-rendered):
    - cl-18 src-23 (medium.com — JS-rendered article)
    - cl-31 src-29 (notion.so — JS-rendered doc)

⚠ 1 critical claim has weakly_supported entailment:
    - cl-9 (source: arxiv preprint, no code released)
    → GATE FAILURE: critical claims cannot be weakly_supported

Action required: either downgrade cl-9 severity (find direct evidence)
or escalate.
```

The agent downgrades cl-9 from `critical` to `high` because the FER+ accuracy of 71.2% is not load-bearing for the DoW (which requires ≥0.70 measured on the actual model, not borrowed from a paper). cl-9 becomes a hint for RECOMBINE, not a constraint.

### Output

- `source_ledger.yaml` — 27 entries
- `claim_ledger.yaml` — 41 entries (3 critical, 8 high, 14 medium, 12 low, 4 trivial)
- `ground_truth_brief.md` — draft summary

Pipeline advances to OBSERVE.

---

## OBSERVE demo

### What FORGER does

OBSERVE reads the ledgers and writes a risk map. Every assumption needed for EXECUTE is listed with severity.

### Risk map excerpt

```yaml
# .forger/workspaces/emotion-2026-05-22/risk_map.yaml
- id: rm-1
  assumption: "MobileNetV3-Small at int8 fits under 30MB"
  severity: high
  resolution_required: probe
  status: open

- id: rm-2
  assumption: "Core ML quantised inference runs <100ms p95 on iPhone 13"
  severity: critical
  resolution_required: probe + acceptance
  status: open

- id: rm-3
  assumption: "FER+ labels map cleanly to 7 standard emotions (no ambiguity)"
  severity: medium
  resolution_required: source + reasoning
  status: resolved
  resolution: "cl-12 confirms FER+ uses 8 labels (7 emotions + neutral)"

- id: rm-4
  assumption: "Sustained 30fps video does not thermal-throttle the model"
  severity: critical
  resolution_required: probe + acceptance
  status: open
```

### Probes

The agent writes probes for rm-1, rm-2, rm-4.

```swift
// .forger/probes/probe_rm-1.swift
// Goal: confirm MobileNetV3-Small quantised to int8 fits under 30MB

import Foundation
import CoreML

let modelURL = URL(fileURLWithPath: "Models/mobilenetv3_small_int8.mlmodelc")
let attrs = try FileManager.default.attributesOfItem(atPath: modelURL.path)
let size = attrs[.size] as! Int
print("MODEL_SIZE_BYTES=\(size)")
print(size < 30 * 1024 * 1024 ? "PASS" : "FAIL")
```

```bash
# .forger/probes/probe_rm-2.sh
xcrun simctl boot "iPhone 13"
xcodebuild test -scheme EmotionClassifier \
  -destination "platform=iOS Simulator,name=iPhone 13" \
  -only-testing:EmotionClassifierTests/PerfTests/testP95LatencyUnder100ms
```

### Probe results

```jsonl
{"probe":"rm-1","ts":"2026-05-22T10:42:11Z","status":"PASS","model_size_bytes":24117248,"note":"23.0 MB, under 30MB cap"}
{"probe":"rm-2","ts":"2026-05-22T10:45:33Z","status":"PASS","p95_ms":78,"p99_ms":94,"n":1000}
{"probe":"rm-4","ts":"2026-05-22T10:55:17Z","status":"PASS","duration_s":300,"thermal_state":"nominal","p95_ms":81}
```

All three critical/high assumptions pass. Probe gate green.

### Output

- `risk_map.yaml` — every assumption resolved
- `probe_results.jsonl` — three passed probes
- `ground_truth_brief.md` — final version with mechanism summary

---

## RECOMBINE demo

### What FORGER does

RECOMBINE assembles the verified elements into a concrete proposal. Speculative ideas are sent to Tier 2/3.

### Tier 1 proposal (excerpt)

```markdown
# Tier 1 Proposal: emotion classifier

## Architecture
- Input: CMSampleBuffer from AVCaptureSession at 30fps
- Pipeline:
  1. Vision VNDetectFaceRectanglesRequest → bounding box (cl-22, cl-23)
  2. Crop + resize to 192×192 (probe rm-2 confirmed this resolution hits p95)
  3. Core ML model: MobileNetV3-Small, int8 quantised (probe rm-1)
  4. Softmax → argmax → Emotion enum
- Output: Emotion (.happy, .sad, .angry, .fear, .surprise, .disgust, .neutral, .contempt)

## Mechanism-fit checks
- Vision face detection is documented for video pipelines (src-3, src-5)
- Core ML int8 quantisation is documented for MobileNet family (src-1, src-11)
- 192x192 input is below MobileNetV3 default but probe rm-2 confirmed accuracy holds

## Source lineage
- Base architecture: src-14 (MobileNetV3 FER paper, downgraded but still a hint)
- Quantisation procedure: src-1 (Apple coremltools docs)
- Face detection: src-3 (Apple Vision docs)
- FER+ training pipeline: src-19 (active GitHub repo with CI)

## What is NOT included
- See tier2.md for: ensemble with two models, online learning, action-unit fusion
- See tier3.md for: train custom architecture from scratch
```

### Tier 2 file (excerpt)

```markdown
# Tier 2 — Frontier Speculation (FIREWALLED)

These ideas extend beyond direct evidence. Cannot enter EXECUTE without a
completed validation plan.

## T2-1: Two-model ensemble (MobileNetV3 + MobileViT)
- Hypothesis: ensembling two quantised models stays under 30MB combined
  and gains +3-5% accuracy
- Evidence so far: paper (not in our ledger), one HN thread
- Validation plan: train both models, measure size + accuracy, check against s1/s2
- Status: NOT validated. Will not enter EXECUTE.
```

### Output

- `proposals/tier1.md` — the executable plan
- `proposals/tier2.md` — speculative, firewalled
- `proposals/tier3.md` — empty for this task (no transformational ideas surfaced)

Pipeline advances to GRILL.

---

## GRILL demo

### What FORGER does

The reviewer router picks a model from a different family than the executor. If the executor is Claude, the reviewer might be GPT or Gemini. The reviewer reads `tier1.md` plus the ledgers and tries to break the proposal.

### Reviewer output (abridged)

```markdown
# Review report — reviewer: gpt-5-pro (cross-family)

## Stance
Hostile. Attempting to identify failure modes.

## Concerns

### FH-1 — Thermal throttling under sustained capture
The probe in rm-4 ran for 300 seconds on a cool device. Real users open the
journaling app after a workout, in a car in summer, etc. Probe did not test
elevated-temperature start conditions.

What would make it fail: device starts at thermal state .fair or .serious.
Evidence required: probe rerun with device pre-heated (run benchmark loop
for 5 minutes first, then start the 300s test).
Severity: critical (kills c2 latency invariant under realistic conditions).
Confidence: medium-high.

### FH-2 — Face detection on dark / partially occluded faces
The Tier-1 plan uses VNDetectFaceRectanglesRequest. Apple's docs do not
guarantee detection on faces below a certain pixel area or under heavy
occlusion (masks, glasses-glare, side angles). If detection fails, classifier
silently outputs neutral.

What would make it fail: input frames where Vision returns zero faces.
Acceptance check: test set of 100 hard images (low light, masks, profile,
sunglasses); measure detection rate.
Severity: high (affects u2 — collapsed output failure mode).
Confidence: high.

### FH-3 — Class imbalance in FER+ skews benchmark
FER+ has heavy imbalance (happy/neutral dominate). 0.70 accuracy can be
reached by a model that always predicts happy. The DoW (u2) bans collapsed
output but the success metric (s1) does not.

What would make it fail: model passes s1 but fails u2.
Acceptance check: per-class accuracy reporting, with the worst class
required to be ≥ 0.50.
Severity: critical (the model would satisfy s1 and violate u2).
Confidence: high.
```

### Resolution

```yaml
# failure_hypotheses.yaml — after executor resolution
- id: fh-1
  status: accepted
  resolution: "Add probe + acceptance test: rerun rm-4 with device pre-heated"
  new_test_id: t-rm-4b

- id: fh-2
  status: accepted
  resolution: "Add hard-image test set (100 images) to acceptance suite"
  new_test_id: t-fh-2

- id: fh-3
  status: accepted
  resolution: "Add per-class accuracy reporting + per-class threshold of 0.50"
  new_test_id: t-fh-3
```

The acceptance suite grows from 12 tests to 15. Pipeline advances to EXECUTE.

---

## EXECUTE demo

### TDD micro-cycle transcript (abridged)

```
[2026-05-22T11:02:14Z] Cycle 1
  test: model loads in <2s on cold start
  written: EmotionClassifierTests/testColdStartUnder2s.swift
  result: FAIL (cold load = 4.3s)
  fix attempt 1: lazy-init the Core ML config
  result: PASS (cold load = 1.1s)
  delta: cold start budget met

[2026-05-22T11:08:51Z] Cycle 2
  test: p95 latency <100ms on iPhone 13, 30s sustained
  written: EmotionClassifierTests/testP95Latency.swift
  result: PASS (p95 = 78ms)
  delta: matches probe rm-2

[2026-05-22T11:14:32Z] Cycle 3
  test: 5-min sustained run with pre-heated device (t-rm-4b)
  result: FAIL (p95 = 142ms after 4 min, thermal_state = .serious)
  fix attempt 1: drop input 192→160
  result: PASS (p95 = 71ms sustained)
  delta: input resolution lowered; accuracy re-checked next cycle

[2026-05-22T11:23:17Z] Cycle 4
  test: FER+ accuracy >= 0.70 at 160x160 input
  result: FAIL (accuracy = 0.67)
  fix attempt 1: increase training epochs (offline retrain)
  fix attempt 2: add light augmentation
  result: FAIL (0.68)
  fix attempt 3: web-search "MobileNetV3 FER+ 160 input accuracy"
    → src-31 (StackOverflow): use mixup augmentation
  result: PASS (0.71)
  delta: cycle 3 + 4 trade-off resolved; 160x160 input + mixup

[2026-05-22T12:11:08Z] Cycle 5
  test: per-class accuracy, worst class >= 0.50 (t-fh-3)
  result: FAIL (disgust class = 0.43)
  fix attempt 1: class-weighted loss
  result: PASS (disgust = 0.56)

[2026-05-22T12:24:55Z] Cycle 6
  test: hard-image detection rate (t-fh-2)
  result: FAIL (62% detection on hard set)
  fix attempt 1: add VNDetectFaceLandmarksRequest as fallback
  result: PASS (89% detection)

[2026-05-22T12:38:11Z] Final acceptance suite: 15/15 GREEN
```

### Acceptance report

```yaml
# acceptance_report.md (excerpt)
status: GREEN
suite_size: 15
passed: 15
failed: 0
skipped: 0

by_source:
  dow_success_criteria: 2/2
  dow_hard_constraints: 3/3
  dow_unacceptable_failure_modes: 2/2
  failure_hypothesis_tests: 3/3
  regression_tests: 0/0   # first run in this domain
  internal_tdd_tests: 5/5

artifact:
  path: artifact/EmotionClassifier/
  size_mb: 26.4
  swift_package_version: 0.1.0

trace:
  every_test_to_dow:
    s1 → t-s1, t-fh-3, t-rm-4b
    s2 → t-s2
    c1 → t-c1
    c2 → t-c2, t-rm-4b
    c3 → t-c3
    u1 → t-u1
    u2 → t-u2, t-fh-2, t-fh-3
```

Done Means Ran rule satisfied. Pipeline advances to RETAIN.

---

## RETAIN demo

### What gets persisted

```yaml
# knowledge/ios-emotion-classification/working_architectures.md
- name: "MobileNetV3-Small + Vision two-stage detection"
  ttl: 2027-05-22
  artifact_reference: workspaces/emotion-2026-05-22/artifact
  version_pins:
    coremltools: 8.1
    ios_minimum: 17.0
    iphone_minimum: 13
  key_choices:
    - input_resolution: 160x160     # learned in cycle 3, lowered from 192x192
    - quantisation: int8 linear
    - face_detection: rectangles + landmarks fallback   # learned from FH-2
    - training_augmentation: mixup   # learned in cycle 4
  acceptance_suite_path: workspaces/emotion-2026-05-22/EmotionClassifierTests
```

### Failure memory

```yaml
# knowledge/ios-emotion-classification/failure_memory.yaml
- assumption: "192x192 input survives sustained capture"
  proved_wrong_at: cycle-3
  evidence: "Thermal throttle at 4 min on pre-heated iPhone 13"
  lesson: "For sustained on-device inference, leave thermal headroom: target p95 under 80ms on cool device"
  affects_future_runs: "Start input resolution at 160x160 in this domain"

- assumption: "Default cross-entropy training reaches per-class threshold"
  proved_wrong_at: cycle-5
  evidence: "Disgust class collapsed to 0.43 due to FER+ imbalance"
  lesson: "Class-weighted loss is non-optional for FER+ training"
  affects_future_runs: "Add class-weighting to training scripts by default"
```

### Self-evolution status

```
$ forger status --domain ios-emotion-classification
Runs in this domain:
  - 2026-05-22 emotion-2026-05-22 [GREEN]
  - (1 more needed for Quick Forge shortcut)

Cached:
  - source_ledger.yaml (TTL: 2026-11-22)
  - 27 source quality scores
  - 2 failure memories
```

Second and third successful runs will trigger the Quick Forge shortcut. The fourth run in this domain will skip FIND, trim OBSERVE, and finish in roughly 40% of the tokens.

---

## What you have at the end

After this single `forger run` command:

| File | Contents |
| --- | --- |
| `artifact/EmotionClassifier/` | Working Swift package, 26.4 MB, all tests green |
| `definition_of_works.yaml` | The contract every test traces back to |
| `source_ledger.yaml`, `claim_ledger.yaml` | 27 sources + 41 claims, every URL live, every quote verified |
| `risk_map.yaml` + `probe_results.jsonl` | Three probed assumptions, all passed |
| `proposals/tier1.md`, `tier2.md` | Executed plan + firewalled speculation |
| `failure_hypotheses.yaml` | Three reviewer attacks, all resolved with new tests |
| `acceptance_report.md` | 15/15 green, with traceability matrix |
| `knowledge/ios-emotion-classification/` | Persistent KB for the next run |
| `retro_note.md` | What was learned, what to do differently |

Re-run the same task in a week and the framework reads its own memory. Re-run a related task (audio emotion classification, for example) and FIND gets a partial head start because adjacent-domain sources are scored too.

---

## Next

- [Usage and CLI reference](05-usage.md) — install, modes, commands, troubleshooting
- [Architecture](06-architecture.md) — plugin layout, schemas, audit internals
