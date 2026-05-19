#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  readYaml, writeYaml, appendJsonl, readJsonl,
  validateRetroNote,
} from '../_lib/ledger.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultPluginRoot = path.resolve(here, '..');

export async function runUpdateKb({ workspace, pluginRoot = defaultPluginRoot, now = new Date() }) {
  const retro = readYaml(path.join(workspace, 'retro_note.yaml'));
  const v = validateRetroNote(retro);
  if (!v.valid) throw new Error('retro_note invalid: ' + JSON.stringify(v.errors));

  const domain = retro.domain_slug;
  const domDir = path.join(pluginRoot, 'knowledge', domain);
  fs.mkdirSync(domDir, { recursive: true });

  const idxPath = path.join(domDir, 'index.yaml');
  const srcPath = path.join(domDir, 'source_ledger.yaml');
  const clmPath = path.join(domDir, 'claim_ledger.yaml');
  const fmPath  = path.join(domDir, 'failure_memory.yaml');
  const archPath = path.join(domDir, 'working_architectures.md');
  const telPath = path.join(domDir, 'telemetry.jsonl');

  const idx = fs.existsSync(idxPath) ? readYaml(idxPath) : {
    domain_slug: domain,
    created_at: now.toISOString(),
    last_updated_at: now.toISOString(),
    tasks_completed: 0, tasks_shipped: 0, tasks_escalated: 0, tasks_abandoned: 0,
    shortcut_eligible: false, shortcut_coverage: 0,
    default_ttl_days: 90,
    known_sources: [], known_failure_patterns: [],
  };

  const src = fs.existsSync(srcPath) ? readYaml(srcPath) || [] : [];
  const clm = fs.existsSync(clmPath) ? readYaml(clmPath) || [] : [];
  const fm  = fs.existsSync(fmPath)  ? readYaml(fmPath)  || [] : [];

  const wsSrc = fs.existsSync(path.join(workspace, 'source_ledger.yaml'))
                ? readYaml(path.join(workspace, 'source_ledger.yaml')) || [] : [];
  const wsClm = fs.existsSync(path.join(workspace, 'claim_ledger.yaml'))
                ? readYaml(path.join(workspace, 'claim_ledger.yaml')) || [] : [];

  let proven_claims_merged = 0;
  for (const id of retro.proven_claim_ids || []) {
    const claim = wsClm.find(c => c.id === id);
    if (!claim) continue;
    const ttl = (retro.ttl_overrides && retro.ttl_overrides[id]) || idx.default_ttl_days;
    const expires = new Date(now.getTime() + ttl * 86400000).toISOString();
    const upserted = { ...claim, expires_at: expires };
    const ix = clm.findIndex(c => c.id === id);
    if (ix >= 0) clm[ix] = upserted; else clm.push(upserted);
    proven_claims_merged++;

    const s = wsSrc.find(s => s.id === claim.source_id);
    if (s) {
      const sExpires = new Date(now.getTime() + (s.ttl_days || 90) * 86400000).toISOString();
      const sUp = { ...s, expires_at: sExpires };
      const sx = src.findIndex(x => x.id === s.id);
      if (sx >= 0) src[sx] = sUp; else src.push(sUp);
      if (!idx.known_sources.includes(s.id)) idx.known_sources.push(s.id);
    }
  }

  for (const f of retro.failed_assumptions || []) fm.push(f);

  if (retro.working_architecture_ref) {
    const refPath = path.isAbsolute(retro.working_architecture_ref)
                    ? retro.working_architecture_ref
                    : path.join(workspace, retro.working_architecture_ref);
    if (fs.existsSync(refPath)) {
      const body = fs.readFileSync(refPath, 'utf8');
      const hdr = `\n\n## ${retro.task_id}\n\n`;
      const existing = fs.existsSync(archPath) ? fs.readFileSync(archPath, 'utf8') : '# Working architectures\n';
      fs.writeFileSync(archPath, existing + hdr + body, 'utf8');
    }
  }

  if (retro.status === 'shipped')    idx.tasks_shipped++;
  if (retro.status === 'escalated')  idx.tasks_escalated++;
  if (retro.status === 'abandoned')  idx.tasks_abandoned++;
  idx.tasks_completed = idx.tasks_shipped + idx.tasks_escalated + idx.tasks_abandoned;
  idx.last_updated_at = now.toISOString();

  appendJsonl(telPath, {
    ts: now.toISOString(), task_id: retro.task_id, mode: retro.mode_used,
    token_used: retro.token_used, duration_ms: retro.duration_ms, status: retro.status,
  });

  const tel = readJsonl(telPath);
  const last3 = tel.slice(-3);
  if (last3.length === 3 && last3.every(l => l.status === 'shipped')) {
    idx.shortcut_eligible = true;
  }

  writeYaml(idxPath, idx);
  writeYaml(srcPath, src);
  writeYaml(clmPath, clm);
  writeYaml(fmPath, fm);
  if (!fs.existsSync(archPath)) fs.writeFileSync(archPath, '# Working architectures\n', 'utf8');

  return { proven_claims_merged, status: retro.status };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const argv = process.argv.slice(2);
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      const v = (i + 1 < argv.length && !argv[i + 1].startsWith('--')) ? argv[++i] : true;
      args[k] = v;
    }
  }
  if (!args.workspace) {
    console.error('Usage: update_kb.mjs --workspace <path>');
    process.exit(2);
  }
  const r = await runUpdateKb({ workspace: args.workspace });
  console.log(JSON.stringify(r, null, 2));
}
