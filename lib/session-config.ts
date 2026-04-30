export interface SessionData {
  accessToken: string
}

export const SESSION_COOKIE_NAME = "compliance_dashboard_session"
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
