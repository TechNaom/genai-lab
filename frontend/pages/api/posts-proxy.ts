import type { NextApiRequest, NextApiResponse } from 'next'

const BACKEND = (process.env.NEXT_PUBLIC_API_URL || 'https://genai-lab-api.onrender.com').replace(/\/$/, '')

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, ...restQuery } = req.query

  // Build backend URL
  let backendPath = '/api/posts/'
  if (slug) backendPath += `${slug}`

  // Handle admin/all route
  if (restQuery.status === 'all') {
    backendPath = '/api/posts/admin/all'
  } else {
    // Pass other query params
    const qp = new URLSearchParams()
    Object.entries(restQuery).forEach(([k, v]) => {
      if (v && k !== 'status') qp.set(k, String(v))
    })
    if (restQuery.status) qp.set('status', String(restQuery.status))
    const qs = qp.toString()
    if (qs && !slug) backendPath += `?${qs}`
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
    let data
    try { data = JSON.parse(text) } catch { data = { detail: text } }

    res.status(backendRes.status).json(data)
  } catch (err: any) {
    console.error('Posts proxy error:', err)
    res.status(500).json({ detail: 'Proxy error: ' + err.message })
  }
}
