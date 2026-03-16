import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  let posts: any[] = []
  try {
    posts = await api.getPosts({ limit: 50 })
  } catch {
    posts = []
  }

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`
      const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()
     const tags = (post.tags || []).map((t: string) => `<category>${escapeXml(t)}</category>`).join('\n        ')

      return `
    <item>
      <title>${escapeXml(post.title || '')}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${pubDate}</pubDate>
      <author>manohar@genailab.dev (Manohar Papasani)</author>
      ${tags}
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Manohar's GenAI Lab</title>
    <link>${siteUrl}</link>
    <description>AI engineering insights on RAG, LLMs, prompt engineering, automation and more by Manohar Papasani.</description>
    <language>en-us</language>
    <managingEditor>manohar@genailab.dev (Manohar Papasani)</managingEditor>
    <webMaster>manohar@genailab.dev (Manohar Papasani)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>Manohar's GenAI Lab</title>
      <link>${siteUrl}</link>
    </image>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  res.status(200).send(xml)
}
