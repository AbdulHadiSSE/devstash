import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PinnedItems } from "@/components/dashboard/pinned-items";
import { RecentCollections } from "@/components/dashboard/recent-collections";
import { RecentItemsList } from "@/components/dashboard/recent-items-list";

export default function DashboardPage() {
  return (
    <div className="flex-1 p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Your developer knowledge hub</p>
      </div>

      <div className="space-y-10">
        <DashboardStats />
        <RecentCollections />
        <PinnedItems />
        <RecentItemsList />
      </div>
    </div>
  );
}
