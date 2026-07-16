import axios from "axios"
import { ACCESS_TOKEN_COOKIE_NAME, BASE_URL } from "./constants/variables"
import type { ApiValidationErrorBody } from "@/lib/types/response"

// Browser uses same-origin /api/* so Next rewrites can proxy — avoids CORS (API Allow-Origin ≠ localhost).
const computedBaseURL = typeof window === "undefined" ? BASE_URL : ""

export const api = axios.create({
  baseURL: computedBaseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: attach Bearer token from localStorage (like binit-admin)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(ACCESS_TOKEN_COOKIE_NAME);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const SESSION_EXPIRED_PAGE = "/auth/session-expired";

// Response interceptor: on 401 (e.g. expired token) clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status !== 401) return Promise.reject(error);

    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_COOKIE_NAME)
      window.location.href = "/auth/session-expired"
      return Promise.reject(error);
    }

    // Redirect to a page that does a full navigation to clear-session so the browser
    // applies Set-Cookie (client-side redirect from server action may not).
    const { redirect } = require("next/navigation");
    redirect(SESSION_EXPIRED_PAGE);
    return Promise.reject(error);
  }
);

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.debug("[api] baseURL:", api.defaults.baseURL || "(relative)");
}

export function getApiErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null
  const err = error as {
    response?: { data?: unknown; status?: number; statusText?: string }
    message?: string
  }

  const status = err.response?.status
  const data = err.response?.data

  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    const d = data as Record<string, unknown>
    if (typeof d.message === "string") return d.message
    if (typeof d.error === "string") return d.error
    const errorObj = d.error
    if (errorObj && typeof errorObj === "object" && !Array.isArray(errorObj)) {
      const e = errorObj as ApiValidationErrorBody
      const messages: string[] = []
      if (Array.isArray(e.formErrors)) {
        e.formErrors.forEach((m) => typeof m === "string" && messages.push(m))
      }
      if (e.fieldErrors && typeof e.fieldErrors === "object") {
        Object.values(e.fieldErrors).forEach((arr) => {
          if (Array.isArray(arr)) arr.forEach((m) => typeof m === "string" && messages.push(m))
        })
      }
      if (messages.length > 0) return messages.join(" • ")
    }
    if (Array.isArray(d.errors) && d.errors.length > 0) {
      const first = d.errors[0]
      if (typeof first === "string") return first
      if (
        first &&
        typeof first === "object" &&
        typeof (first as { message?: string }).message === "string"
      )
        return (first as { message: string }).message
    }
    if (d.errors && typeof d.errors === "object" && !Array.isArray(d.errors)) {
      const entries = Object.values(d.errors as Record<string, unknown>)
      const firstMsg = entries.flat().find((v) => typeof v === "string")
      if (typeof firstMsg === "string") return firstMsg
    }
  }

  if (typeof status === "number") {
    const suffix = typeof err.response?.statusText === "string" ? err.response.statusText : ""
    if (suffix.trim()) return `${status} ${suffix}`.trim()
    return status === 404 ? "Not found (404)." : `Request failed (${status}).`
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return null
}

export default api
