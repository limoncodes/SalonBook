import { Suspense } from "react"
import { Banner } from "@/components/home/banner"
import { FeaturedServices } from "@/components/home/featured-services"
import { HowItWorks } from "@/components/home/how-it-works"
import { ServiceCategories } from "@/components/home/service-categories"

function FeaturedServicesFallback() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10">
          <div className="h-8 w-40 animate-pulse rounded-full bg-primary/15" />
          <div className="mt-4 h-12 w-full max-w-xl animate-pulse rounded-lg bg-surface/60" />
          <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-surface/40" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border/70 bg-surface/40">
              <div className="h-52 animate-pulse bg-background/50" />
              <div className="space-y-3 p-5">
                <div className="h-6 w-3/4 animate-pulse rounded bg-background/50" />
                <div className="h-4 w-full animate-pulse rounded bg-background/40" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-background/40" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-background/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <Banner />
      <Suspense fallback={<FeaturedServicesFallback />}>
        <FeaturedServices />
      </Suspense>
      <ServiceCategories />
      <HowItWorks />
    </div>
  )
}
