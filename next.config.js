/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  transpilePackages: ['swiper'],
  typescript: {
    // Temporarily disable TypeScript build errors
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 