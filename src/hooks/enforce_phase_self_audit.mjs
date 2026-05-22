import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readJsonl } from '../lib/ledger.mjs';

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

const KNOWN_PHASES = ['contract', 'find', 'observe', 'recombine', 'grill', 'execute', 'retain'];

function lastPhaseLine(telemetryPath) {
  if (!fs.existsSync(telemetryPath)) return null;
  const lines = readJsonl(telemetryPath);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (KNOWN_PHASES.includes(lines[i].phase)) return lines[i];
  }
  return null;
}

function isAuditClean(self_audit) {
  if (!self_audit || typeof self_audit !== 'object') return false;
  for (const v of Object.values(self_audit)) {
    if (v === false) return false;
    if (v === null || v === undefined) continue;
  }
  return true;
}

export function checkPhaseSelfAudit({ workspace }) {
  if (!workspace || !fs.existsSync(workspace)) return { block: false, reason: 'no workspace' };
  const telemetryPath = path.join(workspace, 'telemetry.jsonl');
  const last = lastPhaseLine(telemetryPath);
  if (!last) return { block: false, reason: 'no phase telemetry yet' };

  if (!('self_audit' in last)) {
    return {
      block: true,
      phase: last.phase,
      reason: `Phase '${last.phase}' wrote telemetry without a 'self_audit' field. ` +
              `Re-spawn the phase and walk the SKILL.md self-audit checklist before exit.`,
    };
  }
  if (!isAuditClean(last.self_audit)) {
    const failed = Object.entries(last.self_audit).filter(([, v]) => v === false).map(([k]) => k);
    return {
      block: true,
      phase: last.phase,
      reason: `Phase '${last.phase}' self-audit recorded failures on: ${failed.join(', ')}. ` +
              `Resolve each failed item before continuing to the next phase.`,
      failed_items: failed,
    };
  }
  return { block: false, phase: last.phase, audit: last.self_audit };
}

if (entryUrl && import.meta.url === entryUrl) {
  let payload = '';
  process.stdin.on('data', chunk => payload += chunk);
  process.stdin.on('end', () => {
    let parsed = {};
    try { parsed = JSON.parse(payload); } catch {}
    const toolName = parsed.tool_name || parsed.tool || '';
    const PHASE_DISPATCH_TOOLS = new Set(['Task', 'Skill']);
    if (toolName && !PHASE_DISPATCH_TOOLS.has(toolName)) {
      process.exit(0);
    }
    const workspace = process.env.FORGER_WORKSPACE || '';
    const r = checkPhaseSelfAudit({ workspace });
    if (r.block) {
      console.error(JSON.stringify({
        level: 'error',
        code: 'phase_self_audit_missing',
        phase: r.phase,
        message: r.reason,
        failed_items: r.failed_items || null,
        suggested_action: 'Re-spawn the prior phase skill; it must append the 6-item self_audit struct to telemetry.jsonl before returning control.',
      }));
      process.exit(2);
    }
    process.exit(0);
  });
}
