import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-full bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
          <CardContent className="px-6 py-12 text-center sm:px-8">
            <XCircle className="mx-auto size-12 text-amber-400" />
            <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">Payment Cancelled</h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
              Your payment was cancelled. No charges were made. You can try again from your appointments page.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button render={<Link href="/dashboard/user/appointments" />} nativeButton={false} className="bg-primary text-primary-foreground hover:bg-primary-light">
                Back to My Appointments
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
