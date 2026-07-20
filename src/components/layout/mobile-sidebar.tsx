"use client"

import { useState, useEffect, startTransition } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Sidebar, type SidebarUser } from "./sidebar"
import type { ItemTypeCount } from "@/lib/db/items"
import type { DashboardCollection } from "@/lib/db/collections"

interface MobileSidebarProps {
  user?: SidebarUser
  itemTypes: ItemTypeCount[]
  favoriteCollections: DashboardCollection[]
  recentCollections: DashboardCollection[]
}

export function MobileSidebar({ user, itemTypes, favoriteCollections, recentCollections }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close sheet when route changes
  useEffect(() => {
    startTransition(() => setOpen(false))
  }, [pathname])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-70">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Mobile navigation sidebar</SheetDescription>
          <Sidebar
            className="w-full border-none h-full"
            user={user}
            itemTypes={itemTypes}
            favoriteCollections={favoriteCollections}
            recentCollections={recentCollections}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}
