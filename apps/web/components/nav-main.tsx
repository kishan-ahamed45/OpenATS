"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: any
    isActive?: boolean
    items?: { title: string; url: string }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          item.items?.length ? (
            // ── Has sub-items: entire row toggles the dropdown ──────────────
            <Collapsible key={item.title} defaultOpen={item.isActive} className="group/collapsible w-full">
              <SidebarMenuItem>
                {/*
                  Base UI CollapsibleTrigger uses `render` prop to delegate its
                  behaviour to SidebarMenuButton. This way the whole button is
                  the toggle — no separate action button, no extra hover zone.
                */}
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton isActive={item.isActive} className="w-full cursor-pointer">
                      <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" />
                      <span className="flex-1">{item.title}</span>
                      {/* Base UI sets data-open on the root, not data-state */}
                      <ChevronRight className="size-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-data-open/collapsible:-rotate-90" />
                    </SidebarMenuButton>
                  }
                />

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton render={<Link href={subItem.url} />}>
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // ── No sub-items: navigates directly ────────────────────────────
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={item.isActive}
                render={<Link href={item.url} />}
              >
                <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
