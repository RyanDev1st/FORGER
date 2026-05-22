import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(here, '..', '..');
const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

const LATEST_RELEASE_URL = 'https://api.github.com/repos/CloakHQ/CloakBrowser/releases/latest';
const PLAYWRIGHT_CLI_VERSION = '^0.0.6';

export function parseArgs(argv) {
  return Object.fromEntries(
    argv.reduce((acc, v, i, a) => {
      if (v.startsWith('--')) acc.push([v.slice(2), a[i + 1] !== undefined && !a[i + 1].startsWith('--') ? a[i + 1] : true]);
      return acc;
    }, [])
  );
}

export function pickAsset(assets, { platform, arch }) {
  const platTokens = { win32: ['win', 'windows'], darwin: ['mac', 'osx', 'darwin'], linux: ['linux'] }[platform] || [];
  const archTokens = arch === 'arm64' ? ['arm64', 'aarch64'] : ['x64', 'x86_64', 'amd64'];
  const ext = platform === 'linux' ? '.tar.gz' : '.zip';
  const byNameLower = assets.map(a => ({ a, n: a.name.toLowerCase() }));
  const exact = byNameLower.find(({ n }) =>
    platTokens.some(p => n.includes(p)) && archTokens.some(x => n.includes(x)) && n.endsWith(ext)
  );
  if (exact) return exact.a;
  const platOnly = byNameLower.find(({ n }) => platTokens.some(p => n.includes(p)) && n.endsWith(ext));
  return platOnly ? platOnly.a : null;
}

export function binaryPathFor(platform, installDir) {
  if (platform === 'win32') return path.join(installDir, 'chrome.exe');
  if (platform === 'darwin') return path.join(installDir, 'Chromium.app', 'Contents', 'MacOS', 'Chromium');
  return path.join(installDir, 'chrome');
}

export function buildConfig(platform, executablePath) {
  // win32 needs double-backslashes when embedded in JSON
  const exe = platform === 'win32' ? executablePath.replace(/\\/g, '\\\\') : executablePath;
  return {
    browser: {
      launchOptions: {
        executablePath: exe,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--disable-infobars',
          '--lang=en-US',
        ],
      },
    },
  };
}

async function loadRelease({ releaseJsonPath, fetcher }) {
  if (releaseJsonPath) {
    return JSON.parse(fs.readFileSync(releaseJsonPath, 'utf8'));
  }
  const res = await fetcher(LATEST_RELEASE_URL, { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'forger-setup-browser' } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return await res.json();
}

function extractArchive(archivePath, destDir, platform) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(destDir, { recursive: true });
    let cmd, args;
    if (platform === 'win32') {
      cmd = 'powershell.exe';
      args = ['-NoProfile', '-Command', `Expand-Archive -LiteralPath '${archivePath}' -DestinationPath '${destDir}' -Force`];
    } else if (archivePath.endsWith('.tar.gz') || archivePath.endsWith('.tgz')) {
      cmd = 'tar';
      args = ['-xzf', archivePath, '-C', destDir];
    } else {
      cmd = 'unzip';
      args = ['-q', '-o', archivePath, '-d', destDir];
    }
    const proc = spawn(cmd, args, { stdio: 'inherit' });
    proc.on('error', err => reject(new Error(`extract failed (${cmd}): ${err.message}. Extract '${archivePath}' to '${destDir}' manually.`)));
    proc.on('exit', code => code === 0 ? resolve() : reject(new Error(`extract exit ${code}; extract '${archivePath}' to '${destDir}' manually.`)));
  });
}

async function downloadTo(url, dest, fetcher) {
  const res = await fetcher(url);
  if (!res.ok) throw new Error(`download ${url} failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function ensurePlaywrightDep(pkgJsonPath, plan) {
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  pkg.dependencies = pkg.dependencies || {};
  if (!pkg.dependencies['playwright-cli']) {
    plan.push({ kind: 'pkg-add', file: pkgJsonPath, dep: 'playwright-cli', version: PLAYWRIGHT_CLI_VERSION });
    return { ...pkg, dependencies: { ...pkg.dependencies, 'playwright-cli': PLAYWRIGHT_CLI_VERSION } };
  }
  return null;
}

export async function runSetupBrowser({ argv = process.argv.slice(2), env = process.env, fetcher = (typeof fetch !== 'undefined' ? fetch : null), platform = process.platform, arch = process.arch, log = console.log } = {}) {
  const args = parseArgs(argv);
  const dryRun = !!(args['dry-run'] || args.dry_run);
  const force = !!args.force;
  const configOnly = !!(args['config-only'] || args.config_only);
  const pinVersion = typeof args.version === 'string' ? args.version : null;
  const releaseJsonPath = typeof args['release-json'] === 'string' ? args['release-json'] : (typeof args.release_json === 'string' ? args.release_json : null);

  const home = env.HOME || env.USERPROFILE || os.homedir();
  const repoRoot = env.FORGER_REPO_ROOT || path.resolve(pluginRoot, '..', '..');
  const playwrightDir = path.join(repoRoot, '.playwright');
  const configPath = path.join(playwrightDir, 'cli.config.json');
  const plan = [];

  let release = null;
  if (!configOnly || !args.version) {
    release = await loadRelease({ releaseJsonPath, fetcher });
  }
  const version = pinVersion || (release && (release.tag_name || '').replace(/^v/, '')) || 'unknown';
  const installDir = path.join(home, '.cloakbrowser', `chromium-${version}`);
  const executablePath = binaryPathFor(platform, installDir);

  let asset = null;
  if (!configOnly) {
    if (!release) throw new Error('release manifest required (use --release-json for offline)');
    asset = pickAsset(release.assets || [], { platform, arch });
    if (!asset) throw new Error(`no asset found for ${platform}/${arch} in release ${release.tag_name}`);
    plan.push({ kind: 'pick-asset', asset: asset.name, url: asset.browser_download_url });
    const alreadyInstalled = fs.existsSync(installDir);
    if (alreadyInstalled && !force) {
      plan.push({ kind: 'skip-download', reason: 'already installed', installDir });
    } else {
      plan.push({ kind: 'download', from: asset.browser_download_url, to: installDir });
    }
  }
  plan.push({ kind: 'write-config', path: configPath, executablePath });

  const pkgJsonPath = path.join(pluginRoot, 'package.json');
  const updatedPkg = ensurePlaywrightDep(pkgJsonPath, plan);

  log(`Platform: ${platform}/${arch}`);
  log(`Version : ${version}`);
  log(`Install : ${installDir}`);
  log(`Config  : ${configPath}`);
  log(`Dry run : ${dryRun ? 'yes' : 'no'}`);
  log('--- Plan ---');
  for (const step of plan) log(JSON.stringify(step));

  if (dryRun) {
    log('Dry run: no files written.');
    return { plan, version, installDir, configPath, executablePath };
  }

  // Apply
  if (!configOnly && asset) {
    const alreadyInstalled = fs.existsSync(installDir);
    if (!alreadyInstalled || force) {
      const tmpFile = path.join(os.tmpdir(), `cloakbrowser-${version}-${Date.now()}${path.extname(asset.name) || '.zip'}`);
      log(`Downloading ${asset.browser_download_url} → ${tmpFile}`);
      await downloadTo(asset.browser_download_url, tmpFile, fetcher);
      log(`Extracting → ${installDir}`);
      await extractArchive(tmpFile, installDir, platform);
      try { fs.unlinkSync(tmpFile); } catch {}
    } else {
      log('Already installed; skipping download (use --force to re-install).');
    }
  }

  fs.mkdirSync(playwrightDir, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(buildConfig(platform, executablePath), null, 2), 'utf8');
  log(`Wrote ${configPath}`);

  if (updatedPkg) {
    fs.writeFileSync(pkgJsonPath, JSON.stringify(updatedPkg, null, 2) + '\n', 'utf8');
    log(`Added playwright-cli ${PLAYWRIGHT_CLI_VERSION} to package.json; run 'npm install' to fetch.`);
  }

  log('Next steps:');
  log(`  1. ${updatedPkg ? "run 'npm install'" : "playwright-cli already in deps"}`);
  log(`  2. verify: playwright-cli --version`);
  log(`  3. test:  npm test`);
  return { plan, version, installDir, configPath, executablePath };
}

if (entryUrl && import.meta.url === entryUrl) {
  runSetupBrowser().catch(err => { console.error(err.message); process.exit(1); });
}
