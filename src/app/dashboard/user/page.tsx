"use client"

import * as React from "react"
import { CalendarClock, CheckCircle2, CircleX, ClipboardList } from "lucide-react"
import { toast } from "react-toastify"
import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Appointment = {
  _id: string
  appointmentStatus: "Pending" | "Confirmed" | "Cancelled"
}

type StatCard = {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  iconClassName: string
}

export default function UserDashboard() {
  const { data: session, isPending } = useSession()
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [isLoadingData, setIsLoadingData] = React.useState(true)

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
        console.error("Failed to load dashboard appointments:", error)
        if (active) toast.error("Failed to load appointment stats")
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

  const stats = React.useMemo<StatCard[]>(() => {
    const total = appointments.length
    const pending = appointments.filter((item) => item.appointmentStatus === "Pending").length
    const confirmed = appointments.filter((item) => item.appointmentStatus === "Confirmed").length
    const cancelled = appointments.filter((item) => item.appointmentStatus === "Cancelled").length

    return [
      {
        label: "Total Appointment Requests",
        value: total,
        icon: ClipboardList,
        iconClassName: "bg-primary/15 text-primary-light",
      },
      {
        label: "Pending Appointments",
        value: pending,
        icon: CalendarClock,
        iconClassName: "bg-amber-500/15 text-amber-400",
      },
      {
        label: "Confirmed Appointments",
        value: confirmed,
        icon: CheckCircle2,
        iconClassName: "bg-emerald-500/15 text-emerald-400",
      },
      {
        label: "Cancelled Appointments",
        value: cancelled,
        icon: CircleX,
        iconClassName: "bg-zinc-500/15 text-zinc-300",
      },
    ]
  }, [appointments])

  if (!isPending && !session?.user) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border/70 bg-surface/40 px-6 py-16 text-center">
          <p className="font-heading text-2xl font-semibold text-foreground">Please sign in</p>
          <p className="mt-2 text-sm text-text-secondary">You need to sign in to view your dashboard.</p>
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
            Welcome, <span className="text-primary-light">{session?.user?.name || "Customer"}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Track your appointment requests and their current status.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
                <CardHeader className="flex flex-row items-center justify-between gap-4 px-6 py-5">
                  <CardTitle className="text-sm font-medium text-text-secondary">{stat.label}</CardTitle>
                  <div className={`rounded-lg p-2.5 ${stat.iconClassName}`}>
                    <Icon className="size-5" />
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="font-heading text-3xl font-semibold text-foreground">
                    {isLoading ? "..." : stat.value}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
