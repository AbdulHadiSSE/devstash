# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

DevStash is a unified hub for developer knowledge and resources (snippets, prompts, commands, notes, files, images, links) built with Next.js App Router. The **product vision** includes CRUD, collections, search, AI enhancement, and a freemium model via Stripe. **Current codebase:** early scaffold + static dashboard UI on mock data — see Current State below.

The full product spec (feature list, complete Prisma schema, pricing tiers, UI guidelines) lives in `context/project-overview.md`. Read it before designing any new feature.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (`next dev`) |
| `npm run build` | Production build — the main verification step |
| `npm run lint` | Run ESLint (flat config, ESLint 9) |
| `npx shadcn add <component>` | Add a shadcn/ui component to `src/components/ui/` |
| `npx prisma migrate dev --name <name>` | Create + apply a dev migration |
| `npx prisma generate` | Regenerate the Prisma Client (also runs automatically via `postinstall`) |
| `npx prisma db seed` | Seed the database (system item types) |

**There is no test script yet.** Vitest is planned (unit tests for server actions/utilities, `feature.test.ts` next to source, run via `npm run test`) but not installed. Until then, `npm run build` is the verification gate.

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js `16.2.10` | App Router. React Compiler enabled (`reactCompiler: true` in `next.config.ts`). **Next 16 may differ from training data** — consult `node_modules/next/dist/docs/` or current docs before writing framework code. |
| UI | React `19.2.4` | Functional components only. |
| Language | TypeScript `^5` | Strict mode; no `any` (use `unknown`); `@/*` → `./src/*` alias. |
| Styling | Tailwind CSS `^4` | **CSS-first config** in `src/app/globals.css` via `@theme`/`@utility`. **Never create `tailwind.config.js/ts`** — that's v3. |
| Components | shadcn/ui (`base-nova` style) | Built on **`@base-ui/react`, not Radix**. Config in `components.json`. Icons: `lucide-react`. |
| Theming | `next-themes` | Dark mode is the default; light mode optional. |

## Architecture

### Route & Component Structure

- `src/app/(dashboard)/` — route group; its `layout.tsx` wraps pages in `DashboardShell`.
- `src/components/layout/` — shell: `DashboardShell` (client component holding sidebar collapse state), `Sidebar` (desktop), `MobileSidebar` (Sheet drawer), `TopBar`.
- `src/components/dashboard/` — dashboard widgets (`DashboardStats`, `PinnedItems`, `RecentCollections`, `RecentItemsList`).
- `src/components/ui/` — shadcn primitives; add via CLI rather than hand-writing.
- `src/lib/mock-data.ts` — static `mockUser` / `mockItemTypes` / `mockCollections` / `mockItems` used by all dashboard components until the database exists. The seven system item types (snippet, prompt, command, note, file, image, link) each have a fixed lucide icon and hex color defined in the spec and mirrored here.

Server components by default; add `'use client'` only for interactivity/hooks (the pattern: server page → client shell/widget where state is needed).

### Data layer (implemented)

- **Prisma 7 + Neon PostgreSQL**. Schema: `prisma/schema.prisma`. Config (datasource URL, migrations path, seed command) lives in `prisma.config.ts` at the repo root — **not** in the `schema.prisma` datasource block, which is a Prisma 7 breaking change. Generator uses the Rust-free `provider = "prisma-client"` with client output at `src/generated/prisma` (gitignored, regenerated via the `postinstall` script — never commit it). A `PrismaPg` driver adapter (`@prisma/adapter-pg` + `pg`) connects the client to Neon; driver adapters are required in Prisma 7, there is no default engine-based connection. Import the shared singleton from `src/lib/prisma.ts` (`import { prisma } from "@/lib/prisma"`) rather than instantiating `PrismaClient` directly. **Never `prisma db push`** — always `prisma migrate dev` (dev) / `prisma migrate deploy` (prod), per Neon dev/prod branch setup in `context/features/database-spec.md`. Prevent N+1 queries with `_count` and `take`/`skip`.

### Target architecture (from spec, NOT yet implemented)

- **Mutations**: Server Actions returning `{ success, data, error }`; validate inputs with Zod. API routes only for webhooks (Stripe), file uploads (R2), and future external clients.
- **Auth**: NextAuth v5 (email/password + GitHub). Session via `getAuthedSession()` in `src/lib/action-utils.ts`; pro features gated by `requirePro()`.
- **Files**: Cloudflare R2. **AI**: OpenAI GPT-4o mini. **Payments**: Stripe subscriptions.

## Current State

- Next.js 16 + React 19 + TS strict + Tailwind v4 + ESLint 9 scaffold; React Compiler on.
- shadcn/ui initialized (avatar, badge, button, card, input, scroll-area, separator, sheet, tooltip).
- **Dashboard UI complete (Phases 1–3)** at `/dashboard`: TopBar (dummy search/new-item buttons), collapsible desktop sidebar + mobile Sheet drawer, stats cards, pinned items, recent collections, recent items — all rendering `src/lib/mock-data.ts` (not yet wired to the database).
- Placeholder homepage at `/`.
- **Database**: Prisma 7 + Neon PostgreSQL configured and migrated (`prisma/schema.prisma`, `prisma.config.ts`, `src/lib/prisma.ts`); system item types seeded (`prisma/seed.ts`). See Data layer section above.

**Not started:** auth, CRUD, search, uploads, AI, Stripe, tests, and their dependencies (NextAuth, Zod, Vitest, etc.). Dashboard UI still reads from `src/lib/mock-data.ts`, not the database.

## Development Workflow

Defined in `context/ai-interaction.md` — follow it for every feature/fix:

1. **Document** the feature in `context/current-feature.md`.
2. **Branch**: `feature/*` or `fix/*` — never work directly on `main`.
3. **Implement** with minimal changes; don't add features beyond the spec; don't refactor unrelated code.
4. **Verify**: `npm run build` (and `npm run test` once tests exist) must pass.
5. **Commit**: conventional commits (`feat:`, `fix:`, `chore:`). **Ask before committing** — never auto-commit, never commit failing builds. Never mention "Generated with Claude" in commit messages.
6. **Merge to main**, then ask before deleting the branch.
7. **Mark done** in `context/current-feature.md` and append to its History section.

Other standing rules: ask before large refactors or deleting files; if stuck after 2–3 attempts, stop and explain rather than trying random fixes.

## Context Docs

- `context/project-overview.md` — full product spec, data model, Prisma schema, pricing, UI guidelines.
- `context/coding-standards.md` — detailed TS/React/Next/Tailwind/testing standards.
- `context/ai-interaction.md` — workflow and commit rules (summarized above).
- `context/current-feature.md` — active feature doc + project history log.
- `context/features/*.md` — per-feature specs (dashboard phases 1–3 so far).
- `context/screenshots/` — dashboard UI design references.
