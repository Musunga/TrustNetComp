import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
  accessToken: string
}

const SESSION_COOKIE_NAME = "compliance_dashboard_session"
const DEFAULT_PASSWORD =
  "at-least-32-characters-long-secret-for-dev-only-change-in-production"

export function getSessionPassword(): string {
  const p = process.env.IRON_SESSION_PASSWORD ?? process.env.SESSION_PASSWORD
  if (p && p.length >= 32) return p
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "IRON_SESSION_PASSWORD or SESSION_PASSWORD (32+ chars) is required in production"
    )
  }
  return DEFAULT_PASSWORD
}

function getSessionOptions() {
  return {
    password: getSessionPassword(),
    cookieName: SESSION_COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    },
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, getSessionOptions())
}

export { SESSION_COOKIE_NAME }
