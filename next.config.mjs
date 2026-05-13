import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Matches lib/constants/variables.ts — avoids http→https redirects breaking CORS preflight. */
function normalizeApiBaseUrl(raw) {
  const trimmed = typeof raw === "string" ? raw.trim() : ""
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      jotai: "./node_modules/jotai",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const base = normalizeApiBaseUrl(
      process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "",
    )
    // Only add rewrite if an external base is configured
    if (!base) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
    ];
  },
}

export default nextConfig
