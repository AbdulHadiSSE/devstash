import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockItems, mockItemTypes } from "@/lib/mock-data";
import { Code, Sparkles, Terminal, StickyNote, File, Image, Link as LinkIcon, Clock, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const getTypeIcon = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon
  };
  return icons[iconName] ?? File;
};

export function RecentItemsList() {
  const items = mockItems
    .filter((item) => !item.isPinned)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-400" />
          Recent Items
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const typeDef = mockItemTypes.find((t) => t.id === item.typeId);
          const Icon = typeDef ? getTypeIcon(typeDef.icon) : File;
          const color = typeDef?.color ?? "#6b7280";
          const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <Card
              key={item.id}
              className="w-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-900/50 transition-colors cursor-pointer rounded-xl overflow-hidden"
            >
              <div className="flex items-start justify-between p-5">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className="p-2.5 rounded-lg shrink-0 mt-0.5"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-zinc-100 truncate">{item.title}</h3>
                      {item.isFavorite && (
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate w-full">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      {item.tags?.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 text-[10px] h-5 px-2 font-medium border border-zinc-700/50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-xs text-zinc-500 font-medium pl-4 pt-1">
                  {formattedDate}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
