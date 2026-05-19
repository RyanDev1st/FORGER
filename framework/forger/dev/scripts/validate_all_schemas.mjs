#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemasDir = path.resolve(here, '..', '..', 'schemas');

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);

let allOk = true;
for (const file of fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.yaml'))) {
  const fullPath = path.join(schemasDir, file);
  const schema = yaml.load(fs.readFileSync(fullPath, 'utf8'));
  try {
    ajv.compile(schema);
    console.log(`ok   ${file}`);
  } catch (err) {
    allOk = false;
    console.error(`FAIL ${file}: ${err.message}`);
  }
}
process.exit(allOk ? 0 : 1);
