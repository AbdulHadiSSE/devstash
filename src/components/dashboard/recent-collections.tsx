import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mockCollections, mockItemTypes } from "@/lib/mock-data";
import { getTypeIcon, getTypeClasses } from "@/lib/constants/item-types";
import { Star, MoreHorizontal } from "lucide-react";

export function RecentCollections() {
  const collections = mockCollections;

  if (collections.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Collections</h2>
        <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">View all</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <Card key={col.id} className={cn("group hover:bg-muted/50 transition-colors cursor-pointer border-l-2 flex flex-col justify-between p-4 min-h-[140px] rounded-xl", col.colorClass)}>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {col.name}
                  {col.isFavorite && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                </h3>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{col.itemCount} items</p>
              <p className="text-xs text-muted-foreground mt-3">{col.description}</p>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {col.activeTypes?.map(typeId => {
                const typeDef = mockItemTypes.find(t => t.id === typeId);
                if (!typeDef) return null;
                const Icon = getTypeIcon(typeDef.name);
                return <Icon key={typeId} className={cn("h-3.5 w-3.5", getTypeClasses(typeDef.name).text)} />;
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
