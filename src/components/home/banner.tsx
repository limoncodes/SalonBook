"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, CalendarDays, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/hero-salon-3.jpg",
    alt: "Elegant salon styling space",
    eyebrow: "Premium Salon Booking",
    title: "Book Your Perfect",
    highlight: "Salon Experience",
    description:
      "Discover trusted salons, explore premium beauty services, and request appointments online with ease.",
    primaryCta: "Explore Salon Services",
    primaryHref: "/services",
    secondaryCta: "How It Works",
    secondaryHref: "#how-it-works",
  },
  {
    image: "/hero-salon-2.jpg",
    alt: "Modern luxury salon interior",
    eyebrow: "Expert Stylists",
    title: "Style That Matches",
    highlight: "Your Personality",
    description:
      "From haircuts to complete makeovers, find skilled professionals who understand your look and bring it to life.",
    primaryCta: "Browse Services",
    primaryHref: "/services",
    secondaryCta: "Book Appointment",
    secondaryHref: "/services",
  },
  {
    image: "/hero-salon.jpg",
    alt: "Professional hairstylist styling a client's hair in a luxury salon",
    eyebrow: "Relax & Refresh",
    title: "Your Time For",
    highlight: "Self-Care",
    description:
      "Enjoy a seamless booking experience and treat yourself to premium salon care in a calm, elegant atmosphere.",
    primaryCta: "Discover Salons",
    primaryHref: "/services",
    secondaryCta: "How It Works",
    secondaryHref: "#how-it-works",
  },
];

export function Banner() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const autoplay = React.useMemo(
    () =>
      Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false }),
    [],
  );

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.image} className="pl-0">
              <div className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
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
                      {slide.eyebrow}
                    </div>

                    <h1 className="max-w-2xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                      {slide.title}{" "}
                      <span className="text-primary-light">{slide.highlight}</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
                      {slide.description}
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                      <Button
                        className="h-12 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_14px_36px_rgba(139,92,246,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-light hover:text-[#08090d]"
                        nativeButton={false}
                        render={<Link href={slide.primaryHref} />}
                      >
                        {slide.primaryCta}
                        <ArrowRight className="size-4" data-icon="inline-end" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 rounded-xl border-border bg-surface/35 px-7 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/45 hover:bg-primary/10 hover:text-primary-light"
                        nativeButton={false}
                        render={<Link href={slide.secondaryHref} />}
                      >
                        <CalendarDays className="size-4" data-icon="inline-start" />
                        {slide.secondaryCta}
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                current === index
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-white/35 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
