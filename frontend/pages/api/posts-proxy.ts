import type { NextApiRequest, NextApiResponse } from 'next'

// Use hardcoded URL as fallback — NEXT_PUBLIC_ vars don't work server-side in all cases
const BACKEND = 'https://genai-lab-api.onrender.com'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, status } = req.query

  // Build backend URL
  let backendPath = '/api/posts/'

  if (status === 'all') {
    // Admin listing — all posts including drafts
    backendPath = '/api/posts/admin/all'
  } else if (slug) {
    // Single post by slug
    backendPath = `/api/posts/${slug}`
  }

  const url = `${BACKEND}${backendPath}`

  // Forward admin token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (req.headers['x-admin-token']) {
    headers['x-admin-token'] = req.headers['x-admin-token'] as string
  }

  try {
    const backendRes = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'DELETE'
        ? JSON.stringify(req.body)
        : undefined,
    })

    const text = await backendRes.text()
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      data = { detail: text }
    }

    // Log for debugging
    console.log(`[posts-proxy] ${req.method} ${url} → ${backendRes.status}`, 
      backendRes.status >= 400 ? data : 'OK')

    res.status(backendRes.status).json(data)
  } catch (err: any) {
    console.error('[posts-proxy] fetch error:', err.message)
    res.status(500).json({ detail: `Proxy error: ${err.message}`, url })
  }
}
