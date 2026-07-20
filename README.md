# DevStash

> A unified hub for developer knowledge & resources — snippets, prompts, commands, notes, files, images, and links, all in one searchable place.

Developers scatter their essentials across VS Code, Notion, Gists, chat histories, bookmarks, and random text files. DevStash aims to be the one fast, searchable, AI-enhanced hub for all of it.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router, React Compiler enabled) |
| UI | React 19, [shadcn/ui](https://ui.shadcn.com) (`base-nova` style, built on `@base-ui/react`) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Database | Neon PostgreSQL via Prisma 7 |
| Auth | NextAuth v5 (GitHub OAuth + email/password credentials) |
| Theming | `next-themes` (dark mode by default) |

## Current State

- Landing page at `/` and a database-backed dashboard at `/dashboard` (stats, pinned items, recent collections, recent items, sidebar type counts) — currently **read-only**, with data queries pinned to a single seeded demo user rather than the signed-in session.
- Auth is functional end-to-end: NextAuth v5 with GitHub OAuth and credentials sign-up/sign-in, custom `/sign-in` and `/register` pages, and route protection for `/dashboard` and `/profile`.
- Not yet implemented: wiring dashboard queries to the real signed-in user, create/edit/delete for items and collections, search, file uploads (Cloudflare R2), AI enhancement (OpenAI), Stripe billing, and automated tests.

See [`CLAUDE.md`](CLAUDE.md) for detailed architecture notes and [`context/project-overview.md`](context/project-overview.md) for the full product spec.

## Getting Started

Install dependencies and set up the database:

```bash
npm install
npx prisma migrate dev
npx prisma db seed
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build — the main verification step |
| `npm run lint` | Run ESLint |
| `npx shadcn add <component>` | Add a shadcn/ui component to `src/components/ui/` |
| `npx prisma migrate dev --name <name>` | Create and apply a dev migration |
| `npx prisma generate` | Regenerate the Prisma Client |
| `npx prisma db seed` | Seed the database (system item types + demo user/collections/items, idempotent) |

There is no test script yet — `npm run build` is the current verification gate.

## Project Structure

```
src/
  app/(dashboard)/   # Dashboard route group
  app/(auth)/        # Sign-in / register route group
  components/layout/ # Dashboard shell, sidebar, top bar
  components/dashboard/ # Dashboard widgets
  components/auth/   # Sign-in / register forms
  components/ui/     # shadcn/ui primitives
  lib/db/            # Query layer (one module per domain)
  lib/constants/     # Shared constants (e.g. item types)
context/
  project-overview.md  # Full product spec
  coding-standards.md  # TS/React/Next/Tailwind standards
  ai-interaction.md    # Development workflow rules
  current-feature.md   # Active feature doc + history log
```
