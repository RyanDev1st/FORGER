import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(here, '..', '..');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      const v = (i + 1 < argv.length && !argv[i + 1].startsWith('--')) ? argv[++i] : true;
      out[k] = v;
    }
  }
  return out;
}

function slugify(s) {
  return s.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 40);
}

const args = parseArgs(process.argv.slice(2));
if (!args.slug || !args.date) {
  console.error('Usage: new_workspace.mjs --slug <slug> --date YYYY-MM-DD [--query <verbatim>]');
  process.exit(2);
}

const slug = slugify(args.slug);
const date = args.date;
let base = path.join(pluginRoot, 'workspaces', `${slug}-${date}`);
let suffix = '';
let n = 2;
while (fs.existsSync(base + suffix)) {
  suffix = `-v${n++}`;
}
const ws = base + suffix;
fs.mkdirSync(ws, { recursive: true });

const seeds = {
  'source_ledger.yaml':       '[]\n',
  'claim_ledger.yaml':        '[]\n',
  'failure_hypotheses.yaml':  '[]\n',
  'tier2_speculation.md':     '# Tier 2 Speculation\n',
  'tier3_proposals.md':       '# Tier 3 Proposals\n',
  'recombine.md':             '# Recombine (Tier 1)\n',
  'find_summary.md':          '# Find Summary\n',
  'grill_report.md':          '# Grill Report\n',
  'ground_truth_brief.md':    '# Ground-Truth Brief\n',
  'acceptance_results.jsonl': '',
  'probe_results.jsonl':      '',
  'telemetry.jsonl':          '',
  'hook_log.jsonl':           '',
};
for (const [name, body] of Object.entries(seeds)) {
  fs.writeFileSync(path.join(ws, name), body, 'utf8');
}

fs.writeFileSync(path.join(ws, 'reframe_memo.md'),
  '# Reframe Memo\n\n(CONTRACT writes this.)\n', 'utf8');

console.log(JSON.stringify({ workspace: ws, slug, date, query: args.query || '' }, null, 2));
