"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Notification03Icon } from "@hugeicons/core-free-icons"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SiteHeader() {
  return (
    <header className="bg-white sticky top-0 z-50 flex w-full items-center border-b border-slate-100">
      <div className="flex h-(--header-height) w-full items-center justify-between px-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-slate-400 font-medium hover:text-slate-600 transition-colors">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-slate-300">
              <span className="text-lg font-light">&gt;</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-slate-600 font-medium">Page 01</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center size-9 rounded-full bg-slate-100/80 text-slate-500 hover:bg-slate-200 transition-colors">
            <HugeiconsIcon icon={Notification03Icon} className="size-5" />
          </button>
          
          <Avatar className="size-9 border-2 border-slate-100">
            <AvatarImage src="https://github.com/nutlope.png" alt="User" />
            <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
