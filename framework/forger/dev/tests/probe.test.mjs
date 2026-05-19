import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runProbe } from '../../tools/probe.mjs';
import { readJsonl } from '../../_lib/ledger.mjs';

describe('probe', () => {
  it('runs a script and records passing result', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-probe-'));
    const r = await runProbe({
      workspace: ws,
      assumptionId: 'a-1',
      probeType: 'script',
      cmd: 'node -e "process.exit(0)"',
    });
    expect(r.passed).toBe(true);
    const lines = readJsonl(path.join(ws, 'probe_results.jsonl'));
    expect(lines).toHaveLength(1);
    expect(lines[0].assumption_ref).toBe('a-1');
  });

  it('records failing result', async () => {
    const ws = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-probe-'));
    const r = await runProbe({
      workspace: ws, assumptionId: 'a-2', probeType: 'script',
      cmd: 'node -e "process.exit(7)"',
    });
    expect(r.passed).toBe(false);
  });
});
