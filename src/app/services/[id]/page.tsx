import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Tag } from "lucide-react"
import { getServiceById } from "@/components/api/get"
import { Card, CardContent } from "@/components/ui/card"
import { BookingDialog } from "./booking-dialog"

export const instant = false

type ServiceDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  const { id } = await params

  let service
  try {
    service = await getServiceById(id)
  } catch {
    notFound()
  }

  if (!service?._id) notFound()

  return (
    <div className="min-h-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary-light"
        >
          <ArrowLeft className="size-4" />
          Back to Services
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
            <div className="relative min-h-[320px] w-full sm:min-h-[420px] lg:min-h-full">
              <Image
                src={service.serviceImage}
                alt={service.serviceName}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
            </div>
          </Card>

          <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
            <CardContent className="flex h-full flex-col p-6 sm:p-8">
              <div className="inline-flex w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
                <Tag className="mr-2 size-4" />
                {service.serviceCategory}
              </div>

              <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {service.serviceName}
              </h1>

              <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base">
                {service.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                  <p className="text-sm text-text-secondary">Price</p>
                  <p className="mt-2 font-heading text-2xl font-semibold text-primary-light">
                    ${service.price}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                  <p className="text-sm text-text-secondary">Estimated Duration</p>
                  <p className="mt-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground">
                    <Clock className="size-5 text-primary-light" />
                    {service.duration} min
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-border/70 bg-background/30 p-4">
                <p className="text-sm font-medium text-foreground">Service Status</p>
                <p className="mt-2 text-sm text-text-secondary">
                  {service.serviceStatus === "Active"
                    ? "This service is currently available for booking."
                    : "This service is currently unavailable."}
                </p>
              </div>

              <div className="mt-auto pt-8">
                <BookingDialog service={service} />
                {service.serviceStatus !== "Active" && (
                  <p className="mt-3 text-sm text-text-secondary">
                    Booking is unavailable for inactive services.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}