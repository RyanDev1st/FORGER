import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  readYaml,
  validateDoW, validateSourceEntry, validateClaimEntry,
  validateRiskMap, validateProbeResult, validateRetroNote,
  validateFailureHypothesis,
} from '../lib/ledger.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

const checks = [
  { match: 'dow.familiar-domain.yaml',        fn: validateDoW,                kind: 'object' },
  { match: 'dow.novel-domain.yaml',           fn: validateDoW,                kind: 'object' },
  { match: 'risk_map.example.yaml',           fn: validateRiskMap,            kind: 'object' },
  { match: 'retro_note.example.yaml',         fn: validateRetroNote,          kind: 'object' },
  { match: 'source_ledger.example.yaml',      fn: validateSourceEntry,        kind: 'array'  },
  { match: 'claim_ledger.example.yaml',       fn: validateClaimEntry,         kind: 'array'  },
  { match: 'failure_hypotheses.example.yaml', fn: validateFailureHypothesis,  kind: 'array'  },
];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.yaml')) out.push(p);
  }
  return out;
}

const examplesRoot = path.join(root, 'phases');
let allOk = true;
let countOk = 0;
for (const file of walk(examplesRoot).filter(f => f.includes(`${path.sep}examples${path.sep}`))) {
  const check = checks.find(c => file.endsWith(c.match));
  if (!check) { console.log(`skip ${file} (no validator mapped)`); continue; }
  const data = readYaml(file);
  if (check.kind === 'object') {
    const r = check.fn(data);
    if (!r.valid) { allOk = false; console.error(`FAIL ${file}: ${JSON.stringify(r.errors)}`); }
    else { console.log(`ok   ${file}`); countOk++; }
  } else {
    if (!Array.isArray(data)) { allOk = false; console.error(`FAIL ${file}: expected array`); continue; }
    let ok = true;
    data.forEach((item, i) => {
      const r = check.fn(item);
      if (!r.valid) { ok = false; console.error(`FAIL ${file}[${i}]: ${JSON.stringify(r.errors)}`); }
    });
    if (ok) { console.log(`ok   ${file} (${data.length} items)`); countOk++; }
    else allOk = false;
  }
}
console.log(`validated ${countOk} example file(s)`);
process.exit(allOk ? 0 : 1);
