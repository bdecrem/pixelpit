/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/pp/:path*',
        destination: '/pixelpit/arcade/:path*',
      },
    ]
  },
}

module.exports = nextConfig
