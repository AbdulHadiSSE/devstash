import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mockUser, mockItemTypes, mockCollections, mockItems } from "@/lib/mock-data"
import { getTypeIcon, getTypeClasses } from "@/lib/constants/item-types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, Folder, Layers, Settings, Star } from "lucide-react"

interface SidebarProps {
  isCollapsed?: boolean
  className?: string
}

export function Sidebar({ isCollapsed = false, className }: SidebarProps) {
  const pathname = usePathname()

  const favoriteCollections = mockCollections.filter((c) => c.isFavorite)
  const allCollections = mockCollections

  const itemCountsByType = mockItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.typeId] = (acc[item.typeId] ?? 0) + 1
    return acc
  }, {})

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[68px]" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          {!isCollapsed && <span className="text-lg font-bold text-foreground">DevStash</span>}
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {/* Types Section */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground">
                <span>Types</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            )}
            {mockItemTypes.map((type) => {
              const href = `/items/${type.name.toLowerCase()}`
              const isActive = pathname === href
              const linkCls = cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                isCollapsed && "justify-center px-0 py-2"
              )
              const TypeIcon = getTypeIcon(type.name)
              const typeIconCls = cn("h-4 w-4", getTypeClasses(type.name).text)

              if (isCollapsed) {
                return (
                  <Tooltip key={type.id}>
                    <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                      <TypeIcon className={typeIconCls} />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="capitalize">{type.name}</TooltipContent>
                  </Tooltip>
                )
              }
              return (
                <Link key={type.id} href={href} className={linkCls}>
                  <div className="flex items-center gap-3">
                    <TypeIcon className={typeIconCls} />
                    <span>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {itemCountsByType[type.id] ?? 0}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Collections Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground">
                  <span>Collections</span>
                  <ChevronDown className="h-3 w-3" />
                </div>
              )}

              {!isCollapsed && <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground mt-2 tracking-wider">FAVORITES</div>}
              {favoriteCollections.map((col) => {
                const href = `/collections/${col.id}`
                const isActive = pathname === href
                const linkCls = cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed && "justify-center px-0 py-2"
                )

                if (isCollapsed) {
                  return (
                    <Tooltip key={col.id}>
                      <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                        <Folder className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right">{col.name}</TooltipContent>
                    </Tooltip>
                  )
                }
                return (
                  <Link key={col.id} href={href} className={linkCls}>
                    <div className="flex items-center gap-3 truncate">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{col.name}</span>
                    </div>
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                  </Link>
                )
              })}
            </div>

            <div className="space-y-1">
              {!isCollapsed && <div className="px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground mt-2 tracking-wider">ALL COLLECTIONS</div>}
              {allCollections.filter(c => !c.isFavorite).map((col) => {
                const href = `/collections/${col.id}`
                const isActive = pathname === href
                const linkCls = cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed && "justify-center px-0 py-2"
                )

                if (isCollapsed) {
                  return (
                    <Tooltip key={col.id}>
                      <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                        <Folder className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right">{col.name}</TooltipContent>
                    </Tooltip>
                  )
                }
                return (
                  <Link key={col.id} href={href} className={linkCls}>
                    <div className="flex items-center gap-3 truncate">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{col.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{col.itemCount}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className={cn("flex items-center justify-between px-2 py-2 rounded-lg hover:bg-accent cursor-pointer transition-colors", isCollapsed && "justify-center px-0")}>
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={mockUser.image} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-medium text-foreground">{mockUser.name}</span>
                <span className="truncate text-[10px] text-muted-foreground">{mockUser.email}</span>
              </div>
            )}
          </div>
          {!isCollapsed && <Settings className="h-4 w-4 text-muted-foreground shrink-0 hover:text-foreground" />}
        </div>
      </div>
    </div>
  )
}
