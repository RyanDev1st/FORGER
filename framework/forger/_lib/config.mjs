import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(here, '..');

dotenv.config({ path: path.join(pluginRoot, '.env') });

export function loadMode(name) {
  const p = path.join(pluginRoot, 'modes', `${name}.yaml`);
  if (!fs.existsSync(p)) throw new Error(`unknown mode: ${name}`);
  return yaml.load(fs.readFileSync(p, 'utf8'));
}

export function getConfig({ workspacePath, mode }) {
  return {
    pluginRoot,
    workspacePath,
    mode: loadMode(mode),
    env: process.env,
    schemaPaths: {
      dow:       path.join(pluginRoot, 'schemas', 'definition_of_works.schema.yaml'),
      source:    path.join(pluginRoot, 'schemas', 'source_ledger_entry.schema.yaml'),
      claim:     path.join(pluginRoot, 'schemas', 'claim_ledger_entry.schema.yaml'),
      riskMap:   path.join(pluginRoot, 'schemas', 'risk_map.schema.yaml'),
      failureH:  path.join(pluginRoot, 'schemas', 'failure_hypothesis.schema.yaml'),
      probe:     path.join(pluginRoot, 'schemas', 'probe_result.schema.yaml'),
      retro:     path.join(pluginRoot, 'schemas', 'retro_note.schema.yaml'),
    },
    kbPath: domainSlug => path.join(pluginRoot, 'knowledge', domainSlug),
    tierPriority: [
      'openai', 'google', 'anthropic', 'xai',
      'mistral', 'qwen', 'glm', 'kimi', 'deepseek',
    ],
  };
}
