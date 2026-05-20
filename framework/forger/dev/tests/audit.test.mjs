import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAudit } from '../../src/gates/audit.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ws = path.resolve(here, '..', 'fixtures', 'sample_workspace');

describe('audit', () => {
  it('flags dead URL with link-dead and orphan claim with orphan-claim', async () => {
    const r = await runAudit({ workspace: ws, skipNetwork: false });
    expect(r.passed).toBe(true); // schema passes; flags are advisory
    const dead = r.flagsBySource['src-dead'] || [];
    expect(dead).toContain('link-dead');
    const orphan = r.flagsByClaim['clm-orphan'] || [];
    expect(orphan).toContain('orphan-claim');
  });

  it('preserves YAML comments when no flags change', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-audit-noop-'));
    const sourceYaml = `# Schema: ../../schemas/source_ledger_entry.schema.yaml
- id: src-noop
  url: 'https://example.com'
  title: 'Noop fixture'
  lane: production
  accessed_at: '2026-05-19T00:00:00Z'
  ttl_days: 90
  expires_at: '2026-08-17T00:00:00Z'
  quality_scores:
    authority: 5
    recency: 5
    reproducibility: 5
    implementation_relevance: 5
    independence: 5
    conflict_of_interest: 5
  composite_score: 5
  flags: []

# ---LANE_SUMMARY---
# lane: production
# findings_count: 1
# ---END---
`;
    fs.writeFileSync(path.join(tmp, 'source_ledger.yaml'), sourceYaml, 'utf8');
    fs.writeFileSync(path.join(tmp, 'claim_ledger.yaml'), '[]\n', 'utf8');

    await runAudit({ workspace: tmp, skipNetwork: true });

    const after = fs.readFileSync(path.join(tmp, 'source_ledger.yaml'), 'utf8');
    expect(after).toContain('# Schema:');
    expect(after).toContain('# ---LANE_SUMMARY---');
    expect(after).toContain('# ---END---');
  });

  it('warns when a lane is below floor and not marked under_sourced', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-audit-floor-'));
    fs.writeFileSync(path.join(tmp, 'source_ledger.yaml'), `- id: src-a
  url: 'https://example.com'
  title: 'A'
  lane: production
  accessed_at: '2026-05-19T00:00:00Z'
  ttl_days: 90
  expires_at: '2026-08-17T00:00:00Z'
  quality_scores: { authority: 5, recency: 5, reproducibility: 5, implementation_relevance: 5, independence: 5, conflict_of_interest: 5 }
  composite_score: 5
  flags: []
`, 'utf8');
    fs.writeFileSync(path.join(tmp, 'claim_ledger.yaml'), `- id: clm-only
  source_id: src-a
  lane: production
  claim_text: only claim
  verbatim_quote: only quote here
  severity: low
  dow_criterion_refs: [sc-m-1]
  entailment: directly_supported
  mechanism: solo
  intended_use: primary
  status: open
`, 'utf8');
    const r = await runAudit({ workspace: tmp, skipNetwork: true });
    const floorWarn = r.warnings.find(w => w.kind === 'lane-under-floor' && w.lane === 'production');
    expect(floorWarn).toBeTruthy();
    expect(floorWarn.count).toBe(1);
    expect(floorWarn.floor).toBe(5);
  });
});
