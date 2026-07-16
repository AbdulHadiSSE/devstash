# Current Feature

## Status

Done

## Goals

Implement Prisma + Neon PostgreSQL setup (reference: `context/features/database-spec.md`):
- Set up Prisma ORM with Neon PostgreSQL (serverless)
- Use Prisma 7 (breaking changes vs. earlier versions — consult the upgrade guide)
- Create the initial schema based on the data models in `context/project-overview.md` (expected to evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Always use `prisma migrate dev` — never push directly to the database (dev branch via `DATABASE_URL`, separate production branch)

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
