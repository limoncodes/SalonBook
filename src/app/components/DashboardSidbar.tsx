"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  PlusCircle,
  Scissors,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";

type MenuItem = {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

const menuItemsByRole: Record<"user" | "admin", MenuItem[]> = {
  user: [
    { name: "Overview", url: "/dashboard/user", icon: LayoutDashboard },
    { name: "My Appointments", url: "/dashboard/user/appointments", icon: CalendarDays },
    { name: "My Profile", url: "/dashboard/user/profile", icon: User },
  ],
  admin: [
    { name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Services", url: "/dashboard/admin/services", icon: Scissors },
    { name: "Add/Update Service", url: "/dashboard/admin/services/manage", icon: PlusCircle },
    { name: "Manage Appointments", url: "/dashboard/admin/appointments", icon: CalendarDays },
    { name: "Manage Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Transactions", url: "/dashboard/admin/transactions", icon: CreditCard },
    { name: "My Profile", url: "/dashboard/admin/profile", icon: User },
  ],
};

export function DashboardSidber() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = (session?.user as { role?: string } | undefined)?.role === "admin" ? "admin" : "user";
  const items = menuItemsByRole[role];
  const title = role === "admin" ? "Admin Dashboard" : "Customer Dashboard";
  const roleLabel = role === "admin" ? "Administrator" : "Customer";

  return (
    <Sidebar className="border-r border-border/70 bg-[linear-gradient(180deg,rgba(17,18,26,0.98)_0%,rgba(8,9,13,1)_100%)]">
      <SidebarHeader className="border-b border-border/70 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/12 text-primary-light shadow-[0_8px_24px_rgba(139,92,246,0.18)]">
            <Scissors className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Salon<span className="text-primary-light">Book</span>
            </p>
            <p className="text-xs text-text-secondary">{title}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary/80">
            {title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/dashboard/user" &&
                    item.url !== "/dashboard/admin" &&
                    pathname?.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.url} />}
                      className="h-11 rounded-xl px-3 text-text-secondary transition-all duration-200 hover:bg-primary/10 hover:text-primary-light data-[active=true]:bg-primary/15 data-[active=true]:text-primary-light data-[active=true]:shadow-[inset_0_0_0_1px_rgba(139,92,246,0.22)]"
                    >
                      <span
                        className={`flex size-7 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary/20 text-primary-light"
                            : "bg-background/40 text-text-secondary"
                        }`}
                      >
                        <item.icon className="size-4" />
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/70 p-4">
        <div className="rounded-xl border border-border/70 bg-surface/50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="size-4 text-primary-light" />
            {roleLabel} Panel
          </div>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            Manage your {role === "admin" ? "salon operations" : "appointments and profile"} from one place.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}