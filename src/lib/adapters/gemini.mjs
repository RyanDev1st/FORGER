// src/lib/adapters/gemini.mjs
export const provider = 'google'; // replace per file
export const defaultModel = 'gemini-2.5-pro'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('google adapter not implemented in v0.1');
}
