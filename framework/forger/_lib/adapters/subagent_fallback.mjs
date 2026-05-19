/**
 * Subagent fallback adapter. Returns a structured stub response that records the
 * model the orchestrator should spawn. The orchestrator skill is responsible for
 * actually issuing the Task() call — this module only formalises the contract.
 */
export const provider = 'anthropic';
export const defaultModel = 'claude-sonnet-4-6';

export function familyOf(model) {
  if (!model) return 'unknown';
  if (model.includes('opus')) return 'opus';
  if (model.includes('sonnet')) return 'sonnet';
  if (model.includes('haiku')) return 'haiku';
  return model.split('-')[0];
}

export async function ping() { return true; }

export async function invoke(systemPrompt, userPrompt, opts = {}) {
  const model = opts.model || defaultModel;
  // This adapter cannot call an API from inside the hook. It produces a
  // structured request envelope; the GRILL skill detects this envelope and
  // spawns the actual subagent via the Task tool.
  return {
    text: JSON.stringify({
      __subagent_request__: true,
      model,
      systemPrompt,
      userPrompt,
    }),
    model_used: model,
    tokens_in: systemPrompt.length + userPrompt.length, // crude estimate
    tokens_out: 0,
    duration_ms: 0,
  };
}
