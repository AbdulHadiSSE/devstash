import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/lib/db/user";

// Matches the sidebar's collections cap; kept as a single constant so both
// queries stay in sync.
const COLLECTIONS_LIMIT = 6;

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  primaryType: string | null;
  typeNames: string[];
}

interface RawCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  items: { item: { itemType: { name: string } } }[];
}

function toDashboardCollection(collection: RawCollection): DashboardCollection {
  const typeCounts = new Map<string, number>();
  for (const { item } of collection.items) {
    typeCounts.set(item.itemType.name, (typeCounts.get(item.itemType.name) ?? 0) + 1);
  }

  const sortedTypes = [...typeCounts.entries()].sort((a, b) => b[1] - a[1]);

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    itemCount: collection.items.length,
    primaryType: sortedTypes[0]?.[0] ?? null,
    typeNames: sortedTypes.map(([name]) => name),
  };
}

export async function getDashboardCollections(limit = COLLECTIONS_LIMIT): Promise<DashboardCollection[]> {
  const user = await getDemoUser();
  if (!user) return [];

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      items: {
        include: { item: { include: { itemType: true } } },
      },
    },
  });

  return collections.map(toDashboardCollection);
}

export interface SidebarCollections {
  favorites: DashboardCollection[];
  recents: DashboardCollection[];
}

interface RawSidebarCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  _count: { items: number };
  items: { item: { itemType: { name: string } } }[];
}

// Sidebar only ever renders `itemCount` and `primaryType` (a colored dot) —
// see src/components/layout/sidebar.tsx — so this uses `_count` for the
// total instead of loading every item, and a single bounded (`take: 1`)
// nested item for an approximate primary type instead of computing the true
// most-common type across all items. `typeNames` is left empty since the
// sidebar doesn't render the multi-type icon row (unlike the dashboard grid).
function toSidebarCollection(collection: RawSidebarCollection): DashboardCollection {
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    itemCount: collection._count.items,
    primaryType: collection.items[0]?.item.itemType.name ?? null,
    typeNames: [],
  };
}

export async function getSidebarCollections(limit = COLLECTIONS_LIMIT): Promise<SidebarCollections> {
  const user = await getDemoUser();
  if (!user) return { favorites: [], recents: [] };

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      _count: { select: { items: true } },
      items: {
        take: 1,
        include: { item: { include: { itemType: true } } },
      },
    },
  });

  const mapped = collections.map(toSidebarCollection);
  return {
    favorites: mapped.filter((c) => c.isFavorite),
    recents: mapped.filter((c) => !c.isFavorite),
  };
}
