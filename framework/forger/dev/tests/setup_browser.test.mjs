import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { runSetupBrowser, pickAsset, binaryPathFor, buildConfig } from '../../dev/scripts/setup_browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.resolve(here, '..', 'fixtures', 'cloakbrowser-release.json');

describe('setup_browser', () => {
  it('pickAsset matches platform+arch with correct extension', () => {
    const release = JSON.parse(fs.readFileSync(fixture, 'utf8'));
    const winX64 = pickAsset(release.assets, { platform: 'win32', arch: 'x64' });
    expect(winX64.name).toMatch(/win-x64\.zip$/);
    const macArm = pickAsset(release.assets, { platform: 'darwin', arch: 'arm64' });
    expect(macArm.name).toMatch(/mac-arm64\.zip$/);
    const linX64 = pickAsset(release.assets, { platform: 'linux', arch: 'x64' });
    expect(linX64.name).toMatch(/linux-x64\.tar\.gz$/);
  });

  it('binaryPathFor returns platform-correct binary path', () => {
    expect(binaryPathFor('win32', '/foo')).toMatch(/chrome\.exe$/);
    expect(binaryPathFor('darwin', '/foo')).toMatch(/Chromium\.app/);
    expect(binaryPathFor('linux', '/foo')).toMatch(/chrome$/);
  });

  it('buildConfig escapes backslashes on win32 and sets stealth args', () => {
    const cfg = buildConfig('win32', 'C:\\path\\chrome.exe');
    expect(cfg.browser.launchOptions.executablePath).toContain('\\\\');
    expect(cfg.browser.launchOptions.args).toContain('--disable-blink-features=AutomationControlled');
    const linuxCfg = buildConfig('linux', '/usr/bin/chrome');
    expect(linuxCfg.browser.launchOptions.executablePath).toBe('/usr/bin/chrome');
  });

  it('dry-run with --release-json writes nothing and never calls fetcher', async () => {
    const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-setup-'));
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const fetcher = vi.fn(() => { throw new Error('fetcher must not be called'); });
    try {
      const result = await runSetupBrowser({
        argv: ['--dry-run', '--release-json', fixture],
        env: { HOME: tmpHome, USERPROFILE: tmpHome, FORGER_REPO_ROOT: tmpHome },
        fetcher,
        platform: 'win32',
        arch: 'x64',
        log: () => {},
      });
      expect(result.version).toBe('1.4.2');
      expect(result.installDir).toContain(path.join('.cloakbrowser', 'chromium-1.4.2'));
      // No config written, no install dir created
      expect(fs.existsSync(result.configPath)).toBe(false);
      expect(fs.existsSync(result.installDir)).toBe(false);
      expect(fetcher).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it('dry-run produces a plan with pick-asset and write-config steps', async () => {
    const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-setup-'));
    const result = await runSetupBrowser({
      argv: ['--dry-run', '--release-json', fixture],
      env: { HOME: tmpHome, FORGER_REPO_ROOT: tmpHome },
      fetcher: () => { throw new Error('no'); },
      platform: 'linux',
      arch: 'x64',
      log: () => {},
    });
    const kinds = result.plan.map(p => p.kind);
    expect(kinds).toContain('pick-asset');
    expect(kinds).toContain('write-config');
  });
});
