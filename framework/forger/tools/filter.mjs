#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { headRequest } from '../_lib/playwright.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const blocklistPath = path.resolve(here, '..', '_lib', 'domain_blocklist.txt');

function loadBlocklist() {
  if (!fs.existsSync(blocklistPath)) return new Set();
  return new Set(
    fs.readFileSync(blocklistPath, 'utf8')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('#'))
  );
}

async function checkGithubRepo(url) {
  const m = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!m) return { ok: true };
  const api = `https://api.github.com/repos/${m[1]}/${m[2]}`;
  try {
    const res = await fetch(api, { headers: { 'User-Agent': 'forger' } });
    if (!res.ok) return { ok: false, reason: `github API ${res.status}` };
    const j = await res.json();
    const pushed = new Date(j.pushed_at);
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 86400000);
    if (j.stargazers_count < 1 && pushed < twoYearsAgo) {
      return { ok: false, reason: 'github repo low signal' };
    }
    return { ok: true, github_meta: { stars: j.stargazers_count, pushed_at: j.pushed_at } };
  } catch (err) {
    return { ok: true };
  }
}

export async function filterUrls(candidates) {
  const blocklist = loadBlocklist();
  const kept = [];
  const rejected = [];
  for (const c of candidates) {
    let host;
    try { host = new URL(c.url).host; }
    catch { rejected.push({ url: c.url, reason: 'invalid URL' }); continue; }
    if (blocklist.has(host)) {
      rejected.push({ url: c.url, reason: 'domain blocklisted' });
      continue;
    }
    const head = await headRequest(c.url);
    if (head.status < 200 || head.status >= 400) {
      rejected.push({ url: c.url, reason: `HEAD ${head.status || 'err'}` });
      continue;
    }
    if (host === 'github.com') {
      const g = await checkGithubRepo(c.url);
      if (!g.ok) { rejected.push({ url: c.url, reason: g.reason }); continue; }
      kept.push({ ...c, accessed_at: new Date().toISOString(), github_meta: g.github_meta });
      continue;
    }
    kept.push({ ...c, accessed_at: new Date().toISOString() });
  }
  return { kept, rejected };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = Object.fromEntries(
    process.argv.slice(2).reduce((acc, v, i, a) => {
      if (v.startsWith('--')) acc.push([v.slice(2), a[i + 1]]);
      return acc;
    }, [])
  );
  if (!args.urls) {
    console.error('Usage: filter.mjs --urls <jsonfile>');
    process.exit(2);
  }
  const candidates = JSON.parse(fs.readFileSync(args.urls, 'utf8'));
  const r = await filterUrls(candidates);
  console.log(JSON.stringify(r, null, 2));
}
