# DevStash — Everything Explained in Simple Terms

> **Course:** Coding With AI by Brad Traversy
> **Project:** DevStash — a developer knowledge hub built entirely with AI-assisted development

---

## 1. What Is DevStash?

DevStash is a **web application** (a website you log into) where developers can **save, organize, search, and AI-enhance** all their useful bits of knowledge in one place.

Think of it like a **personal Google Drive, but built specifically for developer stuff**:

| What you can store | Examples |
| --- | --- |
| **Code Snippets** | A React hook you always reuse |
| **AI Prompts** | A ChatGPT prompt that generates boilerplate |
| **Notes** | How to set up a Docker container |
| **Commands** | `git rebase -i HEAD~3` |
| **Files** | A PDF cheatsheet, a template `.env` file |
| **Images** | Screenshots of UI designs |
| **URLs** | Links to useful docs or tutorials |

---

## 2. Why Does It Exist?

Developers keep their knowledge **scattered everywhere**:

- Snippets in VS Code or Notion
- AI prompts lost in old chat threads
- Useful links buried in browser bookmarks
- Commands in random `.txt` files or bash history
- Templates in GitHub gists
- Docs in random folders

This causes **lost knowledge**, **wasted time searching**, and **inconsistent workflows**.

> **DevStash's answer:** Put it ALL in one searchable, AI-powered hub.

---

## 3. What Can It Do? (Core Features)

### Items & Types

Every piece of knowledge you save is called an **Item**. Each item has a **type**:

- Snippet, Prompt, Note, Command, File, Image, URL (built-in)
- Pro users can create **custom types** too

### Collections

Group related items together — like folders, but more flexible. One collection can hold **mixed types**.

> Example: A "React Patterns" collection might contain snippets, notes, AND links.

### Search

Full-text search that works across **titles, content, tags, and types** — so you can find anything instantly.

### AI Superpowers

| AI Feature | What It Does |
| --- | --- |
| **Auto-tagging** | AI reads your item and suggests relevant tags |
| **Summaries** | AI generates a short summary of long content |
| **Explain Code** | Paste code, AI explains what it does |
| **Prompt Optimization** | AI improves your AI prompts |

> All AI features are powered by **OpenAI's gpt-5-nano** model.

### Authentication (Login System)

Two ways to sign in:

1. **Email + Password** — traditional signup
2. **GitHub OAuth** — one-click login with your GitHub account

Includes email verification and password reset.

### File Uploads

Upload images, documents, and templates. Files are stored on **Cloudflare R2** (a cloud storage service like S3).

### Other Features

- ⭐ **Favorites & Pinning** — keep important items at the top
- 🕐 **Recently Used** — quick access to what you just worked with
- 📥 **Import** — bring in data from files
- ✍️ **Markdown Editor** — write formatted notes
- 📤 **Export** — download everything as JSON or ZIP
- 🌙 **Dark Mode** — on by default (developer-friendly)

---

## 4. How Does It Make Money?

DevStash uses a **freemium model** — basic features are free, advanced features require a paid subscription.

| | Free Plan | Pro Plan |
| --- | --- | --- |
| **Price** | $0 | $8/month or $72/year |
| **Items** | Up to 50 | Unlimited |
| **Collections** | Up to 3 | Unlimited |
| **Search** | ✅ Basic | ✅ Full |
| **Image Uploads** | ✅ | ✅ |
| **File Uploads** | ❌ | ✅ |
| **Custom Types** | ❌ | ✅ |
| **AI Features** | ❌ | ✅ |
| **Export** | ❌ | ✅ |

Payments are handled by **Stripe** (subscriptions + webhooks to keep everything in sync).

---

## 5. Tech Stack (What Powers It)

Here's every technology used and **why**:

| Layer | Technology | Why It's Used |
| --- | --- | --- |
| **Framework** | Next.js (React 19) | Full-stack React framework — handles both the website UI and the backend API |
| **Language** | TypeScript | Safer JavaScript — catches bugs before they happen |
| **Database** | Neon PostgreSQL | Cloud-hosted database that stores all users, items, collections, tags |
| **ORM** | Prisma | Lets you talk to the database using TypeScript instead of raw SQL |
| **File Storage** | Cloudflare R2 | Stores uploaded files and images (like AWS S3, but cheaper) |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS for fast styling + pre-built UI components |
| **Auth** | NextAuth v5 | Handles login, signup, sessions, OAuth |
| **AI** | OpenAI gpt-5-nano | Powers auto-tagging, summaries, code explanations |
| **Deployment** | Vercel | Hosts the live website (optimized for Next.js) |
| **Monitoring** | Sentry (later) | Tracks errors and performance in production |

---

## 6. Database Structure (Data Model)

The database has **5 main tables**. Here's how they relate:

```
User
 ├── has many Items
 ├── has many Collections
 ├── has many Tags
 └── has many ItemTypes (custom ones)

Item
 ├── belongs to one User
 ├── belongs to one ItemType (Snippet, Note, etc.)
 ├── optionally belongs to one Collection
 └── has many Tags (through ItemTag join table)

Collection
 ├── belongs to one User
 └── has many Items

Tag
 ├── belongs to one User
 └── has many Items (through ItemTag join table)

ItemType
 ├── optionally belongs to a User (custom types)
 └── has many Items
```

### Key Fields on Each Table

| Table | Important Fields |
| --- | --- |
| **User** | email, password, isPro, stripeCustomerId |
| **Item** | title, content (text) OR fileUrl (file), language, isFavorite, isPinned |
| **Collection** | name, description, isFavorite |
| **Tag** | name |
| **ItemType** | name, icon, color, isSystem (built-in vs custom) |

---

## 7. How the App Works (Architecture)

```
┌─────────────┐
│   Browser    │  ← User interacts here
└──────┬───────┘
       │
       ▼
┌─────────────┐
│  Next.js App │  ← Handles both UI rendering AND API logic
└──────┬───────┘
       │
       ├──► Neon PostgreSQL  (stores data)
       ├──► Cloudflare R2    (stores files)
       ├──► OpenAI API       (AI features)
       └──► Stripe           (payments)
```

### How Auth Works

```
User → Login Page → NextAuth → Email or GitHub Provider → Session Created → App Access
```

### How AI Features Work

```
User saves an item → App sends content to OpenAI → AI returns tags/summary/explanation → UI updates
```

---

## 8. UI / UX Design

- **Dark mode first** — light mode is the secondary option
- **Minimal, developer-friendly** — inspired by Notion, Linear, and Raycast
- **Syntax highlighting** for code snippets
- **Layout:**
  - Collapsible sidebar (filters & collections)
  - Main grid/list workspace
  - Full-screen item editor
- **Mobile-responsive** — sidebar becomes a drawer, touch-friendly buttons

---

## 9. The 4 Context Files (How AI Knows What to Do)

The project uses **4 root-level markdown files** that act as the AI's permanent memory. These are loaded automatically every time the AI starts:

### [project-overview.md](file:///e:/Projects/understanding_project/project/project-overview.md)

> **The blueprint.** Contains the full project specification — features, data models, tech stack, UI plan, roadmap. This is the "big picture" document.

### [coding-standards.md](file:///e:/Projects/understanding_project/project/coding-standards.md)

> **The rulebook.** Defines how code should be written — naming conventions, folder structure, TypeScript rules, React patterns, Tailwind v4 configuration, error handling patterns.

### [ai-interaction.md](file:///e:/Projects/understanding_project/project/ai-interaction.md)

> **The behavior guide.** Tells the AI how to communicate, what workflow to follow, when to ask for permission, and what NOT to do.

### [current-feature.md](file:///e:/Projects/understanding_project/project/current-feature.md)

> **The task tracker.** A living document updated constantly. Always describes what feature is being worked on RIGHT NOW, so the AI never needs to be re-explained.

### On-Demand Folders (loaded only when needed)

| Folder | Purpose | When Loaded |
| --- | --- | --- |
| `features/` | Detailed feature specs | Via `/feature` command |
| `fixes/` | Bug/issue descriptions | When fixing a specific bug |
| `research/` | Research documentation | Via `/research` command |
| `screenshots/` | UI reference images | When AI needs to "see" the design |

---

## 10. Development Workflow

Every feature or fix follows this **10-step process**:

```
 1. DOCUMENT  → Write what you're building in current-feature.md
 2. BRANCH    → Create a new git branch (feature/... or fix/...)
 3. IMPLEMENT → Write the code
 4. TEST      → Check in browser + run `npm run build`
 5. ITERATE   → Fix issues, refine
 6. COMMIT    → Only after build passes (use conventional commits)
 7. MERGE     → Merge branch into main
 8. DELETE    → Delete the feature branch
 9. REVIEW    → Review the AI-generated code
10. MARK DONE → Update current-feature.md
```

> [!IMPORTANT]
> **Never commit until the build passes.** If `npm run build` fails, fix the errors first.

### Git Branch Naming

- Features: `feature/item-crud`
- Bug fixes: `fix/search-not-working`
- Chores: `chore/update-deps`

### Commit Messages

Follow **conventional commits**:
- `feat: add item creation form`
- `fix: resolve search pagination bug`
- `chore: update prisma schema`

---

## 11. Coding Standards Summary

### TypeScript Rules
- Strict mode ON — no shortcuts
- Never use `any` — use proper types or `unknown`
- Define interfaces for all props, API responses, and data models

### React Rules
- Functional components only (no class components)
- Use hooks for state and side effects
- One job per component — keep them focused

### Next.js Rules
- **Server components by default** (they're faster, no JS sent to the browser)
- Only add `'use client'` when you need interactivity, hooks, or browser APIs
- Use **Server Actions** for form submissions
- Use **API routes** only for webhooks, file uploads, long-running operations, or third-party integrations

### Tailwind CSS v4 Rules

> [!WARNING]
> **DO NOT create `tailwind.config.ts` or `tailwind.config.js`** — those are for Tailwind v3. Version 4 uses CSS-based configuration with the `@theme` directive.

```css
/* Correct v4 setup in globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(50% 0.2 250);
}
```

### Folder Structure

```
src/
├── app/            ← Pages and routes
├── components/     ← UI components (grouped by feature)
├── actions/        ← Server Actions
├── types/          ← TypeScript type definitions
└── lib/            ← Utilities and helpers
```

### Error Handling Pattern

Every Server Action returns a consistent shape:
```typescript
{ success: boolean, data?: T, error?: string }
```

---

## 12. Roadmap

### MVP (Minimum Viable Product)
- [ ] Items CRUD (create, read, update, delete)
- [ ] Collections
- [ ] Search
- [ ] Basic tags
- [ ] Free-tier limits

### Pro Phase
- [ ] AI features (auto-tag, summarize, explain)
- [ ] Custom item types
- [ ] File uploads
- [ ] Export
- [ ] Stripe billing & upgrade flow

### Future Enhancements
- [ ] Shared collections
- [ ] Team / Organization plans
- [ ] VS Code extension
- [ ] Browser extension
- [ ] Public API + CLI tool

---

## 13. Course Connection

This project is built as part of Brad Traversy's **"Coding With AI"** course. The course teaches AI-assisted development through 15 sections and 100+ lessons, using DevStash as the hands-on project.

Key course topics mapped to DevStash:

| Course Section | What You Build |
| --- | --- |
| Project Planning & Context Files | The 4 context files above |
| Database Integration | Neon PostgreSQL + Prisma setup |
| Authentication | NextAuth v5 with email & GitHub |
| Item CRUD & Testing | Core item features + unit tests |
| File Storage | Cloudflare R2 uploads |
| Collections & Search | Organizing & finding items |
| Stripe Integration | Payment system |
| AI Features | Auto-tagging, summaries, explanations |
| Final Deployment | Live on Vercel |

---

## TL;DR

**DevStash** = one searchable web app where developers save snippets, prompts, notes, commands, files, and links. Built with **Next.js + TypeScript + PostgreSQL + Tailwind v4**. Has **AI features** (auto-tagging, summaries), **Stripe payments** (free vs pro), and **file uploads** (Cloudflare R2). Follows a strict **10-step workflow** with context files that keep the AI on track. The whole thing is built as a real SaaS product using AI-assisted development.

🏗️ **DevStash — Store Smarter. Build Faster.**
