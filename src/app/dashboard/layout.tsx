import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidber } from "../components/DashboardSidbar"

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidber />
      <SidebarInset className="min-w-0 bg-background">
        <div className="flex h-14 items-center border-b border-border/70 px-4 sm:px-6">
          <SidebarTrigger />
        </div>
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Dashboardlayout