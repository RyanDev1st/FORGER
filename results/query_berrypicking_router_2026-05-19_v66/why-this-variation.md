# Why This Variation — Query Berrypicking Router v66

Parent: ARCHITECTURE.md

## Status

v66. Search-first, browser-read, query-evolving.

## Scope

This variation extends v65 by shifting from lead scoring to vocabulary evolution. Instead of only ranking leads, it extracts better search terms from opened sources and routes those query branches to lanes.

## Evidence

- Bates berrypicking candidate was opened with `playwright-cli`; page title confirmed relevance, but quote extraction was weak, so no strong claim rests on it.
- NN/g Information Foraging page was opened with `playwright-cli`; visible text says people weigh likely relevant information against extraction effort.
- Cochrane Chapter 4 was opened with `playwright-cli`; visible text treats searching and selecting studies as a systematic-review phase.
- Library citation-searching candidate was opened with `playwright-cli`; weak extraction showed why visible-source checks must precede claims.

## Rationale

Search-first research often starts with poor vocabulary. Good sources reveal better names, older terms, practitioner phrases, citation trails, and failure language. Query Berrypicking Router captures that evolution as data.

## Tradeoff

More adaptive than fixed search or scent ranking, but easier to drift unless branch provenance and dead-branch logging are strict.

## Next

1. v67 can add branch budgets and stop rules.
2. v68 can combine scent scoring with query-branch mutation.
3. v69 can compare branch ancestry against final synthesis value.
