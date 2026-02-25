"use client"

import * as React from "react"
import {
  Home01Icon,
  Briefcase01Icon,
  UserGroupIcon,
  CheckListIcon,
  Message01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons"

import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const navMainData = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home01Icon,
  },
  {
    title: "Manage Jobs",
    url: "/dashboard/jobs",
    icon: Briefcase01Icon,
  },
  {
    title: "Candidates",
    url: "/dashboard/candidates",
    icon: UserGroupIcon,
  },
  {
    title: "Assessments",
    url: "/dashboard/assessments",
    icon: CheckListIcon,
  },
  {
    title: "Manage Offers",
    url: "/dashboard/offers",
    icon: Message01Icon,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings02Icon,
    items: [
      {
        title: "General",
        url: "/dashboard/settings/general",
      },
      {
        title: "Page Setup",
        url: "/dashboard/settings/setup",
      },
      {
        title: "Templates",
        url: "/dashboard/settings/templates",
      },
      {
        title: "Team",
        url: "/dashboard/settings/team",
      },
      {
        title: "Profile",
        url: "/dashboard/settings/profile",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const items = navMainData.map((item) => ({
    ...item,
    isActive: item.url === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname === item.url || pathname.startsWith(item.url + "/"),
  }))

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader className="h-16 justify-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-full bg-green-500">
            <div className="size-4 rounded-full border-2 border-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            OpenATS
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
