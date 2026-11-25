import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Tag } from "lucide-react"
import { getaddServices } from "@/components/api/get"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export async function FeaturedServices() {
  let services: Awaited<ReturnType<typeof getaddServices>> = []
  try {
    services = await getaddServices({ status: "Active" })
  } catch {
    services = []
  }
  const featured = (Array.isArray(services) ? services : []).slice(0, 6)

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
              Featured Services
            </p>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Popular Salon <span className="text-primary-light">Services</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
              Explore our most requested active services, crafted by trusted professionals for your best look.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 w-fit rounded-lg border-border bg-background/30 text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
            nativeButton={false}
            render={<Link href="/services" />}
          >
            View All Services
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-surface/40 px-6 py-16 text-center text-text-secondary">
            No active services available right now.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((service) => (
              <Card
                key={service._id}
                className="group overflow-hidden border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="relative h-52 w-full overflow-hidden bg-background/40">
                  <Image
                    src={service.serviceImage}
                    alt={service.serviceName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-xs font-medium text-primary-light backdrop-blur-sm">
                    <Tag className="size-3.5" />
                    {service.serviceCategory}
                  </div>
                </div>
                <CardContent className="space-y-4 p-5">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">{service.serviceName}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{service.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <p className="font-heading text-2xl font-semibold text-primary-light">${service.price}</p>
                    <p className="inline-flex items-center gap-1.5 text-text-secondary">
                      <Clock className="size-4" />
                      {service.duration} min
                    </p>
                  </div>

                  <Button
                    className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
                    nativeButton={false}
                    render={<Link href={`/services/${service._id}`} />}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}