"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, CalendarDays, Clock, Tag, XCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useSession } from "@/lib/auth-client"
import { PaymentButton } from "../payment-button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


type Appointment = {
  _id: string
  serviceName: string
  serviceCategory: string
  serviceImage?: string
  price: number
  appointmentDate: string
  timeSlot: string
  message?: string
  appointmentStatus: "Pending" | "Confirmed" | "Cancelled" | "Completed"
  paymentStatus: "Unpaid" | "Paid"
  createdAt?: string
}

function formatDate(value?: string) {
  if (!value) return "N/A"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

function statusClass(status: string) {
  if (status === "Pending") return "bg-amber-500/15 text-amber-400"
  if (status === "Confirmed" || status === "Paid") return "bg-emerald-500/15 text-emerald-400"
  if (status === "Completed") return "bg-sky-500/15 text-sky-400"
  return "bg-zinc-500/15 text-zinc-300"
}

export function AppointmentDetailsClient() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { data: session, isPending } = useSession()
  const [appointment, setAppointment] = React.useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [cancelOpen, setCancelOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    const email = session?.user?.email
    if (!id || !email) return

    let active = true
    const load = async () => {
      try {
        const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
        const res = await fetch(`${baseurl}/appointments/${id}?email=${encodeURIComponent(email)}`, { cache: "no-store" })
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error(data?.message || "Failed to load appointment")
        if (active) setAppointment(data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load appointment")
      } finally {
        if (active) setIsLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [id, session?.user?.email])

  const handleCancel = async () => {
    if (!appointment || !session?.user?.email) return
    setBusy(true)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const res = await fetch(`${baseurl}/appointments/${appointment._id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: session.user.email }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || "Failed to cancel appointment")
      setAppointment((prev) => (prev ? { ...prev, appointmentStatus: "Cancelled" } : prev))
      toast.success("Appointment cancelled successfully")
      setCancelOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel appointment")
    } finally {
      setBusy(false)
    }
  }

  if (isPending || (isLoading && session?.user?.email)) {
    return <div className="px-6 py-10 text-text-secondary">Loading appointment...</div>
  }

  if (!session?.user) {
    return <div className="px-6 py-10 text-text-secondary">Please sign in to view this appointment.</div>
  }

  if (!appointment) {
    return <div className="px-6 py-10 text-text-secondary">Appointment not found.</div>
  }

  const canPay = appointment.appointmentStatus === "Confirmed" && appointment.paymentStatus === "Unpaid"
  const canCancel = appointment.appointmentStatus === "Pending"

  return (
    <div className="min-h-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link href="/dashboard/user/appointments" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary-light">
          <ArrowLeft className="size-4" />
          Back to My Appointments
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
            <div className="relative min-h-[320px] w-full sm:min-h-[420px] lg:min-h-full">
              {appointment.serviceImage ? (
                <Image src={appointment.serviceImage} alt={appointment.serviceName} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center bg-background/40 text-text-secondary">No image</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
            </div>
          </Card>

          <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
            <CardContent className="flex h-full flex-col p-6 sm:p-8">
              <div className="inline-flex w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
                <Tag className="mr-2 size-4" />
                {appointment.serviceCategory}
              </div>

              <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {appointment.serviceName}
              </h1>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                  <p className="text-sm text-text-secondary">Appointment Date</p>
                  <p className="mt-2 flex items-center gap-2 font-medium text-foreground"><CalendarDays className="size-4 text-primary-light" />{appointment.appointmentDate}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                  <p className="text-sm text-text-secondary">Appointment Time</p>
                  <p className="mt-2 flex items-center gap-2 font-medium text-foreground"><Clock className="size-4 text-primary-light" />{appointment.timeSlot}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                  <p className="text-sm text-text-secondary">Service Price</p>
                  <p className="mt-2 font-heading text-2xl font-semibold text-primary-light">${appointment.price}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/30 p-4">
                  <p className="text-sm text-text-secondary">Requested On</p>
                  <p className="mt-2 font-medium text-foreground">{formatDate(appointment.createdAt)}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(appointment.appointmentStatus)}`}>
                  {appointment.appointmentStatus}
                </span>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(appointment.paymentStatus)}`}>
                  {appointment.paymentStatus}
                </span>
              </div>

              {appointment.message && (
                <div className="mt-6 rounded-xl border border-border/70 bg-background/30 p-4">
                  <p className="text-sm text-text-secondary">Additional Message</p>
                  <p className="mt-2 text-sm text-foreground">{appointment.message}</p>
                </div>
              )}

              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                {canPay && (
                  <PaymentButton
                    appointmentId={appointment._id}
                    serviceName={appointment.serviceName}
                    amount={appointment.price}
                    disabled={busy}
                  />
                )}
                {canCancel && (
                  <Button variant="outline" className="border-border bg-background/30 text-destructive hover:bg-destructive/10" onClick={() => setCancelOpen(true)} disabled={busy}>
                    <XCircle className="size-4" /> Cancel Appointment
                  </Button>
                )}
                {!canPay && !canCancel && (
                  <p className="text-sm text-text-secondary">No actions available for this appointment.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel appointment?</AlertDialogTitle>
            <AlertDialogDescription>This will cancel your pending appointment. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Keep</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" disabled={busy} onClick={handleCancel}>
              {busy ? "Cancelling..." : "Cancel Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
