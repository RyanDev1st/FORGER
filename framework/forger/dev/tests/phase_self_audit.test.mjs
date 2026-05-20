import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { checkPhaseSelfAudit } from '../../src/hooks/enforce_phase_self_audit.mjs';
import { appendJsonl } from '../../src/lib/ledger.mjs';

function mkWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'forger-psa-'));
}

describe('enforce_phase_self_audit', () => {
  it('passes when no telemetry yet (no phases run)', () => {
    const ws = mkWorkspace();
    const r = checkPhaseSelfAudit({ workspace: ws });
    expect(r.block).toBe(false);
  });

  it('blocks when phase telemetry lacks self_audit field', () => {
    const ws = mkWorkspace();
    appendJsonl(path.join(ws, 'telemetry.jsonl'), {
      phase: 'find', mode: 'standard', claims_total: 8, audit_passed: true,
      ts: '2026-05-21T00:00:00Z',
    });
    const r = checkPhaseSelfAudit({ workspace: ws });
    expect(r.block).toBe(true);
    expect(r.phase).toBe('find');
    expect(r.reason).toMatch(/self_audit/);
  });

  it('blocks when self_audit has a failed item', () => {
    const ws = mkWorkspace();
    appendJsonl(path.join(ws, 'telemetry.jsonl'), {
      phase: 'find', mode: 'standard', claims_total: 8, audit_passed: true,
      self_audit: {
        audit_gate_passed: true,
        lanes_reached_floor_or_pivoted: true,
        find_summary_complete: false,
        ledgers_ajv_valid: true,
        telemetry_appended: true,
        re_entry_tags_present: null,
      },
      ts: '2026-05-21T00:00:00Z',
    });
    const r = checkPhaseSelfAudit({ workspace: ws });
    expect(r.block).toBe(true);
    expect(r.failed_items).toContain('find_summary_complete');
  });

  it('passes when self_audit is clean', () => {
    const ws = mkWorkspace();
    appendJsonl(path.join(ws, 'telemetry.jsonl'), {
      phase: 'find', mode: 'standard', claims_total: 8, audit_passed: true,
      self_audit: {
        audit_gate_passed: true,
        lanes_reached_floor_or_pivoted: true,
        find_summary_complete: true,
        ledgers_ajv_valid: true,
        telemetry_appended: true,
        re_entry_tags_present: null,
      },
      ts: '2026-05-21T00:00:00Z',
    });
    const r = checkPhaseSelfAudit({ workspace: ws });
    expect(r.block).toBe(false);
    expect(r.phase).toBe('find');
  });

  it('checks the most recent phase line only when multiple phases recorded', () => {
    const ws = mkWorkspace();
    appendJsonl(path.join(ws, 'telemetry.jsonl'), {
      phase: 'contract', mode: 'standard', ts: '2026-05-21T00:00:00Z',
      self_audit: { dow_written: true, reframe_memo_written: true },
    });
    appendJsonl(path.join(ws, 'telemetry.jsonl'), {
      phase: 'find', mode: 'standard', ts: '2026-05-21T00:01:00Z',
      // no self_audit on this one
    });
    const r = checkPhaseSelfAudit({ workspace: ws });
    expect(r.block).toBe(true);
    expect(r.phase).toBe('find');
  });

  it('ignores non-phase telemetry lines (e.g., hook log noise)', () => {
    const ws = mkWorkspace();
    appendJsonl(path.join(ws, 'telemetry.jsonl'), {
      phase: 'find', mode: 'standard',
      self_audit: {
        audit_gate_passed: true,
        lanes_reached_floor_or_pivoted: true,
        find_summary_complete: true,
        ledgers_ajv_valid: true,
        telemetry_appended: true,
      },
      ts: '2026-05-21T00:00:00Z',
    });
    appendJsonl(path.join(ws, 'telemetry.jsonl'), {
      phase: 'hook', kind: 'noise', ts: '2026-05-21T00:01:00Z',
    });
    const r = checkPhaseSelfAudit({ workspace: ws });
    expect(r.block).toBe(false);
    expect(r.phase).toBe('find');
  });
});
