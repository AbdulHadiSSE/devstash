# Current Feature

## Status

Done

## Goals

Seed the database with sample development/demo data (reference: `context/features/seed-spec.md`):
- Extend `prisma/seed.ts` to create a demo user (demo@devstash.io / "Demo User", password `12345678` hashed with bcryptjs at 12 rounds, `isPro: false`, `emailVerified` set to the current date) alongside the existing system item type seeding
- Create 5 collections owned by the demo user, each with its described items:
  - **React Patterns** (_Reusable React patterns and hooks_) — 3 TypeScript snippets (custom hooks, component patterns, utility functions)
  - **AI Workflows** (_AI prompts and workflow automations_) — 3 prompts (code review, documentation generation, refactoring assistance)
  - **DevOps** (_Infrastructure and deployment resources_) — 1 snippet (Docker/CI-CD config), 1 command (deployment script), 2 links (real documentation URLs)
  - **Terminal Commands** (_Useful shell commands for everyday development_) — 4 commands (git, docker, process management, package manager)
  - **Design Resources** (_UI/UX resources and references_) — 4 links (real URLs: CSS/Tailwind references, component libraries, design systems, icon libraries)
- Items must reference the correct system `ItemType` (snippet/prompt/command/link) seeded earlier in the script
- Seed script should remain idempotent/safe to re-run (e.g. upsert by unique fields) consistent with the existing item type seeding

## Notes

<!-- Additional context here -->

## History

- **Project Bootstrap** - Next.js 16.2.10 app scaffolded via create-next-app (`package.json`, `src/app/`)
- **TypeScript Configuration** - Strict mode, bundler module resolution, `@/*` path alias (`tsconfig.json`)
- **Tailwind CSS v4 Setup** - CSS-first Tailwind via `@import "tailwindcss"` and `@tailwindcss/postcss` plugin (`src/app/globals.css`, `postcss.config.mjs`)
- **React Compiler** - Enabled in Next.js config (`next.config.ts`)
- **ESLint Setup** - ESLint 9 flat config with `eslint-config-next` (`eslint.config.mjs`)
- **Root Layout & Placeholder Homepage** - Basic root layout with DevStash metadata (`src/app/layout.tsx`); minimal `<h1>DevStash</h1>` placeholder at `/` (`src/app/page.tsx`)
- **Dashboard UI Phase 1** - ShadCN UI initialized with `next-themes` and `lucide-react`. Built the main dashboard layout at `/dashboard` enforcing dark mode by default. Included a `TopBar` with dummy search and new item buttons, alongside basic placeholders for the `Sidebar` and `Main` content areas.
- **Dashboard UI Phase 2** - Built collapsible sidebar with Types, Favorite Collections, Recent Items, and User Avatar using mock data. Added mobile drawer via Shadcn `Sheet`. Integrated `DashboardShell` client component for layout state management. (`src/components/layout/sidebar.tsx`, `mobile-sidebar.tsx`, `dashboard-shell.tsx`)
- **Dashboard UI Phase 3** - Built main dashboard components (`DashboardStats`, `PinnedItems`, `RecentCollections`, `RecentItemsList`) and assembled them into the `/dashboard` page using a responsive grid layout. (`src/components/dashboard/*.tsx`, `src/app/(dashboard)/dashboard/page.tsx`)
- **Dashboard Spec & Styling Fixes** - Rendered the missing `DashboardStats` cards on `/dashboard`; sidebar user card and type counts now derived from mock data instead of hardcoded values; extracted shared item-type icon/color constants (`src/lib/constants/item-types.ts` + `@theme` type colors in `globals.css`); replaced hardcoded `zinc-*`/hex colors and inline styles with semantic theme tokens across layout and dashboard components; pinned item cards use per-type left-border colors; synced context docs.
- **Prisma + Neon PostgreSQL Setup** - Installed Prisma 7 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`) and wired it up for Prisma 7's breaking changes: `prisma.config.ts` (root) now owns the datasource URL/migrations/seed config instead of the `schema.prisma` datasource block; generator uses the Rust-free `provider = "prisma-client"` with an explicit `output` into `src/generated/prisma` (gitignored); a `PrismaPg` driver adapter wires the generated client to Neon via `pg`. Added the full schema from `context/project-overview.md` (`prisma/schema.prisma`) including NextAuth models (Account, Session, VerificationToken), indexes, and cascade deletes. Added a hot-reload-safe client singleton (`src/lib/prisma.ts`), seed script for the 7 system item types (`prisma/seed.ts`), and a `postinstall: prisma generate` script. Ran `prisma migrate dev --name init` against a live Neon database and seeded successfully (verified 7 `ItemType` rows); `npm run build` passes.
- **Demo Data Seeding** - Extended `prisma/seed.ts` (reference: `context/features/seed-spec.md`) to seed a demo user (`demo@devstash.io` / "Demo User", password `12345678` hashed with `bcryptjs` at 12 rounds, `isPro: false`) alongside the existing system item types. Added `bcryptjs` + `@types/bcryptjs` as dependencies. Seeded 5 demo collections owned by the user — React Patterns (3 TS snippets), AI Workflows (3 prompts), DevOps (1 snippet, 1 command, 2 real doc links), Terminal Commands (4 commands), Design Resources (4 real links) — 18 items total, linked to their collections via `ItemCollection`. Seeding is idempotent (find-or-create per collection/item, `upsert` on the `ItemCollection` composite key), verified by running `prisma db seed` twice with no duplicate rows created; `npm run build` passes.
