<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mandatory Agent Protocol

Before writing ANY code, you MUST read and follow `agents/agents.md` — the coordination protocol is mandatory for every session.

## Quick checklist:
1. Read `status.md` at session start
2. Read `plans/roadmap.md` for next tasks
3. Check `docs/decisions.md` before making decisions
4. Update `docs/interfaces.md` before cross-boundary work
5. Update `status.md` at session end with daily log
6. Run `npm run build` to verify no regressions
