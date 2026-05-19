#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { readYaml, appendJsonl } from '../_lib/ledger.mjs';

function runSubprocess(cmd, { timeoutMs = 300000 } = {}) {
  const start = Date.now();
  const r = spawnSync(cmd, { shell: true, timeout: timeoutMs, encoding: 'utf8' });
  return {
    exit: r.status ?? -1,
    stdout: (r.stdout || '').slice(-2000),
    stderr: (r.stderr || '').slice(-2000),
    duration_ms: Date.now() - start,
    timedOut: r.error?.code === 'ETIMEDOUT',
  };
}

export async function runAcceptance({ workspace }) {
  const dow = readYaml(path.join(workspace, 'dow.yaml'));
  const resultsPath = path.join(workspace, 'acceptance_results.jsonl');
  let required_passed = 0;
  let required_failed = 0;
  let subjective_pending = 0;

  const now = () => new Date().toISOString();

  for (const sc of dow.success_criteria_measurable || []) {
    const r = runSubprocess(sc.test_method);
    const passed = r.exit === 0 && !r.timedOut;
    appendJsonl(resultsPath, {
      ts: now(), criterion_id: sc.id, type: 'measurable',
      passed, expected: sc.threshold, actual: r.stdout,
      duration_ms: r.duration_ms, exit: r.exit, output_snippet: r.stderr,
    });
    if (passed) required_passed++; else required_failed++;
  }

  for (const hc of dow.hard_constraints || []) {
    if (!hc.verification_method) continue;
    const r = runSubprocess(hc.verification_method);
    const passed = r.exit === 0;
    appendJsonl(resultsPath, {
      ts: now(), criterion_id: hc.id, type: 'hard_constraint',
      passed, duration_ms: r.duration_ms, exit: r.exit,
      output_snippet: r.stderr,
    });
    if (passed) required_passed++; else required_failed++;
  }

  for (const ufm of dow.unacceptable_failure_modes || []) {
    if (!ufm.detection_method) continue;
    const r = runSubprocess(ufm.detection_method);
    const passed = r.exit !== 0; // failure mode must NOT trigger
    appendJsonl(resultsPath, {
      ts: now(), criterion_id: ufm.id, type: 'failure_mode',
      passed, duration_ms: r.duration_ms, exit: r.exit,
      output_snippet: r.stderr,
    });
    if (passed) required_passed++; else required_failed++;
  }

  for (const sc of dow.success_criteria_subjective || []) {
    appendJsonl(resultsPath, {
      ts: now(), criterion_id: sc.id, type: 'subjective_pending',
      passed: false, protocol: sc.measurement_protocol,
    });
    subjective_pending++;
  }

  return { required_passed, required_failed, subjective_pending };
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  const args = Object.fromEntries(
    process.argv.slice(2).reduce((acc, v, i, a) => {
      if (v.startsWith('--')) acc.push([v.slice(2), a[i + 1]]);
      return acc;
    }, [])
  );
  const r = await runAcceptance({ workspace: args.workspace });
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.required_failed === 0 ? 0 : 1);
}
