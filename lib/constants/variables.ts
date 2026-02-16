// Expose variables safely to both server and client.
// For client-side usage, prefer NEXT_PUBLIC_* vars.
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  "";

export const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY ||
  process.env.API_KEY ||
  "";

export const NODE_ENV = process.env.NODE_ENV || "development";

/** Cookie name for the access token (used by middleware and auth). */
export const ACCESS_TOKEN_COOKIE_NAME = "access_token";

