import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidber } from "../components/DashboardSidbar"
const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidber/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Dashboardlayout