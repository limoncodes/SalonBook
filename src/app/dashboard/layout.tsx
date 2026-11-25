import { Suspense } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidber } from "../components/DashboardSidbar"
import { DashboardGuard } from "./dashboard-guard"

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <DashboardSidber />
      </Suspense>
      <SidebarInset className="min-w-0 bg-background">
        <div className="min-w-0 flex-1">
          <DashboardGuard>{children}</DashboardGuard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Dashboardlayout