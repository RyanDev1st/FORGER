import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
const STOPWORDS = new Set(['a','an','the','of','and','or','to','in','for','on','with','by','is','are','as','at','it','that','this']);

function bigrams(text) {
  const tokens = (text || '').toLowerCase()
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

function parseTierFile(p) {
  if (!fs.existsSync(p)) return [];
  const text = fs.readFileSync(p, 'utf8');
  const entries = [];
  let buf = '';
  let promoted = null;
  let idea = '';
  function flush() {
    if (buf.trim()) entries.push({ block: buf, idea, promoted_at: promoted });
    buf = ''; promoted = null; idea = '';
  }
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) {
      flush();
      buf = line + '\n';
      continue;
    }
    buf += line + '\n';
    const ideaMatch = line.match(/^\s*-\s*idea:\s*(.+)$/i);
    if (ideaMatch) idea = ideaMatch[1].trim();
    const promMatch = line.match(/^\s*-\s*promoted_at:\s*(.+)$/i);
    if (promMatch) {
      const v = promMatch[1].trim();
      promoted = (v === 'null' || v === '') ? null : v;
    }
  }
  flush();
  return entries;
}

export async function checkTierFirewall({ tool_name, file_path, content, command, workspace }) {
  if (!workspace || !fs.existsSync(workspace)) return { block: false };
  if (file_path && /tier2_speculation\.md|tier3_proposals\.md/.test(file_path)) return { block: false };
  const candidates = [
    ...parseTierFile(path.join(workspace, 'tier2_speculation.md')),
    ...parseTierFile(path.join(workspace, 'tier3_proposals.md')),
  ].filter(e => !e.promoted_at);
  if (candidates.length === 0) return { block: false };

  const propBg = bigrams(content || command || '');
  for (const c of candidates) {
    const ov = overlap(propBg, bigrams(c.idea + ' ' + c.block));
    if (ov >= 0.60) {
      return {
        block: true,
        reason: `Proposed write overlaps un-promoted speculative idea: '${c.idea.slice(0, 80)}'.`,
        overlap: ov,
      };
    }
  }
  return { block: false };
}

if (entryUrl && import.meta.url === entryUrl) {
  let payload = '';
  process.stdin.on('data', chunk => payload += chunk);
  process.stdin.on('end', async () => {
    let parsed = {};
    try { parsed = JSON.parse(payload); } catch {}
    const r = await checkTierFirewall({
      tool_name: parsed.tool_name,
      file_path: parsed.file_path || parsed.path,
      content: parsed.content || parsed.new_string,
      command: parsed.command,
      workspace: process.env.FORGER_WORKSPACE || '',
    });
    if (r.block) {
      console.error(JSON.stringify({
        level: 'error', code: 'tier_firewall', message: r.reason,
        suggested_action: 'Promote the Tier 2/3 idea explicitly by setting promoted_at, or rephrase the change so it does not derive from a speculative idea.',
      }));
      process.exit(2);
    }
    process.exit(0);
  });
}
