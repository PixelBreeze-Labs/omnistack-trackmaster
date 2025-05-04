import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    domains: ['stageadmin.pixelbreeze.xyz'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stageadmin.pixelbreeze.xyz',
        port: '',
        pathname: '/storage/uploads/**',
      },
    ],
  },
};

export default nextConfig;