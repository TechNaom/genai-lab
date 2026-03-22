import type { NextApiRequest, NextApiResponse } from 'next'

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

  let backendPath = '/api/posts/'
  if (status === 'all') {
    backendPath = '/api/posts/admin/all'
  } else if (slug) {
    backendPath = `/api/posts/${slug}`
  }

  const url = `${BACKEND}${backendPath}`

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

    // Log FULL response for debugging
    console.log(`[posts-proxy] ${req.method} ${url} → ${backendRes.status}`)
    if (backendRes.status >= 400) {
      console.log('[posts-proxy] ERROR BODY:', JSON.stringify(data))
      console.log('[posts-proxy] REQUEST BODY:', JSON.stringify(req.body))
    }

    res.status(backendRes.status).json(data)
  } catch (err: any) {
    console.error('[posts-proxy] fetch error:', err.message)
    res.status(500).json({ detail: `Proxy error: ${err.message}`, url })
  }
}
