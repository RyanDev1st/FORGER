import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { appendProbeResult } from '../_lib/ledger.mjs';

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

export async function runProbe({ workspace, assumptionId, probeType, cmd, expected = '', timeoutMs = 60000 }) {
  const sandbox = path.join(workspace, 'probe-sandbox', assumptionId);
  fs.mkdirSync(sandbox, { recursive: true });
  const start = Date.now();
  const r = spawnSync(cmd, { shell: true, cwd: sandbox, timeout: timeoutMs, encoding: 'utf8' });
  const duration_ms = Date.now() - start;
  const stdout = (r.stdout || '').slice(-8000);
  const stderr = (r.stderr || '').slice(-2000);
  const passed = r.status === 0 && !(r.error?.code === 'ETIMEDOUT');

  const result = {
    id: 'pr-' + crypto.randomUUID().slice(0, 8),
    assumption_ref: assumptionId,
    probe_type: probeType,
    command_or_code: cmd,
    expected,
    actual: stdout,
    passed,
    duration_ms,
    ran_at: new Date().toISOString(),
    environment_notes: `Node ${process.version}, ${os.platform()}`,
    evidence: stderr + '\n' + stdout.slice(-2000),
  };

  appendProbeResult(workspace, result);
  return result;
}

if (entryUrl && import.meta.url === entryUrl) {
  const argv = process.argv.slice(2);
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      const v = (i + 1 < argv.length && !argv[i + 1].startsWith('--')) ? argv[++i] : true;
      args[k] = v;
    }
  }
  if (!args.workspace || !args['assumption-id'] || !args.type || !args.cmd) {
    console.error('Usage: probe.mjs --workspace <p> --assumption-id <id> --type <t> --cmd <cmd> [--timeout-ms N]');
    process.exit(2);
  }
  const r = await runProbe({
    workspace: args.workspace,
    assumptionId: args['assumption-id'],
    probeType: args.type,
    cmd: args.cmd,
    timeoutMs: Number(args['timeout-ms'] || 60000),
  });
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.passed ? 0 : 1);
}
