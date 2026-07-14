# DevStash — Project Context

## Overview

DevStash is a unified hub for developer knowledge and resources, built with Next.js App Router. The **product vision** includes saving, organizing, searching, and AI-enhancing code snippets, prompts, commands, notes, files, images, and links, with a freemium model via Stripe. **Current codebase:** early scaffold only — see Current State below.

## Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Framework** | Next.js | `16.2.10` | App Router. React Compiler enabled (`reactCompiler: true`). |
| **UI Library** | React | `19.2.4` | With `react-dom@19.2.4`. |
| **Language** | TypeScript | `^5` | Strict mode, `bundler` module resolution, `@/*` → `./src/*` path alias. |
| **Styling** | Tailwind CSS | `^4` | Via `@tailwindcss/postcss` plugin. CSS-first config in `src/app/globals.css`. |
| **Linting** | ESLint | `^9` | Flat config. |
| **Package Manager** | npm | — | `package-lock.json` present. |

## Key Patterns & Conventions

> The patterns below describe the **target architecture** from the product spec. They are not yet implemented in the codebase.

### App Router (Next.js 16)
- **Server Components by Default**: Fetch data directly with Prisma in server components.
- **Server Actions**: Used for form submissions and simple mutations. Always return `{ success, data, error }`.
- **API Routes**: Used only for webhooks (Stripe), file uploads (R2), and specific HTTP handlers.
- **Next.js 16.2.10 may differ from training data** — always consult `node_modules/next/dist/docs/` before writing code.

### Tailwind CSS v4
- **No `tailwind.config.js`** — v4 uses CSS-first configuration directly in CSS (`src/app/globals.css`).
- Theme customization, custom utilities, and plugins are declared in CSS using `@theme`, `@utility`, etc.

### Database (Prisma)
- **Never use `db push`**: Always use `prisma migrate dev` for schema changes.
- **N+1 Query Prevention**: Utilize Prisma `_count` and `take`/`skip` appropriately.

### Authentication & Gating
- Access session securely via `getAuthedSession()` helper in `src/lib/action-utils.ts`.
- Gate pro features (files, images, AI) using the `requirePro()` helper and DB subscription status.

### Testing
- Vitest is used for unit tests (server actions and utilities).
- Run with `npm run test`. Test files live next to source files (`feature.test.ts`).

## Current State

Early scaffold and initial UI. The following exist:

- **Next.js 16 + React 19** — `package.json`, `next.config.ts`
- **TypeScript** — strict mode, path alias (`tsconfig.json`)
- **Tailwind CSS v4** — minimal setup (`src/app/globals.css`, `postcss.config.mjs`)
- **React Compiler** — enabled (`next.config.ts`)
- **ESLint 9** — flat config (`eslint.config.mjs`)
- **Root layout** — metadata title/description (`src/app/layout.tsx`)
- **Placeholder homepage** — `<h1>DevStash</h1>` at `/` (`src/app/page.tsx`)
- **Shadcn UI** — initialized with `next-themes` and `lucide-react`
- **Dashboard UI Phase 1** — main dashboard layout at `/dashboard` with TopBar (dummy search, new item buttons) and placeholders for Sidebar and Main content.
- **Mock Data** — static arrays for development (`src/lib/mock-data.ts`)
- **UI design references** — screenshots in `context/screenshots/`

**Not yet started:** database, auth, items/collections CRUD, search, file uploads, AI, Stripe, tests, or any planned dependencies (Prisma, NextAuth, etc.).

## Development Workflow

1. **Document**: Document the feature/fix in `context/current-feature.md`.
2. **Branch**: Create a new branch (`feature/*` or `fix/*`).
3. **Implement**: Write code making minimal changes to accomplish the task.
4. **Test**: Run `npm run test` and `npm run build` to verify.
5. **Iterate**: Fix any issues.
6. **Commit**: Use conventional commits. Never commit if tests/build fail. Ask for permission first.
7. **Merge & Clean**: Merge to main and delete the branch.
8. **Mark Done**: Update `current-feature.md`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (`next dev`) |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Start production server (`next start`) |
| `npm run lint` | Run ESLint |
