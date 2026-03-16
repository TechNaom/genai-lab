import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const robots = `User-agent: *
Allow: /

# Don't index admin
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl}/api/sitemap
`

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.status(200).send(robots)
}
