import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const baseRedirect = searchParams.get("redirect") ?? "/login"
  const redirectTo = baseRedirect === "/login" ? "/login?session_expired=1" : baseRedirect
  const url = new URL(redirectTo, request.url)
  const session = await getSession()
  session.destroy()
  return NextResponse.redirect(url)
}
