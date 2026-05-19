// _lib/adapters/glm.mjs
export const provider = 'glm'; // replace per file
export const defaultModel = 'glm-5'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('glm adapter not implemented in v0.1');
}
