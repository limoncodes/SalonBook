import { authHeaders } from "@/lib/jwt"

const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL

export type AddServicePayload = {
  serviceName: string
  serviceCategory: string
  description: string
  price: number
  duration: number
  serviceStatus: "Active" | "Inactive"
  serviceImage: string
}

export type AddServiceResponse = {
  acknowledged: boolean
  insertedId: string
}

export type UpdateServicePayload = Partial<AddServicePayload>

export type ServiceMutationResponse = {
  acknowledged: boolean
  modifiedCount?: number
  matchedCount?: number
  deletedCount?: number
}

export const AddServices = async (
  formData: AddServicePayload,
  email: string,
): Promise<AddServiceResponse> => {
  const headers = await authHeaders(email)
  const res = await fetch(`${baseurl}/Add-Services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(formData),
  })

  if (!res.ok) {
    throw new Error("Failed to add service")
  }

  return res.json() as Promise<AddServiceResponse>
}

export const updateService = async (
  id: string,
  formData: UpdateServicePayload,
  email: string,
): Promise<ServiceMutationResponse> => {
  const headers = await authHeaders(email)
  const res = await fetch(`${baseurl}/addServices/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(formData),
  })

  if (!res.ok) {
    throw new Error("Failed to update service")
  }

  return res.json() as Promise<ServiceMutationResponse>
}

export const deleteService = async (
  id: string,
  email: string,
): Promise<ServiceMutationResponse> => {
  const headers = await authHeaders(email)
  const res = await fetch(`${baseurl}/addServices/${id}`, {
    method: "DELETE",
    headers,
  })

  if (!res.ok) {
    throw new Error("Failed to delete service")
  }

  return res.json() as Promise<ServiceMutationResponse>
}

