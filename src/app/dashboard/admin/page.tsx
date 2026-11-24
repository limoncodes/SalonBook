"use client"

import * as React from "react"
import { BadgeDollarSign, CalendarCheck2, CalendarClock, ClipboardList, Scissors, Users } from "lucide-react"
import { toast } from "react-toastify"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Appointment = {
  appointmentStatus?: string
  paymentStatus?: string
}

type StatCard = {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  iconClassName: string
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState({
    totalCustomers: 0,
    activeServices: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    successfulPayments: 0,
  })
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true

    const loadStats = async () => {
      try {
        const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
        const [usersRes, servicesRes, appointmentsRes] = await Promise.allSettled([
          authClient.admin.listUsers({ query: { limit: 1 } }),
          fetch(`${baseurl}/addServices?status=Active`, { cache: "no-store" }),
          fetch(`${baseurl}/appointments`, { cache: "no-store" }),
        ])

        let totalCustomers = 0
        if (usersRes.status === "fulfilled") {
          const { data, error } = usersRes.value
          if (!error) {
            totalCustomers = Number(data?.total ?? data?.users?.length ?? 0)
          }
        }

        let activeServices = 0
        if (servicesRes.status === "fulfilled" && servicesRes.value.ok) {
          const data = await servicesRes.value.json()
          activeServices = Array.isArray(data) ? data.length : 0
        }

        let appointments: Appointment[] = []
        if (appointmentsRes.status === "fulfilled" && appointmentsRes.value.ok) {
          const data = await appointmentsRes.value.json()
          appointments = Array.isArray(data) ? data : []
        }

        const totalAppointments = appointments.length
        const pendingAppointments = appointments.filter((a) => a.appointmentStatus === "Pending").length
        const confirmedAppointments = appointments.filter((a) => a.appointmentStatus === "Confirmed").length
        const successfulPayments = appointments.filter((a) => a.paymentStatus === "Paid").length

        if (active) {
          setStats({
            totalCustomers,
            activeServices,
            totalAppointments,
            pendingAppointments,
            confirmedAppointments,
            successfulPayments,
          })
        }
      } catch (error) {
        console.error("Failed to load admin stats:", error)
        if (active) toast.error("Failed to load dashboard stats")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadStats()
    return () => {
      active = false
    }
  }, [])

  const cards: StatCard[] = [
    { label: "Total Registered Customers", value: stats.totalCustomers, icon: Users, iconClassName: "bg-primary/15 text-primary-light" },
    { label: "Total Active Services", value: stats.activeServices, icon: Scissors, iconClassName: "bg-emerald-500/15 text-emerald-400" },
    { label: "Total Appointment Requests", value: stats.totalAppointments, icon: ClipboardList, iconClassName: "bg-sky-500/15 text-sky-400" },
    { label: "Pending Appointments", value: stats.pendingAppointments, icon: CalendarClock, iconClassName: "bg-amber-500/15 text-amber-400" },
    { label: "Confirmed Appointments", value: stats.confirmedAppointments, icon: CalendarCheck2, iconClassName: "bg-emerald-500/15 text-emerald-400" },
    { label: "Total Successful Payments", value: stats.successfulPayments, icon: BadgeDollarSign, iconClassName: "bg-primary/15 text-primary-light" },
  ]

  return (
    <div className="min-h-full w-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            Admin Dashboard
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Dashboard <span className="text-primary-light">Overview</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Monitor customers, services, appointments, and payment activity at a glance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((stat) => {
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
