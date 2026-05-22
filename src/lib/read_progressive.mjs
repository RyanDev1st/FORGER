// Progressive page-read library: SKIM → SCAN → DEEP with token budgets.
// All public functions accept injectable {fetcher, snapshotter} so tests stay offline.
// v0.1: cheap regex parsing (no jsdom dep); reader-mode strip is best-effort.

const STOPWORDS = new Set(['the','a','an','of','to','in','on','for','and','or','is','it','this','that','with','as','by','at','be','are','was','were','from','into','than','then','its','their','our','your']);
const PROMOTE_VISUAL_RE = /see figure|see fig\.|figure \d+|pipeline|architecture|as shown|algorithm \d+|equation \d+/i;
const READER_DROP_RE = /\b(nav|navbar|footer|advertisement|ad-|ad_|cookie|banner|sidebar|menu)\b/i;

export function estimateTokens(str) {
  if (!str) return 0;
  return Math.ceil(String(str).length / 4);
}

export function tokenize(str) {
  return String(str || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(t => t && !STOPWORDS.has(t));
}

function tagText(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : '';
}

function allTagText(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1].replace(/<[^>]+>/g, '').trim());
  return out.filter(Boolean);
}

async function defaultFetcher(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return await res.text();
}

export async function skim(url, { fetcher = defaultFetcher, budget = 500 } = {}) {
  const html = await fetcher(url);
  const title = tagText(html, 'title');
  const h1 = allTagText(html, 'h1');
  const h2 = allTagText(html, 'h2');
  const h3 = allTagText(html, 'h3');
  const paras = allTagText(html, 'p');
  const first_para = paras[0] || '';
  const last_para = paras[paras.length - 1] || '';
  const text = [title, ...h1, ...h2, ...h3, first_para, last_para].join(' ');
  return {
    stage: 'skim',
    title,
    h1_h3: [...h1, ...h2, ...h3],
    first_para,
    last_para,
    tokens_estimate: Math.min(estimateTokens(text), budget),
    raw_tokens_estimate: estimateTokens(text),
  };
}

function snapshotToScan(snapshot) {
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
  const headings = nodes.filter(n => /^h[1-6]$/i.test(n.role || '')).map(n => n.text || '');
  const paragraphs = nodes.filter(n => (n.role || '') === 'paragraph').map(n => n.text || '');
  const code_blocks = nodes.filter(n => (n.role || '') === 'code').map(n => n.text || '');
  const tables = nodes.filter(n => (n.role || '') === 'table').map(n => n.text || '');
  const image_refs = nodes.filter(n => (n.role || '') === 'image').map(n => ({ alt: n.alt || n.text || '', src: n.src || '' }));
  return { headings, paragraphs, code_blocks, tables, image_refs };
}

export async function scan(url, { snapshotter, budget = 2000 } = {}) {
  if (!snapshotter) throw new Error('scan: snapshotter required');
  const snap = await snapshotter(url);
  const parts = snapshotToScan(snap);
  const text = [...parts.headings, ...parts.paragraphs, ...parts.code_blocks].join(' ');
  return {
    stage: 'scan',
    ...parts,
    tokens_estimate: Math.min(estimateTokens(text), budget),
    raw_tokens_estimate: estimateTokens(text),
  };
}

function readerStrip(snapshot) {
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : [];
  const kept = nodes.filter(n => {
    const tag = `${n.role || ''} ${n.cls || ''} ${n.id || ''}`;
    return !READER_DROP_RE.test(tag);
  });
  const text = kept.map(n => n.text || '').filter(Boolean).join('\n');
  const images = kept.filter(n => (n.role || '') === 'image').map(n => ({ alt: n.alt || n.text || '', src: n.src || '', near: n.near || '' }));
  return { text, images };
}

export async function deep(url, { snapshotter, budget = 6000 } = {}) {
  if (!snapshotter) throw new Error('deep: snapshotter required');
  const snap = await snapshotter(url);
  const { text, images } = readerStrip(snap);
  return {
    stage: 'deep',
    text,
    images,
    tokens_estimate: Math.min(estimateTokens(text), budget),
    raw_tokens_estimate: estimateTokens(text),
  };
}

export function shouldPromote(stageResult, claimTarget) {
  const targetToks = new Set(tokenize(claimTarget));
  if (!stageResult || !targetToks.size) return { promote: false, reason: 'no claim_target tokens' };

  if (stageResult.stage === 'skim') {
    const titleToks = tokenize(stageResult.title);
    const headerToks = tokenize((stageResult.h1_h3 || []).join(' '));
    const titleHit = titleToks.some(t => targetToks.has(t));
    const headerHit = headerToks.some(t => targetToks.has(t));
    if (titleHit || headerHit) return { promote: true, reason: 'title/header keyword hit' };
    const firstParaWords = (stageResult.first_para || '').split(/\s+/);
    const entities = firstParaWords.filter(w => /^[A-Z][A-Za-z0-9._-]{1,}$/.test(w) && !STOPWORDS.has(w.toLowerCase()));
    const numerics = firstParaWords.filter(w => /\d/.test(w));
    if (entities.length + numerics.length >= 2) return { promote: true, reason: 'entity/numeric density' };
    return { promote: false, reason: 'off-topic skim signal' };
  }

  if (stageResult.stage === 'scan') {
    const headings = stageResult.headings || [];
    const paragraphs = stageResult.paragraphs || [];
    for (let i = 0; i < headings.length; i++) {
      const headToks = tokenize(headings[i]);
      const para = paragraphs[i] || '';
      if (!para) continue;
      const words = para.split(/\s+/).filter(Boolean);
      if (words.length < 10) continue;
      const entityHit = words.some(w => /^[A-Z]/.test(w) && targetToks.has(w.toLowerCase()));
      const headHit = headToks.some(t => targetToks.has(t));
      if (entityHit || headHit) return { promote: true, reason: `quote candidate in section "${headings[i]}"` };
    }
    return { promote: false, reason: 'no candidate quote in scan' };
  }

  return { promote: false, reason: `no promotion rule for stage ${stageResult.stage}` };
}

export function annotateVisuals(deepResult) {
  if (!deepResult || deepResult.stage !== 'deep') return deepResult;
  const prose = deepResult.text || '';
  if (!PROMOTE_VISUAL_RE.test(prose)) return { ...deepResult, images: [] };
  const images = (deepResult.images || []).map(img => ({ ...img, surfaced: true }));
  return { ...deepResult, images };
}

export async function readWithBudget(url, claimTarget, { budgetTokens = 6000, fetcher, snapshotter, log } = {}) {
  const trace = [];
  let tokens_used = 0;
  const skimRes = await skim(url, { fetcher, budget: 500 });
  tokens_used += skimRes.tokens_estimate;
  trace.push({ stage: 'skim', tokens: skimRes.tokens_estimate });
  const skimDecision = shouldPromote(skimRes, claimTarget);
  if (!skimDecision.promote) {
    return { stage_reached: 'skim', tokens_used, trace, result: skimRes, stopped_reason: skimDecision.reason };
  }

  const scanRes = await scan(url, { snapshotter, budget: 2000 });
  tokens_used += scanRes.tokens_estimate;
  trace.push({ stage: 'scan', tokens: scanRes.tokens_estimate });
  const scanDecision = shouldPromote(scanRes, claimTarget);
  if (!scanDecision.promote || tokens_used >= budgetTokens) {
    return { stage_reached: 'scan', tokens_used, trace, result: scanRes, stopped_reason: scanDecision.reason || 'budget hit' };
  }

  const deepRes = annotateVisuals(await deep(url, { snapshotter, budget: Math.max(0, budgetTokens - tokens_used) }));
  tokens_used += deepRes.tokens_estimate;
  trace.push({ stage: 'deep', tokens: deepRes.tokens_estimate });
  return { stage_reached: 'deep', tokens_used, trace, result: deepRes, stopped_reason: 'deep complete' };
}
