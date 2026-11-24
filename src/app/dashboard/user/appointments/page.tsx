"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarDays, Clock, Eye, Trash2, XCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useSession } from "@/lib/auth-client"
import { PaymentButton } from "./payment-button"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


type Appointment = {
  _id: string
  serviceId: string
  serviceName: string
  serviceCategory: string
  serviceImage?: string
  price: number
  duration: number
  appointmentDate: string
  timeSlot: string
  message?: string
  userEmail: string
  userName?: string
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

export default function UserAppointmentsPage() {
  const { data: session, isPending } = useSession()
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [isLoadingData, setIsLoadingData] = React.useState(true)
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = React.useState<Appointment | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Appointment | null>(null)

  React.useEffect(() => {
    const email = session?.user?.email
    if (!email) return

    let active = true
    const loadAppointments = async () => {
      try {
        const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
        const res = await fetch(`${baseurl}/appointments?email=${encodeURIComponent(email)}`, {
          cache: "no-store",
        })
        const data = await res.json()
        if (active) setAppointments(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load appointments:", error)
        if (active) toast.error("Failed to load appointments")
      } finally {
        if (active) setIsLoadingData(false)
      }
    }

    void loadAppointments()
    return () => {
      active = false
    }
  }, [session?.user?.email])

  const isLoading = isPending || (!!session?.user?.email && isLoadingData)

  const handleCancel = async () => {
    if (!cancelTarget || !session?.user?.email) return
    setBusyId(cancelTarget._id)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const res = await fetch(`${baseurl}/appointments/${cancelTarget._id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: session.user.email }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.message || "Failed to cancel appointment")
      }
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === cancelTarget._id ? { ...item, appointmentStatus: "Cancelled" } : item,
        ),
      )
      toast.success("Appointment cancelled successfully")
      setCancelTarget(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel appointment")
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !session?.user?.email) return
    setBusyId(deleteTarget._id)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const res = await fetch(
        `${baseurl}/appointments/${deleteTarget._id}?email=${encodeURIComponent(session.user.email)}`,
        { method: "DELETE" },
      )
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete appointment")
      }
      setAppointments((prev) => prev.filter((item) => item._id !== deleteTarget._id))
      toast.success("Appointment deleted successfully")
      setDeleteTarget(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete appointment")
    } finally {
      setBusyId(null)
    }
  }



  if (!isPending && !session?.user) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border/70 bg-surface/40 px-6 py-16 text-center">
          <p className="font-heading text-2xl font-semibold text-foreground">Please sign in</p>
          <p className="mt-2 text-sm text-text-secondary">You need to sign in to view your appointments.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full w-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            Customer Dashboard
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            My <span className="text-primary-light">Appointments</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            View your appointment requests, track status, cancel pending requests, and pay for confirmed appointments.
          </p>
        </div>

        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
          <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">Appointment Requests</CardTitle>
            <CardDescription className="text-text-secondary">All appointment requests submitted by your account.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading || isPending ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">No appointments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border/70 bg-background/30 text-text-secondary">
                    <tr>
                      <th className="px-6 py-4 font-medium sm:px-8">Service</th>
                      <th className="px-4 py-4 font-medium">Category</th>
                      <th className="px-4 py-4 font-medium">Date & Time</th>
                      <th className="px-4 py-4 font-medium">Price</th>
                      <th className="px-4 py-4 font-medium">Appointment</th>
                      <th className="px-4 py-4 font-medium">Payment</th>
                      <th className="px-4 py-4 font-medium">Requested</th>
                      <th className="px-6 py-4 text-right font-medium sm:px-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => {
                      const isBusy = busyId === appointment._id
                      const canCancel = appointment.appointmentStatus === "Pending"
                      const canPay = appointment.appointmentStatus === "Confirmed" && appointment.paymentStatus === "Unpaid"
                      const canDelete = appointment.appointmentStatus === "Cancelled"
                      return (
                        <tr key={appointment._id} className="border-b border-border/50 last:border-b-0">
                          <td className="px-6 py-4 sm:px-8">
                            <div className="flex items-center gap-3">
                              {appointment.serviceImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={appointment.serviceImage}
                                  alt={appointment.serviceName}
                                  className="size-12 rounded-lg object-cover bg-background/40"
                                />
                              ) : (
                                <div className="flex size-12 items-center justify-center rounded-lg bg-background/40 text-xs text-text-secondary">
                                  N/A
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-foreground">{appointment.serviceName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-text-secondary">{appointment.serviceCategory}</td>
                          <td className="px-4 py-4 text-text-secondary">
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{appointment.appointmentDate}</span>
                              <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" />{appointment.timeSlot}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-foreground">${appointment.price}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(appointment.appointmentStatus)}`}>
                              {appointment.appointmentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(appointment.paymentStatus)}`}>
                              {appointment.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-text-secondary">{formatDate(appointment.createdAt)}</td>
                          <td className="px-6 py-4 sm:px-8">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-border bg-background/30"
                                nativeButton={false}
                                render={<Link href={`/dashboard/user/appointments/${appointment._id}`} />}
                              >
                                <Eye className="size-3.5" /> Details
                              </Button>
                              {canPay && (
                                <PaymentButton
                                  appointmentId={appointment._id}
                                  serviceName={appointment.serviceName}
                                  amount={appointment.price}
                                  disabled={isBusy}
                                />
                              )}
                              {canCancel && (
                                <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-destructive hover:bg-destructive/10" disabled={isBusy} onClick={() => setCancelTarget(appointment)}>
                                  <XCircle className="size-3.5" /> Cancel
                                </Button>
                              )}
                              {canDelete && (
                                <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-destructive hover:bg-destructive/10" disabled={isBusy} onClick={() => setDeleteTarget(appointment)}>
                                  <Trash2 className="size-3.5" /> Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel appointment?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel your pending appointment for{" "}
                <span className="font-medium text-foreground">{cancelTarget?.serviceName}</span>. You cannot cancel confirmed or cancelled appointments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!busyId}>Keep Appointment</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" disabled={!!busyId} onClick={handleCancel}>
                {busyId ? "Cancelling..." : "Cancel Appointment"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete appointment?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the cancelled appointment for{" "}
                <span className="font-medium text-foreground">{deleteTarget?.serviceName}</span>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!busyId}>Keep</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" disabled={!!busyId} onClick={handleDelete}>
                {busyId ? "Deleting..." : "Delete Appointment"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}