import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { unsealData } from "iron-session"
import {
  SESSION_COOKIE_NAME,
  getSessionPassword,
} from "@/lib/session"
import type { SessionData } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const seal = request.cookies.get(SESSION_COOKIE_NAME)?.value
  let isLoggedIn = false
  if (seal) {
    try {
      const data = await unsealData<SessionData>(seal, {
        password: getSessionPassword(),
      })
      isLoggedIn = !!(data?.accessToken)
    } catch {
      isLoggedIn = false
    }
  }

  const { pathname } = request.nextUrl
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/"
  const isPublicPage = isAuthPage || pathname.startsWith("/invited")

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
