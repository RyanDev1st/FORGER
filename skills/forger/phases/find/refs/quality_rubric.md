# Quality Rubric (FIND phase)

Every source kept in `source_ledger.yaml` carries six quality scores, each in
the range 0-5. The composite score is the arithmetic mean of all six. This
file is the calibration reference — when you are about to give a source a
score, find the row whose anchor best matches the source in your hands and
use that level.

The six dimensions are **independent**. A source can be 5 on authority and 1
on recency (a vendor's deprecated documentation page); a source can be 1 on
authority and 5 on reproducibility (a randos' GitHub repo with a fully
reproducible benchmark harness). Score each axis on its own merits.

---

## 1. Authority — how authoritative is this source for this domain?

| Level | Anchor                                                              |
|-------|---------------------------------------------------------------------|
| 5     | The canonical vendor / standards body / spec author for the domain (e.g., `nodejs.org/api`, IETF RFC, ISO standard, the maintainer's own commit). |
| 4     | A peer-reviewed paper at a top-venue conference; an official documentation site that is one hop from the canonical source (e.g., a framework's docs that re-export a vendor API). |
| 3     | A maintainer-confirmed answer on Stack Overflow, GitHub Issue, or Discussion; a well-cited engineering blog from a known practitioner. |
| 2     | A high-vote forum post by a non-maintainer who appears competent but unverified; a blog post by an unknown author with citations. |
| 1     | A forum post with no citations, no votes, no maintainer engagement. |
| 0     | Anonymous, uncited, or content-farm material; AI-generated SEO content. |

## 2. Recency — how current is this source for this domain?

Recency is **domain-relative**. A 1980s control-theory paper used as a
frontier analogue can score 5 if its content has not been superseded. A
2-year-old web framework tutorial can score 2 because the framework moves
fast. Judge by "would this still be true if I ran it today?".

| Level | Anchor                                                              |
|-------|---------------------------------------------------------------------|
| 5     | Published or last-updated within the past 12 months *and* the domain has not had a major breaking change since. |
| 4     | 1-2 years old in a domain that does not break often; or current docs for the LTS / stable channel of a fast-moving project. |
| 3     | 2-5 years old, still substantially correct for the parts you cite. |
| 2     | 5-10 years old, partially correct; you have verified the specific claim still holds. |
| 1     | 10+ years old, or 1-5 years old in a domain that breaks every release. |
| 0     | Documents an API or product that has been removed or renamed. |

## 3. Reproducibility — can the claims be independently verified?

| Level | Anchor                                                              |
|-------|---------------------------------------------------------------------|
| 5     | The source includes a minimal reproducible example (code repo + dataset + scripts) that another engineer could run end-to-end in under an hour. |
| 4     | The source includes a code snippet and enough surrounding context that a domain expert could reproduce it from the snippet alone. |
| 3     | The source describes the methodology in prose but omits the code or data; reproduction requires substantial effort. |
| 2     | The source asserts a result without methodology; reproduction would require contacting the author. |
| 1     | The source is an opinion or anecdote; "reproduction" is not meaningful. |
| 0     | The source's claim is unfalsifiable in principle ("everyone agrees", "it just feels right"). |

## 4. Implementation_relevance — how directly does this inform building the artifact?

| Level | Anchor                                                              |
|-------|---------------------------------------------------------------------|
| 5     | Tells you *exactly* what the artifact must do or avoid: an API contract, a config flag, a known edge case with a concrete trigger. |
| 4     | Tells you a mechanism the artifact depends on, with enough detail that you can derive the implementation. |
| 3     | Gives you a design pattern or recipe that informs the implementation but requires translation to your specific stack. |
| 2     | Background that helps you understand why the implementation is shaped the way it is, but does not change any specific decision. |
| 1     | Adjacent context; interesting but not load-bearing. |
| 0     | Tangential; included only because the search returned it. |

## 5. Independence — is this source independent or derivative?

| Level | Anchor                                                              |
|-------|---------------------------------------------------------------------|
| 5     | Original work — the source's claim is something the author or organisation discovered or first stated. |
| 4     | Substantially independent — the source cites others but adds new evidence, analysis, or measurement. |
| 3     | Re-explains an idea from elsewhere with new examples or context but no new evidence. |
| 2     | A summary or tutorial that paraphrases the canonical source. |
| 1     | A near-duplicate of another source, possibly cited; adds nothing not already present in the original. |
| 0     | A scraped, copy-pasted, or content-farmed version of someone else's work. |

A claim with `severity: critical` should be supported by ≥2 sources with
independence ≥ 4 (the audit gate flags this as a warning, not an error).

## 6. Conflict_of_interest — does the source have incentives to mislead?

Higher score = less conflict. A clean independent source is 5; a vendor
selling the thing the claim endorses is 0-1.

| Level | Anchor                                                              |
|-------|---------------------------------------------------------------------|
| 5     | The source has no financial or reputational stake in the claim being true. |
| 4     | The source has a mild reputational stake (e.g., maintainer answering their own project's issue truthfully). |
| 3     | The source has a moderate stake (e.g., a vendor blog post about their product, but with citable third-party benchmarks). |
| 2     | The source has a strong stake and provides no independent verification (e.g., marketing copy with selective benchmarks). |
| 1     | The source is sponsored content disguised as independent analysis. |
| 0     | The source is paid promotion or a pump-and-dump for a related asset. |

---

## Composite score

  composite_score = mean(authority, recency, reproducibility,
                        implementation_relevance, independence,
                        conflict_of_interest)

Round to 2 decimal places. The schema accepts any number in [0, 5]; the
convention is two decimals so the ledger is human-readable. The composite is
advisory — the audit gate does not block on a low composite — but a source
with composite < 2.0 should have a `notes:` line explaining why it was kept.
