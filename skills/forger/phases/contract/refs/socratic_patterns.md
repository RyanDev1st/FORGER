# Socratic Patterns (CONTRACT phase)

Step 2 of the CONTRACT procedure converts each detected vagueness (see
`vagueness_detectors.md`) into 1-3 targeted user questions. The four classical
Socratic elements below give you a small toolbox of question *shapes*; pick
the one that fits the kind of fog you are clearing.

Worked examples below use a recurring concrete scenario:

> **Scenario.** The user has asked for "a facial emotion recognition system
> for our retail kiosks". Several kinds of vagueness are present
> simultaneously — that is normal, and each pattern below addresses a
> different slice.

For each pattern: a definition, a guide on when to use it, a question stem
you can adapt, and three worked examples.

---

## 1. Maieutics — drawing out latent knowledge

**Definition.** Maieutic questions assume the user already knows the answer
but has not articulated it. You help them put words around what they already
believe. Think of a midwife: you are not implanting new knowledge, you are
helping an existing answer come out.

**When to use.** The user has *experience* with the problem domain but
defaulted to a vague phrasing because the answer felt too obvious to state.
Common after an initial vagueness scan flags **missing success criteria** or
**unstated assumptions**.

**Question stem template.**

> "When you imagine this working, what specifically would you *see / hear /
> measure*? Walk me through what 'done' looks like from your perspective."

**Worked examples (facial emotion recognition scenario).**

1. *Eliciting success criteria.* "When the kiosk recognises a customer's
   emotion correctly, what happens next in your store? What would you notice
   on a busy Saturday that tells you it is working?"
2. *Eliciting an unstated assumption.* "You mentioned 'our retail kiosks' —
   if you had to draw the kiosk on a whiteboard right now, what would the
   camera angle and lighting look like? What is normal in your stores?"
3. *Eliciting a hidden constraint.* "If the system was working perfectly but
   it cost three times more to run than it does now, would you still want
   it? That answer tells me what your real budget is."

---

## 2. Elenchus — testing for contradiction

**Definition.** Elenchus is cross-examination: you take the user's stated
position and test whether it survives an obvious counter-case. If their
answer to your question contradicts their original brief, the brief — not the
answer — is what needs to change.

**When to use.** The user has given a confident-sounding constraint that may
not survive contact with reality. Common after **ambiguous constraints**
detection: "must be fast", "must be secure", "must work offline".

**Question stem template.**

> "You said *X*. What about the case where *Y*? Does *X* still hold there,
> or would you want to relax it?"

**Worked examples (facial emotion recognition scenario).**

1. *Testing 'must work for everyone'.* "You'd like the system to work for
   all customers. Modern face-recognition systems have measurable accuracy
   gaps across demographics — would shipping a system that works at 95% on
   group A but 70% on group B meet your bar, or would you rather hold the
   launch until both are at 90%?"
2. *Testing 'real-time'.* "You called it 'real-time'. If recognition takes
   400 ms instead of 50 ms, would that break the customer experience, or
   would it still be fine for what the kiosk does next?"
3. *Testing 'on-device'.* "You'd prefer everything to run on the kiosk
   hardware. If we offload one heavy model to a regional server with a
   30 ms round trip, does that violate the spirit of what you wanted, or
   is the constraint actually about not sending images to the public
   internet?"

---

## 3. Aporia — sitting with uncertainty

**Definition.** Aporia is the deliberate exposure of "we don't know yet". You
surface a question both parties realise neither of you can confidently
answer, and you record that gap rather than papering over it. The output of
an aporetic question is usually an entry in `assumptions[]` with an honest
severity, not a polished requirement.

**When to use.** The vagueness comes from genuine domain uncertainty — the
user cannot tell you because *no one knows yet*. Common when **mixed goals**
or **unstated assumptions** surface novel territory.

**Question stem template.**

> "Here is something I don't think either of us knows the answer to: *X*.
> How would you like us to handle that — verify it now, assume one answer
> and tag the assumption, or treat it as a research question?"

**Worked examples (facial emotion recognition scenario).**

1. *Aporia on model behaviour.* "I genuinely don't know whether current
   open-source emotion models hold up on store-lit faces with masks or
   sunglasses. Do you want us to spend an hour stress-testing one before
   we promise anything, or note it as a risk and continue?"
2. *Aporia on regulation.* "I am not sure whether the privacy regime your
   stores operate under treats facial expressions as biometric data. Would
   you like to confirm with legal before we shape the DoW, or carry it as
   an open assumption that may invalidate the project?"
3. *Aporia on user reaction.* "Whether shoppers will actually like having a
   camera read their face — I cannot tell you that from research alone.
   Should we treat that as a separate user study, or as a Tier-2 risk in
   this DoW?"

---

## 4. Dialectic — opposing two framings

**Definition.** Dialectic juxtaposes the user's framing with a clearly
different framing, then asks them to choose. The goal is not to win the
argument — it is to make the user *see* that a choice exists, so the chosen
framing is intentional rather than default. This is the muscle that
`reframe_memo.md` (step 3) is built on.

**When to use.** A single problem has at least two reasonable framings and
the choice between them dictates almost everything that follows. Common as
the precursor to step 3 (Reframe) and when **mixed goals** suggest the user
is trying to solve two problems with one artifact.

**Question stem template.**

> "There are two ways to read this: *Framing A* says we should do *X*,
> *Framing B* says we should do *Y*. They lead to very different work. Which
> reflects what you actually want — or is there a third I am missing?"

**Worked examples (facial emotion recognition scenario).**

1. *Detection vs. measurement.* "Two framings: (A) we build a system that
   *detects* customer emotion to trigger staff intervention in real time;
   (B) we build a system that *aggregates* expression data across visits
   to inform future store layout. (A) needs low latency and per-event
   accuracy. (B) tolerates batch processing and cares about population
   statistics. Which one is the brief?"
2. *Product vs. research.* "(A) ship a working pilot in three stores in
   eight weeks. (B) write a research report that tells the rest of the
   business whether emotion recognition is worth pursuing. These are
   different DoWs. Which is the ask?"
3. *Replace vs. augment.* "(A) replace your existing customer-feedback
   touchscreen with an emotion-recognition flow. (B) keep the touchscreen
   and add emotion recognition as a silent second signal. (A) implies
   removing a working surface; (B) implies a more conservative addition.
   Which is closer to what you want?"
