"use client"

import * as React from "react"
import { CreditCard, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "react-toastify"
import { useSession } from "@/lib/auth-client"
import { authHeaders } from "@/lib/jwt"
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

type PaymentButtonProps = {
  appointmentId: string
  serviceName: string
  amount: number
  disabled?: boolean
}

export function PaymentButton({
  appointmentId,
  serviceName,
  amount,
  disabled,
}: PaymentButtonProps) {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handlePayment = async () => {
    if (!session?.user?.email) {
      toast.error("Please sign in to make a payment")
      return
    }

    setIsLoading(true)
    try {
      const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const headers = await authHeaders(session.user.email)
      const res = await fetch(`${baseurl}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          appointmentId,
          userEmail: session.user.email,
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.url) {
        const message = data?.error
          ? `${data.message || "Failed to start payment"}: ${data.error}`
          : data?.message || "Failed to start payment"
        throw new Error(message)
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Payment error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to start payment")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border bg-background/30 text-emerald-400 hover:text-emerald-300"
            disabled={disabled}
          />
        }
      >
        <CreditCard className="size-3.5" />
        Pay
      </DialogTrigger>

      <DialogContent className="border-border/80 bg-surface text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">Complete Payment</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Secure payment for your confirmed appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/70 bg-background/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-text-secondary">Service</p>
                <p className="mt-1 font-medium text-foreground">{serviceName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">Amount</p>
                <p className="mt-1 font-heading text-2xl font-semibold text-primary-light">${amount}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-text-secondary">
            <ShieldCheck className="size-4 text-emerald-400" />
            You will be redirected to Stripe to complete your payment securely.
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            disabled={isLoading}
            className="h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
            onClick={handlePayment}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
            {isLoading ? "Redirecting..." : `Pay $${amount} with Stripe`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
