// Expose variables safely to both server and client.
// For client-side usage, prefer NEXT_PUBLIC_* vars.

/** Use https for non-local http bases so CORS preflight is not redirected (e.g. Vercel → https). */
function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""
  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.toLowerCase()
    const keepHttp =
      host === "localhost" || host === "127.0.0.1" || host === "[::1]"
    if (parsed.protocol === "http:" && !keepHttp) {
      parsed.protocol = "https:"
    }
    const pathSuffix = parsed.pathname === "/" ? "" : parsed.pathname
    return `${parsed.origin}${pathSuffix}`.replace(/\/+$/, "")
  } catch {
    return trimmed.replace(/\/+$/, "")
  }
}

export const BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "",
)

export const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY ||
  process.env.API_KEY ||
  "";

export const NODE_ENV = process.env.NODE_ENV || "development";

/** Cookie name for the access token (used by middleware and auth). */
export const ACCESS_TOKEN_COOKIE_NAME = "access_token";

/** localStorage key for auth session (user, memberships, etc.) – no tokens. */
export const AUTH_SESSION_STORAGE_KEY = "auth-session";

/** localStorage key for the currently selected company (full CompanyI). */
export const ACTIVE_COMPANY_STORAGE_KEY = "active-company";

