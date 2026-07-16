import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { unsealData } from "iron-session"
import {
  SESSION_COOKIE_NAME,
  getSessionPassword,
  type SessionData,
} from "@/lib/session-config"

const ALLOWED_ORIGINS = [
  'https://trustnetcomp.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
  ...(process.env.EXTRA_ALLOWED_ORIGINS?.split(',') ?? []),
]

function getCorsHeaders(origin: string) {
  const isAllowed = ALLOWED_ORIGINS.includes(origin)
  return {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...(isAllowed && { 'Access-Control-Allow-Origin': origin }),
  }
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || ''

  // Handle CORS preflight for API routes
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api')) {
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    })
  }

  // Attach CORS headers to all API responses
  if (request.nextUrl.pathname.startsWith('/api')) {
    const response = NextResponse.next()
    Object.entries(getCorsHeaders(origin)).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // --- existing auth logic below, unchanged ---

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
    pathname === "/live-capture" ||
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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|countries.json|job-titles.json).*)",
  ],
}