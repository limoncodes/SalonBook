const baseurl = process.env.NEXT_PUBLIC_SERVER_BASE_URL

export type ServiceItem = {
  _id: string
  serviceName: string
  serviceCategory: string
  description: string
  price: number
  duration: number
  serviceStatus: "Active" | "Inactive"
  serviceImage: string
}

export type ServiceQuery = {
  search?: string
  category?: string
  sort?: string
  status?: string
}

export const getaddServices = async (
  query: ServiceQuery = {},
): Promise<ServiceItem[]> => {
  const params = new URLSearchParams()

  if (query.search?.trim()) params.set("search", query.search.trim())
  if (query.category && query.category !== "All") {
    params.set("category", query.category)
  }
  if (query.sort && query.sort !== "default") params.set("sort", query.sort)
  if (query.status && query.status !== "All") params.set("status", query.status)

  const queryString = params.toString()
  const url = `${baseurl}/addServices${queryString ? `?${queryString}` : ""}`

  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch services")
  }

  const data: ServiceItem[] = await res.json()
  return data
}

export const getServiceById = async (id: string): Promise<ServiceItem> => {
  const res = await fetch(`${baseurl}/addServices/${id}`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Failed to fetch service")
  }

  const data: ServiceItem = await res.json()
  return data
}