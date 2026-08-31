import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: 'https', hostname: 'raw.githubusercontent.com' }] },
}

export default nextConfig
