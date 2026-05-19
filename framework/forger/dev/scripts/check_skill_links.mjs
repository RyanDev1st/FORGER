import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

const LINK_RE = /\b((refs|gates|tools|schemas|templates|lanes|_lib|hooks)\/[A-Za-z0-9_./-]+\.(md|mjs|yaml|jsonl|json|txt))\b/g;

function walk(dir, accept = () => true) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'workspaces') continue;
      out.push(...walk(p, accept));
    } else if (accept(p)) out.push(p);
  }
  return out;
}

const skillFiles = walk(path.join(root, 'phases'), p => p.endsWith('.md'));
const orchestratorSkill = path.join(root, 'SKILL.md');
if (fs.existsSync(orchestratorSkill)) skillFiles.push(orchestratorSkill);

let allOk = true;
for (const sf of skillFiles) {
  const text = fs.readFileSync(sf, 'utf8');
  const seen = new Set();
  for (const m of text.matchAll(LINK_RE)) {
    const rel = m[1];
    if (seen.has(rel)) continue;
    seen.add(rel);
    const candidates = [
      path.resolve(path.dirname(sf), rel),
      path.resolve(path.dirname(sf), '..', rel),
      path.resolve(root, rel),
    ];
    if (!candidates.some(p => fs.existsSync(p))) {
      console.error(`BROKEN ${sf}: ${rel}`);
      allOk = false;
    }
  }
}

if (allOk) console.log('all skill links resolve');
process.exit(allOk ? 0 : 1);
