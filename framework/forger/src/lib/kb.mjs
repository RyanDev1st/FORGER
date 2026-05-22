import fs from 'node:fs';
import path from 'node:path';
import { readYaml, readJsonl } from './ledger.mjs';

export function loadDomain(domainPath) {
  return {
    index:          readYaml(path.join(domainPath, 'index.yaml')),
    sourceLedger:   safeReadYaml(path.join(domainPath, 'source_ledger.yaml'), []),
    claimLedger:    safeReadYaml(path.join(domainPath, 'claim_ledger.yaml'), []),
    failureMemory:  safeReadYaml(path.join(domainPath, 'failure_memory.yaml'), []),
    telemetry:      readJsonl(path.join(domainPath, 'telemetry.jsonl')),
  };
}

function safeReadYaml(p, fallback) {
  if (!fs.existsSync(p)) return fallback;
  const data = readYaml(p);
  return data == null ? fallback : data;
}

export function pruneExpired(entries, now = new Date()) {
  const kept = [];
  const removed = [];
  for (const e of entries) {
    if (!e.expires_at || new Date(e.expires_at) > now) kept.push(e);
    else removed.push(e);
  }
  return { kept, removed };
}

export function isShortcutEligible(domainPath) {
  const idx = readYaml(path.join(domainPath, 'index.yaml'));
  return !!idx.shortcut_eligible;
}

export function countShippedTasks(domainPath, lastN = 3) {
  const lines = readJsonl(path.join(domainPath, 'telemetry.jsonl'));
  const tail = lines.slice(-lastN);
  return tail.filter(l => l.status === 'shipped').length;
}

export function computeCoverage(claims, dowCriterionIds) {
  if (dowCriterionIds.length === 0) return 1;
  const covered = new Set();
  for (const c of claims) {
    for (const id of (c.dow_criterion_refs || [])) {
      if (dowCriterionIds.includes(id)) covered.add(id);
    }
  }
  return covered.size / dowCriterionIds.length;
}
