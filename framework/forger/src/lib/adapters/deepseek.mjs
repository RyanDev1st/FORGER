// src/lib/adapters/deepseek.mjs
export const provider = 'deepseek'; // replace per file
export const defaultModel = 'deepseek-v3'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('deepseek adapter not implemented in v0.1');
}
