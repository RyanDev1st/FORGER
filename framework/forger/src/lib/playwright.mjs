import { spawn } from 'node:child_process';

export async function headRequest(url, { timeoutMs = 5000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    return { status: res.status, headers: Object.fromEntries(res.headers) };
  } catch (err) {
    return { status: 0, error: String(err) };
  } finally {
    clearTimeout(t);
  }
}

export async function getPageText(url, { timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: controller.signal });
    return await res.text();
  } catch (err) {
    return '';
  } finally {
    clearTimeout(t);
  }
}

export function grepQuote(pageText, quote) {
  if (!pageText || !quote) return false;
  const norm = s => s.replace(/\s+/g, ' ').trim().toLowerCase();
  return norm(pageText).includes(norm(quote));
}

/**
 * Browser-driven page open via playwright-cli (cloakbrowser).
 * Project rule: never pass --browser flag. Uses PLAYWRIGHT_MCP_EXECUTABLE_PATH if set.
 */
export function openPageViaPlaywrightCli(url) {
  return new Promise((resolve, reject) => {
    const proc = spawn('playwright-cli', ['open', url], { stdio: 'inherit' });
    proc.on('error', reject);
    proc.on('exit', code => code === 0 ? resolve() : reject(new Error(`playwright-cli exit ${code}`)));
  });
}
