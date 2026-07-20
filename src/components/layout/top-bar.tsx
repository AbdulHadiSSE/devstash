import { Search, Plus, FolderPlus, PanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./mobile-sidebar";
import type { SidebarUser } from "./sidebar";
import type { ItemTypeCount } from "@/lib/db/items";
import type { DashboardCollection } from "@/lib/db/collections";

interface TopBarProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  user?: SidebarUser;
  itemTypes: ItemTypeCount[];
  favoriteCollections: DashboardCollection[];
  recentCollections: DashboardCollection[];
}

export function TopBar({
  onToggleSidebar,
  isSidebarCollapsed,
  user,
  itemTypes,
  favoriteCollections,
  recentCollections,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <MobileSidebar
          user={user}
          itemTypes={itemTypes}
          favoriteCollections={favoriteCollections}
          recentCollections={recentCollections}
        />
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden md:flex">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md hidden sm:flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="w-full bg-muted/50 pl-9 pr-12 h-9 rounded-md"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" className="hidden sm:flex h-9">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
          <Button className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            New Item
          </Button>
        </div>
      </div>
    </header>
  );
}
