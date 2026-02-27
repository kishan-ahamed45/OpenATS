import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut } from "@asgardeo/nextjs"
import { RedirectToLogin } from "./redirect-to-login"
import { DragDropProvider } from "@/components/drag-drop-provider"

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Authenticated: show the full dashboard */}
      <SignedIn>
        <div className="[--header-height:calc(theme(spacing.14))]">
          <SidebarProvider className="flex flex-col">
            <SiteHeader />
            <div className="flex flex-1 min-w-0 overflow-x-hidden w-full">
              <AppSidebar />
              <SidebarInset>
                <DragDropProvider>
                  {children}
                </DragDropProvider>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </SignedIn>

      {/* Unauthenticated: client component handles the redirect to /login */}
      <SignedOut>
        <RedirectToLogin />
      </SignedOut>
    </>
  )
}
