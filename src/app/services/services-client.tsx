"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ServiceItem } from "@/components/api/get";
import { useSession } from "@/lib/auth-client";
import { authHeaders } from "@/lib/jwt";

type ServicesClientProps = {
  initialServices: ServiceItem[];
};

export function ServicesClient({ initialServices }: ServicesClientProps) {
  const { data: session } = useSession();
  const [services, setServices] = React.useState<ServiceItem[]>(initialServices);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("default");
  const [isLoading, setIsLoading] = React.useState(false);
  const isFirstRender = React.useRef(true);

  const categories = React.useMemo(() => {
    const unique = Array.from(
      new Set(initialServices.map((service) => service.serviceCategory)),
    );
    return ["All", ...unique];
  }, [initialServices]);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (category && category !== "All") params.set("category", category);
        if (sortBy && sortBy !== "default") params.set("sort", sortBy);
        params.set("status", "Active");

        const queryString = params.toString();
        const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
        const headers = await authHeaders(session?.user?.email || "guest@salonbook.local");
        const res = await fetch(
          `${baseurl}/addServices${queryString ? `?${queryString}` : ""}`,
          { signal: controller.signal, cache: "no-store", headers },
        );

        if (!res.ok) throw new Error("Failed to fetch services");
        const data: ServiceItem[] = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to fetch services:", error);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [search, category, sortBy, session?.user?.email]);

  return (
    <div className="min-h-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 text-center">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            Explore Services
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Find Your Perfect <span className="text-primary-light">Salon Service</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Browse premium salon services, compare options, and choose the perfect treatment for your style and comfort.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-border/80 bg-surface/50 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search Services by Name</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for a salon service"
                  className="h-11 border-border bg-background/40 pl-10 text-foreground placeholder:text-text-secondary focus-visible:border-primary/60 focus-visible:ring-primary/25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category-Based Filtering</label>
              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 w-full rounded-md border border-border bg-background/40 pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-3 focus:ring-primary/25"
                >
                  {categories.map((item) => (
                    <option key={item} value={item} className="bg-surface text-foreground">
                      {item === "All" ? "All Categories" : item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sort Services by Price</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 w-full rounded-md border border-border bg-background/40 px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-3 focus:ring-primary/25"
              >
                <option value="default" className="bg-surface text-foreground">Default Order</option>
                <option value="price-low" className="bg-surface text-foreground">Price: Low to High</option>
                <option value="price-high" className="bg-surface text-foreground">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border/70 bg-surface/40 px-6 py-16 text-center">
            <p className="font-heading text-2xl font-semibold text-foreground">Loading services...</p>
            <p className="mt-2 text-sm text-text-secondary">Please wait while we fetch services.</p>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-surface/40 px-6 py-16 text-center">
            <p className="font-heading text-2xl font-semibold text-foreground">No services found</p>
            <p className="mt-2 text-sm text-text-secondary">Try adjusting your search, category, or sort options.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service._id}
                className="group overflow-hidden border-border/80 bg-surface/50 py-0 shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={service.serviceImage}
                    alt={service.serviceName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-xs font-medium text-primary-light backdrop-blur-sm">
                    {service.serviceCategory}
                  </span>
                  <span
                    className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${
                      service.serviceStatus === "Active"
                        ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                        : "border-zinc-500/30 bg-zinc-500/15 text-zinc-300"
                    }`}
                  >
                    {service.serviceStatus}
                  </span>
                </div>

                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-heading text-xl font-semibold leading-tight text-foreground">
                      {service.serviceName}
                    </h2>
                    <p className="shrink-0 font-heading text-xl font-semibold text-primary-light">
                      ${service.price}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                    <Clock className="size-4 text-primary-light" />
                    <span>{service.duration} minutes</span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-secondary">
                    {service.description}
                  </p>

                  <div className="mt-6 pt-2">
                    <Button
                      nativeButton={false}
                      render={<Link href={`/services/${service._id}`} />}
                      className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
