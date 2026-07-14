import { PinnedItems } from "@/components/dashboard/pinned-items";
import { RecentCollections } from "@/components/dashboard/recent-collections";

export default function DashboardPage() {
  return (
    <div className="flex-1 bg-zinc-950 min-h-screen text-zinc-100 p-8 pt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-100">Dashboard</h2>
        <p className="text-zinc-400 text-sm mt-1">Your developer knowledge hub</p>
      </div>
      
      <div className="space-y-10">
        <RecentCollections />
        <PinnedItems />
      </div>
    </div>
  );
}
