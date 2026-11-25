"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { BadgeDollarSign, CalendarDays, CheckCircle2, ClipboardCheck, Clock, Eye, XCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useSession } from "@/lib/auth-client"
import { authHeaders } from "@/lib/jwt"
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
  serviceName: string
  serviceCategory?: string
  serviceImage?: string
  price: number
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

function formatAppointmentDate(value?: string) {
  if (!value) return "N/A"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}

function statusClass(status: string) {
  if (status === "Pending") return "bg-amber-500/15 text-amber-400"
  if (status === "Confirmed" || status === "Paid") return "bg-emerald-500/15 text-emerald-400"
  if (status === "Completed") return "bg-sky-500/15 text-sky-400"
  return "bg-zinc-500/15 text-zinc-300"
}

export default function AdminAppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = React.useState<Appointment | null>(null)

  React.useEffect(() => {
    const email = session?.user?.email
    if (!email) return
    let active = true
    const loadAppointments = async () => {
      try {
        const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
        const headers = await authHeaders(email)
        const res = await fetch(`${baseurl}/appointments`, { cache: "no-store", headers })
        const data = await res.json()
        if (active) setAppointments(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load appointments:", error)
        if (active) toast.error("Failed to load appointments")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadAppointments()
    return () => {
      active = false
    }
  }, [session?.user?.email])

  const handleConfirm = async (appointment: Appointment) => {
    const email = session?.user?.email
    if (!email) return toast.error("You must be signed in")
    setBusyId(appointment._id)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const headers = await authHeaders(email)
      const res = await fetch(`${baseurl}/appointments/${appointment._id}/confirm`, {
        method: "PATCH",
        headers,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || "Failed to confirm appointment")
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === appointment._id ? { ...item, appointmentStatus: "Confirmed" } : item,
        ),
      )
      toast.success("Appointment confirmed successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to confirm appointment")
    } finally {
      setBusyId(null)
    }
  }

  const handleComplete = async (appointment: Appointment) => {
    const email = session?.user?.email
    if (!email) return toast.error("You must be signed in")
    setBusyId(appointment._id)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const headers = await authHeaders(email)
      const res = await fetch(`${baseurl}/appointments/${appointment._id}/complete`, {
        method: "PATCH",
        headers,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || "Failed to complete appointment")
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === appointment._id ? { ...item, appointmentStatus: "Completed" } : item,
        ),
      )
      toast.success("Appointment marked as completed")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete appointment")
    } finally {
      setBusyId(null)
    }
  }

  const handleMarkPaid = async (appointment: Appointment) => {
    const email = session?.user?.email
    if (!email) return toast.error("You must be signed in")
    setBusyId(appointment._id)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const headers = await authHeaders(email)
      const res = await fetch(`${baseurl}/appointments/${appointment._id}/mark-paid`, {
        method: "PATCH",
        headers,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || "Failed to mark appointment as paid")
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === appointment._id ? { ...item, paymentStatus: "Paid" } : item,
        ),
      )
      toast.success("Appointment marked as paid")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to mark appointment as paid")
    } finally {
      setBusyId(null)
    }
  }

  const handleCancel = async () => {
    if (!cancelTarget) return
    const email = session?.user?.email
    if (!email) return toast.error("You must be signed in")
    setBusyId(cancelTarget._id)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const headers = await authHeaders(email)
      const res = await fetch(`${baseurl}/appointments/${cancelTarget._id}/admin-cancel`, {
        method: "PATCH",
        headers,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || "Failed to cancel appointment")
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

  return (
    <div className="min-h-full w-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            Admin Dashboard
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Manage <span className="text-primary-light">Appointments</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            View and manage all customer appointment requests.
          </p>
        </div>

        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
          <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">All Appointment Requests</CardTitle>
            <CardDescription className="text-text-secondary">Confirm pending appointments or cancel pending/confirmed appointments.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">No appointments found.</div>
            ) : (
              <>
                <div className="space-y-4 p-4 md:hidden">
                  {appointments.map((appointment) => {
                    const isBusy = busyId === appointment._id
                    const canConfirm = appointment.appointmentStatus === "Pending"
                    const canComplete = appointment.appointmentStatus === "Confirmed"
                    const canCancel = (appointment.appointmentStatus === "Pending" || appointment.appointmentStatus === "Confirmed") && appointment.paymentStatus !== "Paid"
                    const canMarkPaid = appointment.paymentStatus === "Unpaid"
                    return (
                      <div key={appointment._id} className="rounded-xl border border-border/70 bg-background/20 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{appointment.userName || "Unknown"}</p>
                            <p className="truncate text-xs text-text-secondary">{appointment.userEmail}</p>
                          </div>
                          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(appointment.appointmentStatus)}`}>{appointment.appointmentStatus}</span>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(appointment.paymentStatus)}`}>{appointment.paymentStatus}</span>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <p className="text-text-secondary">Service</p>
                            <div className="mt-1 flex items-center gap-3">
                              <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-background/40">
                                {appointment.serviceImage ? (
                                  <Image src={appointment.serviceImage} alt={appointment.serviceName} fill className="object-cover" sizes="44px" />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-[10px] text-text-secondary">No img</div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">{appointment.serviceName}</p>
                                <p className="mt-0.5 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary-light">
                                  {appointment.serviceCategory || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-text-secondary">Date & Time</p>
                            <p className="mt-1 inline-flex items-center gap-2 font-medium text-foreground">
                              <CalendarDays className="size-4 text-primary-light" />
                              {formatAppointmentDate(appointment.appointmentDate)}
                            </p>
                            <p className="mt-1 inline-flex items-center gap-2 text-text-secondary">
                              <Clock className="size-4 text-primary-light" />
                              {appointment.timeSlot}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-secondary">Price</p>
                            <p className="mt-1 font-medium text-foreground">${appointment.price}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-text-secondary">Requested</p>
                            <p className="mt-1 text-foreground">{formatDate(appointment.createdAt)}</p>
                          </div>
                        </div>

                        {appointment.message && (
                          <div className="mt-3 rounded-lg border border-border/60 bg-background/30 p-3">
                            <p className="text-xs text-text-secondary">Customer Message</p>
                            <p className="mt-1 text-sm text-foreground">{appointment.message}</p>
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="h-8 border-border bg-background/30" nativeButton={false} render={<Link href={`/dashboard/admin/appointments/${appointment._id}`} />}>
                            <Eye className="size-3.5" /> Details
                          </Button>
                          {canConfirm && (
                            <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-emerald-400 hover:text-emerald-300" disabled={isBusy} onClick={() => void handleConfirm(appointment)}>
                              <CheckCircle2 className="size-3.5" /> {isBusy ? "Confirming..." : "Confirm"}
                            </Button>
                          )}
                          {canComplete && (
                            <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-sky-400 hover:text-sky-300" disabled={isBusy} onClick={() => void handleComplete(appointment)}>
                              <ClipboardCheck className="size-3.5" /> {isBusy ? "Updating..." : "Complete"}
                            </Button>
                          )}
                          {canMarkPaid && (
                            <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-emerald-400 hover:text-emerald-300" disabled={isBusy} onClick={() => void handleMarkPaid(appointment)}>
                              <BadgeDollarSign className="size-3.5" /> {isBusy ? "Updating..." : "Mark Paid"}
                            </Button>
                          )}

                          {canCancel && (
                            <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-destructive hover:bg-destructive/10" disabled={isBusy} onClick={() => setCancelTarget(appointment)}>
                              <XCircle className="size-3.5" /> Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border/70 bg-background/30 text-text-secondary">
                      <tr>
                        <th className="px-6 py-4 font-medium sm:px-8">Customer</th>
                        <th className="px-4 py-4 font-medium">Service</th>
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
                        const canConfirm = appointment.appointmentStatus === "Pending"
                        const canComplete = appointment.appointmentStatus === "Confirmed"
                        const canCancel = (appointment.appointmentStatus === "Pending" || appointment.appointmentStatus === "Confirmed") && appointment.paymentStatus !== "Paid"
                        const canMarkPaid = appointment.paymentStatus === "Unpaid"
                        return (
                          <tr key={appointment._id} className="border-b border-border/50 last:border-b-0 align-top">
                            <td className="px-6 py-4 sm:px-8">
                              <p className="font-medium text-foreground">{appointment.userName || "Unknown"}</p>
                              <p className="text-xs text-text-secondary">{appointment.userEmail}</p>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-background/40">
                                  {appointment.serviceImage ? (
                                    <Image src={appointment.serviceImage} alt={appointment.serviceName} fill className="object-cover" sizes="44px" />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-[10px] text-text-secondary">No img</div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-foreground">{appointment.serviceName}</p>
                                  <p className="mt-0.5 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary-light">
                                    {appointment.serviceCategory || "N/A"}
                                  </p>
                                  {appointment.message && (
                                    <p className="mt-1 max-w-[200px] truncate text-xs text-text-secondary" title={appointment.message}>
                                      “{appointment.message}”
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1.5">
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                                  <CalendarDays className="size-4 text-primary-light" />
                                  {formatAppointmentDate(appointment.appointmentDate)}
                                </span>
                                <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                                  <Clock className="size-4 text-primary-light" />
                                  {appointment.timeSlot}
                                </span>
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
                                <Button variant="outline" size="sm" className="h-8 border-border bg-background/30" nativeButton={false} render={<Link href={`/dashboard/admin/appointments/${appointment._id}`} />}>
                                  <Eye className="size-3.5" /> Details
                                </Button>
                                {canConfirm && (
                                  <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-emerald-400 hover:text-emerald-300" disabled={isBusy} onClick={() => void handleConfirm(appointment)}>
                                    <CheckCircle2 className="size-3.5" /> {isBusy ? "Confirming..." : "Confirm"}
                                  </Button>
                                )}
                                {canComplete && (
                                  <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-sky-400 hover:text-sky-300" disabled={isBusy} onClick={() => void handleComplete(appointment)}>
                                    <ClipboardCheck className="size-3.5" /> {isBusy ? "Updating..." : "Complete"}
                                  </Button>
                                )}
                                {canMarkPaid && (
                                  <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-emerald-400 hover:text-emerald-300" disabled={isBusy} onClick={() => void handleMarkPaid(appointment)}>
                                    <BadgeDollarSign className="size-3.5" /> {isBusy ? "Updating..." : "Mark Paid"}
                                  </Button>
                                )}

                                {canCancel && (
                                  <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-destructive hover:bg-destructive/10" disabled={isBusy} onClick={() => setCancelTarget(appointment)}>
                                    <XCircle className="size-3.5" /> Cancel
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
              </>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel appointment?</AlertDialogTitle>
              <AlertDialogDescription>
                This will cancel the appointment for <span className="font-medium text-foreground">{cancelTarget?.serviceName}</span>. Only pending or confirmed appointments can be cancelled.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!busyId}>Keep</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" disabled={!!busyId} onClick={handleCancel}>
                {busyId ? "Cancelling..." : "Cancel Appointment"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
