/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Forward browser logs to terminal for easier debugging
    browserDebugInfoInTerminal: true,
    // Enable DevTools segment explorer for route composition
    devtoolSegmentExplorer: true,
    // Enable global 404 page support
    globalNotFound: true,
    // Improve client-side navigation with smarter caching
    clientSegmentCache: true,
    // Enable persistent caching for Turbopack
    turbopackPersistentCaching: true,
    // Enable unified caching strategy (will be renamed to cacheComponents in v16)
    cacheComponents: true,
  },
}

export default nextConfig
