"use client"

import * as React from "react"
import { CalendarDays, Clock, CreditCard, ReceiptText } from "lucide-react"
import { toast } from "react-toastify"
import { useSession } from "@/lib/auth-client"
import { authHeaders } from "@/lib/jwt"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Transaction = {
  _id: string
  userName?: string
  userEmail: string
  serviceName: string
  appointmentDate: string
  timeSlot: string
  price: number
  currency?: string
  stripeSessionId?: string
  paymentStatus: "Unpaid" | "Paid"
  paidAt?: string
  createdAt?: string
}

function formatDate(value?: string) {
  if (!value) return "N/A"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

function shortSessionId(value?: string) {
  if (!value) return "N/A"
  if (value.length <= 20) return value
  return `${value.slice(0, 12)}...${value.slice(-8)}`
}

function statusClass(status: string) {
  if (status === "Paid") return "bg-emerald-500/15 text-emerald-400"
  return "bg-zinc-500/15 text-zinc-300"
}

export default function AdminTransactionsPage() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const email = session?.user?.email
    if (!email) return
    let active = true

    const loadTransactions = async () => {
      try {
        const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL
        const headers = await authHeaders(email)
        const res = await fetch(`${baseurl}/appointments`, { cache: "no-store", headers })
        if (!res.ok) throw new Error("Failed to load transactions")
        const data = await res.json()
        const list = Array.isArray(data) ? (data as Transaction[]) : []
        const paidTransactions = list.filter(
          (item) => item.paymentStatus === "Paid" || !!item.stripeSessionId,
        )
        if (active) setTransactions(paidTransactions)
      } catch (error) {
        console.error("Failed to load transactions:", error)
        if (active) toast.error("Failed to load transactions")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadTransactions()
    return () => {
      active = false
    }
  }, [session?.user?.email])

  return (
    <div className="min-h-full w-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            Admin Dashboard
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Payment <span className="text-primary-light">Transactions</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Review payment records for customer appointments. Payment records cannot be manually changed to mark an unsuccessful payment as successful.
          </p>
        </div>

        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
          <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">Transaction Records</CardTitle>
            <CardDescription className="text-text-secondary">
              Stripe Checkout payment details for salon appointment transactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">Loading transactions...</div>
            ) : transactions.length === 0 ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">No payment transactions found.</div>
            ) : (
              <>
                <div className="space-y-4 p-4 md:hidden">
                  {transactions.map((tx) => (
                    <div key={tx._id} className="rounded-xl border border-border/70 bg-background/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{tx.userName || "Unknown"}</p>
                          <p className="truncate text-xs text-text-secondary">{tx.userEmail}</p>
                        </div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(tx.paymentStatus)}`}>
                          {tx.paymentStatus}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-text-secondary">Related Service</p>
                          <p className="font-medium text-foreground">{tx.serviceName}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Appointment Date</p>
                          <p className="inline-flex items-center gap-1.5 text-foreground"><CalendarDays className="size-3.5" />{tx.appointmentDate}</p>
                          <p className="inline-flex items-center gap-1.5 text-xs text-text-secondary"><Clock className="size-3.5" />{tx.timeSlot}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Payment Amount</p>
                          <p className="text-foreground">${tx.price} {tx.currency || "USD"}</p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Transaction Date</p>
                          <p className="text-foreground">{formatDate(tx.paidAt || tx.createdAt)}</p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-border/60 bg-background/30 p-3">
                        <p className="inline-flex items-center gap-1.5 text-xs text-text-secondary"><ReceiptText className="size-3.5" />Stripe Session ID</p>
                        <p className="mt-1 break-all font-mono text-xs text-foreground" title={tx.stripeSessionId || "N/A"}>
                          {shortSessionId(tx.stripeSessionId)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border/70 bg-background/30 text-text-secondary">
                      <tr>
                        <th className="px-6 py-4 font-medium sm:px-8">Customer</th>
                        <th className="px-4 py-4 font-medium">Related Service</th>
                        <th className="px-4 py-4 font-medium">Appointment Date</th>
                        <th className="px-4 py-4 font-medium">Amount</th>
                        <th className="px-4 py-4 font-medium">Stripe Session</th>
                        <th className="px-4 py-4 font-medium">Payment Status</th>
                        <th className="px-6 py-4 font-medium sm:px-8">Transaction Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx._id} className="border-b border-border/50 align-top last:border-b-0">
                          <td className="px-6 py-4 sm:px-8">
                            <p className="font-medium text-foreground">{tx.userName || "Unknown"}</p>
                            <p className="text-xs text-text-secondary">{tx.userEmail}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-medium text-foreground">{tx.serviceName}</p>
                          </td>
                          <td className="px-4 py-4 text-text-secondary">
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{tx.appointmentDate}</span>
                              <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" />{tx.timeSlot}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-foreground">
                            <p>${tx.price}</p>
                            <p className="text-xs text-text-secondary">{tx.currency || "USD"}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground" title={tx.stripeSessionId || "N/A"}>
                              <CreditCard className="size-3.5 text-text-secondary" />
                              {shortSessionId(tx.stripeSessionId)}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(tx.paymentStatus)}`}>
                              {tx.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-text-secondary sm:px-8">{formatDate(tx.paidAt || tx.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
