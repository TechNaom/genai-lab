import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../../lib/api'

const STATIC_ROUTES = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: '/blog', changefreq: 'daily', priority: '0.9' },
  { path: '/projects', changefreq: 'monthly', priority: '0.7' },
  { path: '/experiments', changefreq: 'weekly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
]

const CATEGORIES = [
  'AI Automation',
  'Prompt Engineering',
  'GenAI Systems',
  'LLM Architectures',
  'Mini LLM Research',
  'Experiments',
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const today = new Date().toISOString().split('T')[0]

  let posts = []
  try {
    posts = await api.getPosts({ limit: 1000 })
  } catch {
    posts = []
  }

  const staticUrls = STATIC_ROUTES.map(
    (r) => `
  <url>
    <loc>${siteUrl}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  ).join('')

  const categoryUrls = CATEGORIES.map(
    (cat) => `
  <url>
    <loc>${siteUrl}/blog?category=${encodeURIComponent(cat)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
  ).join('')

  const postUrls = posts
    .map((post) => {
      const lastmod = post.date ? new Date(post.date).toISOString().split('T')[0] : today
      return `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${staticUrls}
  ${categoryUrls}
  ${postUrls}
</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  res.status(200).send(xml)
}
