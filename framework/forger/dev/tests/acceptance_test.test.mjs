import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { runAcceptance } from '../../gates/acceptance_test.mjs';
import { writeYaml } from '../../_lib/ledger.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

describe('acceptance_test', () => {
  it('runs measurable test_method and reports pass', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'forger-acc-'));
    writeYaml(path.join(tmp, 'dow.yaml'), {
      meta: { id: 'x', created_at: '2026-05-19T00:00:00Z',
              user_query_verbatim: 'q', mode: 'standard', domain_slug: 'd',
              mode_picked_by: 'user' },
      artifact: { type: 'code', description: 'x' },
      audience: { who: 'me', use_case: 'me' },
      hard_constraints: [],
      success_criteria_measurable: [
        { id: 'sc-m-1', metric: 'two', threshold: '2',
          test_method: 'node -e "if(1+1===2) process.exit(0); else process.exit(1)"' },
      ],
      unacceptable_failure_modes: [],
      reframe_memo: {
        original_framing: 'a', alternative_framings: ['b'],
        chosen_framing: 'a', rationale: 'r',
      },
    });
    const r = await runAcceptance({ workspace: tmp });
    expect(r.required_passed).toBe(1);
    expect(r.required_failed).toBe(0);
    const out = fs.readFileSync(path.join(tmp, 'acceptance_results.jsonl'), 'utf8').trim();
    expect(out.split('\n')).toHaveLength(1);
  });
});
