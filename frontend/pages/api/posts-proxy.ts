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
    // Fix: body may already be a string or an object — handle both
    let bodyStr: string | undefined
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      if (typeof req.body === 'string') {
        bodyStr = req.body  // already stringified — use as-is
      } else {
        bodyStr = JSON.stringify(req.body)  // object — stringify it
      }
    }

    const backendRes = await fetch(url, {
      method: req.method,
      headers,
      body: bodyStr,
    })

    const text = await backendRes.text()
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      data = { detail: text }
    }

    console.log(`[posts-proxy] ${req.method} ${url} → ${backendRes.status}`)
    if (backendRes.status >= 400) {
      console.log('[posts-proxy] ERROR:', JSON.stringify(data))
    }

    res.status(backendRes.status).json(data)
  } catch (err: any) {
    console.error('[posts-proxy] fetch error:', err.message)
    res.status(500).json({ detail: `Proxy error: ${err.message}` })
  }
}
