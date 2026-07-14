import { Card } from "@/components/ui/card";
import { mockCollections, mockItemTypes } from "@/lib/mock-data";
import { Star, MoreHorizontal, Code, Sparkles, Terminal, StickyNote, File, Image, Link as LinkIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const getTypeIcon = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon
  };
  return icons[iconName] ?? File;
};

export function RecentCollections() {
  const collections = mockCollections;

  if (collections.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100">Collections</h2>
        <span className="text-sm text-zinc-400 hover:text-zinc-300 cursor-pointer">View all</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <Card key={col.id} className={`group bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50 transition-colors cursor-pointer border-l-2 ${col.colorClass} flex flex-col justify-between p-4 min-h-[140px] rounded-xl`}>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                  {col.name}
                  {col.isFavorite && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                </h3>
                <MoreHorizontal className="h-4 w-4 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-zinc-500 mt-1">{col.itemCount} items</p>
              <p className="text-xs text-zinc-400 mt-3">{col.description}</p>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              {col.activeTypes?.map(typeId => {
                const typeDef = mockItemTypes.find(t => t.id === typeId);
                if (!typeDef) return null;
                const Icon = getTypeIcon(typeDef.icon);
                return <Icon key={typeId} className="h-3.5 w-3.5" style={{ color: typeDef.color }} />;
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
