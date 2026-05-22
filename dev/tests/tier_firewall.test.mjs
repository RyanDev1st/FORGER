import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { checkTierFirewall } from '../../src/hooks/enforce_tier_firewall.mjs';

describe('tier_firewall', () => {
  it('blocks Write whose content matches an un-promoted Tier 2 entry', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-tf-'));
    fs.writeFileSync(path.join(ws, 'tier2_speculation.md'),
      `## tier2_entry: 'Bloom filter for cache eviction'
- idea: Use a Bloom filter to short-circuit cache lookups before key hashing.
- promoted_at: null
`);
    const r = await checkTierFirewall({
      tool_name: 'Write',
      file_path: '/tmp/somewhere/cache.mjs',
      content: 'Use a Bloom filter to short-circuit cache lookups before key hashing.',
      workspace: ws,
    });
    expect(r.block).toBe(true);
  });

  it('allows when no workspace active', async () => {
    const r = await checkTierFirewall({
      tool_name: 'Write', file_path: '/tmp/x', content: 'whatever',
      workspace: '/tmp/this-workspace-does-not-exist-' + Date.now(),
    });
    expect(r.block).toBe(false);
  });

  it('allows promoted Tier 2 content', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-tf-'));
    fs.writeFileSync(path.join(ws, 'tier2_speculation.md'),
      `## tier2_entry: 'Bloom filter for cache eviction'
- idea: Use a Bloom filter to short-circuit cache lookups before key hashing.
- promoted_at: 2026-05-19T00:00:00Z
`);
    const r = await checkTierFirewall({
      tool_name: 'Write',
      file_path: '/tmp/cache.mjs',
      content: 'Use a Bloom filter to short-circuit cache lookups before key hashing.',
      workspace: ws,
    });
    expect(r.block).toBe(false);
  });
});
