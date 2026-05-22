// diff_hash — structural hash for the futility detector
//
// Computes a deterministic hash of a code change, normalized so
// whitespace-only differences collide. Used by refs/futility_detector.md
// to detect "same diff twice" inside the TDD retry policy.
//
// Inputs: before string, after string (full file contents, or diff
// patch text). Output: 16-char hex hash.
//
// Normalization:
//   - LF line endings
//   - collapse runs of whitespace to single space
//   - strip trailing whitespace
//   - drop empty lines
//
// This catches the common futility pattern (re-issue the same patch
// with different whitespace) without over-fitting to syntactic
// re-arrangement.

import { createHash } from "node:crypto";

function normalize(text) {
  if (text === null || text === undefined) return "";
  const lf = String(text).replace(/\r\n?/g, "\n");
  const lines = lf.split("\n").map((l) => l.replace(/\s+/g, " ").trim());
  return lines.filter((l) => l.length > 0).join("\n");
}

export function diffHash(before, after) {
  const b = normalize(before);
  const a = normalize(after);
  const payload = `${b}\n--CHANGE--\n${a}`;
  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

export function isSameAsAnyPrior(currentHash, priorHashes) {
  if (!currentHash || !Array.isArray(priorHashes)) return false;
  return priorHashes.includes(currentHash);
}

// CLI usage: node diff_hash.mjs <before-file> <after-file>
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  const fs = await import("node:fs/promises");
  const [beforeFile, afterFile] = process.argv.slice(2);
  if (!beforeFile || !afterFile) {
    console.error("usage: node diff_hash.mjs <before-file> <after-file>");
    process.exit(2);
  }
  try {
    const before = await fs.readFile(beforeFile, "utf-8");
    const after = await fs.readFile(afterFile, "utf-8");
    process.stdout.write(diffHash(before, after) + "\n");
  } catch (err) {
    console.error(`diff_hash failed: ${err.message}`);
    process.exit(1);
  }
}
