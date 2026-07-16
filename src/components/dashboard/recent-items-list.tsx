import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getRecentItems } from "@/lib/db/items";
import { getTypeIcon, getTypeClasses } from "@/lib/constants/item-types";
import { Clock, Star } from "lucide-react";

export async function RecentItemsList() {
  const items = await getRecentItems();

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Recent Items
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const Icon = getTypeIcon(item.typeName);
          const typeClasses = getTypeClasses(item.typeName);
          const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <Card
              key={item.id}
              className="w-full border hover:bg-muted/50 transition-colors cursor-pointer rounded-xl overflow-hidden"
            >
              <div className="flex items-start justify-between p-5">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={cn("p-2.5 rounded-lg shrink-0 mt-0.5", typeClasses.chip)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                      {item.isFavorite && (
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate w-full">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      {item.tags?.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] h-5 px-2 font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
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
