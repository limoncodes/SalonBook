export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background px-4 py-16">
      <div className="relative flex flex-col items-center text-center">
        <div className="absolute -inset-10 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mb-8 flex size-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-primary/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary-light border-r-primary/60 [animation-duration:1.1s]" />
          <div className="absolute inset-2 animate-spin rounded-full border border-transparent border-b-primary/40 [animation-duration:1.8s] [animation-direction:reverse]" />
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary-light shadow-[0_0_30px_rgba(139,92,246,0.18)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
        </div>

        <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light">
          SalonBook
        </p>
        <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Preparing your <span className="text-primary-light">experience</span>
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary sm:text-base">
          Please wait a moment while we load the latest salon services and content.
        </p>

        <div className="mt-8 flex items-center gap-2" aria-hidden="true">
          <span className="size-2 animate-bounce rounded-full bg-primary-light [animation-delay:-0.2s]" />
          <span className="size-2 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.1s]" />
          <span className="size-2 animate-bounce rounded-full bg-primary/45" />
        </div>
      </div>
    </div>
  )
}