import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mockUser } from "@/lib/mock-data"
import { getTypeIcon, getTypeClasses, getTypeLabel } from "@/lib/constants/item-types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Folder, Layers, Settings, Star } from "lucide-react"
import type { ItemTypeCount } from "@/lib/db/items"
import type { DashboardCollection } from "@/lib/db/collections"

interface SidebarProps {
  isCollapsed?: boolean
  className?: string
  itemTypes: ItemTypeCount[]
  favoriteCollections: DashboardCollection[]
  recentCollections: DashboardCollection[]
}

export function Sidebar({
  isCollapsed = false,
  className,
  itemTypes,
  favoriteCollections,
  recentCollections,
}: SidebarProps) {
  const pathname = usePathname()
  const [typesOpen, setTypesOpen] = useState(true)
  const [collectionsOpen, setCollectionsOpen] = useState(true)

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-17" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-white shrink-0">
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
              <button
                type="button"
                onClick={() => setTypesOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Types</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", !typesOpen && "-rotate-90")} />
              </button>
            )}
            {(isCollapsed || typesOpen) && itemTypes.map((type) => {
              const href = `/items/${type.name}`
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
                  <Tooltip key={type.name}>
                    <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                      <TypeIcon className={typeIconCls} />
                    </TooltipTrigger>
                    <TooltipContent side="right">{getTypeLabel(type.name)}</TooltipContent>
                  </Tooltip>
                )
              }
              return (
                <Link key={type.name} href={href} className={linkCls}>
                  <div className="flex items-center gap-3">
                    <TypeIcon className={typeIconCls} />
                    <span>{getTypeLabel(type.name)}</span>
                    {(type.name === "file" || type.name === "image") && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-semibold tracking-wide text-muted-foreground">
                        PRO
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{type.count}</span>
                </Link>
              )
            })}
          </div>

          {/* Collections Section */}
          <div className="space-y-4">
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setCollectionsOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Collections</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", !collectionsOpen && "-rotate-90")} />
              </button>
            )}
            {(isCollapsed || collectionsOpen) && (
            <>
            <div className="space-y-1">
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
              {recentCollections.map((col) => {
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
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                      <span className={cn("h-2 w-2 rounded-full", getTypeClasses(col.primaryType ?? undefined).dot)} />
                      {col.itemCount}
                    </span>
                  </Link>
                )
              })}

              {!isCollapsed && (
                <Link
                  href="/collections"
                  className="block px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all collections
                </Link>
              )}
            </div>
            </>
            )}
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
