# DevStash — Project Context

## Overview

DevStash is a greenfield Next.js project in its earliest stage — scaffolded via `create-next-app` with the App Router, but containing virtually no application code yet. The `layout.tsx` is empty and `page.tsx` renders a single `<h1>DevStash</h1>`.

## Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| **Framework** | Next.js | `16.2.10` | App Router. React Compiler enabled (`reactCompiler: true`). |
| **UI Library** | React | `19.2.4` | With `react-dom@19.2.4`. |
| **Language** | TypeScript | `^5` | Strict mode, `bundler` module resolution, `@/*` → `./src/*` path alias. |
| **Styling** | Tailwind CSS v4 | `^4` | Via `@tailwindcss/postcss` PostCSS plugin. CSS-first config (no `tailwind.config.js`). |
| **Compiler Plugin** | React Compiler | `babel-plugin-react-compiler@1.0.0` | Activated in `next.config.ts`. |
| **Linting** | ESLint 9 | `^9` | Flat config using `eslint-config-next` (core-web-vitals + typescript). |
| **Package Manager** | npm | — | `package-lock.json` present. |

## Folder Structure

```
devstash/
├── public/                  # Static assets (currently empty)
├── src/
│   └── app/                 # Next.js App Router root
│       ├── favicon.ico
│       ├── globals.css      # Tailwind v4 import
│       ├── layout.tsx       # Root layout (⚠ EMPTY — needs implementation)
│       └── page.tsx         # Home route — renders <h1>DevStash</h1>
├── .gitignore
├── CLAUDE.md                # This file — project context
├── eslint.config.mjs        # ESLint 9 flat config
├── next.config.ts           # Next.js config (React Compiler on)
├── package.json
├── postcss.config.mjs       # Tailwind v4 via @tailwindcss/postcss
└── tsconfig.json            # Strict TS, bundler resolution, @/* alias
```

## Key Patterns & Conventions

### App Router (Next.js 16)
- Uses the `src/app/` directory for routing.
- Pages are defined via `page.tsx` files in route directories.
- Layout nesting through `layout.tsx` files.
- **Next.js 16.2.10 may differ from training data** — always consult `node_modules/next/dist/docs/` before writing code.

### Tailwind CSS v4
- **No `tailwind.config.js`** — v4 uses CSS-first configuration directly in CSS.
- Theme customization, custom utilities, and plugins are declared in CSS using `@theme`, `@utility`, etc.

### React Compiler
- Automatic memoization — manual `useMemo`, `useCallback`, and `React.memo` are generally unnecessary.
- Components must follow the Rules of React for the compiler to optimize correctly.

### Import Alias
- Use `@/` to reference anything under `src/`. Example: `import Foo from '@/app/components/Foo'`.

## Configuration Summary

- **TypeScript**: ES2017 target, strict mode, `react-jsx`, incremental builds, `@/*` path alias.
- **Next.js**: `reactCompiler: true`. No custom rewrites/redirects/headers.
- **PostCSS**: Tailwind v4 via `@tailwindcss/postcss` plugin.
- **ESLint**: Flat config (ESLint 9). Ignores `.next/`, `out/`, `build/`, `next-env.d.ts`.

## Current State

| Aspect | Status |
|---|---|
| Root layout | ⚠ **Empty** — must be implemented before the app renders |
| Routes | Only `/` exists (bare `<h1>`) |
| Components | None |
| API routes | None |
| Database / Auth | Not configured |
| Testing | Not configured |
| CI/CD | Not configured |
| Environment variables | No `.env` files |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (`next dev`) |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Start production server (`next start`) |
| `npm run lint` | Run ESLint |
