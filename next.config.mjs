/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevent bundling native modules like better-sqlite3 (required for Vercel builds).
  serverExternalPackages: ["better-sqlite3"],
}

export default nextConfig
