import { Suspense } from "react"
import { PaymentSuccessClient } from "./success-client"

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="px-6 py-16 text-center text-text-secondary">Loading payment status...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  )
}
