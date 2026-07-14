"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mockUser, mockItemTypes, mockCollections, mockItems } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
  className?: string
}

export function Sidebar({ isCollapsed = false, onToggle, className }: SidebarProps) {
  const pathname = usePathname()
  const recentItems = mockItems.slice(0, 3)
  const favoriteCollections = mockCollections.filter((c) => c.isFavorite)

  const renderIcon = (iconName: string, color?: string) => {
    const iconMap = Icons as unknown as Record<string, LucideIcon>
    const Icon = iconMap[iconName] ?? Icons.FileText
    return <Icon className="h-4 w-4" style={{ color }} />
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-muted/40 transition-all duration-300",
        isCollapsed ? "w-[68px]" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 py-2">
        {!isCollapsed && <span className="font-semibold">Menu</span>}
        {onToggle && (
          <Button variant="ghost" size="icon" onClick={onToggle} className={cn(isCollapsed && "mx-auto")}>
            <Icons.PanelLeftClose className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
      </div>
      <Separator />
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Types Section */}
          <div className="space-y-1">
            {!isCollapsed && <h4 className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">Types</h4>}
            {mockItemTypes.map((type) => {
              const href = `/items/${type.name.toLowerCase()}`
              const isActive = pathname === href
              const linkCls = cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                isCollapsed && "justify-center px-0 py-2"
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={type.id}>
                    <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                      {renderIcon(type.icon, type.color)}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="capitalize">{type.name}</TooltipContent>
                  </Tooltip>
                )
              }
              return (
                <Link key={type.id} href={href} className={linkCls}>
                  {renderIcon(type.icon, type.color)}
                  <span>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</span>
                </Link>
              )
            })}
          </div>

          {/* Collections Section */}
          <div className="space-y-1">
            <Separator className="my-2" />
            {!isCollapsed && <h4 className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">Collections</h4>}
            {favoriteCollections.map((col) => {
              const href = `/collections/${col.id}`
              const isActive = pathname === href
              const linkCls = cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                isCollapsed && "justify-center px-0 py-2"
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={col.id}>
                    <TooltipTrigger render={<Link href={href} className={linkCls} />}>
                      <Icons.Folder className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right">{col.name}</TooltipContent>
                  </Tooltip>
                )
              }
              return (
                <Link key={col.id} href={href} className={linkCls}>
                  <Icons.Folder className="h-4 w-4" />
                  <span className="truncate">{col.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Recent Section */}
          <div className="space-y-1">
            <Separator className="my-2" />
            {!isCollapsed && <h4 className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">Recent</h4>}
            {recentItems.map((item) => {
              const type = mockItemTypes.find(t => t.id === item.typeId)
              const divCls = cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                isCollapsed && "justify-center px-0 py-2"
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger render={<div className={divCls} />}>
                      {type ? renderIcon(type.icon, type.color) : <Icons.FileText className="h-4 w-4" />}
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                )
              }
              return (
                <div key={item.id} className={divCls}>
                  {type ? renderIcon(type.icon, type.color) : <Icons.FileText className="h-4 w-4" />}
                  <span className="truncate">{item.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
      
      <Separator />
      <div className="p-4 flex-shrink-0">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={mockUser.image} alt={mockUser.name} />
            <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{mockUser.name}</span>
              <span className="truncate text-xs text-muted-foreground">{mockUser.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
