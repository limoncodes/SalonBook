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

export const AddServices = async (
  formData: AddServicePayload,
): Promise<AddServiceResponse> => {
  const res = await fetch(`${baseurl}/Add-Services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })

  if (!res.ok) {
    throw new Error("Failed to add service")
  }

  return res.json() as Promise<AddServiceResponse>
}

