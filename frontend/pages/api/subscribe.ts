import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(422).json({ detail: 'Email is required' })
  }

  // Hardcoded backend URL — no env var needed
  const url = 'https://genai-lab-api.onrender.com/api/newsletter/subscribe'

  try {
    console.log('Calling backend:', url, 'with email:', email)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    })

    console.log('Backend response status:', response.status)
    const data = await response.json()
    console.log('Backend response data:', data)
    
    return res.status(response.status).json(data)
  } catch (err: any) {
    console.error('Proxy fetch error:', err.message)
    // Return the actual error for debugging
    return res.status(500).json({ 
      detail: 'Proxy error: ' + err.message,
      url: url 
    })
  }
}
