/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Transpile three.js and react-three packages to fix bundling issues
  transpilePackages: ['three', '@react-three/fiber'],
  // Webpack config for three.js
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
