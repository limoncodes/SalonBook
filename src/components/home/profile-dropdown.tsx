"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type ProfileDropdownProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?:string |"user"
  };
};

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const handleLogout = async () => {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };
  

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="group flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface/50 px-2.5 py-1.5 outline-none transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/30 data-[popup-open]:border-primary/40 data-[popup-open]:bg-primary/5">
        <Avatar className="size-8">
          {user.image ? <AvatarImage src={user.image} alt={user.name || "User"} /> : null}
          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary-light">
            {initials}
          </AvatarFallback>
          <AvatarBadge className="bg-success" />
        </Avatar>
        <div className="hidden min-w-0 flex-col items-start sm:flex">
          <span className="max-w-[120px] truncate text-sm font-medium leading-none text-foreground">
            {user.name}
          </span>
          <span className="mt-1 max-w-[120px] truncate text-[11px] leading-none text-text-secondary">
            Account
          </span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-text-secondary transition-transform duration-200 group-hover:text-primary-light",
            open && "rotate-180 text-primary-light",
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-60 rounded-xl border-border/80 bg-surface p-1.5 text-foreground shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                {user.image ? <AvatarImage src={user.image} alt={user.name || "User"} /> : null}
                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary-light">
                  {initials}
                </AvatarFallback>
                <AvatarBadge className="bg-success" />
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                <p className="truncate text-xs text-text-secondary">{user.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1 bg-border/70" />
        <DropdownMenuGroup>
          {
            user.role==="admin"?<>
            <DropdownMenuItem
            className="cursor-pointer rounded-lg px-2.5 py-2 text-text-secondary focus:bg-primary/10 focus:text-primary-light"
            render={<Link href="/dashboard/admin" />}
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </DropdownMenuItem>
            </>:<>
            <DropdownMenuItem
            className="cursor-pointer rounded-lg px-2.5 py-2 text-text-secondary focus:bg-primary/10 focus:text-primary-light"
            render={<Link href="/dashboard/user" />}
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </DropdownMenuItem>
            </>
          }
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer rounded-lg px-2.5 py-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
