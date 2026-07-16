import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ITEM_TYPE_NAMES = [
  "snippet",
  "prompt",
  "command",
  "note",
  "file",
  "image",
  "link",
] as const;

export type ItemTypeName = (typeof ITEM_TYPE_NAMES)[number];

export const ITEM_TYPE_LABELS: Record<ItemTypeName, string> = {
  snippet: "Snippets",
  prompt: "Prompts",
  command: "Commands",
  note: "Notes",
  file: "Files",
  image: "Images",
  link: "Links",
};

export const ITEM_TYPE_ICONS: Record<ItemTypeName, LucideIcon> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: StickyNote,
  file: File,
  image: Image,
  link: Link,
};

// Keep in sync with the item-type @theme block in src/app/globals.css.
export const ITEM_TYPE_COLORS: Record<ItemTypeName, string> = {
  snippet: "#3b82f6",
  prompt: "#8b5cf6",
  command: "#f97316",
  note: "#fde047",
  file: "#6b7280",
  image: "#ec4899",
  link: "#10b981",
};

interface ItemTypeClasses {
  border: string;
  text: string;
  chip: string;
  dot: string;
}

// Class strings must stay static literals so Tailwind's source scan emits them.
export const ITEM_TYPE_CLASSES: Record<ItemTypeName, ItemTypeClasses> = {
  snippet: { border: "border-l-snippet", text: "text-snippet", chip: "bg-snippet/10 text-snippet", dot: "bg-snippet" },
  prompt: { border: "border-l-prompt", text: "text-prompt", chip: "bg-prompt/10 text-prompt", dot: "bg-prompt" },
  command: { border: "border-l-command", text: "text-command", chip: "bg-command/10 text-command", dot: "bg-command" },
  note: { border: "border-l-note", text: "text-note", chip: "bg-note/10 text-note", dot: "bg-note" },
  file: { border: "border-l-file", text: "text-file", chip: "bg-file/10 text-file", dot: "bg-file" },
  image: { border: "border-l-image", text: "text-image", chip: "bg-image/10 text-image", dot: "bg-image" },
  link: { border: "border-l-link", text: "text-link", chip: "bg-link/10 text-link", dot: "bg-link" },
};

function isItemTypeName(name: string): name is ItemTypeName {
  return (ITEM_TYPE_NAMES as readonly string[]).includes(name);
}

export function getTypeIcon(name: string | undefined): LucideIcon {
  return name && isItemTypeName(name) ? ITEM_TYPE_ICONS[name] : File;
}

export function getTypeClasses(name: string | undefined): ItemTypeClasses {
  return name && isItemTypeName(name) ? ITEM_TYPE_CLASSES[name] : ITEM_TYPE_CLASSES.file;
}

export function getTypeLabel(name: string): string {
  return isItemTypeName(name) ? ITEM_TYPE_LABELS[name] : name;
}
