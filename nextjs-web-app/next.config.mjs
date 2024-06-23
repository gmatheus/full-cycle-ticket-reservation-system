/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/nextjs-web-app',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:8000']
    }
  }
};

export default nextConfig;
