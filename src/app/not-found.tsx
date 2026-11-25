import Link from "next/link"
import { ArrowRight, Home, Scissors, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(167,139,250,0.08),transparent_30%)]" />
      <div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-primary-light/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl text-center">
        <div className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/12 text-primary-light shadow-[0_0_40px_rgba(139,92,246,0.16)]">
          <SearchX className="size-8" />
        </div>

        <p className="mt-8 font-heading text-7xl font-semibold tracking-tight text-primary-light/30 sm:text-8xl lg:text-9xl">
          404
        </p>

        <p className="mt-2 inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
          Page Not Found
        </p>

        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          This page got a little <span className="text-primary-light">off style</span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
          The page you’re looking for doesn’t exist or may have been moved. Let’s get you back to discovering beautiful salon services.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            className="h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-light hover:text-[#08090d]"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <Home className="size-4" data-icon="inline-start" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-lg border-border bg-surface/30 px-6 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
            nativeButton={false}
            render={<Link href="/services" />}
          >
            <Scissors className="size-4" data-icon="inline-start" />
            Browse Services
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
}