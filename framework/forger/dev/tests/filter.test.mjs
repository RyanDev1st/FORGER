import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { filterUrls } from '../../tools/filter.mjs';

describe('filter', () => {
  it('keeps live, non-blocklisted URLs', async () => {
    const r = await filterUrls([{ url: 'https://example.com',
                                   candidate_title: 'Example', lane: 'production' }]);
    expect(r.kept).toHaveLength(1);
    expect(r.kept[0].url).toBe('https://example.com');
  });

  it('rejects dead URL', async () => {
    const r = await filterUrls([{ url: 'https://this-host-does-not-exist-forger.invalid',
                                   candidate_title: 'Dead', lane: 'production' }]);
    expect(r.rejected).toHaveLength(1);
    expect(r.rejected[0].reason).toMatch(/HEAD/);
  });
});
