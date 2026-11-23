"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <span className="font-heading text-lg leading-none">S</span>
          </span>
          <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Salon<span className="text-primary">Book</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            className="h-10 rounded-full border-border bg-surface/40 px-5 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
            nativeButton={false}
            render={<Link href="/sign-in" />}
          >
            Log In
          </Button>
          <Button
            className="h-10 rounded-full px-6 text-sm font-semibold shadow-[0_0_0_1px_rgba(139,92,246,0.28),0_10px_30px_rgba(139,92,246,0.35)] transition-all hover:-translate-y-0.5 hover:bg-primary-light"
            nativeButton={false}
            render={<Link href="/sign-up" />}
          >
            Sign Up
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="border-border bg-surface/60 hover:bg-primary/10 hover:text-foreground"
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
                  Salon<span className="text-primary">Book</span>
                </SheetTitle>
                <SheetDescription className="text-text-secondary">
                  Discover and book premium salon services.
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-2 px-4 py-6" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-xl px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-primary/10 hover:text-foreground"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-border px-6 py-6">
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/sign-in"
                      className="inline-flex h-11 w-full items-center justify-center rounded-full border border-border bg-surface/40 px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
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
                      className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_rgba(139,92,246,0.28),0_10px_30px_rgba(139,92,246,0.35)] transition-all hover:bg-primary-light"
                    />
                  }
                >
                  Sign Up
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
