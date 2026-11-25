import Link from "next/link"
import {
  ArrowRight,
  Flower2,
  Hand,
  Palette,
  Scissors,
  Sparkles,
  SprayCan,
  UserRound,
} from "lucide-react"

const categories = [
  {
    name: "Haircut & Styling",
    description: "Precision cuts and modern styles tailored to your look.",
    icon: Scissors,
  },
  {
    name: "Hair Coloring",
    description: "Rich color, highlights, and balayage by expert colorists.",
    icon: Palette,
  },
  {
    name: "Hair Treatment",
    description: "Repair, nourish, and restore healthy shine to your hair.",
    icon: SprayCan,
  },
  {
    name: "Facial & Skincare",
    description: "Refreshing facials and skincare treatments for glowing skin.",
    icon: Sparkles,
  },
  {
    name: "Makeup",
    description: "Professional makeup for events, weddings, and everyday glam.",
    icon: UserRound,
  },
  {
    name: "Manicure & Pedicure",
    description: "Clean, polished nail care with relaxing hand and foot treatment.",
    icon: Hand,
  },
  {
    name: "Spa & Massage",
    description: "Relaxing spa therapies to unwind your body and mind.",
    icon: Flower2,
  },
]

export function ServiceCategories() {
  return (
    <section className="border-y border-border/60 bg-surface/20 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            Service Categories
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore by <span className="text-primary-light">Category</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
            Find the perfect salon service for your needs. Browse categories and discover treatments you’ll love.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href="/services"
                className="group rounded-2xl border border-border/70 bg-background/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/5"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary-light transition-colors group-hover:bg-primary/20">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{category.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-light">
                  Explore
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}