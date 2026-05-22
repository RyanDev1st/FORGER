import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runPostCode } from '../../src/hooks/post_code.mjs';

describe('post_code', () => {
  it('validates a YAML workspace artifact if schema mapping known', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-pc-'));
    const file = path.join(ws, 'risk_map.yaml');
    fs.writeFileSync(file, 'assumptions: []\nmechanisms: []\nknown_failure_modes: []\n');
    const r = await runPostCode({ file_path: file, tool_name: 'Write' });
    expect(r.kind).toBe('yaml-validation');
    expect(r.ok).toBe(true);
  });

  it('skips non-workspace files cleanly', async () => {
    const r = await runPostCode({ file_path: '/tmp/random.txt', tool_name: 'Write' });
    expect(r.kind).toBe('skip');
  });
});
