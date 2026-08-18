# Agent Operating Manual

## Agent Roster

**opencode**: solo agent — owns all domains (frontend, backend, logic, infra)

## Mandatory Protocol (enforced every session)

Every AI agent session MUST follow these steps in order. No exceptions.

### 1. Session Start (required)

Before writing ANY code, the agent MUST:

- [ ] Read `status.md` — know current phase, in-progress items, blockers
- [ ] Read `plans/roadmap.md` — know what's next
- [ ] Check `agents/blockers.md` — know what's stuck
- [ ] Check `docs/decisions.md` — know past decisions
- [ ] Check Next.js docs if touching framework code: `node_modules/next/dist/docs/`

**If any of these files are missing, create them before proceeding.**

### 2. Before Implementation (required)

Before writing code for any task:

- [ ] If cross-boundary work: update `docs/interfaces.md` FIRST
- [ ] If making an architecture decision: log in `docs/decisions.md` BEFORE implementing
- [ ] If blocked >15 min: log in `agents/blockers.md` with severity + proposed fix

### 3. During Implementation

- **Use graft for code exploration** — prefer `graft_graft_find_code`, `graft_graft_trace_calls`, `graft_graft_repo_map` over `Read` for understanding existing code. Only use `Read` when graft doesn't have the answer or you need exact line-by-line content.
- Follow existing code conventions (check neighboring files)
- Match existing patterns (same libraries, same style)
- Never introduce secrets or credentials

### 4. Session End (required)

Before finishing, the agent MUST:

- [ ] Update `status.md` with daily log entry (Done/Doing/Blocked/Next)
- [ ] Update `docs/interfaces.md` if any types/contracts changed
- [ ] Run `npm run build` to verify no regressions
- [ ] Run `npm run lint` if available

**If the agent skips step 4, the session is incomplete.**

## Escalation Path

| Trigger | File |
|---|---|
| Technical blocker | `agents/blockers.md` |
| Architecture decision | `docs/decisions.md` |
| Scope question | `docs/prd.md` |
| Interface conflict | `docs/interfaces.md` |

## Communication Rules

- All coordination happens through files, not chat
- If it's not in `status.md`, it's not real
- Every session ends with a `status.md` update
- Agent roles: opencode
