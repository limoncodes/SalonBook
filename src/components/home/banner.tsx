import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Banner() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0">
        <Image
          src="/hero-salon.jpg"
          alt="Professional hairstylist styling a client's hair in a luxury salon"
          fill
          priority
          className="object-cover object-[62%_center] lg:object-[58%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,13,0.97)_0%,rgba(8,9,13,0.88)_30%,rgba(8,9,13,0.58)_55%,rgba(8,9,13,0.30)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,13,0.15)_0%,rgba(8,9,13,0)_35%,rgba(8,9,13,0.55)_100%)]" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-20 h-64 w-64 rounded-full bg-primary-light/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface/50 px-4 py-2 text-sm font-medium text-primary-light backdrop-blur-md">
            <span className="inline-flex size-2 rounded-full bg-success" />
            Premium Salon Booking
          </div>

          <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Book Your Perfect{" "}
            <span className="text-primary-light">Salon Experience</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            Discover trusted salons, explore premium beauty services, and
            request appointments online with ease. SalonBook makes self-care
            simple, elegant, and effortless.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              className="h-12 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_14px_36px_rgba(139,92,246,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-light hover:text-[#08090d]"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              Explore Salon Services
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-border bg-surface/35 px-7 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/45 hover:bg-primary/10 hover:text-primary-light"
              nativeButton={false}
              render={<Link href="#how-it-works" />}
            >
              <CalendarDays className="size-4" data-icon="inline-start" />
              How It Works
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-border/70 bg-surface/35 p-5 backdrop-blur-md sm:max-w-xl">
            <div>
              <p className="font-heading text-2xl font-semibold text-foreground">500+</p>
              <p className="text-sm text-text-secondary">Verified Salons</p>
            </div>
            <div className="hidden h-10 w-px bg-border/80 sm:block" />
            <div>
              <p className="font-heading text-2xl font-semibold text-foreground">10k+</p>
              <p className="text-sm text-text-secondary">Happy Customers</p>
            </div>
            <div className="hidden h-10 w-px bg-border/80 sm:block" />
            <div>
              <p className="flex items-center gap-1 font-heading text-2xl font-semibold text-foreground">
                4.9 <Star className="size-4 fill-primary text-primary" />
              </p>
              <p className="text-sm text-text-secondary">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
