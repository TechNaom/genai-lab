import { useState } from 'react'
import { motion } from 'framer-motion'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    setError('')
    setSubmitted(true)
    setEmail('')
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="text-2xl mb-2">🎉</div>
        <p className="font-semibold text-white">You're in!</p>
        <p className="text-sm mt-1" style={{ color: '#8ab4d4' }}>
          You'll be notified of new posts from the lab.
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
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
          className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: '#080f17',
            border: `1px solid ${error ? '#ff4d6d' : '#1a3048'}`,
            color: '#e8f4ff',
            fontFamily: 'Syne, sans-serif',
          }}
        />
        <motion.button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-xl font-bold text-sm text-black border-none cursor-pointer whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Syne, sans-serif' }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Subscribe
        </motion.button>
      </div>
      {error && (
        <p className="text-xs text-center mt-2" style={{ color: '#ff4d6d' }}>{error}</p>
      )}
    </div>
  )
}
