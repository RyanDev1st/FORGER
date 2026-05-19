// _lib/adapters/anthropic.mjs
export const provider = 'anthropic'; // replace per file
export const defaultModel = 'claude-sonnet-4-6'; // replace per file

export function familyOf(model) {
  return (model || defaultModel).split(/[-_:]/)[0];
}

export async function ping() {
  return false; // stub adapters always report unavailable until implemented
}

export async function invoke(systemPrompt = '', userPrompt = '', opts = {}) {
  const model = opts.model || defaultModel;
  return {
    text: JSON.stringify({ provider, model, reviewed: true }),
    model_used: model,
    tokens_in: systemPrompt.length + userPrompt.length,
    tokens_out: 0,
    duration_ms: 0,
  };
}
