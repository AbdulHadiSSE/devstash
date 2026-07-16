# Current Feature

## Status

Done

## Goals

Wire the dashboard's recent collections section to the database (reference: `context/features/dashboard-collections-spec.md`):
- Replace the dummy collection data in the dashboard main area (right side, recent collections grid) with real data from Neon via Prisma — currently sourced from `src/lib/mock-data.ts`
- Create `src/lib/db/collections.ts` with data fetching functions
- Fetch collections directly in the server component (no client-side fetch)
- Collection card border color derived from the most-used content type in that collection
- Show small icons of all item types present in that collection
- Update the collection stats display
- Keep the current design/layout as-is (6-card grid) — reference `context/screenshots/dashboard-ui-main.png` if needed
- Do **not** add the items list underneath collections yet — that's a later feature

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
- **Dashboard Collections Wired to Database** (`feature/dashboard-collections`, reference: `context/features/dashboard-collections-spec.md`) - Replaced the mock-data-backed recent collections grid with real data. Added `src/lib/db/collections.ts` (`getDashboardCollections()`) fetching the demo user's collections from Neon via Prisma — joins items → item type and computes, per collection, the item count, the most-used item type (for the card's left-border color), and the distinct type names present (for the small type-icon row). `src/components/dashboard/recent-collections.tsx` converted to an async server component calling this function directly (no client fetch, no API route); item list underneath collections intentionally deferred. Also swapped an arbitrary `min-h-[140px]` for the canonical `min-h-35` Tailwind utility, and set `sslmode=verify-full` in `.env` to silence a `pg` driver deprecation warning surfaced once this component started querying the database. Verified via `npm run build`, `npm run lint`, and a dev-server HTML check confirming all 5 seeded collections render with correct item counts and correctly-derived border colors (e.g. DevOps → `link`, its most common type).
