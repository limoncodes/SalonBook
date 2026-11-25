"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Scissors,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/home/profile-dropdown";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

type DashboardLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const dashboardLinksByRole: Record<"user" | "admin", DashboardLink[]> = {
  user: [
    { href: "/dashboard/user", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/user/appointments", label: "My Appointments", icon: CalendarDays },
    { href: "/dashboard/user/profile", label: "My Profile", icon: User },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: Scissors },
    { href: "/dashboard/admin/Add-Services", label: "Add / Update Service", icon: PlusCircle },
    { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: CalendarDays },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
    { href: "/dashboard/admin/profile", label: "My Profile", icon: User },
  ],
};

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const isAdmin = user?.role === "admin";
  const dashboardLinks = dashboardLinksByRole[isAdmin ? "admin" : "user"];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/12 text-primary-light transition-colors group-hover:bg-primary/20">
            <Scissors className="size-[18px]" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              Salon<span className="text-primary-light">Book</span>
            </span>
            <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-secondary">
              Beauty Studio
            </span>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary-light",
                  active ? "text-primary-light" : "text-text-secondary",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-primary-light" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <ProfileDropdown user={user} />
          ) : (
            <>
              <Button
                variant="outline"
                className="h-10 rounded-lg border-primary/35 bg-transparent px-6 text-sm font-medium text-foreground hover:border-primary-light hover:bg-primary/10 hover:text-primary-light"
                nativeButton={false}
                render={<Link href="/sign-in" />}
              >
                Log In
              </Button>
              <Button
                className="h-10 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(139,92,246,0.28)] transition-all hover:bg-primary-light hover:text-[#08090d]"
                nativeButton={false}
                render={<Link href="/sign-up" />}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-lg border-border bg-surface hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-border bg-background px-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b border-border px-6 pb-5 pt-6 text-left">
                <SheetTitle className="font-heading text-2xl text-foreground">
                  Salon<span className="text-primary-light">Book</span>
                </SheetTitle>
                <SheetDescription className="text-text-secondary">
                  Discover and book premium salon services.
                </SheetDescription>
              </SheetHeader>

              <nav
                className="flex flex-col gap-2 px-4 py-6"
                aria-label="Mobile navigation"
              >
                {navLinks.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <SheetClose
                      key={link.href}
                      nativeButton={false}
                      render={
                        <Link
                          href={link.href}
                          className={cn(
                            "rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary-light",
                            active ? "bg-primary/10 text-primary-light" : "text-text-secondary",
                          )}
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  )
                })}

                {user ? (
                  <>
                    <div className="my-2 border-t border-border/70" />
                    <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                      Dashboard
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {dashboardLinks.map((item) => {
                        const active = isActive(item.href)
                        return (
                          <SheetClose
                            key={item.href}
                            nativeButton={false}
                            render={
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex items-center gap-3 rounded-lg border border-transparent bg-surface/50 px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary-light",
                                  active && "border-primary/25 bg-primary/10 text-primary-light",
                                )}
                              />
                            }
                          >
                            <span className="flex size-7 items-center justify-center rounded-lg bg-background/50 text-text-secondary">
                              <item.icon className="size-4 shrink-0" />
                            </span>
                            {item.label}
                          </SheetClose>
                        )
                      })}
                    </div>
                  </>
                ) : null}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-border px-6 py-6">
                {user ? (
                  <ProfileDropdown user={user} />
                ) : (
                  <>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/sign-in"
                          className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-primary/35 bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:border-primary-light hover:bg-primary/10 hover:text-primary-light"
                        />
                      }
                    >
                      Log In
                    </SheetClose>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/sign-up"
                          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-light hover:text-[#08090d]"
                        />
                      }
                    >
                      Sign Up
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
