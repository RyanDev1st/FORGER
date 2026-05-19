import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runInstall } from '../../dev/scripts/install.mjs';

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
  });
});
