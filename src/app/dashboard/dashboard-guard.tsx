"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { authClient, useSession } from "@/lib/auth-client"

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  React.useEffect(() => {
    const user = session?.user as { banned?: boolean } | undefined
    if (isPending) return
    if (user?.banned) {
      toast.error("Your account has been blocked. Please contact support.")
      void authClient.signOut().finally(() => {
        router.replace("/sign-in")
        router.refresh()
      })
    }
  }, [isPending, router, session?.user])

  const banned = (session?.user as { banned?: boolean } | undefined)?.banned
  if (!isPending && banned) {
    return <div className="px-6 py-10 text-text-secondary">Your account is blocked.</div>
  }

  return <>{children}</>
}
