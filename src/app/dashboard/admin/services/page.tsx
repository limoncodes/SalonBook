"use client"

import * as React from "react"
import Link from "next/link"
import { Pencil, PlusCircle, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import { getaddServices, type ServiceItem } from "@/components/api/get"
import { deleteService, updateService } from "@/components/api/post"
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

export default function ManageServicesPage() {
  const [services, setServices] = React.useState<ServiceItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [serviceToDelete, setServiceToDelete] = React.useState<ServiceItem | null>(null)

  React.useEffect(() => {
    let active = true

    const loadServices = async () => {
      try {
        const data = await getaddServices()
        if (active) setServices(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load services:", error)
        if (active) toast.error("Failed to load services")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadServices()
    return () => {
      active = false
    }
  }, [])

  const handleDelete = async () => {
    if (!serviceToDelete) return

    const id = serviceToDelete._id
    setBusyId(id)
    try {
      await deleteService(id)
      setServices((prev) => prev.filter((service) => service._id !== id))
      toast.success("Service deleted successfully")
      setServiceToDelete(null)
    } catch (error) {
      console.error("Failed to delete service:", error)
      toast.error("Failed to delete service")
    } finally {
      setBusyId(null)
    }
  }

  const handleToggleStatus = async (service: ServiceItem) => {
    const nextStatus = service.serviceStatus === "Active" ? "Inactive" : "Active"
    setBusyId(service._id)
    try {
      await updateService(service._id, { serviceStatus: nextStatus })
      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id ? { ...item, serviceStatus: nextStatus } : item,
        ),
      )
      toast.success(`Service ${nextStatus === "Active" ? "activated" : "deactivated"}`)
    } catch (error) {
      console.error("Failed to update service status:", error)
      toast.error("Failed to update service status")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-full w-full bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
              Admin Dashboard
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Manage <span className="text-primary-light">Services</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
              View, add, update, delete, and control service availability for SalonBook.
            </p>
          </div>

          <Button
            render={<Link href="/dashboard/admin/Add-Services" />}
            nativeButton={false}
            className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
          >
            <PlusCircle className="size-4" />
            Add New Service
          </Button>
        </div>

        <Card className="border-border/80 bg-surface/50 py-0 shadow-[0_16px_50px_rgba(0,0,0,0.22)]">
          <CardHeader className="border-b border-border/70 px-6 py-6 sm:px-8">
            <CardTitle className="font-heading text-2xl font-semibold text-foreground">
              All Services
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-text-secondary">
              Only active services are visible on the public Browse Services page.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="px-6 py-16 text-center text-text-secondary sm:px-8">No services found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border/70 bg-background/30 text-text-secondary">
                    <tr>
                      <th className="px-6 py-4 font-medium sm:px-8">Service</th>
                      <th className="px-4 py-4 font-medium">Category</th>
                      <th className="px-4 py-4 font-medium">Price</th>
                      <th className="px-4 py-4 font-medium">Duration</th>
                      <th className="px-4 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 text-right font-medium sm:px-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => {
                      const isBusy = busyId === service._id
                      return (
                        <tr key={service._id} className="border-b border-border/50 last:border-b-0">
                          <td className="px-6 py-4 sm:px-8">
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={service.serviceImage}
                                alt={service.serviceName}
                                className="size-12 rounded-lg object-cover"
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">{service.serviceName}</p>
                                <p className="max-w-xs truncate text-xs text-text-secondary">
                                  {service.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-text-secondary">{service.serviceCategory}</td>
                          <td className="px-4 py-4 text-foreground">${service.price}</td>
                          <td className="px-4 py-4 text-text-secondary">{service.duration} min</td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                service.serviceStatus === "Active"
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : "bg-zinc-500/15 text-zinc-300"
                              }`}
                            >
                              {service.serviceStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 sm:px-8">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-border bg-background/30 text-foreground hover:bg-primary/10 hover:text-primary-light"
                                disabled={isBusy}
                                onClick={() => handleToggleStatus(service)}
                              >
                                {service.serviceStatus === "Active" ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                render={<Link href={`/dashboard/admin/Add-Services?id=${service._id}`} />}
                                nativeButton={false}
                                className="border-border bg-background/30 text-foreground hover:bg-primary/10 hover:text-primary-light"
                                aria-label="Edit service"
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-border bg-background/30 text-destructive hover:bg-destructive/10"
                                disabled={isBusy}
                                onClick={() => setServiceToDelete(service)}
                                aria-label="Delete service"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog
          open={!!serviceToDelete}
          onOpenChange={(open) => {
            if (!open) setServiceToDelete(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete service?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{" "}
                <span className="font-medium text-foreground">
                  {serviceToDelete?.serviceName}
                </span>
                . This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!busyId}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={!!busyId}
                onClick={handleDelete}
              >
                {busyId ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}