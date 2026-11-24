import { Suspense } from "react"
import { AdminAppointmentDetailsClient } from "./appointment-details-client"

export default function AdminAppointmentDetailsPage() {
  return (
    <Suspense fallback={<div className="px-6 py-10 text-text-secondary">Loading appointment...</div>}>
      <AdminAppointmentDetailsClient />
    </Suspense>
  )
}
