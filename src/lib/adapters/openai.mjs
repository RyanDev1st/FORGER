// src/lib/adapters/openai.mjs
export const provider = 'openai'; // replace per file
export const defaultModel = 'gpt-5'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('openai adapter not implemented in v0.1');
}
