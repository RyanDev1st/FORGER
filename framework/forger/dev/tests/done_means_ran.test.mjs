import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { checkDoneMeansRan } from '../../hooks/enforce_done_means_ran.mjs';
import { writeYaml, appendJsonl } from '../../_lib/ledger.mjs';

function baseDow() {
  return {
    meta: { id: 't', created_at: '2026-05-19T00:00:00Z',
            user_query_verbatim: 'q', mode: 'standard', domain_slug: 'd',
            mode_picked_by: 'user' },
    artifact: { type: 'code', description: 'x' },
    audience: { who: 'me', use_case: 'me' },
    hard_constraints: [],
    success_criteria_measurable: [{ id: 'sc-m-1', metric: 'x', threshold: '1', test_method: 'true' }],
    unacceptable_failure_modes: [],
    reframe_memo: { original_framing: 'a', alternative_framings: ['b'],
                    chosen_framing: 'a', rationale: 'r' },
  };
}

describe('done_means_ran', () => {
  it('blocks when completion claim made but no acceptance pass', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-dmr-'));
    writeYaml(path.join(ws, 'dow.yaml'), baseDow());
    const r = await checkDoneMeansRan({
      workspace: ws,
      recentText: 'All done, ready to ship.',
    });
    expect(r.block).toBe(true);
  });

  it('allows when no completion claim', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-dmr-'));
    writeYaml(path.join(ws, 'dow.yaml'), baseDow());
    const r = await checkDoneMeansRan({ workspace: ws, recentText: 'mid-step update' });
    expect(r.block).toBe(false);
  });

  it('allows when acceptance passes', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-dmr-'));
    writeYaml(path.join(ws, 'dow.yaml'), baseDow());
    appendJsonl(path.join(ws, 'acceptance_results.jsonl'),
      { criterion_id: 'sc-m-1', type: 'measurable', passed: true });
    const r = await checkDoneMeansRan({ workspace: ws, recentText: 'All tests pass — done.' });
    expect(r.block).toBe(false);
  });
});
