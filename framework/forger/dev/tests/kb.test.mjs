import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadDomain,
  pruneExpired,
  isShortcutEligible,
  countShippedTasks,
  computeCoverage,
} from '../../src/lib/kb.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.resolve(here, '..', 'fixtures', 'sample_kb_domain');

describe('kb', () => {
  it('loadDomain returns index, sourceLedger, claimLedger, failureMemory', () => {
    const d = loadDomain(fixture);
    expect(d.index.domain_slug).toBe('sample');
    expect(d.sourceLedger).toHaveLength(2);
    expect(d.claimLedger).toHaveLength(1);
  });

  it('pruneExpired removes sources past expires_at against now', () => {
    const d = loadDomain(fixture);
    const { kept, removed } = pruneExpired(d.sourceLedger, new Date('2026-05-19T00:00:00Z'));
    expect(removed).toHaveLength(1);
    expect(kept).toHaveLength(1);
    expect(kept[0].id).toBe('src-a');
  });

  it('countShippedTasks(N) counts last N shipped statuses', () => {
    expect(countShippedTasks(fixture, 3)).toBe(3);
    expect(countShippedTasks(fixture, 2)).toBe(2);
  });

  it('isShortcutEligible reflects index flag', () => {
    expect(isShortcutEligible(fixture)).toBe(true);
  });

  it('computeCoverage returns fraction of criterion IDs covered by claims', () => {
    const claims = [
      { dow_criterion_refs: ['sc-m-1', 'sc-m-2'] },
      { dow_criterion_refs: ['hc-1'] },
    ];
    const dowIds = ['sc-m-1', 'sc-m-2', 'hc-1', 'ufm-1'];
    expect(computeCoverage(claims, dowIds)).toBeCloseTo(0.75);
  });
});
