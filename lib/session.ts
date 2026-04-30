import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import {
  SESSION_COOKIE_NAME,
  getSessionPassword,
  type SessionData,
} from "./session-config"

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

export { SESSION_COOKIE_NAME, getSessionPassword }
export type { SessionData }
