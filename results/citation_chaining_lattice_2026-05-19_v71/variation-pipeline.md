Parent: ARCHITECTURE.md

# Variation Pipeline — Citation Chaining Lattice v71

## Status

v71. Search-first, browser-read, anchor-expansion.

## Scope

This variation inserts a citation lattice between initial search and lane synthesis so strong seeds generate structured backward, forward, and sibling expansion paths.

## Pipeline

1. Search broad lead pool for initial candidate sources.
2. Open candidates directly with `playwright-cli` and identify which can function as anchors.
3. Build `citation-lattice.md` with anchor metadata, chain directions, yield, and stop signals.
4. Expand each strong anchor through backward, forward, and sibling chaining.
5. Record whether chains yield novel evidence, redundancy, access failures, or terminology mutations.
6. Route chain outputs by lane:
   - scholar = evidence-rich papers, reviews, and methods chains
   - community = maintainer, repo, benchmark, migration, and postmortem trails
   - edge = adjacent-domain and grounded contrarian chains
7. Stop on diminishing returns, redundancy, or repeated blocked paths.
8. Synthesize anchor yield, productive chain directions, dead ends, and lane findings.

## Audit checks

- Every anchor came from browser-read source, not snippet-only inference.
- Chain direction logged explicitly.
- Dead or blocked chains preserved as evidence about access limits.
- Stop rules triggered from yield, not intuition.

## Evidence

- Cochrane Chapter 4 indexed text said authors should check reference lists of included studies and relevant systematic reviews.
- Cochrane Chapter 4 indexed text said to use citation searching on key articles in addition to a database search.
- Cochrane Chapter 4 indexed text said search development is iterative and exploratory and stopping can depend on retrieval of new relevant records.
- PMC candidate hit reCAPTCHA in browser, showing some chain targets become access-friction nodes.
- MIT guide DNS failure and Wisconsin guide 404 showed citation-chasing advice pages can be unstable support material rather than dependable anchors.

## Next

1. Test on topic with one strong review anchor and weak keyword precision.
2. Combine with contradiction matrix when citation chains surface rival evidence families.
3. Measure whether anchor yield improves lane diversity versus plain search expansion.
