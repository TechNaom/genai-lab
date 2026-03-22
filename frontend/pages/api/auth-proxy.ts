import type { NextApiRequest, NextApiResponse } from 'next'

const BACKEND = (process.env.NEXT_PUBLIC_API_URL || 'https://genai-lab-api.onrender.com').replace(/\/$/, '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const backendRes = await fetch(`${BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })
    const data = await backendRes.json()
    res.status(backendRes.status).json(data)
  } catch (err: any) {
    res.status(500).json({ detail: 'Auth proxy error: ' + err.message })
  }
}
