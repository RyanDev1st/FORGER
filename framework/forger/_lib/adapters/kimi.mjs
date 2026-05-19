// _lib/adapters/kimi.mjs
export const provider = 'kimi'; // replace per file
export const defaultModel = 'k2'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('kimi adapter not implemented in v0.1');
}
