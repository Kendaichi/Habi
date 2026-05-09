# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## 5. Project Folder Conventions

Where code lives in this project:

| Folder | What goes here |
|---|---|
| `src/lib/` | Server-side helpers and service wrappers. Examples: `auth.ts` (requireRole, getCurrentUserProfile), `prisma.ts`, `storage.ts` (uploadFile), `junkshop.ts` (getCurrentJunkShop), `room-service.ts`. |
| `src/utils/` | Pure, side-effect-free utility functions and shared constants. Examples: `material-styles.ts` (MATERIAL_BG, MATERIAL_STYLE), `cn()` is in `lib/utils.ts`. |
| `src/types/` | Shared TypeScript types and interfaces. Subdirectories: `server/` (Handler, Route), `room/`. Inline page-local types can stay in their file. |
| `src/api/` | Next.js API route handlers for external-facing endpoints (called by client-side fetch or third parties). Current routes: `room/generate`, `room/world`. Mutations that are only called from the app use server actions instead. |
| `src/app/**/actions.ts` | Server actions (`'use server'`) for mutations tied to a specific route. Should use `requireRole()` on every action — never hardcode user IDs. |
| `src/app/**/page.tsx` | Page components only. Data fetching via Prisma is fine here for server components. Extract logic to `lib/` when it's reused across 2+ pages. |

**Key rules:**
- Never hardcode user/entity IDs in server actions — always derive from `requireRole()`.
- Duplicate Supabase upload logic → `src/lib/storage.ts` (`uploadFile`).
- Duplicate shop lookup pattern → `src/lib/junkshop.ts` (`getCurrentJunkShop`).
- Duplicate material color/style maps → `src/utils/material-styles.ts`.
