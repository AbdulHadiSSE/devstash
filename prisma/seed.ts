import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const systemItemTypes = [
  { name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { name: "file", icon: "File", color: "#6b7280", isSystem: true },
  { name: "image", icon: "Image", color: "#ec4899", isSystem: true },
  { name: "link", icon: "Link", color: "#10b981", isSystem: true },
];

const DEMO_USER_EMAIL = "demo@devstash.io";
const DEMO_USER_PASSWORD = "12345678";

type SeedTextItem = {
  title: string;
  description: string;
  typeName: string;
  contentType: "TEXT";
  content: string;
  language?: string;
};

type SeedUrlItem = {
  title: string;
  description: string;
  typeName: string;
  contentType: "URL";
  url: string;
};

type SeedItem = SeedTextItem | SeedUrlItem;

type SeedCollection = {
  name: string;
  description: string;
  items: SeedItem[];
};

const seedCollections: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        title: "useDebounce Hook",
        description:
          "Debounce a fast-changing value, useful for search inputs and live filters",
        typeName: "snippet",
        contentType: "TEXT",
        language: "typescript",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}`,
      },
      {
        title: "Compound Component Pattern",
        description:
          "Context-based compound components for flexible, composable UI (Tabs example)",
        typeName: "snippet",
        contentType: "TEXT",
        language: "typescript",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

const TabsContext = createContext<{
  active: string;
  setActive: (id: string) => void;
} | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* must be used within <Tabs>");
  return ctx;
}

export function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Trigger = function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const { active, setActive } = useTabsContext();
  return (
    <button role="tab" aria-selected={active === value} onClick={() => setActive(value)}>
      {children}
    </button>
  );
};

Tabs.Content = function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const { active } = useTabsContext();
  return active === value ? <div role="tabpanel">{children}</div> : null;
};`,
      },
      {
        title: "Deep Merge Utility",
        description: "Recursively merge plain objects without mutating the originals",
        typeName: "snippet",
        contentType: "TEXT",
        language: "typescript",
        content: `type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T extends PlainObject>(target: T, source: PlainObject): T {
  const result: PlainObject = { ...target };

  for (const key of Object.keys(source)) {
    const targetValue = result[key];
    const sourceValue = source[key];

    result[key] =
      isPlainObject(targetValue) && isPlainObject(sourceValue)
        ? deepMerge(targetValue, sourceValue)
        : sourceValue;
  }

  return result as T;
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        title: "Code Review Prompt",
        description: "Prompt for thorough, actionable AI code reviews",
        typeName: "prompt",
        contentType: "TEXT",
        content: `Review the following code changes for:
1. Correctness bugs and edge cases
2. Security vulnerabilities (injection, auth, data exposure)
3. Performance issues (N+1 queries, unnecessary re-renders, unbounded loops)
4. Readability and naming

For each issue, cite the file and line, explain the failure scenario concretely, and suggest a fix. Skip nitpicks that don't affect correctness or maintainability.

<diff>
{{PASTE_DIFF_HERE}}
</diff>`,
      },
      {
        title: "Documentation Generation Prompt",
        description: "Generate concise reference docs from source code",
        typeName: "prompt",
        contentType: "TEXT",
        content: `Generate documentation for the following module. Include:
- A one-paragraph summary of its purpose
- Public API (functions/classes) with parameters, return types, and short descriptions
- One realistic usage example

Keep it concise — skip anything a reader could infer from well-named identifiers. Do not restate the code line by line.

<source>
{{PASTE_SOURCE_HERE}}
</source>`,
      },
      {
        title: "Refactoring Assistance Prompt",
        description: "Get a refactor plan without changing external behavior",
        typeName: "prompt",
        contentType: "TEXT",
        content: `Analyze the following code and propose a refactor that improves readability and reduces duplication without changing external behavior.

Requirements:
- Preserve the existing public API and function signatures
- Call out any risky assumptions you're making
- List the refactor as discrete, independently reviewable steps
- Flag anything that needs a test before it's safe to change

<source>
{{PASTE_SOURCE_HERE}}
</source>`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        title: "Multi-Stage Dockerfile",
        description: "Multi-stage build for a lean production Node.js image",
        typeName: "snippet",
        contentType: "TEXT",
        language: "dockerfile",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]`,
      },
      {
        title: "Deploy to Production",
        description: "Build and deploy the current branch to the production environment",
        typeName: "command",
        contentType: "TEXT",
        language: "bash",
        content: "npm run build && npx vercel deploy --prod",
      },
      {
        title: "Docker Multi-Stage Builds",
        description: "Official docs on structuring multi-stage Dockerfiles",
        typeName: "link",
        contentType: "URL",
        url: "https://docs.docker.com/build/building/multi-stage/",
      },
      {
        title: "GitHub Actions Documentation",
        description: "Official docs for building CI/CD workflows",
        typeName: "link",
        contentType: "URL",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        title: "Pretty Git Log Graph",
        description: "One-line commit graph across all branches",
        typeName: "command",
        contentType: "TEXT",
        language: "bash",
        content: "git log --oneline --graph --all --decorate",
      },
      {
        title: "Docker Full Cleanup",
        description: "Remove all stopped containers, unused images, networks, and volumes",
        typeName: "command",
        contentType: "TEXT",
        language: "bash",
        content: "docker system prune -af --volumes",
      },
      {
        title: "Find Process on Port",
        description: "List the process currently listening on a given port (macOS/Linux)",
        typeName: "command",
        contentType: "TEXT",
        language: "bash",
        content: "lsof -i :3000 | grep LISTEN",
      },
      {
        title: "Clean Install Dependencies",
        description: "Install exact versions from the lockfile, ignoring node_modules drift",
        typeName: "command",
        contentType: "TEXT",
        language: "bash",
        content: "npm ci --prefer-offline",
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        title: "Tailwind CSS Documentation",
        description: "Utility-class reference and configuration guide",
        typeName: "link",
        contentType: "URL",
        url: "https://tailwindcss.com/docs",
      },
      {
        title: "shadcn/ui",
        description: "Composable component library built on Radix/Base UI primitives",
        typeName: "link",
        contentType: "URL",
        url: "https://ui.shadcn.com",
      },
      {
        title: "Material Design 3",
        description: "Google's design system guidelines and components",
        typeName: "link",
        contentType: "URL",
        url: "https://m3.material.io",
      },
      {
        title: "Lucide Icons",
        description: "Open-source icon library used throughout the app",
        typeName: "link",
        contentType: "URL",
        url: "https://lucide.dev",
      },
    ],
  },
];

async function seedSystemItemTypes() {
  console.log("Seeding system item types...");

  for (const type of systemItemTypes) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });

    if (!existing) {
      await prisma.itemType.create({ data: type });
    }
  }
}

async function seedDemoUser() {
  console.log("Seeding demo user...");

  const hashedPassword = await bcrypt.hash(DEMO_USER_PASSWORD, 12);

  return prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });
}

async function seedCollectionsAndItems(userId: string) {
  console.log("Seeding demo collections and items...");

  const typeNames = [...new Set(seedCollections.flatMap((c) => c.items.map((i) => i.typeName)))];
  const itemTypes = await Promise.all(
    typeNames.map((name) =>
      prisma.itemType.findFirstOrThrow({ where: { name, userId: null } })
    )
  );
  const itemTypeIdByName = new Map(itemTypes.map((t) => [t.name, t.id]));

  for (const seedCollection of seedCollections) {
    let collection = await prisma.collection.findFirst({
      where: { name: seedCollection.name, userId },
    });

    if (!collection) {
      collection = await prisma.collection.create({
        data: {
          name: seedCollection.name,
          description: seedCollection.description,
          userId,
        },
      });
    }

    for (const seedItem of seedCollection.items) {
      const itemTypeId = itemTypeIdByName.get(seedItem.typeName);
      if (!itemTypeId) {
        throw new Error(`Unknown item type "${seedItem.typeName}" for item "${seedItem.title}"`);
      }

      let item = await prisma.item.findFirst({
        where: { title: seedItem.title, userId },
      });

      if (!item) {
        item = await prisma.item.create({
          data: {
            title: seedItem.title,
            description: seedItem.description,
            contentType: seedItem.contentType,
            content: seedItem.contentType === "TEXT" ? seedItem.content : undefined,
            url: seedItem.contentType === "URL" ? seedItem.url : undefined,
            language: seedItem.contentType === "TEXT" ? seedItem.language : undefined,
            userId,
            itemTypeId,
          },
        });
      }

      await prisma.itemCollection.upsert({
        where: { itemId_collectionId: { itemId: item.id, collectionId: collection.id } },
        update: {},
        create: { itemId: item.id, collectionId: collection.id },
      });
    }
  }
}

async function main() {
  await seedSystemItemTypes();
  const demoUser = await seedDemoUser();
  await seedCollectionsAndItems(demoUser.id);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
