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

// YAML/JSONL files seeded so downstream readers see a valid empty container.
// Markdown placeholders left empty so phase skills can Write fresh without
// hitting the harness's "must Read before Write" guard on prefilled files.
const seeds = {
  'source_ledger.yaml':       '[]\n',
  'claim_ledger.yaml':        '[]\n',
  'failure_hypotheses.yaml':  '[]\n',
  'tier2_speculation.md':     '',
  'tier3_proposals.md':       '',
  'recombine.md':             '',
  'find_summary.md':          '',
  'grill_report.md':          '',
  'ground_truth_brief.md':    '',
  'reframe_memo.md':          '',
  'acceptance_results.jsonl': '',
  'probe_results.jsonl':      '',
  'telemetry.jsonl':          '',
  'hook_log.jsonl':           '',
};
for (const [name, body] of Object.entries(seeds)) {
  fs.writeFileSync(path.join(ws, name), body, 'utf8');
}

console.log(JSON.stringify({ workspace: ws, slug, date, query: args.query || '' }, null, 2));
