import { Suspense } from "react"
import { AppointmentDetailsClient } from "./appointment-details-client"

export default function AppointmentDetailsPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-text-secondary">Loading appointment...</div>}>
      <AppointmentDetailsClient />
    </Suspense>
  )
}
