import { describe, it, expect } from 'vitest';
import {
  estimateTokens,
  skim,
  shouldPromote,
  readWithBudget,
} from '../../src/lib/read_progressive.mjs';

const MINI_HTML = `
<html>
  <head><title>Three.js InstancedMesh performance tips</title></head>
  <body>
    <h1>InstancedMesh tips</h1>
    <h2>Performance considerations</h2>
    <p>InstancedMesh reduces draw calls by batching identical geometries. Tests show 80% improvement at 10k objects.</p>
    <p>Use setMatrixAt for per-instance transforms.</p>
    <p>That concludes the tips.</p>
  </body>
</html>`;

const OFF_TOPIC_HTML = `
<html>
  <head><title>Vintage tea cup collection guide</title></head>
  <body>
    <h1>Teacups</h1>
    <p>Welcome to a relaxed afternoon hobby blog about porcelain.</p>
  </body>
</html>`;

function makeFetcher(html) {
  return async () => html;
}

function makeSnapshotter(nodes) {
  return async () => ({ nodes });
}

describe('read_progressive', () => {
  it('estimateTokens returns a plausible positive value', () => {
    expect(estimateTokens('hello world')).toBeGreaterThanOrEqual(1);
    expect(estimateTokens('')).toBe(0);
  });

  it('skim returns title + first_para from minimal HTML and stays under SKIM budget', async () => {
    const res = await skim('http://example.test/threejs', { fetcher: makeFetcher(MINI_HTML), budget: 500 });
    expect(res.stage).toBe('skim');
    expect(res.title).toMatch(/InstancedMesh/i);
    expect(res.first_para).toMatch(/draw calls/i);
    expect(res.tokens_estimate).toBeLessThanOrEqual(500);
  });

  it('shouldPromote skim→scan true when claim_target keyword in title', async () => {
    const res = await skim('http://example.test/threejs', { fetcher: makeFetcher(MINI_HTML) });
    const decision = shouldPromote(res, 'Three.js InstancedMesh performance');
    expect(decision.promote).toBe(true);
  });

  it('shouldPromote skim→scan false when title + first para are off-topic', async () => {
    const res = await skim('http://example.test/tea', { fetcher: makeFetcher(OFF_TOPIC_HTML) });
    const decision = shouldPromote(res, 'Three.js InstancedMesh performance');
    expect(decision.promote).toBe(false);
  });

  it('readWithBudget short-circuits at SCAN when no candidate quote; tokens_used ≤ scan budget', async () => {
    // SKIM signal hits (title contains "InstancedMesh") so we promote to SCAN.
    // SCAN nodes are deliberately weak: no entity overlap, no heading hit → no DEEP promotion.
    const snapNodes = [
      { role: 'heading', text: 'Generic heading' },
      { role: 'paragraph', text: 'Short.' },
    ];
    const res = await readWithBudget(
      'http://example.test/threejs',
      'Three.js InstancedMesh performance',
      {
        fetcher: makeFetcher(MINI_HTML),
        snapshotter: makeSnapshotter(snapNodes),
        budgetTokens: 6000,
      }
    );
    expect(res.stage_reached).toBe('scan');
    // SKIM budget=500 + SCAN budget=2000 ceiling
    expect(res.tokens_used).toBeLessThanOrEqual(2500);
    expect(res.trace.map(t => t.stage)).toEqual(['skim', 'scan']);
  });
});
