"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import type { ItemTypeCount } from "@/lib/db/items"
import type { DashboardCollection } from "@/lib/db/collections"

interface DashboardShellProps {
  children: React.ReactNode
  itemTypes: ItemTypeCount[]
  favoriteCollections: DashboardCollection[]
  recentCollections: DashboardCollection[]
}

export function DashboardShell({
  children,
  itemTypes,
  favoriteCollections,
  recentCollections,
}: DashboardShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        className="hidden md:flex"
        itemTypes={itemTypes}
        favoriteCollections={favoriteCollections}
        recentCollections={recentCollections}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          itemTypes={itemTypes}
          favoriteCollections={favoriteCollections}
          recentCollections={recentCollections}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
