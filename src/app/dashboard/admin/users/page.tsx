"use client"

import * as React from "react"
import { Ban, CheckCircle2, Eye, ShieldCheck, UserX } from "lucide-react"
import { toast } from "react-toastify"
import { authClient, useSession } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ManagedUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  banned?: boolean | null
  banReason?: string | null
  banExpires?: string | Date | null
  createdAt?: string | Date | null
}

function formatDate(value?: string | Date | null) {
  if (!value) return "N/A"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "N/A"
  return date.toLocaleString()
}

function initials(name?: string | null) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  )
}

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = React.useState<ManagedUser[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [selectedUser, setSelectedUser] = React.useState<ManagedUser | null>(null)
  const [blockTarget, setBlockTarget] = React.useState<ManagedUser | null>(null)
  const [unblockTarget, setUnblockTarget] = React.useState<ManagedUser | null>(null)

  React.useEffect(() => {
    let active = true
    const loadUsers = async () => {
      try {
        const { data, error } = await authClient.admin.listUsers({
          query: {
            limit: 100,
          },
        })
        if (error) throw new Error(error.message || "Failed to load users")
        const list = (data?.users || []) as ManagedUser[]
        if (active) setUsers(list)
      } catch (error) {
        console.error("Failed to load users:", error)
        if (active) toast.error(error instanceof Error ? error.message : "Failed to load users")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadUsers()
    return () => {
      active = false
    }
  }, [])

  const handleBlock = async () => {
    if (!blockTarget) return
    setBusyId(blockTarget.id)
    try {
      const { error } = await authClient.admin.banUser({
        userId: blockTarget.id,
        banReason: "Blocked by admin",
      })
      if (error) throw new Error(error.message || "Failed to block user")
      setUsers((prev) => prev.map((user) => (user.id === blockTarget.id ? { ...user, banned: true, banReason: "Blocked by admin" } : user)))
      toast.success("User blocked successfully")
      setBlockTarget(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to block user")
    } finally {
      setBusyId(null)
    }
  }

  const handleUnblock = async () => {
    if (!unblockTarget) return
    setBusyId(unblockTarget.id)
    try {
      const { error } = await authClient.admin.unbanUser({
        userId: unblockTarget.id,
      })
      if (error) throw new Error(error.message || "Failed to unblock user")
      setUsers((prev) => prev.map((user) => (user.id === unblockTarget.id ? { ...user, banned: false, banReason: null, banExpires: null } : user)))
      toast.success("User unblocked successfully")
      setUnblockTarget(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unblock user")
    } finally {
      setBusyId(null)
    }
  }

  const currentUserId = session?.user?.id

  return (
    <div className="min-h-full w-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            Admin Dashboard
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Manage <span className="text-primary-light">Users</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            View registered customers, inspect user details, and block or unblock access.
          </p>
        </div>

        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
          <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">All Registered Users</CardTitle>
            <CardDescription className="text-text-secondary">Blocked users should not be able to access protected platform features.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">No users found.</div>
            ) : (
              <>
                <div className="space-y-4 p-4 md:hidden">
                  {users.map((user) => {
                    const isBusy = busyId === user.id
                    const isSelf = currentUserId === user.id
                    const banned = !!user.banned
                    return (
                      <div key={user.id} className="rounded-xl border border-border/70 bg-background/20 p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-11 border border-border/70">
                            {user.image ? <AvatarImage src={user.image} alt={user.name || "User"} /> : null}
                            <AvatarFallback className="bg-primary/15 text-primary-light">{initials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-foreground">{user.name || "Unknown"}</p>
                            <p className="truncate text-xs text-text-secondary">{user.email}</p>
                          </div>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${banned ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"}`}>
                            {banned ? "Blocked" : "Active"}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div><p className="text-text-secondary">Role</p><p className="text-foreground capitalize">{user.role || "user"}</p></div>
                          <div><p className="text-text-secondary">Joined</p><p className="text-foreground">{formatDate(user.createdAt)}</p></div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="h-8 border-border bg-background/30" onClick={() => setSelectedUser(user)}>
                            <Eye className="size-3.5" /> Details
                          </Button>
                          {!banned ? (
                            <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-destructive hover:bg-destructive/10" disabled={isBusy || isSelf} onClick={() => setBlockTarget(user)}>
                              <Ban className="size-3.5" /> Block
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-emerald-400 hover:text-emerald-300" disabled={isBusy} onClick={() => setUnblockTarget(user)}>
                              <CheckCircle2 className="size-3.5" /> Unblock
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border/70 bg-background/30 text-text-secondary">
                      <tr>
                        <th className="px-6 py-4 font-medium sm:px-8">User</th>
                        <th className="px-4 py-4 font-medium">Role</th>
                        <th className="px-4 py-4 font-medium">Status</th>
                        <th className="px-4 py-4 font-medium">Joined</th>
                        <th className="px-6 py-4 text-right font-medium sm:px-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => {
                        const isBusy = busyId === user.id
                        const isSelf = currentUserId === user.id
                        const banned = !!user.banned
                        return (
                          <tr key={user.id} className="border-b border-border/50 last:border-b-0">
                            <td className="px-6 py-4 sm:px-8">
                              <div className="flex items-center gap-3">
                                <Avatar className="size-10 border border-border/70">
                                  {user.image ? <AvatarImage src={user.image} alt={user.name || "User"} /> : null}
                                  <AvatarFallback className="bg-primary/15 text-primary-light">{initials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-medium text-foreground">{user.name || "Unknown"}</p>
                                  <p className="truncate text-xs text-text-secondary">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-text-secondary capitalize">{user.role || "user"}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${banned ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"}`}>
                                {banned ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-text-secondary">{formatDate(user.createdAt)}</td>
                            <td className="px-6 py-4 sm:px-8">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8 border-border bg-background/30" onClick={() => setSelectedUser(user)}>
                                  <Eye className="size-3.5" /> Details
                                </Button>
                                {!banned ? (
                                  <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-destructive hover:bg-destructive/10" disabled={isBusy || isSelf} onClick={() => setBlockTarget(user)}>
                                    <Ban className="size-3.5" /> Block
                                  </Button>
                                ) : (
                                  <Button variant="outline" size="sm" className="h-8 border-border bg-background/30 text-emerald-400 hover:text-emerald-300" disabled={isBusy} onClick={() => setUnblockTarget(user)}>
                                    <CheckCircle2 className="size-3.5" /> Unblock
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="border-border/80 bg-surface text-foreground sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl text-foreground">User Details</DialogTitle>
              <DialogDescription className="text-text-secondary">Registered customer information.</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-14 border border-border/70">
                    {selectedUser.image ? <AvatarImage src={selectedUser.image} alt={selectedUser.name || "User"} /> : null}
                    <AvatarFallback className="bg-primary/15 text-primary-light">{initials(selectedUser.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{selectedUser.name || "Unknown"}</p>
                    <p className="text-sm text-text-secondary">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border/70 bg-background/30 p-3"><p className="text-text-secondary">Role</p><p className="mt-1 capitalize text-foreground">{selectedUser.role || "user"}</p></div>
                  <div className="rounded-lg border border-border/70 bg-background/30 p-3"><p className="text-text-secondary">Status</p><p className="mt-1 text-foreground">{selectedUser.banned ? "Blocked" : "Active"}</p></div>
                  <div className="rounded-lg border border-border/70 bg-background/30 p-3"><p className="text-text-secondary">Joined</p><p className="mt-1 text-foreground">{formatDate(selectedUser.createdAt)}</p></div>
                  <div className="rounded-lg border border-border/70 bg-background/30 p-3"><p className="text-text-secondary">User ID</p><p className="mt-1 break-all text-foreground">{selectedUser.id}</p></div>
                </div>
                {selectedUser.banned && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
                    <p className="inline-flex items-center gap-2 font-medium"><UserX className="size-4" />Blocked</p>
                    {selectedUser.banReason && <p className="mt-1 text-red-200/80">{selectedUser.banReason}</p>}
                  </div>
                )}
                {!selectedUser.banned && (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-300">
                    <p className="inline-flex items-center gap-2 font-medium"><ShieldCheck className="size-4" />Active account</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Block user?</AlertDialogTitle>
              <AlertDialogDescription>
                This will block <span className="font-medium text-foreground">{blockTarget?.name || blockTarget?.email}</span>. Blocked users must not be able to access protected platform features.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!busyId}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" disabled={!!busyId} onClick={handleBlock}>
                {busyId ? "Blocking..." : "Block User"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!unblockTarget} onOpenChange={(open) => !open && setUnblockTarget(null)}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Unblock user?</AlertDialogTitle>
              <AlertDialogDescription>
                This will restore access for <span className="font-medium text-foreground">{unblockTarget?.name || unblockTarget?.email}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!busyId}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary-light" disabled={!!busyId} onClick={handleUnblock}>
                {busyId ? "Unblocking..." : "Unblock User"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
