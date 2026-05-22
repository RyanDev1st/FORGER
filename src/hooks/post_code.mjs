import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  readYaml,
  validateRiskMap, validateProbeResult, validateRetroNote,
  validateSourceEntry, validateClaimEntry,
  validateFailureHypothesis, validateDoW,
} from '../lib/ledger.mjs';

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
const yamlMap = {
  'dow.yaml': obj => validateDoW(obj),
  'risk_map.yaml': obj => validateRiskMap(obj),
  'retro_note.yaml': obj => validateRetroNote(obj),
  'source_ledger.yaml': arr => everyEntry(arr, validateSourceEntry),
  'claim_ledger.yaml': arr => everyEntry(arr, validateClaimEntry),
  'failure_hypotheses.yaml': arr => everyEntry(arr, validateFailureHypothesis),
  'probe_result.yaml': obj => validateProbeResult(obj),
};

function everyEntry(arr, fn) {
  if (!Array.isArray(arr)) return { valid: false, errors: [{ msg: 'expected array' }] };
  const errors = [];
  arr.forEach((item, i) => {
    const r = fn(item);
    if (!r.valid) errors.push({ index: i, errors: r.errors });
  });
  return { valid: errors.length === 0, errors };
}

export async function runPostCode({ file_path, tool_name }) {
  if (!file_path) return { kind: 'skip', reason: 'no file_path' };
  const base = path.basename(file_path);
  if (!/(workspaces|knowledge)[\\/]/.test(file_path) && !yamlMap[base]) {
    return { kind: 'skip', reason: 'not a forger artifact' };
  }
  if (yamlMap[base]) {
    let data;
    try { data = readYaml(file_path); }
    catch (err) { return { kind: 'yaml-validation', ok: false, errors: [String(err)] }; }
    const r = yamlMap[base](data);
    return { kind: 'yaml-validation', ok: r.valid, errors: r.errors };
  }
  return { kind: 'skip', reason: 'no schema for ' + base };
}

if (entryUrl && import.meta.url === entryUrl) {
  let payload = '';
  process.stdin.on('data', chunk => payload += chunk);
  process.stdin.on('end', async () => {
    let parsed = {};
    try { parsed = JSON.parse(payload); } catch {}
    const r = await runPostCode({
      file_path: parsed.file_path || parsed.path,
      tool_name: parsed.tool_name,
    });
    if (r.kind === 'yaml-validation' && !r.ok) {
      console.error(JSON.stringify({
        level: 'warn', code: 'schema-fail',
        message: 'Workspace YAML failed schema', details: r.errors,
      }));
    }
    process.exit(0);
  });
}
