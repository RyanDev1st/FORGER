// _lib/adapters/mistral.mjs
export const provider = 'mistral'; // replace per file
export const defaultModel = 'mistral-large-2'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke() {
  throw new Error('mistral adapter not implemented in v0.1');
}
