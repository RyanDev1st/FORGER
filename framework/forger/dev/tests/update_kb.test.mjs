import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runUpdateKb } from '../../tools/update_kb.mjs';
import { writeYaml, readYaml } from '../../_lib/ledger.mjs';

describe('update_kb', () => {
  it('merges proven claims into a fresh domain KB and stamps expires_at', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-ukb-'));
    const pluginRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-root-'));
    fs.mkdirSync(path.join(pluginRoot, 'knowledge'), { recursive: true });

    writeYaml(path.join(ws, 'dow.yaml'), {
      meta: { id: 't', created_at: '2026-05-19T00:00:00Z',
              user_query_verbatim: 'q', mode: 'standard', domain_slug: 'd',
              mode_picked_by: 'user' },
      artifact: { type: 'code', description: 'x' },
      audience: { who: 'me', use_case: 'me' },
      hard_constraints: [], success_criteria_measurable: [],
      unacceptable_failure_modes: [],
      reframe_memo: { original_framing: 'a', alternative_framings: ['b'],
                      chosen_framing: 'a', rationale: 'r' },
    });
    writeYaml(path.join(ws, 'source_ledger.yaml'), [
      { id: 'src-a', url: 'https://example.com', title: 'A', lane: 'production',
        accessed_at: '2026-05-19T00:00:00Z', ttl_days: 90, expires_at: '2026-08-17T00:00:00Z',
        quality_scores: { authority: 5, recency: 5, reproducibility: 5,
                          implementation_relevance: 5, independence: 5, conflict_of_interest: 5 },
        composite_score: 5, flags: [] },
    ]);
    writeYaml(path.join(ws, 'claim_ledger.yaml'), [
      { id: 'clm-a', source_id: 'src-a', lane: 'production',
        claim_text: 'X', verbatim_quote: 'X',
        severity: 'high', dow_criterion_refs: ['sc-m-1'],
        entailment: 'directly_supported', status: 'verified' },
    ]);
    writeYaml(path.join(ws, 'retro_note.yaml'), {
      task_id: 't-2026-05-19', domain_slug: 'd',
      completed_at: '2026-05-19T00:00:00Z',
      mode_used: 'standard', status: 'shipped',
      token_used: 1234, duration_ms: 1000,
      proven_claim_ids: ['clm-a'],
      failed_assumptions: [],
      working_architecture_ref: '',
      ttl_overrides: {}, shortcut_eligible: false,
    });

    const r = await runUpdateKb({ workspace: ws, pluginRoot });
    expect(r.proven_claims_merged).toBe(1);
    const dom = path.join(pluginRoot, 'knowledge', 'd');
    const idx = readYaml(path.join(dom, 'index.yaml'));
    expect(idx.tasks_shipped).toBe(1);
    const claims = readYaml(path.join(dom, 'claim_ledger.yaml'));
    expect(claims).toHaveLength(1);
    expect(claims[0].expires_at).toBeTruthy();
  });
});
