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
      // Short URLs for arcade games: /pp/beam → /pixelpit/arcade/beam
      { source: '/pp/:game', destination: '/pixelpit/arcade/:game' },
      // Everything else maps automatically: /lab/catch → /pixelpit/lab/catch
      { source: '/:path*', destination: '/pixelpit/:path*' },
    ];
  },
}

module.exports = nextConfig
