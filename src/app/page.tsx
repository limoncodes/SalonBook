import { getaddServices } from "@/components/api/get"
import { Banner } from "@/components/home/banner"
import { FeaturedServices } from "@/components/home/featured-services"
import { HowItWorks } from "@/components/home/how-it-works"
import { ServiceCategories } from "@/components/home/service-categories"

export const instant = false

export default async function Home() {
  let services: Awaited<ReturnType<typeof getaddServices>> = []
  try {
    services = await getaddServices({ status: "Active" })
  } catch {
    services = []
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <Banner />
      <FeaturedServices services={Array.isArray(services) ? services : []} />
      <ServiceCategories />
      <HowItWorks />
    </div>
  )
}
