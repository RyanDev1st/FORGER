#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const schemasDir = path.join(root, 'schemas');
const templatesDir = path.join(root, 'templates');

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);

const validators = {};
let allOk = true;

// Compile each schema
for (const file of fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.yaml'))) {
  const schema = yaml.load(fs.readFileSync(path.join(schemasDir, file), 'utf8'));
  try {
    validators[file] = ajv.compile(schema);
    console.log(`schema ok   ${file}`);
  } catch (err) {
    allOk = false;
    console.error(`schema FAIL ${file}: ${err.message}`);
  }
}

// Map template -> schema (by filename convention)
const templateToSchema = {
  'dow.template.yaml': 'definition_of_works.schema.yaml',
  'source_ledger.template.yaml': 'source_ledger_entry.schema.yaml',
  'claim_ledger.template.yaml': 'claim_ledger_entry.schema.yaml',
  'risk_map.template.yaml': 'risk_map.schema.yaml',
  'failure_hypotheses.template.yaml': 'failure_hypothesis.schema.yaml',
  'probe_result.template.yaml': 'probe_result.schema.yaml',
  'retro_note.template.yaml': 'retro_note.schema.yaml',
};

for (const [tmplName, schemaName] of Object.entries(templateToSchema)) {
  const tmplPath = path.join(templatesDir, tmplName);
  const validator = validators[schemaName];
  if (!validator) {
    console.error(`template SKIP ${tmplName}: schema ${schemaName} missing`);
    allOk = false;
    continue;
  }
  const data = yaml.load(fs.readFileSync(tmplPath, 'utf8'));
  // Arrays of entries (source_ledger, claim_ledger, failure_hypotheses) validate each item
  if (Array.isArray(data)) {
    let arrayOk = true;
    data.forEach((item, i) => {
      if (!validator(item)) {
        arrayOk = false;
        console.error(`template FAIL ${tmplName}[${i}]: ${JSON.stringify(validator.errors)}`);
      }
    });
    if (arrayOk) console.log(`template ok ${tmplName} (${data.length} items)`);
    else allOk = false;
  } else {
    if (validator(data)) {
      console.log(`template ok ${tmplName}`);
    } else {
      console.error(`template FAIL ${tmplName}: ${JSON.stringify(validator.errors)}`);
      allOk = false;
    }
  }
}

process.exit(allOk ? 0 : 1);
