import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  if (sessionCookie) {
    return NextResponse.next()
  }

  const signInUrl = new URL("/sign-in", request.url)
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:path+"],
}