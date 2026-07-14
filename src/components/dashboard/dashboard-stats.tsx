import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockItems, mockCollections } from "@/lib/mock-data";
import { Layers, Star, FileText, Heart } from "lucide-react";

export function DashboardStats() {
  const totalItems = mockItems.length;
  const totalCollections = mockCollections.length;
  const favoriteItems = mockItems.filter((item) => item.isFavorite).length;
  const favoriteCollections = mockCollections.filter((col) => col.isFavorite).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">Across all types</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCollections}</div>
          <p className="text-xs text-muted-foreground">Categories & groups</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorite Items</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{favoriteItems}</div>
          <p className="text-xs text-muted-foreground">Starred for quick access</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorite Collections</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{favoriteCollections}</div>
          <p className="text-xs text-muted-foreground">Pinned to sidebar</p>
        </CardContent>
      </Card>
    </div>
  );
}
