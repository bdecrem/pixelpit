/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three', '@react-three/fiber'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': require.resolve('three'),
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: 'daskollektiv.rip' }],
          destination: '/pixelpit/daskollektiv/index.html',
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'daskollektiv.rip' }],
          destination: '/pixelpit/daskollektiv/:path*',
        },
      ],
      afterFiles: [
        {
          source: '/pp/:path*',
          destination: '/pixelpit/arcade/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig