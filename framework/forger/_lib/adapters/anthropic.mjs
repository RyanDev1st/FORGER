// _lib/adapters/anthropic.mjs
export const provider = 'anthropic'; // replace per file
export const defaultModel = 'claude-sonnet-4-6'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('anthropic adapter not implemented in v0.1');
}
