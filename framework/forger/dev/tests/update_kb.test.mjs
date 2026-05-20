import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runUpdateKb } from '../../src/cli/update_kb.mjs';
import { writeYaml, readYaml } from '../../src/lib/ledger.mjs';

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
    expect(r.ttl_overrides_applied).toBe(0);
  });

  it('reports ttl_overrides_applied count when retro overrides TTLs', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-ukb-ttl-'));
    const pluginRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-root-ttl-'));
    fs.mkdirSync(path.join(pluginRoot, 'knowledge'), { recursive: true });

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
      task_id: 't-ttl', domain_slug: 'd',
      completed_at: '2026-05-19T00:00:00Z',
      mode_used: 'standard', status: 'shipped',
      token_used: 1, duration_ms: 1,
      proven_claim_ids: ['clm-a'], failed_assumptions: [],
      working_architecture_ref: '',
      ttl_overrides: { 'clm-a': 30 },
      shortcut_eligible: false,
    });

    const r = await runUpdateKb({ workspace: ws, pluginRoot });
    expect(r.ttl_overrides_applied).toBe(1);
  });

  it('flips shortcut_eligible back to false when streak breaks', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-ukb-reset-'));
    const pluginRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-root-reset-'));
    fs.mkdirSync(path.join(pluginRoot, 'knowledge', 'd'), { recursive: true });

    // Seed an eligible domain with 3 prior shipped tasks in telemetry.
    const dom = path.join(pluginRoot, 'knowledge', 'd');
    writeYaml(path.join(dom, 'index.yaml'), {
      domain_slug: 'd', created_at: '2026-01-01T00:00:00Z',
      last_updated_at: '2026-04-01T00:00:00Z',
      tasks_completed: 3, tasks_shipped: 3, tasks_escalated: 0, tasks_abandoned: 0,
      shortcut_eligible: true, shortcut_coverage: 0,
      default_ttl_days: 90, known_sources: [], known_failure_patterns: [],
    });
    fs.writeFileSync(path.join(dom, 'telemetry.jsonl'),
      JSON.stringify({ ts: '2026-02-01T00:00:00Z', task_id: 't1', status: 'shipped' }) + '\n' +
      JSON.stringify({ ts: '2026-03-01T00:00:00Z', task_id: 't2', status: 'shipped' }) + '\n' +
      JSON.stringify({ ts: '2026-04-01T00:00:00Z', task_id: 't3', status: 'shipped' }) + '\n',
      'utf8');

    writeYaml(path.join(ws, 'retro_note.yaml'), {
      task_id: 't4-2026-05-19', domain_slug: 'd',
      completed_at: '2026-05-19T00:00:00Z',
      mode_used: 'standard', status: 'escalated',
      token_used: 1, duration_ms: 1,
      proven_claim_ids: [], failed_assumptions: [],
      working_architecture_ref: '', ttl_overrides: {}, shortcut_eligible: false,
    });

    await runUpdateKb({ workspace: ws, pluginRoot });
    const idx = readYaml(path.join(dom, 'index.yaml'));
    expect(idx.shortcut_eligible).toBe(false);
  });
});
