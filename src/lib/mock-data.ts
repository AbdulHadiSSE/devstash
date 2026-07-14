export const mockUser = {
  id: "user-1",
  name: "Demo User",
  email: "demo@devstash.io",
  image: "https://github.com/shadcn.png",
  isPro: true,
};

export const mockItemTypes = [
  { id: "type-1", name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "type-2", name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "type-3", name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "type-4", name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "type-5", name: "file", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type-6", name: "image", icon: "Image", color: "#ec4899", isSystem: true },
  { id: "type-7", name: "link", icon: "Link", color: "#10b981", isSystem: true },
];

export const mockCollections = [
  {
    id: "col-1",
    name: "React Patterns",
    description: "Common React hooks and components",
    isFavorite: true,
    itemCount: 12,
  },
  {
    id: "col-2",
    name: "Python Snippets",
    description: "Useful Python utility functions",
    isFavorite: false,
    itemCount: 5,
  },
  {
    id: "col-3",
    name: "Context Files",
    description: "Project context markdown files",
    isFavorite: true,
    itemCount: 8,
  },
  {
    id: "col-4",
    name: "Interview Prep",
    description: "Notes and snippets for interviews",
    isFavorite: false,
    itemCount: 24,
  },
];

export const mockItems = [
  {
    id: "item-1",
    title: "useAuth hook",
    description: "A custom hook for handling authentication in React",
    contentType: "TEXT",
    content: "export function useAuth() {\n  return useContext(AuthContext);\n}",
    language: "typescript",
    typeId: "type-1", // snippet
    isFavorite: true,
    isPinned: true,
    tags: ["react", "hooks", "auth"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-2",
    title: "Code review prompt",
    description: "System prompt for reviewing pull requests",
    contentType: "TEXT",
    content: "You are an expert developer. Review the following code for bugs, performance issues, and readability improvements...",
    typeId: "type-2", // prompt
    isFavorite: false,
    isPinned: false,
    tags: ["ai", "code-review"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "item-3",
    title: "git reset --hard HEAD~1",
    description: "Undo last commit and delete changes",
    contentType: "TEXT",
    content: "git reset --hard HEAD~1",
    language: "bash",
    typeId: "type-3", // command
    isFavorite: true,
    isPinned: false,
    tags: ["git", "cli"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "item-4",
    title: "Next.js Documentation",
    description: "Official Next.js documentation for App Router",
    contentType: "URL",
    url: "https://nextjs.org/docs",
    typeId: "type-7", // link
    isFavorite: false,
    isPinned: true,
    tags: ["nextjs", "docs"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "item-5",
    title: "Docker Setup Notes",
    description: "Steps to configure docker-compose for PostgreSQL",
    contentType: "TEXT",
    content: "1. Create docker-compose.yml\n2. Add postgres service\n3. Run docker-compose up -d",
    typeId: "type-4", // note
    isFavorite: false,
    isPinned: false,
    tags: ["docker", "db"],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];
