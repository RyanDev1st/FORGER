import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadMode, getConfig } from '../../_lib/config.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

describe('config', () => {
  it('loads quick mode', () => {
    const m = loadMode('quick');
    expect(m.lanes).toEqual(['production']);
    expect(m.token_budget_cold).toBe(6000);
  });

  it('loads standard mode', () => {
    const m = loadMode('standard');
    expect(m.lanes).toEqual(['production', 'community']);
  });

  it('loads deep mode', () => {
    const m = loadMode('deep');
    expect(m.lanes).toEqual(['production', 'community', 'frontier']);
    expect(m.grill_blind_reviewer).toBe(true);
  });

  it('getConfig assembles config from a workspace path', () => {
    const cfg = getConfig({ workspacePath: '/tmp/ws-fake', mode: 'standard' });
    expect(cfg.mode.lanes).toEqual(['production', 'community']);
    expect(cfg.pluginRoot).toMatch(/forger$/);
  });
});
