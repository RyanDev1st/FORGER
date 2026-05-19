import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAudit } from '../../gates/audit.mjs';

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
});
