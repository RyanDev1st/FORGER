import { execFileSync } from 'node:child_process';

// _lib/adapters/codex_cli.mjs
export const provider = 'codex_cli'; // replace per file
export const defaultModel = 'codex'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  try {
    execFileSync(process.platform === 'win32' ? 'where' : 'which', ['codex'], { stdio: 'ignore' });
  } catch {
    // unavailable or not on PATH
  }
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('codex_cli adapter not implemented in v0.1');
}
