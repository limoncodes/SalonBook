"use client"

import * as React from "react"
import { CreditCard, ShieldCheck } from "lucide-react"
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
  const [open, setOpen] = React.useState(false)

  const handlePayment = async () => {
    // TODO: Add your Stripe payment setup here.
    // You have access to appointmentId, serviceName, and amount.
    console.log("Stripe payment setup pending:", { appointmentId, serviceName, amount })
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

          <div className="rounded-xl border border-border/70 bg-background/30 p-4">
            <p className="text-sm text-text-secondary">Appointment ID</p>
            <p className="mt-1 break-all text-sm font-medium text-foreground">{appointmentId}</p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-text-secondary">
            <ShieldCheck className="size-4 text-emerald-400" />
            Payment will be processed securely with Stripe.
          </div>

          {/* TODO: Add your Stripe Elements / Checkout integration here. */}
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
            onClick={handlePayment}
          >
            <CreditCard className="size-4" />
            Pay ${amount} with Stripe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}