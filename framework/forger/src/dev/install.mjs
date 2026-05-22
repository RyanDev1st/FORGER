import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginSource = path.resolve(here, '..', '..');
const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

export function parseArgs(argv) {
  return Object.fromEntries(
    argv.reduce((acc, v, i, a) => {
      if (v.startsWith('--')) acc.push([v.slice(2), a[i + 1] !== undefined && !a[i + 1].startsWith('--') ? a[i + 1] : true]);
      return acc;
    }, [])
  );
}

export function copyDir(src, dst, { skip = [], skipRoot = [] } = {}) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.includes(entry.name) || skipRoot.includes(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d, { skip });
    else fs.copyFileSync(s, d);
  }
}

export function mergeHooks(settings, template) {
  const out = JSON.parse(JSON.stringify(settings));
  out.hooks = out.hooks || {};
  for (const [event, blocks] of Object.entries(template.hooks)) {
    out.hooks[event] = out.hooks[event] || [];
    for (const block of blocks) {
      const exists = out.hooks[event].some(b => JSON.stringify(b) === JSON.stringify(block));
      if (!exists) out.hooks[event].push(block);
    }
  }
  return out;
}

export function diffJson(a, b) {
  const oldLines = new Set(JSON.stringify(a, null, 2).split('\n'));
  return JSON.stringify(b, null, 2).split('\n')
    .map(line => (oldLines.has(line) ? '  ' : '+ ') + line)
    .join('\n');
}

export function runInstall({ argv = process.argv.slice(2), env = process.env } = {}) {
  const args = parseArgs(argv);
  const dryRun = args['dry-run'] || args.dry_run;
  const claudeHome = env.CLAUDE_HOME || path.join(os.homedir(), '.claude');
  const pluginsDir = path.join(claudeHome, 'plugins');
  const targetDir = path.join(pluginsDir, 'forger');
  const settingsPath = path.join(claudeHome, 'settings.json');
  const hookTemplate = JSON.parse(fs.readFileSync(path.join(pluginSource, 'src', 'hooks', 'settings.hooks.json'), 'utf8'));

  console.log(`Source:   ${pluginSource}`);
  console.log(`Target:   ${targetDir}`);
  console.log(`Settings: ${settingsPath}`);
  console.log(`Dry run:  ${dryRun ? 'yes' : 'no'}`);

  if (!dryRun) {
    fs.mkdirSync(pluginsDir, { recursive: true });
    const existed = fs.existsSync(targetDir);
    copyDir(pluginSource, targetDir, { skip: ['node_modules', 'workspaces', '.git', 'scripts'], skipRoot: ['hooks', 'gates', 'tools', '_lib', 'phases', 'modes'] });
    console.log(existed ? 'Updated plugin tree.' : 'Copied plugin tree.');
  }

  const existingSettings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, 'utf8')) : {};
  const proposed = mergeHooks(existingSettings, hookTemplate);
  console.log('\n--- Settings diff (proposed) ---');
  console.log(diffJson(existingSettings, proposed));

  if (!dryRun) {
    fs.writeFileSync(settingsPath, JSON.stringify(proposed, null, 2), 'utf8');
    console.log('Wrote settings.json.');
  }
}

if (entryUrl && import.meta.url === entryUrl) runInstall();
