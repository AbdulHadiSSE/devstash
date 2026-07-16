import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPinnedItems } from "@/lib/db/items";
import { getTypeIcon, getTypeClasses } from "@/lib/constants/item-types";
import { Pin, Star } from "lucide-react";

export async function PinnedItems() {
  const pinnedItems = await getPinnedItems();

  if (pinnedItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Pin className="h-4 w-4 text-muted-foreground" />
          Pinned
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {pinnedItems.map((item) => {
          const Icon = getTypeIcon(item.typeName);
          const typeClasses = getTypeClasses(item.typeName);

          // Format date like "Jan 15"
          const date = new Date(item.createdAt);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <Card key={item.id} className={cn("w-full border hover:bg-muted/50 transition-colors cursor-pointer border-l-2 rounded-xl overflow-hidden", typeClasses.border)}>
              <div className="flex items-start justify-between p-5">
                {/* Left Section */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className={cn("p-2.5 rounded-lg shrink-0 mt-0.5", typeClasses.chip)}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Text Area */}
                  <div className="flex flex-col gap-1 min-w-0 w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                      <Pin className="h-3 w-3 text-muted-foreground fill-muted-foreground -rotate-45 shrink-0" />
                      {item.isFavorite && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate w-full">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      {item.tags?.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] h-5 px-2 font-medium">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="shrink-0 text-xs text-muted-foreground font-medium pl-4 pt-1">
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
