import { Search, Plus, FolderPlus, PanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./mobile-sidebar";

interface TopBarProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function TopBar({ onToggleSidebar, isSidebarCollapsed }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-zinc-900 bg-[#09090b] px-4 md:px-6">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="hidden md:flex text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md hidden sm:flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search items..."
            className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-300 pl-9 pr-12 h-9 rounded-md focus-visible:ring-1 focus-visible:ring-zinc-700 placeholder:text-zinc-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" className="hidden sm:flex h-9 bg-transparent border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
          <Button className="h-9 bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
            <Plus className="mr-2 h-4 w-4" />
            New Item
          </Button>
        </div>
      </div>
    </header>
  );
}
