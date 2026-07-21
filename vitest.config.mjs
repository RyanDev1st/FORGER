import { defineConfig } from "vitest/config";

// `vitest run dev/tests` still globbed into .claude/worktrees, where agent
// worktrees keep their own copies of this framework. That ran the suite 118
// times instead of once, took 38s, and surfaced a failure from a scratch
// worktree whose tools directory no longer exists — a red result that said
// nothing about this repository.
export default defineConfig({
  test: {
    include: ["dev/tests/**/*.test.mjs"],
    exclude: [
      "**/node_modules/**",
      "**/.claude/**",
      "**/_archive/**",
      "**/legacy/**",
    ],
  },
});
