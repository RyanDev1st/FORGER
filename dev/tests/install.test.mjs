import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runInstall } from '../../src/dev/install.mjs';

describe('install', () => {
  it('updates files in an existing plugin directory', () => {
    const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-install-'));
    const target = path.join(claudeHome, 'plugins', 'forger');
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'README.md'), 'stale');
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      runInstall({ argv: [], env: { CLAUDE_HOME: claudeHome } });
    } finally {
      log.mockRestore();
    }

    expect(fs.readFileSync(path.join(target, 'README.md'), 'utf8')).not.toBe('stale');
    expect(fs.existsSync(path.join(target, 'src', 'hooks', 'settings.hooks.json'))).toBe(true);
    expect(fs.existsSync(path.join(target, 'src', 'gates'))).toBe(true);
    expect(fs.existsSync(path.join(target, 'src', 'cli'))).toBe(true);
    expect(fs.existsSync(path.join(target, 'src', 'lib'))).toBe(true);
    expect(fs.existsSync(path.join(target, 'src', 'dev', 'install.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(target, 'skills', 'forger', 'phases'))).toBe(true);
    expect(fs.existsSync(path.join(target, 'skills', 'forger', 'modes'))).toBe(true);
    expect(fs.existsSync(path.join(target, 'hooks'))).toBe(false);
    expect(fs.existsSync(path.join(target, 'gates'))).toBe(false);
    expect(fs.existsSync(path.join(target, 'tools'))).toBe(false);
    expect(fs.existsSync(path.join(target, '_lib'))).toBe(false);
    expect(fs.existsSync(path.join(target, 'dev', 'scripts'))).toBe(false);
    expect(fs.existsSync(path.join(target, 'phases'))).toBe(false);
    expect(fs.existsSync(path.join(target, 'modes'))).toBe(false);
  });
});
