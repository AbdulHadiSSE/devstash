import { cache } from "react";
import { prisma } from "@/lib/prisma";

// No auth yet — dashboard reads the seeded demo user's data (see prisma/seed.ts).
const DEMO_USER_EMAIL = "demo@devstash.io";

/**
 * Resolves the demo user's id. Every dashboard data-fetcher in
 * `src/lib/db/items.ts` and `src/lib/db/collections.ts` needs this same
 * lookup; wrapping it in React's `cache()` dedupes it to a single query per
 * request instead of one `user.findUnique` per consumer (e.g. a `/dashboard`
 * load previously triggered 6 separate lookups).
 */
export const getDemoUser = cache(async () => {
  return prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });
});
