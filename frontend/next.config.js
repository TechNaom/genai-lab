/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for Docker multi-stage build
  output: 'standalone',

  images: {
    domains: ['images.unsplash.com'],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // /sitemap.xml, /robots.txt, /rss.xml → API routes
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: '/api/sitemap' },
      { source: '/robots.txt', destination: '/api/robots' },
      { source: '/rss.xml', destination: '/api/rss' },
    ]
  },
}

module.exports = nextConfig
