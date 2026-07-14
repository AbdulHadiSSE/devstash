"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        className="hidden md:flex"
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar 
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
