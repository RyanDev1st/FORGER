import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemasDir = path.resolve(here, '..', 'schemas');

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);

function compile(file) {
  const schema = yaml.load(fs.readFileSync(path.join(schemasDir, file), 'utf8'));
  return ajv.compile(schema);
}

const v = {
  dow:        compile('definition_of_works.schema.yaml'),
  source:     compile('source_ledger_entry.schema.yaml'),
  claim:      compile('claim_ledger_entry.schema.yaml'),
  riskMap:    compile('risk_map.schema.yaml'),
  failureH:   compile('failure_hypothesis.schema.yaml'),
  probe:      compile('probe_result.schema.yaml'),
  retro:      compile('retro_note.schema.yaml'),
};

function wrap(fn) {
  return obj => fn(obj) ? { valid: true } : { valid: false, errors: fn.errors };
}

export const validateDoW                = wrap(v.dow);
export const validateSourceEntry        = wrap(v.source);
export const validateClaimEntry         = wrap(v.claim);
export const validateRiskMap            = wrap(v.riskMap);
export const validateFailureHypothesis  = wrap(v.failureH);
export const validateProbeResult        = wrap(v.probe);
export const validateRetroNote          = wrap(v.retro);

export function readYaml(p) {
  return yaml.load(fs.readFileSync(p, 'utf8'));
}

export function writeYaml(p, obj) {
  const body = yaml.dump(obj, { lineWidth: 100, noRefs: true });
  fs.writeFileSync(p, body, 'utf8');
}

export function appendJsonl(p, obj) {
  fs.appendFileSync(p, JSON.stringify(obj) + '\n', 'utf8');
}

export function readJsonl(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

// Convenience appenders that validate before writing
export function appendSourceEntry(workspacePath, entry) {
  const r = validateSourceEntry(entry);
  if (!r.valid) throw new Error(`source entry invalid: ${JSON.stringify(r.errors)}`);
  const p = path.join(workspacePath, 'source_ledger.yaml');
  const existing = fs.existsSync(p) ? readYaml(p) || [] : [];
  existing.push(entry);
  writeYaml(p, existing);
}

export function appendClaimEntry(workspacePath, entry) {
  const r = validateClaimEntry(entry);
  if (!r.valid) throw new Error(`claim entry invalid: ${JSON.stringify(r.errors)}`);
  const p = path.join(workspacePath, 'claim_ledger.yaml');
  const existing = fs.existsSync(p) ? readYaml(p) || [] : [];
  existing.push(entry);
  writeYaml(p, existing);
}

export function appendProbeResult(workspacePath, entry) {
  const r = validateProbeResult(entry);
  if (!r.valid) throw new Error(`probe result invalid: ${JSON.stringify(r.errors)}`);
  appendJsonl(path.join(workspacePath, 'probe_results.jsonl'), entry);
}
