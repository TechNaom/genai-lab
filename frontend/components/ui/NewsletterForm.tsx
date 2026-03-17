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
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const res = await fetch(`${API}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setSubmitted(true)
      setEmail('')
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
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
        <p className="font-semibold text-white text-lg">You are in!</p>
        <p className="text-sm mt-1" style={{ color: '#8ab4d4' }}>
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
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 rounded-xl font-bold text-sm text-black border-none cursor-pointer whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #0088cc)',
            fontFamily: 'Inter, sans-serif',
            opacity: loading ? 0.7 : 1,
            minWidth: '120px',
          }}
          whileHover={{ y: loading ? 0 : -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </motion.button>
      </div>
      {error && (
        <p className="text-xs text-center mt-3" style={{ color: '#ff4d6d' }}>
          {error}
        </p>
      )}
    </div>
  )
}
