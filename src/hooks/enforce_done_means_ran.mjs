import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readYaml, readJsonl } from '../lib/ledger.mjs';
import { checkPhaseSelfAudit } from './enforce_phase_self_audit.mjs';

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
const COMPLETION_PATTERNS = [
  /\b(done|complete|completed|finished|shipped|ready)\b/i,
  /\ball\s+tests?\s+pass/i,
  /✓|✅/,
];

function isCompletionClaim(text) {
  return COMPLETION_PATTERNS.some(re => re.test(text || ''));
}

function getRequiredCriteria(dow) {
  const ids = [];
  for (const sc of dow.success_criteria_measurable || []) ids.push({ id: sc.id, type: 'measurable' });
  for (const hc of dow.hard_constraints || []) ids.push({ id: hc.id, type: 'hard_constraint' });
  for (const ufm of dow.unacceptable_failure_modes || []) ids.push({ id: ufm.id, type: 'failure_mode' });
  return ids;
}

export async function checkDoneMeansRan({ workspace, recentText, transcriptPath }) {
  if (!workspace || !fs.existsSync(workspace)) return { block: false };
  let text = recentText || '';
  let transcriptMissing = false;
  if (!text && transcriptPath) {
    if (fs.existsSync(transcriptPath)) {
      text = fs.readFileSync(transcriptPath, 'utf8').split('\n').slice(-200).join('\n');
    } else {
      transcriptMissing = true;
    }
  }
  if (!isCompletionClaim(text)) {
    return transcriptMissing ? { block: false, transcript_missing: true } : { block: false };
  }

  const dowPath = path.join(workspace, 'dow.yaml');
  if (!fs.existsSync(dowPath)) {
    return { block: true, reason: 'Completion claimed but no Definition of Works in workspace.' };
  }
  const required = getRequiredCriteria(readYaml(dowPath));
  if (required.length === 0) return { block: false };

  const latest = new Map();
  for (const line of readJsonl(path.join(workspace, 'acceptance_results.jsonl'))) {
    if (line.criterion_id) latest.set(line.criterion_id, line);
  }
  const missing = required.filter(r => latest.get(r.id)?.passed !== true);
  if (missing.length > 0) {
    return {
      block: true,
      reason: 'Done Means Ran: required criteria not passing — ' +
              missing.map(m => `${m.type}:${m.id}`).join(', '),
      missing,
    };
  }

  const phaseAudit = checkPhaseSelfAudit({ workspace });
  if (phaseAudit.block) {
    return {
      block: true,
      reason: `Done Means Ran: last phase '${phaseAudit.phase}' has an unclean self_audit. ${phaseAudit.reason}`,
      failed_items: phaseAudit.failed_items || null,
      last_phase: phaseAudit.phase,
    };
  }

  return { block: false };
}

if (entryUrl && import.meta.url === entryUrl) {
  let payload = '';
  process.stdin.on('data', chunk => payload += chunk);
  process.stdin.on('end', async () => {
    let parsed = {};
    try { parsed = JSON.parse(payload); } catch {}
    const r = await checkDoneMeansRan({
      workspace: process.env.FORGER_WORKSPACE || '',
      transcriptPath: parsed.transcript_path,
    });
    if (r.transcript_missing) {
      console.error(JSON.stringify({
        level: 'warn', code: 'transcript_missing',
        message: `done_means_ran could not read transcript_path '${parsed.transcript_path}'; completion claims will not be detected this turn.`,
      }));
    }
    if (r.block) {
      const isPhaseAudit = !!r.last_phase;
      console.error(JSON.stringify({
        level: 'error',
        code: isPhaseAudit ? 'done_means_ran_phase_self_audit' : 'done_means_ran',
        message: r.reason,
        failed_items: r.failed_items || null,
        last_phase: r.last_phase || null,
        suggested_action: isPhaseAudit
          ? 'Re-spawn the last phase agent; it must append a clean self_audit struct before completion can be claimed.'
          : 'Run src/gates/acceptance_test.mjs and fix any failing criteria before claiming completion.',
      }));
      process.exit(2);
    }
    process.exit(0);
  });
}
