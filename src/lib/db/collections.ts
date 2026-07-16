import { prisma } from "@/lib/prisma";

// No auth yet — dashboard reads the seeded demo user's data (see prisma/seed.ts).
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  primaryType: string | null;
  typeNames: string[];
}

export async function getDashboardCollections(limit = 6): Promise<DashboardCollection[]> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: {
      collections: {
        orderBy: { updatedAt: "desc" },
        take: limit,
        include: {
          items: {
            include: { item: { include: { itemType: true } } },
          },
        },
      },
    },
  });

  if (!user) return [];

  return user.collections.map((collection) => {
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
  });
}
