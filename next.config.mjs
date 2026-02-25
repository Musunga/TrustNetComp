/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
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
