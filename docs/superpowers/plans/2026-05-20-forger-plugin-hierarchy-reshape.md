# FORGER Plugin Hierarchy Reshape Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reshape `framework/forger` into a clearer package hierarchy while preserving runtime behavior, imports, exports, plugin install behavior, and skill references.

**Architecture:** Keep root plugin contract stable: `manifest.json`, `package.json`, `README.md`, `DESIGN.md`, and top-level `SKILL.md` remain at `framework/forger/`. Move executable JavaScript modules into `src/` by responsibility, keep skill markdown under `skills/forger/`, keep examples/templates/schemas close enough to avoid changing data format, and add compatibility checks before each move. No behavior rewrite.

**Tech Stack:** Node.js ESM, Vitest, js-yaml, AJV, Claude Code plugin manifest/skills/hooks.

---

## Guardrails

- Work only inside `C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger` unless updating repo docs for moved paths.
- Before moving a file, search every exact old path and directory-token reference.
- After moving a file, update imports in same commit-sized chunk and run targeted tests.
- Do not move `manifest.json`, `package.json`, `package-lock.json`, root `SKILL.md`, root `README.md`, or root `DESIGN.md` in this pass.
- Preserve exported function names. Imports may change paths only.
- Preserve skill slugs and frontmatter names.

## Target hierarchy

```text
framework/forger/
  manifest.json
  package.json
  package-lock.json
  README.md
  DESIGN.md
  SKILL.md
  src/
    lib/              # old _lib/*.mjs
    cli/              # old tools/*.mjs
    gates/            # old gates/*.mjs
    hooks/            # old hooks/*.mjs
    dev/              # old dev/scripts/*.mjs
  dev/
    tests/            # old dev/tests/*.mjs, updated imports
    fixtures/         # unchanged test fixtures
  skills/forger/
    phases/           # old phases/*
    modes/            # old modes/*
    refs/             # old skills/* plus shared refs if any
  schemas/            # unchanged for data path stability
  templates/          # unchanged for data path stability
  knowledge/          # unchanged runtime data
  workspaces/         # unchanged runtime data
  plans/              # unchanged historical plans
```

## Files to move

| Old path | New path | Why |
| --- | --- | --- |
| `_lib/*.mjs` | `src/lib/*.mjs` | Runtime libraries under source tree |
| `tools/*.mjs` | `src/cli/*.mjs` | CLI/probe utilities under source tree |
| `gates/*.mjs` | `src/gates/*.mjs` | Runtime gates under source tree |
| `hooks/*.mjs` | `src/hooks/*.mjs` | Runtime hooks under source tree |
| `dev/scripts/*.mjs` | `src/dev/*.mjs` | Dev scripts are source modules invoked by package scripts |
| `phases/**` | `skills/forger/phases/**` | Phase skills grouped under plugin skill namespace |
| `modes/**` | `skills/forger/modes/**` | Mode docs grouped with skills |

## Reference map to verify before edits

Run from `framework/forger`:

```bash
node -e "const fs=require('fs'),path=require('path');function walk(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git'].includes(e.name))continue;const p=path.join(d,e.name);e.isDirectory()?walk(p,o):o.push(p)}return o}const pats=['_lib/','tools/','gates/','hooks/','dev/scripts/','phases/','modes/'];for(const f of walk('.')){const t=fs.readFileSync(f,'utf8');const hit=pats.filter(p=>t.includes(p));if(hit.length)console.log(f,hit.join(','))}"
```

Expected before refactor: list of files with old references.
Expected after refactor: no old references except historical plan docs under `plans/`.

## Task 1: Baseline verification

**Files:** none

- [ ] **Step 1: Run baseline schema validation**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npm run validate:schemas
```

Expected: all schemas and examples validate.

- [ ] **Step 2: Run baseline tests**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npm test
```

Expected: `13 files / 41 tests pass` or current equivalent pass count.

- [ ] **Step 3: Capture current relative imports**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && node -e "const fs=require('fs'),path=require('path');function walk(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git'].includes(e.name))continue;const p=path.join(d,e.name);e.isDirectory()?walk(p,o):o.push(p)}return o}for(const f of walk('.').filter(f=>/\\.(mjs|js)$/.test(f))){const t=fs.readFileSync(f,'utf8');const re=/from\\s+['\"]([^'\"]+)['\"]|import\\(['\"]([^'\"]+)['\"]\\)|require\\(['\"]([^'\"]+)['\"]\\)/g;let m;while((m=re.exec(t))){const s=m[1]||m[2]||m[3];if(s.startsWith('.'))console.log(f+' -> '+s)}}"
```

Expected: relative imports print; save mentally for path rewrite.

## Task 2: Move JavaScript runtime modules into `src/`

**Files:**
- Move: `_lib/*.mjs` -> `src/lib/*.mjs`
- Move: `tools/*.mjs` -> `src/cli/*.mjs`
- Move: `gates/*.mjs` -> `src/gates/*.mjs`
- Move: `hooks/*.mjs` -> `src/hooks/*.mjs`
- Move: `dev/scripts/*.mjs` -> `src/dev/*.mjs`
- Modify: `package.json`
- Modify: `manifest.json`
- Modify: `dev/tests/*.mjs`
- Modify: moved `src/**/*.mjs` imports

- [ ] **Step 1: Create target directories**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && mkdir -p src/lib src/cli src/gates src/hooks src/dev
```

Expected: directories exist.

- [ ] **Step 2: Move files with git**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && git mv _lib/*.mjs src/lib/ && git mv tools/*.mjs src/cli/ && git mv gates/*.mjs src/gates/ && git mv hooks/*.mjs src/hooks/ && git mv dev/scripts/*.mjs src/dev/
```

Expected: old JS directories empty or removed by git; moved files staged as renames.

- [ ] **Step 3: Update package scripts**

Modify `package.json` scripts exactly:

```json
{
  "scripts": {
    "test": "vitest run dev/tests",
    "test:watch": "vitest dev/tests",
    "validate:schemas": "node src/dev/validate_all_schemas.mjs",
    "install:plugin": "node src/dev/install.mjs",
    "setup:browser": "node src/dev/setup_browser.mjs"
  }
}
```

Expected: no package name/version/dependency changes.

- [ ] **Step 4: Update moved module imports**

Apply these path rules:

```text
src/dev/*.mjs importing ../../schemas or ../../templates stays ../../schemas / ../../templates only if old file was dev/scripts/* and now src/dev/*; from src/dev to root schemas is ../../schemas.
src/gates/*.mjs importing ../_lib/* becomes ../lib/*.
src/hooks/*.mjs importing ../_lib/* becomes ../lib/*.
src/cli/*.mjs importing ../_lib/* becomes ../lib/*.
dev/tests/*.mjs importing ../../_lib/* becomes ../../src/lib/*.
dev/tests/*.mjs importing ../../tools/* becomes ../../src/cli/*.
dev/tests/*.mjs importing ../../gates/* becomes ../../src/gates/*.
dev/tests/*.mjs importing ../../hooks/* becomes ../../src/hooks/*.
dev/tests/*.mjs importing ../scripts/* becomes ../../src/dev/*.
```

Expected: every relative import resolves to existing file.

- [ ] **Step 5: Update manifest hook paths**

If `manifest.json` references old hook/gate/tool paths, replace:

```text
hooks/ -> src/hooks/
gates/ -> src/gates/
tools/ -> src/cli/
dev/scripts/ -> src/dev/
```

Expected: manifest still valid JSON.

- [ ] **Step 6: Run import resolver**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && node -e "const fs=require('fs'),path=require('path');function walk(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git'].includes(e.name))continue;const p=path.join(d,e.name);e.isDirectory()?walk(p,o):o.push(p)}return o}let bad=0;for(const f of walk('.').filter(f=>/\\.(mjs|js)$/.test(f))){const t=fs.readFileSync(f,'utf8');const re=/from\\s+['\"]([^'\"]+)['\"]|import\\(['\"]([^'\"]+)['\"]\\)|require\\(['\"]([^'\"]+)['\"]\\)/g;let m;while((m=re.exec(t))){const s=m[1]||m[2]||m[3];if(!s.startsWith('.'))continue;const b=path.resolve(path.dirname(f),s);const ok=[b,b+'.mjs',b+'.js',path.join(b,'index.mjs'),path.join(b,'index.js')].some(fs.existsSync);if(!ok){bad++;console.log('MISSING '+f+' -> '+s)}}}process.exit(bad?1:0)"
```

Expected: no output, exit 0.

- [ ] **Step 7: Run targeted tests**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npm test
```

Expected: pass.

## Task 3: Move phase and mode skill docs under `skills/forger/`

**Files:**
- Move: `phases/**` -> `skills/forger/phases/**`
- Move: `modes/**` -> `skills/forger/modes/**`
- Modify: `SKILL.md`
- Modify: `README.md`
- Modify: `DESIGN.md`
- Modify: `src/dev/check_skill_links.mjs` if it assumes old root paths
- Modify: tests that reference `phases/` or `modes/`

- [ ] **Step 1: Create target docs directories**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && mkdir -p skills/forger
```

Expected: `skills/forger` exists.

- [ ] **Step 2: Move docs with git**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && git mv phases skills/forger/phases && git mv modes skills/forger/modes
```

Expected: old root `phases/` and `modes/` absent.

- [ ] **Step 3: Search old doc paths**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && node -e "const fs=require('fs'),path=require('path');function walk(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git'].includes(e.name))continue;const p=path.join(d,e.name);e.isDirectory()?walk(p,o):o.push(p)}return o}for(const f of walk('.')){const t=fs.readFileSync(f,'utf8');if(t.includes('phases/')||t.includes('modes/'))console.log(f)}"
```

Expected: prints files needing reference updates; historical `plans/` may remain unchanged.

- [ ] **Step 4: Update active doc references**

In active files (`SKILL.md`, `README.md`, `DESIGN.md`, `src/dev/check_skill_links.mjs`, tests), replace:

```text
phases/ -> skills/forger/phases/
modes/ -> skills/forger/modes/
```

Do not edit historical files under `plans/` unless tests require it.

- [ ] **Step 5: Verify skill links**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && node src/dev/check_skill_links.mjs
```

Expected: all skill cross-references resolve.

- [ ] **Step 6: Run schema validation**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npm run validate:schemas
```

Expected: pass.

## Task 4: Update installer path assumptions

**Files:**
- Modify: `src/dev/install.mjs`
- Modify: `dev/tests/install.test.mjs`
- Modify: `manifest.json` if installer copies manifest path lists

- [ ] **Step 1: Inspect installer path constants**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && node -e "const fs=require('fs');const f='src/dev/install.mjs';fs.readFileSync(f,'utf8').split(/\\r?\\n/).forEach((l,i)=>{if(/phases|modes|hooks|gates|tools|_lib|dev\\/scripts/.test(l))console.log((i+1)+': '+l)})"
```

Expected: all old path assumptions visible.

- [ ] **Step 2: Update installer constants only**

Change old paths in `src/dev/install.mjs`:

```text
hooks/ -> src/hooks/
gates/ -> src/gates/
tools/ -> src/cli/
_lib/ -> src/lib/
dev/scripts/ -> src/dev/
phases/ -> skills/forger/phases/
modes/ -> skills/forger/modes/
```

Expected: installer copies new tree or references new hook paths.

- [ ] **Step 3: Update installer tests**

In `dev/tests/install.test.mjs`, update expected paths to match new install output. Keep test names same unless inaccurate.

- [ ] **Step 4: Run installer tests**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npx vitest run dev/tests/install.test.mjs
```

Expected: pass.

- [ ] **Step 5: Run dry-run installer**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npm run install:plugin -- --dry-run
```

Expected: dry-run completes; no write to user settings.

## Task 5: Update active documentation and root map

**Files:**
- Modify: `README.md`
- Modify: `DESIGN.md`
- Modify: `SKILL.md`
- Modify: parent repo `CLAUDE.md` only if repository map mentions old plugin subpaths

- [ ] **Step 1: Search active docs for stale paths**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && node -e "const fs=require('fs');for(const f of ['README.md','DESIGN.md','SKILL.md']){const t=fs.readFileSync(f,'utf8');for(const p of ['_lib/','tools/','gates/','hooks/','dev/scripts/','phases/','modes/'])if(t.includes(p))console.log(f+' '+p)}"
```

Expected: stale references listed.

- [ ] **Step 2: Update active docs**

Replace stale paths with target hierarchy paths. Keep historical plan references unchanged when referring to archived implementation history.

- [ ] **Step 3: Update parent repository map if needed**

If `C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/CLAUDE.md` mentions old FORGER paths, update only those rows to new paths.

- [ ] **Step 4: Re-run old-path scan**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && node -e "const fs=require('fs'),path=require('path');function walk(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git','plans'].includes(e.name))continue;const p=path.join(d,e.name);e.isDirectory()?walk(p,o):o.push(p)}return o}let bad=0;for(const f of walk('.')){const t=fs.readFileSync(f,'utf8');for(const p of ['_lib/','tools/','gates/','hooks/','dev/scripts/','phases/','modes/'])if(t.includes(p)){bad++;console.log(f+' '+p)}}process.exit(bad?1:0)"
```

Expected: no output, exit 0. If output points to legitimate prose describing old layout, update prose or add explicit historical wording.

## Task 6: Full verification and review

**Files:** none unless verification finds failures

- [ ] **Step 1: Run import resolver**

Run same resolver from Task 2 Step 6.

Expected: no missing relative imports.

- [ ] **Step 2: Run skill link checker**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && node src/dev/check_skill_links.mjs
```

Expected: pass.

- [ ] **Step 3: Run schema validation**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npm run validate:schemas
```

Expected: pass.

- [ ] **Step 4: Run tests**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npm test
```

Expected: all tests pass.

- [ ] **Step 5: Run package dry install**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a/framework/forger && npm run install:plugin -- --dry-run
```

Expected: dry-run completes and references new paths.

- [ ] **Step 6: Inspect git diff summary**

Run:

```bash
cd C:/Users/admin/reTruth/.claude/worktrees/forger-plan-a && git status --short && git diff --stat
```

Expected: mostly renames plus import/doc path updates; no unrelated root files added.

## Self-review

- Spec coverage: covers full option 3 package reshape, import/export preservation, reference path checks, installer behavior, docs, validation.
- Placeholder scan: no TBD/TODO/fill-later placeholders.
- Type consistency: no new runtime APIs; path-only refactor preserves existing exports.
