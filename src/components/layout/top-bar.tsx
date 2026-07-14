import { Search, Plus, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 font-semibold">
        <FolderOpen className="h-6 w-6 text-primary" />
        <span className="hidden sm:inline-block">DevStash</span>
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
        <div className="relative flex-1 sm:max-w-md hidden sm:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items, tags, collections..."
            className="w-full bg-background pl-8 sm:w-[300px] md:w-full"
            disabled
          />
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}
