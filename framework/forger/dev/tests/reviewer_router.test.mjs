import { describe, it, expect, vi, beforeEach } from 'vitest';
import { invokeReviewer, __resetForTests } from '../../src/lib/reviewer_router.mjs';

beforeEach(() => {
  delete process.env.OPENAI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.FORGER_REVIEWER_PROVIDER;
  delete process.env.FORGER_REVIEWER_MODEL;
  __resetForTests();
});

describe('reviewer_router', () => {
  it('falls back to subagent_fallback when no env keys present', async () => {
    process.env.CLAUDE_CODE_MODEL = 'claude-opus-4-7';
    const r = await invokeReviewer('system', 'user', { sessionProvider: 'anthropic',
                                                       sessionModel: 'claude-opus-4-7' });
    expect(['acceptable', 'weak']).toContain(r.tier);
    expect(r.reviewer_meta.provider).toBe('anthropic');
    expect(r.reviewer_meta.key_source).toBe('subagent');
  });

  it('respects FORGER_REVIEWER_PROVIDER override and routes to that adapter', async () => {
    process.env.FORGER_REVIEWER_PROVIDER = 'anthropic';
    process.env.FORGER_REVIEWER_MODEL = 'claude-sonnet-4-6';
    const r = await invokeReviewer('system', 'user', { sessionProvider: 'anthropic',
                                                       sessionModel: 'claude-opus-4-7' });
    expect(r.reviewer_meta.provider).toBe('anthropic');
    expect(r.reviewer_meta.key_source).toBe('env');
  });
});
