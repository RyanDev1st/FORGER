// src/lib/adapters/xai.mjs
export const provider = 'xai'; // replace per file
export const defaultModel = 'grok-4'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('xai adapter not implemented in v0.1');
}
