import { getaddServices } from "@/components/api/get"
import { ServicesClient } from "./services-client"

export const instant = false

const ServicePage = async () => {
  const services = await getaddServices()

  return <ServicesClient initialServices={Array.isArray(services) ? services : []} />
}

export default ServicePage