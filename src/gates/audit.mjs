import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readYaml, writeYaml,
         validateSourceEntry, validateClaimEntry } from '../lib/ledger.mjs';
import { headRequest, getPageText, grepQuote } from '../lib/playwright.mjs';

const STOPWORDS = new Set(['a','an','the','of','and','or','to','in','for','on','with','by','is','are','as','at','it','that','this']);
const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

function bigrams(text) {
  const tokens = text.toLowerCase()
                     .replace(/[^a-z0-9 ]+/g, ' ')
                     .split(/\s+/)
                     .filter(t => t && !STOPWORDS.has(t));
  const out = new Set();
  for (let i = 0; i < tokens.length - 1; i++) out.add(tokens[i] + ' ' + tokens[i + 1]);
  return out;
}

function overlap(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n / Math.min(a.size, b.size);
}

export async function runAudit({ workspace, skipNetwork = false }) {
  const sourcePath = path.join(workspace, 'source_ledger.yaml');
  const claimPath  = path.join(workspace, 'claim_ledger.yaml');
  const sources    = fs.existsSync(sourcePath) ? readYaml(sourcePath) || [] : [];
  const claims     = fs.existsSync(claimPath)  ? readYaml(claimPath)  || [] : [];

  const errors = [];
  const warnings = [];
  const flagsBySource = {};
  const flagsByClaim = {};

  // Schema validation
  for (const s of sources) {
    const r = validateSourceEntry(s);
    if (!r.valid) errors.push({ kind: 'source-schema', id: s.id, errors: r.errors });
  }
  for (const c of claims) {
    const r = validateClaimEntry(c);
    if (!r.valid) errors.push({ kind: 'claim-schema', id: c.id, errors: r.errors });
  }

  // Source IDs index
  const sourceIds = new Set(sources.map(s => s.id));

  // HEAD-request each source
  if (!skipNetwork) {
    for (const s of sources) {
      const r = await headRequest(s.url, { timeoutMs: 5000 });
      if (r.status < 200 || r.status >= 400) {
        flagsBySource[s.id] = [...(flagsBySource[s.id] || []), 'link-dead'];
      }
    }
  }

  // Per-claim checks
  const lanes = new Set(claims.map(c => c.lane).filter(Boolean));
  for (const c of claims) {
    // Lineage
    if (!sourceIds.has(c.source_id)) {
      flagsByClaim[c.id] = [...(flagsByClaim[c.id] || []), 'orphan-claim'];
      continue;
    }
    // Quote grep
    if (!skipNetwork) {
      const s = sources.find(x => x.id === c.source_id);
      const txt = await getPageText(s.url);
      if (!grepQuote(txt, c.verbatim_quote)) {
        flagsByClaim[c.id] = [...(flagsByClaim[c.id] || []), 'quote-not-found'];
      }
    }
  }

  // Bigram anti-redundancy (frontier vs production+community)
  if (lanes.has('frontier') && (lanes.has('production') || lanes.has('community'))) {
    const baseSet = new Set();
    for (const c of claims) {
      if (c.lane === 'production' || c.lane === 'community') {
        for (const bg of bigrams(c.claim_text + ' ' + c.verbatim_quote)) baseSet.add(bg);
      }
    }
    for (const c of claims) {
      if (c.lane !== 'frontier') continue;
      const ov = overlap(bigrams(c.claim_text + ' ' + c.verbatim_quote), baseSet);
      if (ov >= 0.30) {
        flagsByClaim[c.id] = [...(flagsByClaim[c.id] || []), 'redundant-with-other-lane'];
      }
    }
  }

  // Independence advisory (warnings only)
  for (const c of claims) {
    if (c.severity === 'critical') {
      const linked = sources.filter(s => s.id === c.source_id);
      const indep = linked.filter(s => (s.quality_scores?.independence || 0) >= 4);
      if (indep.length < 2) {
        warnings.push({ kind: 'low-independence', claim: c.id });
      }
    }
  }

  // Lane-floor advisory: warn when a lane has fewer claims than its floor and
  // its closing-block comment did not declare itself under_sourced. Floors per
  // DESIGN §7: production=5, community=5, frontier=3.
  const laneFloors = { production: 5, community: 5, frontier: 3 };
  const claimsByLane = {};
  for (const c of claims) {
    if (!c.lane) continue;
    claimsByLane[c.lane] = (claimsByLane[c.lane] || 0) + 1;
  }
  const rawSource = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, 'utf8') : '';
  function laneUnderSourced(lane) {
    const re = new RegExp(`#\\s*lane:\\s*${lane}[\\s\\S]*?#\\s*under_sourced:\\s*true`, 'i');
    return re.test(rawSource);
  }
  for (const [lane, floor] of Object.entries(laneFloors)) {
    const count = claimsByLane[lane] || 0;
    if (count > 0 && count < floor && !laneUnderSourced(lane)) {
      warnings.push({ kind: 'lane-under-floor', lane, count, floor });
    }
  }

  // Merge new flags; only rewrite ledger files when something actually changed
  // so YAML comments (schema headers + lane-summary closing blocks) survive a
  // no-op audit pass.
  let sourcesChanged = false;
  for (const s of sources) {
    if (!flagsBySource[s.id]) continue;
    const before = new Set(s.flags || []);
    const merged = new Set([...before, ...flagsBySource[s.id]]);
    if (merged.size !== before.size) {
      s.flags = [...merged];
      sourcesChanged = true;
    }
  }
  let claimsChanged = false;
  for (const c of claims) {
    if (!flagsByClaim[c.id]) continue;
    const before = new Set(c.flags || []);
    const merged = new Set([...before, ...flagsByClaim[c.id]]);
    if (merged.size !== before.size) {
      c.flags = [...merged];
      claimsChanged = true;
    }
  }
  if (sourcesChanged && fs.existsSync(sourcePath)) writeYaml(sourcePath, sources);
  if (claimsChanged  && fs.existsSync(claimPath))  writeYaml(claimPath, claims);

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    flagsBySource,
    flagsByClaim,
  };
}

// CLI entry
if (entryUrl && import.meta.url === entryUrl) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.workspace) {
    console.error('Usage: audit.mjs --workspace <path>');
    process.exit(2);
  }
  const r = await runAudit({ workspace: args.workspace, skipNetwork: args['skip-network'] });
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.passed ? 0 : 1);
}

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
