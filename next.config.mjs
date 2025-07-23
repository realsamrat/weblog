/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development and production settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Fix cross-origin warnings in development
  allowedDevOrigins: ['192.168.1.3'],
  
  // Image configuration - combined from both configs
  images: {
    domains: ['localhost', 'your-production-domain.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  
  // Webpack configuration for Payload CMS
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

export default nextConfig
