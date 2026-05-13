import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://trustnetcomp.netlify.app", // handled dynamically in middleware
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ]
  },
  async rewrites() {
    const base = normalizeApiBaseUrl(
      process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "",
    )
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