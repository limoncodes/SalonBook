"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function PaymentSuccessClient() {
  const searchParams = useSearchParams()
  const { data: session, isPending } = useSession()
  const [verification, setVerification] = React.useState<{
    status: "loading" | "success" | "error"
    message: string
  }>({ status: "loading", message: "Verifying your payment..." })
  const hasVerified = React.useRef(false)

  const sessionId = searchParams.get("session_id")
  const appointmentId = searchParams.get("appointmentId")
  const userEmail = session?.user?.email

  React.useEffect(() => {
    if (isPending || hasVerified.current) return
    if (!sessionId || !appointmentId || !userEmail) return

    hasVerified.current = true
    const verify = async () => {
      try {
        const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
        const res = await fetch(`${baseurl}/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, appointmentId, userEmail }),
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          throw new Error(data?.message || "Payment verification failed")
        }
        setVerification({
          status: "success",
          message: "Your payment was successful and your appointment is now marked as paid.",
        })
      } catch (error) {
        setVerification({
          status: "error",
          message: error instanceof Error ? error.message : "Payment verification failed",
        })
      }
    }

    void verify()
  }, [appointmentId, isPending, sessionId, userEmail])

  const status =
    !sessionId || !appointmentId
      ? "error"
      : !isPending && !userEmail
        ? "error"
        : verification.status
  const message =
    !sessionId || !appointmentId
      ? "Missing payment information."
      : !isPending && !userEmail
        ? "Please sign in to verify your payment."
        : verification.message

  return (
    <div className="min-h-full bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
          <CardContent className="px-6 py-12 text-center sm:px-8">
            {status === "loading" && <Loader2 className="mx-auto size-12 animate-spin text-primary-light" />}
            {status === "success" && <CheckCircle2 className="mx-auto size-12 text-emerald-400" />}
            {status === "error" && <XCircle className="mx-auto size-12 text-destructive" />}

            <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
              {status === "loading" ? "Verifying Payment" : status === "success" ? "Payment Successful" : "Payment Verification Failed"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">{message}</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button render={<Link href="/dashboard/user/appointments" />} nativeButton={false} className="bg-primary text-primary-foreground hover:bg-primary-light">
                Go to My Appointments
              </Button>
              <Button variant="outline" render={<Link href="/services" />} nativeButton={false} className="border-border bg-background/30">
                Browse Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
