import { useState } from 'react'
import { motion } from 'framer-motion'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    setError('')
    setLoading(true)

    const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const url = `${API}/api/newsletter/subscribe`

    // Retry up to 3 times — handles Render cold start
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Subscription failed')
        setSubmitted(true)
        setEmail('')
        setLoading(false)
        return
      } catch (err: any) {
        if (attempt === 3) {
          // All retries failed
          if (err.message === 'Failed to fetch') {
            setError('Server is waking up — please try again in 30 seconds')
          } else {
            setError(err.message || 'Something went wrong. Please try again.')
          }
          setLoading(false)
          return
        }
        // Wait 2 seconds before retrying
        await new Promise((r) => setTimeout(r, 2000))
      }
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="text-3xl mb-3">🎉</div>
        <p style={{ fontWeight: 600, color: '#e8f4ff', fontSize: '16px', fontFamily: 'Montserrat, sans-serif' }}>
          You are in!
        </p>
        <p style={{ fontSize: '13px', color: '#8ab4d4', marginTop: '6px', fontFamily: 'Montserrat, sans-serif' }}>
          You will be notified when new articles drop from the lab.
        </p>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex gap-3 max-w-md mx-auto flex-wrap justify-center">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
          className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: '#080f17',
            border: `1px solid ${error ? '#ff4d6d' : '#1a3048'}`,
            color: '#e8f4ff',
            fontFamily: 'Montserrat, sans-serif',
          }}
        />
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 rounded-xl font-bold text-sm text-black border-none cursor-pointer whitespace-nowrap"
          style={{
            background: loading ? '#0088cc' : 'linear-gradient(135deg, #00d4ff, #0088cc)',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            minWidth: '120px',
            opacity: loading ? 0.8 : 1,
          }}
          whileHover={{ y: loading ? 0 : -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </motion.button>
      </div>
      {error && (
        <p style={{ fontSize: '12px', color: '#ff4d6d', textAlign: 'center', marginTop: '12px', fontFamily: 'Montserrat, sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  )
}
