import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/constants/variables";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has(ACCESS_TOKEN_COOKIE_NAME);
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register" ||
    request.nextUrl.pathname === "/forgot-password";

  // // If the user is not logged in and trying to access a protected page
  // if (!isLoggedIn && !isAuthPage) {
  //     return NextResponse.redirect(new URL("/login", request.url))
  // }
  //
  // // If the user is logged in and trying to access an (auth) page
  // if (isLoggedIn && isAuthPage) {
  //     return NextResponse.redirect(new URL("/", request.url))
  // }

  return NextResponse.next();
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
