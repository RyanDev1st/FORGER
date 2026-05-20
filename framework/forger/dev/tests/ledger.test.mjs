import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  validateDoW,
  validateSourceEntry,
  validateClaimEntry,
  validateRiskMap,
  validateProbeResult,
  validateRetroNote,
  validateFailureHypothesis,
  readYaml,
  writeYaml,
  appendJsonl,
  readJsonl,
} from '../../src/lib/ledger.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const tmpl = path.join(root, 'templates');

describe('ledger validators', () => {
  it('validateDoW accepts the DoW template', () => {
    const obj = readYaml(path.join(tmpl, 'dow.template.yaml'));
    const r = validateDoW(obj);
    expect(r.valid).toBe(true);
  });

  it('validateSourceEntry accepts the source_ledger template items', () => {
    const arr = readYaml(path.join(tmpl, 'source_ledger.template.yaml'));
    for (const item of arr) {
      const r = validateSourceEntry(item);
      expect(r.valid).toBe(true);
    }
  });

  it('validateClaimEntry rejects a claim missing verbatim_quote', () => {
    const arr = readYaml(path.join(tmpl, 'claim_ledger.template.yaml'));
    const bad = { ...arr[0] };
    delete bad.verbatim_quote;
    const r = validateClaimEntry(bad);
    expect(r.valid).toBe(false);
  });

  it('validateRiskMap accepts template', () => {
    const obj = readYaml(path.join(tmpl, 'risk_map.template.yaml'));
    expect(validateRiskMap(obj).valid).toBe(true);
  });

  it('validateProbeResult accepts template', () => {
    const obj = readYaml(path.join(tmpl, 'probe_result.template.yaml'));
    expect(validateProbeResult(obj).valid).toBe(true);
  });

  it('validateRetroNote accepts template', () => {
    const obj = readYaml(path.join(tmpl, 'retro_note.template.yaml'));
    expect(validateRetroNote(obj).valid).toBe(true);
  });

  it('validateFailureHypothesis accepts template items', () => {
    const arr = readYaml(path.join(tmpl, 'failure_hypotheses.template.yaml'));
    for (const item of arr) {
      expect(validateFailureHypothesis(item).valid).toBe(true);
    }
  });
});

describe('ledger I/O', () => {
  it('writeYaml round-trips an object', () => {
    const tmp = path.join(os.tmpdir(), `forger-yaml-${Date.now()}.yaml`);
    const data = { hello: 'world', n: 1, list: [1, 2, 3] };
    writeYaml(tmp, data);
    const round = readYaml(tmp);
    expect(round).toEqual(data);
    fs.unlinkSync(tmp);
  });

  it('appendJsonl appends one line per call', () => {
    const tmp = path.join(os.tmpdir(), `forger-jsonl-${Date.now()}.jsonl`);
    appendJsonl(tmp, { a: 1 });
    appendJsonl(tmp, { b: 2 });
    const lines = readJsonl(tmp);
    expect(lines).toEqual([{ a: 1 }, { b: 2 }]);
    fs.unlinkSync(tmp);
  });
});
