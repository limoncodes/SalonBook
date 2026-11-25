import Link from "next/link"
import { Suspense } from "react"
import { Clock, Mail, MapPin, Phone, Scissors } from "lucide-react"
import { CopyrightYear } from "./footer-year"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.88 1.12a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2H21l-6.56 7.5L22.16 22h-6.04l-4.73-6.18L5.98 22H3.22l7.02-8.02L1.92 2h6.2l4.27 5.65L18.24 2Zm-2.12 17.97h1.67L7.21 3.92H5.42l10.7 16.05Z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.13C19.53 3.56 12 3.56 12 3.56s-7.53 0-9.39.51A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.13c1.86.51 9.39.51 9.39.51s7.53 0 9.39-.51a3 3 0 0 0 2.11-2.13A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.56 15.56V8.44L15.82 12l-6.26 3.56Z" />
    </svg>
  )
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Create Account" },
]

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
  { href: "https://instagram.com", label: "Instagram", icon: InstagramIcon },
  { href: "https://x.com", label: "X", icon: XIcon },
  { href: "https://youtube.com", label: "YouTube", icon: YoutubeIcon },
]

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
          <div className="sm:col-span-2 xl:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/12 text-primary-light transition-colors group-hover:bg-primary/20">
                <Scissors className="size-[18px]" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Salon<span className="text-primary-light">Book</span>
                </span>
                <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-secondary">
                  Beauty Studio
                </span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-text-secondary">
              SalonBook makes it easy to discover premium salon services, explore trusted
              professionals, and book appointments online with confidence.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-border/70 bg-background/30 text-text-secondary transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
                  >
                    <Icon className="size-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-primary-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 space-y-4 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary-light" />
                <div>
                  <p className="text-foreground">+1 (555) 123-4567</p>
                  <p className="text-xs">Call us for booking support</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary-light" />
                <div>
                  <a href="mailto:hello@salonbook.com" className="text-foreground transition-colors hover:text-primary-light">
                    hello@salonbook.com
                  </a>
                  <p className="text-xs">We reply within 24 hours</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary-light" />
                <div>
                  <p className="text-foreground">123 Beauty Avenue, Suite 12</p>
                  <p className="text-xs">New York, NY 10001</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">Opening Hours</h3>
            <ul className="mt-4 space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary-light" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-6">
                    <span>Mon - Fri</span>
                    <span className="text-foreground">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span>Saturday</span>
                    <span className="text-foreground">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span>Sunday</span>
                    <span className="text-foreground">Closed</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-text-secondary sm:flex-row">
          <p>
            ©{" "}
            <Suspense fallback="2026">
              <CopyrightYear />
            </Suspense>{" "}
            SalonBook. All rights reserved.
          </p>
          <p className="text-center sm:text-right">Premium salon booking, made simple.</p>
        </div>
      </div>
    </footer>
  )
}
