import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DragDropProvider } from "@/components/drag-drop-provider";
import { ThemeInitializer } from "@/components/theme-initializer";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <ThemeInitializer />
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1 min-w-0 overflow-x-hidden w-full">
          <AppSidebar />
          <SidebarInset>
            <DragDropProvider>{children}</DragDropProvider>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
