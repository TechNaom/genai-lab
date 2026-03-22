import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(422).json({ detail: 'Email is required' })
  }

  const API = (process.env.NEXT_PUBLIC_API_URL || 'https://genai-lab-api.onrender.com').replace(/\/$/, '')

  try {
    const response = await fetch(`${API}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    console.error('Proxy error:', err)
    return res.status(500).json({ detail: 'Failed to reach backend' })
  }
}
