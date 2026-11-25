import { CalendarCheck, Search, Sparkles, Star } from "lucide-react"

const steps = [
  {
    title: "Browse Services",
    description: "Explore active salon services, compare prices, and find the right treatment for you.",
    icon: Search,
  },
  {
    title: "Book Appointment",
    description: "Choose your preferred date and time slot, then submit your appointment request in minutes.",
    icon: CalendarCheck,
  },
  {
    title: "Get Styled",
    description: "Visit the salon at your scheduled time and enjoy a premium beauty experience.",
    icon: Sparkles,
  },
  {
    title: "Pay Securely",
    description: "After confirmation, complete your payment securely with Stripe Checkout.",
    icon: Star,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
            How It Works
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Book in <span className="text-primary-light">Simple Steps</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
            From discovering services to secure payment, SalonBook makes your salon experience smooth and effortless.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border/70 bg-surface/40 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary-light">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-heading text-3xl font-semibold text-primary/25">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}