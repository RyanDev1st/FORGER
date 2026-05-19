import * as openai from './adapters/openai.mjs';
import * as gemini from './adapters/gemini.mjs';
import * as anthropic from './adapters/anthropic.mjs';
import * as xai from './adapters/xai.mjs';
import * as mistral from './adapters/mistral.mjs';
import * as qwen from './adapters/qwen.mjs';
import * as glm from './adapters/glm.mjs';
import * as kimi from './adapters/kimi.mjs';
import * as deepseek from './adapters/deepseek.mjs';
import * as codex_cli from './adapters/codex_cli.mjs';
import * as subagent_fallback from './adapters/subagent_fallback.mjs';

const adapters = {
  openai, gemini, anthropic, xai, mistral, qwen, glm, kimi, deepseek,
  codex_cli, subagent_fallback,
};

const TIER_PRIORITY = ['openai', 'google', 'anthropic', 'xai',
                       'mistral', 'qwen', 'glm', 'kimi', 'deepseek'];

const ENV_KEY_MAP = {
  OPENAI_API_KEY:    'openai',
  GEMINI_API_KEY:    'google',
  ANTHROPIC_API_KEY: 'anthropic',
  XAI_API_KEY:       'xai',
  MISTRAL_API_KEY:   'mistral',
  QWEN_API_KEY:      'qwen',
  GLM_API_KEY:       'glm',
  KIMI_API_KEY:      'kimi',
  DEEPSEEK_API_KEY:  'deepseek',
};

// Mapping provider id -> adapter module key
const PROVIDER_TO_ADAPTER = {
  openai: 'openai', google: 'gemini', anthropic: 'anthropic',
  xai: 'xai', mistral: 'mistral', qwen: 'qwen', glm: 'glm',
  kimi: 'kimi', deepseek: 'deepseek',
};

let cachedPings = {};
export function __resetForTests() { cachedPings = {}; }

function parseEnvKeys() {
  const out = [];
  for (const [envName, provider] of Object.entries(ENV_KEY_MAP)) {
    const v = process.env[envName];
    if (v && v.trim()) out.push({ envName, provider, key: v });
  }
  return out;
}

async function pingCached(adapterKey) {
  if (adapterKey in cachedPings) return cachedPings[adapterKey];
  try {
    cachedPings[adapterKey] = await adapters[adapterKey].ping();
  } catch {
    cachedPings[adapterKey] = false;
  }
  return cachedPings[adapterKey];
}

export async function invokeReviewer(systemPrompt, userPrompt, opts = {}) {
  const sessionProvider = opts.sessionProvider || detectSessionProvider();
  const sessionModel    = opts.sessionModel    || detectSessionModel();

  // Override path
  if (process.env.FORGER_REVIEWER_PROVIDER) {
    const adapterKey = PROVIDER_TO_ADAPTER[process.env.FORGER_REVIEWER_PROVIDER]
                      || process.env.FORGER_REVIEWER_PROVIDER;
    try {
      const result = await safeInvoke(adapterKey, systemPrompt, userPrompt,
                                      { model: process.env.FORGER_REVIEWER_MODEL });
      return wrap(result, adapterKey, 'env', tierFor(adapterKey, sessionProvider));
    } catch { /* cascade to reviewer fallback */ }
  }

  // Tier 'best': different provider env key
  const envKeys = parseEnvKeys();
  const diff = envKeys.filter(k => k.provider !== sessionProvider);
  const ranked = TIER_PRIORITY
    .map(p => diff.find(k => k.provider === p))
    .filter(Boolean);

  for (const cand of ranked) {
    const adapterKey = PROVIDER_TO_ADAPTER[cand.provider];
    if (!(await pingCached(adapterKey))) continue;
    try {
      const result = await adapters[adapterKey].invoke(systemPrompt, userPrompt,
                                                       { key: cand.key, ...opts });
      return wrap(result, adapterKey, 'env', 'best');
    } catch { /* cascade to next candidate */ }
  }

  // Tier 'good': same provider env key, different model family
  const same = envKeys.filter(k => k.provider === sessionProvider);
  for (const cand of same) {
    const adapterKey = PROVIDER_TO_ADAPTER[cand.provider];
    const altModel = pickDifferentFamilyModel(adapterKey, sessionModel);
    if (altModel && (await pingCached(adapterKey))) {
      try {
        const result = await adapters[adapterKey].invoke(systemPrompt, userPrompt,
                                                         { key: cand.key, model: altModel });
        return wrap(result, adapterKey, 'env', 'good');
      } catch { /* fall through */ }
    }
  }

  // Tier 'acceptable': same provider, subagent with different model family
  if (sessionProvider === 'anthropic') {
    const reviewerModel = sessionModel && sessionModel.includes('sonnet')
                          ? 'claude-opus-4-7'
                          : 'claude-sonnet-4-6';
    const result = await adapters.subagent_fallback.invoke(systemPrompt, userPrompt,
                                                           { model: reviewerModel });
    return wrap(result, 'subagent_fallback', 'subagent', 'acceptable');
  }

  // Tier 'weak': last resort
  const result = await adapters.subagent_fallback.invoke(
    systemPrompt,
    userPrompt + '\n\n[CRITICAL: review as if from a different model family.]',
    { model: sessionModel }
  );
  return wrap(result, 'subagent_fallback', 'subagent', 'weak');
}

function wrap(result, adapterKey, keySource, tier) {
  return {
    tier,
    response: result.text,
    reviewer_meta: {
      provider:     adapters[adapterKey].provider,
      model:        result.model_used,
      key_source:   keySource,
      duration_ms:  result.duration_ms,
      tokens_used:  (result.tokens_in || 0) + (result.tokens_out || 0),
    },
  };
}

async function safeInvoke(adapterKey, systemPrompt, userPrompt, opts) {
  if (!adapters[adapterKey]) throw new Error(`unknown adapter ${adapterKey}`);
  return adapters[adapterKey].invoke(systemPrompt, userPrompt, opts);
}

function pickDifferentFamilyModel(adapterKey, sessionModel) {
  // v0.1 heuristic — adapter-specific tables come later.
  const m = adapters[adapterKey];
  const sessionFamily = m.familyOf ? m.familyOf(sessionModel) : sessionModel;
  if (m.defaultModel && m.familyOf(m.defaultModel) !== sessionFamily) return m.defaultModel;
  return null;
}

function tierFor(adapterKey, sessionProvider) {
  const provider = adapters[adapterKey].provider;
  if (provider === sessionProvider) return 'good';
  return 'best';
}

export function detectSessionProvider() {
  // Heuristic; v0.1.
  if (process.env.CLAUDE_CODE_MODEL || process.env.ANTHROPIC_MODEL) return 'anthropic';
  if (process.env.OPENAI_MODEL) return 'openai';
  if (process.env.GEMINI_MODEL || process.env.GOOGLE_MODEL) return 'google';
  return 'anthropic';
}

export function detectSessionModel() {
  return process.env.CLAUDE_CODE_MODEL
      || process.env.ANTHROPIC_MODEL
      || 'claude-opus-4-7';
}
