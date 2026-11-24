"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"
import { toast } from "react-toastify"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ServiceItem } from "@/components/api/get"

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

type BookingDialogProps = {
  service: ServiceItem
}

export function BookingDialog({ service }: BookingDialogProps) {
  const { data: session } = useSession()
  const today = React.useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }, [])
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [appointmentDate, setAppointmentDate] = React.useState(today)
  const [timeSlot, setTimeSlot] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitError, setSubmitError] = React.useState("")

  const isInactive = service.serviceStatus !== "Active"

  const resetForm = () => {
    setAppointmentDate(today)
    setTimeSlot("")
    setMessage("")
    setErrors({})
    setSubmitError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError("")

    if (!session?.user) {
      const msg = "Please sign in to book an appointment"
      setSubmitError(msg)
      toast.error(msg)
      return
    }

    if (isInactive) {
      const msg = "This service is inactive and cannot be booked"
      setSubmitError(msg)
      toast.error(msg)
      return
    }

    const nextErrors: Record<string, string> = {}
    if (!appointmentDate) nextErrors.appointmentDate = "Appointment date is required"
    if (!timeSlot) nextErrors.timeSlot = "Time slot is required"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const res = await fetch(`${baseurl}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service._id,
          serviceName: service.serviceName,
          serviceCategory: service.serviceCategory,
          serviceImage: service.serviceImage,
          price: service.price,
          duration: service.duration,
          appointmentDate,
          timeSlot,
          message: message.trim(),
          userEmail: session.user.email,
          userName: session.user.name,
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = data?.message || "Failed to book appointment"
        setSubmitError(msg)
        toast.error(msg)
        return
      }

      toast.success("Appointment request submitted successfully")
      setOpen(false)
      resetForm()
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to book appointment"
      setSubmitError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetForm()
      }}
    >
      <DialogTrigger
        render={
          <Button
            className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d] sm:w-auto sm:px-8"
            disabled={isInactive}
          />
        }
      >
        <CalendarDays className="size-4" />
        Book Appointment
      </DialogTrigger>

      <DialogContent className="border-border/80 bg-surface text-foreground sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">Book Appointment</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Request an appointment for <span className="font-medium text-foreground">{service.serviceName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="appointmentDate" className="text-foreground">Appointment Date</Label>
            <Input
              id="appointmentDate"
              type="date"
              min={today}
              value={appointmentDate}
              onChange={(e) => {
                setAppointmentDate(e.target.value)
                if (errors.appointmentDate) setErrors((p) => ({ ...p, appointmentDate: "" }))
                if (submitError) setSubmitError("")
              }}
              className="h-11 border-border bg-background/40 text-foreground focus-visible:border-primary/60 focus-visible:ring-primary/25"
            />
            <p className="text-xs text-text-secondary">Today is selected by default. You can change it if needed.</p>
            {errors.appointmentDate && <p className="text-xs text-destructive">{errors.appointmentDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeSlot" className="text-foreground">Available Time Slot</Label>
            <select
              id="timeSlot"
              value={timeSlot}
              onChange={(e) => {
                setTimeSlot(e.target.value)
                if (errors.timeSlot) setErrors((p) => ({ ...p, timeSlot: "" }))
                if (submitError) setSubmitError("")
              }}
              className="h-11 w-full rounded-md border border-border bg-background/40 px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-3 focus:ring-primary/25"
            >
              <option value="" className="bg-surface text-text-secondary">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot} className="bg-surface text-foreground">
                  {slot}
                </option>
              ))}
            </select>
            {errors.timeSlot && <p className="text-xs text-destructive">{errors.timeSlot}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">Additional Message (Optional)</Label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share any preferences or notes for your appointment."
              rows={4}
              className="min-h-[100px] w-full rounded-md border border-border bg-background/40 px-3.5 py-3 text-sm text-foreground placeholder:text-text-secondary outline-none transition-colors focus:border-primary/60 focus:ring-3 focus:ring-primary/25"
            />
          </div>

          {!session?.user && (
            <p className="text-sm text-destructive">You must sign in as a customer to book an appointment.</p>
          )}
          {submitError && <p className="text-sm text-destructive">{submitError}</p>}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || isInactive}
              className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}