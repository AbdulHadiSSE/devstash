import { prisma } from "@/lib/prisma";
import { ITEM_TYPE_NAMES } from "@/lib/constants/item-types";

// No auth yet — dashboard reads the seeded demo user's data (see prisma/seed.ts).
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  typeName: string;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
}

interface RawItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  itemType: { name: string };
  tags: { name: string }[];
}

function toDashboardItem(item: RawItem): DashboardItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    typeName: item.itemType.name,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    tags: item.tags.map((tag) => tag.name),
    createdAt: item.createdAt,
  };
}

export async function getPinnedItems(limit = 10): Promise<DashboardItem[]> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: {
      items: {
        where: { isPinned: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { itemType: true, tags: true },
      },
    },
  });

  if (!user) return [];

  return user.items.map(toDashboardItem);
}

export async function getRecentItems(limit = 10): Promise<DashboardItem[]> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: {
      items: {
        where: { isPinned: false },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { itemType: true, tags: true },
      },
    },
  });

  if (!user) return [];

  return user.items.map(toDashboardItem);
}

export interface DashboardStatsData {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export async function getDashboardStats(): Promise<DashboardStatsData> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  if (!user) {
    return { totalItems: 0, totalCollections: 0, favoriteItems: 0, favoriteCollections: 0 };
  }

  const [totalItems, favoriteItems, totalCollections, favoriteCollections] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
    prisma.collection.count({ where: { userId: user.id } }),
    prisma.collection.count({ where: { userId: user.id, isFavorite: true } }),
  ]);

  return { totalItems, totalCollections, favoriteItems, favoriteCollections };
}

export interface ItemTypeCount {
  name: string;
  count: number;
}

export async function getItemTypesWithCounts(): Promise<ItemTypeCount[]> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  const types = await prisma.itemType.findMany({ where: { isSystem: true } });

  const counts = user
    ? await prisma.item.groupBy({
        by: ["itemTypeId"],
        where: { userId: user.id },
        _count: { _all: true },
      })
    : [];
  const countByTypeId = new Map(counts.map((c) => [c.itemTypeId, c._count._all]));

  return ITEM_TYPE_NAMES.map((name) => {
    const type = types.find((t) => t.name === name);
    return { name, count: type ? countByTypeId.get(type.id) ?? 0 : 0 };
  });
}
