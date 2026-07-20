import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, itemTypes, { favorites, recents }] = await Promise.all([
    auth(),
    getItemTypesWithCounts(),
    getSidebarCollections(),
  ]);

  return (
    <DashboardShell
      user={session?.user}
      itemTypes={itemTypes}
      favoriteCollections={favorites}
      recentCollections={recents}
    >
      {children}
    </DashboardShell>
  );
}
