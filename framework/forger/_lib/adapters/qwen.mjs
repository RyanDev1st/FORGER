// _lib/adapters/qwen.mjs
export const provider = 'qwen'; // replace per file
export const defaultModel = 'qwen3-max'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('qwen adapter not implemented in v0.1');
}
