# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

DevStash is a unified hub for developer knowledge and resources (snippets, prompts, commands, notes, files, images, links) built with Next.js App Router. The **product vision** includes CRUD, collections, search, AI enhancement, and a freemium model via Stripe. **Current codebase:** NextAuth v5 (GitHub + credentials) protects `/dashboard` and has custom `/sign-in`/`/register` pages, but the `/dashboard` UI itself is still read-only and its data queries are gated behind a single hardcoded demo user rather than the signed-in session — see Current State below.

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
| `npx prisma db seed` | Seed the database (system item types + demo user/collections/items, idempotent) |

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

## Neon MCP Usage

When using Neon MCP tools (`run_sql`, `run_sql_transaction`, `describe_branch`, `get_connection_string`, migrations, branch operations, etc.), always default to:

- **Project**: `DevStash` — project ID `purple-fire-32924884`
- **Branch**: `development` — branch ID `br-steep-union-atedwnnq`

**Never target the `production` branch (`br-hidden-rice-at7x3yh5`) — or run any destructive/write operation — unless the user explicitly says "production" or otherwise asks for it by name.** If a request doesn't name a branch, assume `development`.

## Architecture

### Route & Component Structure

- `src/app/(dashboard)/` — route group; its `layout.tsx` wraps pages in `DashboardShell`.
- `src/components/layout/` — shell: `DashboardShell` (client component holding sidebar collapse state), `Sidebar` (desktop), `MobileSidebar` (Sheet drawer), `TopBar`.
- `src/components/dashboard/` — dashboard widgets (`DashboardStats`, `PinnedItems`, `RecentCollections`, `RecentItemsList`).
- `src/components/ui/` — shadcn primitives; add via CLI rather than hand-writing.
- `src/lib/constants/item-types.ts` — single source of truth for the seven system item types (snippet, prompt, command, note, file, image, link): `ITEM_TYPE_NAMES`, plus icon/label/color/Tailwind-class lookup maps and `getTypeIcon`/`getTypeClasses`/`getTypeLabel` helpers. The `ITEM_TYPE_CLASSES` strings must stay static literals (not built dynamically) so Tailwind's source scanner picks them up, and `ITEM_TYPE_COLORS` must stay in sync with the `@theme` color block in `src/app/globals.css`.
- `src/app/(auth)/` — route group for `/sign-in` and `/register` (custom NextAuth pages, centered `AuthLayout`); forms live in `src/components/auth/` (`SignInForm`, `RegisterForm`), both client components calling `next-auth/react`'s `signIn()` / the `/api/auth/register` route directly. `src/components/shared/user-avatar.tsx` renders the GitHub `image` when present, else initials derived from the session user's `name`.

Server components by default; add `'use client'` only for interactivity/hooks (the pattern: server page → client shell/widget where state is needed).

### Data layer (implemented)

- **Prisma 7 + Neon PostgreSQL**. Schema: `prisma/schema.prisma`. Config (datasource URL, migrations path, seed command) lives in `prisma.config.ts` at the repo root — **not** in the `schema.prisma` datasource block, which is a Prisma 7 breaking change. Generator uses the Rust-free `provider = "prisma-client"` with client output at `src/generated/prisma` (gitignored, regenerated via the `postinstall` script — never commit it). A `PrismaPg` driver adapter (`@prisma/adapter-pg` + `pg`) connects the client to Neon; driver adapters are required in Prisma 7, there is no default engine-based connection. Import the shared singleton from `src/lib/prisma.ts` (`import { prisma } from "@/lib/prisma"`) rather than instantiating `PrismaClient` directly. **Never `prisma db push`** — always `prisma migrate dev` (dev) / `prisma migrate deploy` (prod), per Neon dev/prod branch setup in `context/features/database-spec.md`. Prevent N+1 queries with `_count` and `take`/`skip`.
- **`src/lib/db/*.ts`** — the dashboard's query layer, one module per domain (`items.ts`, `collections.ts`, `user.ts`), called directly from server components/layouts (no API routes, no client fetching). Each exported function resolves the current user via `getDemoUser()` (`src/lib/db/user.ts`) and returns a plain mapped DTO (e.g. `DashboardItem`, `DashboardCollection`), never a raw Prisma model — components stay decoupled from the schema shape. **No real auth yet**: `getDemoUser()` looks up a single hardcoded email (`demo@devstash.io`, seeded in `prisma/seed.ts`) and is wrapped in React's `cache()` so one request only pays for one `user.findUnique` no matter how many `db/*` functions call it. This is still the seam for item/collection queries even though auth UI now exists (see below) — replacing it with `getAuthedSession()`-derived user IDs is unimplemented follow-up work. `src/app/(dashboard)/layout.tsx` is itself an async server component that fetches sidebar data (item type counts, favorite/recent collections) and threads it down as props through `DashboardShell` → `TopBar`/`MobileSidebar` → `Sidebar`, since the sidebar tree includes client components that can't call Prisma directly. That same layout also calls `auth()` and passes `session?.user` down as the `user` prop for the sidebar's avatar/name/sign-out card — the one part of the UI already driven by the real NextAuth session rather than `getDemoUser()`.

### Target architecture (from spec, NOT yet implemented)

- **Mutations**: Server Actions returning `{ success, data, error }`; validate inputs with Zod. API routes only for webhooks (Stripe), file uploads (R2), and future external clients.
- **Auth**: NextAuth v5 (email/password + GitHub). Session via `getAuthedSession()` in `src/lib/action-utils.ts`; pro features gated by `requirePro()`.
- **Files**: Cloudflare R2. **AI**: OpenAI GPT-4o mini. **Payments**: Stripe subscriptions.

## Current State

- Next.js 16 + React 19 + TS strict + Tailwind v4 + ESLint 9 scaffold; React Compiler on.
- shadcn/ui initialized (avatar, badge, button, card, input, scroll-area, separator, sheet, tooltip).
- **Dashboard UI wired to Neon** at `/dashboard`: TopBar (dummy search/new-item buttons — not functional yet), collapsible desktop sidebar + mobile Sheet drawer, stats cards, pinned items, recent collections, recent items, sidebar type counts and favorite/recent collections all read live from the database via `src/lib/db/*.ts` for a single hardcoded demo user (see Data layer above). Everything is display-only — no create/edit/delete/search/filter UI exists yet.
- Placeholder homepage at `/`.
- **Database**: Prisma 7 + Neon PostgreSQL configured and migrated (`prisma/schema.prisma`, `prisma.config.ts`, `src/lib/prisma.ts`); full schema (User/Item/ItemType/Collection/ItemCollection/Tag + NextAuth's Account/Session/VerificationToken) migrated; system item types + a demo user with 5 collections / 18 items seeded (`prisma/seed.ts`, idempotent — safe to rerun via `npx prisma db seed`).

- **Auth (Phases 1–3)**: NextAuth v5 with GitHub OAuth + Credentials providers (`src/auth.ts`, `src/auth.config.ts`), `/api/auth/register`, and custom `/sign-in`/`/register` pages (`src/app/(auth)/`) replacing the NextAuth default pages; `src/proxy.ts` protects `/dashboard/:path*` and `/profile/:path*`. The sidebar's user card reads the real session (avatar/name, sign-out dropdown, link to a placeholder `/profile` page) — but item/collection *data* queries are still hardcoded to the seeded demo user (see Data layer above), independent of who's signed in.

**Not started:** wiring dashboard data queries to the signed-in session (`getAuthedSession()` swap for `getDemoUser()`), pro-gating (`requirePro()`), all mutations (create/edit/delete for items/collections — currently nothing writes to the DB outside the seed script), search, file uploads (R2), AI enhancement, Stripe, tests, and their dependencies (Zod, Vitest, etc.).

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
- `context/features/*.md` — per-feature specs (dashboard phases 1–3, database, seed, dashboard collections/items, stats/sidebar, pro badge).
- `context/screenshots/` — dashboard UI design references.
