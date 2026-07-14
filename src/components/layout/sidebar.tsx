import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mockUser, mockItemTypes, mockCollections, mockItems } from "@/lib/mock-data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

interface SidebarProps {
  isCollapsed?: boolean
  className?: string
}

export function Sidebar({ isCollapsed = false, className }: SidebarProps) {
  const pathname = usePathname()
  
  const favoriteCollections = mockCollections.filter((c) => c.isFavorite)
  const allCollections = mockCollections

  const renderIcon = (iconName: string, color?: string) => {
    const iconMap = Icons as unknown as Record<string, LucideIcon>
    const Icon = iconMap[iconName] ?? Icons.FileText
    return <Icon className="h-4 w-4" style={{ color }} />
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r border-zinc-900 bg-[#09090b] transition-all duration-300",
        isCollapsed ? "w-[68px]" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shrink-0">
            <Icons.Layers className="h-4 w-4" />
          </div>
          {!isCollapsed && <span className="text-lg font-bold text-zinc-100">DevStash</span>}
        </Link>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {/* Types Section */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-zinc-500">
                <span>Types</span>
                <Icons.ChevronDown className="h-3 w-3" />
              </div>
            )}
            {mockItemTypes.map((type) => {
              const href = `/items/${type.name.toLowerCase()}`
              const isActive = pathname === href
              const linkCls = cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-900 hover:text-zinc-100",
                isActive ? "bg-zinc-900 text-zinc-100" : "text-zinc-400",
                isCollapsed && "justify-center px-0 py-2"
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={type.id}>
                    <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                      {renderIcon(type.icon, type.color)}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="capitalize bg-zinc-900 border-zinc-800 text-zinc-100">{type.name}</TooltipContent>
                  </Tooltip>
                )
              }
              return (
                <Link key={type.id} href={href} className={linkCls}>
                  <div className="flex items-center gap-3">
                    {renderIcon(type.icon, type.color)}
                    <span>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                  </div>
                  <span className="text-xs text-zinc-600">
                    {type.name === 'snippet' ? 24 : type.name === 'prompt' ? 18 : type.name === 'command' ? 15 : type.name === 'note' ? 12 : type.name === 'file' ? 5 : type.name === 'image' ? 3 : 8}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Collections Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-zinc-500">
                  <span>Collections</span>
                  <Icons.ChevronDown className="h-3 w-3" />
                </div>
              )}
              
              {!isCollapsed && <div className="px-2 py-1 text-[10px] font-semibold uppercase text-zinc-600 mt-2 tracking-wider">FAVORITES</div>}
              {favoriteCollections.map((col) => {
                const href = `/collections/${col.id}`
                const isActive = pathname === href
                const linkCls = cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-900 hover:text-zinc-100",
                  isActive ? "bg-zinc-900 text-zinc-100" : "text-zinc-400",
                  isCollapsed && "justify-center px-0 py-2"
                )

                if (isCollapsed) {
                  return (
                    <Tooltip key={col.id}>
                      <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                        <Icons.Folder className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-zinc-100">{col.name}</TooltipContent>
                    </Tooltip>
                  )
                }
                return (
                  <Link key={col.id} href={href} className={linkCls}>
                    <div className="flex items-center gap-3 truncate">
                      <Icons.Folder className="h-4 w-4 text-zinc-500" />
                      <span className="truncate">{col.name}</span>
                    </div>
                    <Icons.Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                  </Link>
                )
              })}
            </div>
            
            <div className="space-y-1">
              {!isCollapsed && <div className="px-2 py-1 text-[10px] font-semibold uppercase text-zinc-600 mt-2 tracking-wider">ALL COLLECTIONS</div>}
              {allCollections.filter(c => !c.isFavorite).map((col) => {
                const href = `/collections/${col.id}`
                const isActive = pathname === href
                const linkCls = cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-900 hover:text-zinc-100",
                  isActive ? "bg-zinc-900 text-zinc-100" : "text-zinc-400",
                  isCollapsed && "justify-center px-0 py-2"
                )

                if (isCollapsed) {
                  return (
                    <Tooltip key={col.id}>
                      <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                        <Icons.Folder className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-zinc-100">{col.name}</TooltipContent>
                    </Tooltip>
                  )
                }
                return (
                  <Link key={col.id} href={href} className={linkCls}>
                    <div className="flex items-center gap-3 truncate">
                      <Icons.Folder className="h-4 w-4 text-zinc-500" />
                      <span className="truncate">{col.name}</span>
                    </div>
                    <span className="text-xs text-zinc-600">{col.itemCount}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-zinc-900 bg-zinc-950/50">
        <div className={cn("flex items-center justify-between px-2 py-2 rounded-lg hover:bg-zinc-900 cursor-pointer transition-colors", isCollapsed && "justify-center px-0")}>
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={mockUser.image} alt={mockUser.name} />
              <AvatarFallback className="bg-zinc-800 text-zinc-300">{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-medium text-zinc-200">John Doe</span>
                <span className="truncate text-[10px] text-zinc-500">john@example.com</span>
              </div>
            )}
          </div>
          {!isCollapsed && <Icons.Settings className="h-4 w-4 text-zinc-500 shrink-0 hover:text-zinc-300" />}
        </div>
      </div>
    </div>
  )
}
