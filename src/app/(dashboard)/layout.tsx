import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itemTypes, { favorites, recents }] = await Promise.all([
    getItemTypesWithCounts(),
    getSidebarCollections(),
  ]);

  return (
    <DashboardShell itemTypes={itemTypes} favoriteCollections={favorites} recentCollections={recents}>
      {children}
    </DashboardShell>
  );
}
