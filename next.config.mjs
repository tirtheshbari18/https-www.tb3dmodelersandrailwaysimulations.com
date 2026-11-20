/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'vg3dmodelersandrailwaysimulations.com',
      'raw.githubusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/dev.db'],
      '/**/*': ['./prisma/dev.db'],
    },
  },
};

export default nextConfig;
