import { mockItems, mockItemTypes } from "@/lib/mock-data";
import { Code, Sparkles, Terminal, StickyNote, File, Image, Link as LinkIcon, Clock } from "lucide-react";

// Helper to get icon
const getTypeIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Code, Sparkles, Terminal, StickyNote, File, Image, Link: LinkIcon
  };
  return icons[iconName] || File;
};

export function RecentItemsList() {
  // Sort mockItems by createdAt and take the first 10
  const items = [...mockItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </h2>
      </div>
      
      <div className="border rounded-md divide-y bg-card">
        {items.map((item) => {
          const typeDef = mockItemTypes.find(t => t.id === item.typeId);
          const Icon = typeDef ? getTypeIcon(typeDef.icon) : File;
          const color = typeDef?.color || "#6b7280";
          
          return (
            <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="p-2 rounded-md shrink-0" style={{ backgroundColor: `${color}15`, color }}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              </div>
              <div className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
