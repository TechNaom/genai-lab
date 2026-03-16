import Link from 'next/link'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="text-8xl font-black mb-4 select-none"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-4px',
            }}
          >
            404
          </div>
          <h1 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: '-0.5px' }}>
            Page not found
          </h1>
          <p className="mb-8 max-w-sm mx-auto" style={{ color: '#8ab4d4' }}>
            This experiment seems to have escaped the lab. Let's get you back on track.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <motion.button
                className="px-6 py-3 rounded-xl font-bold text-sm text-black border-none cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Syne, sans-serif' }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Go Home
              </motion.button>
            </Link>
            <Link href="/blog">
              <motion.button
                className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                style={{ background: 'transparent', border: '1px solid #1f3a58', color: '#e8f4ff', fontFamily: 'Syne, sans-serif' }}
                whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
                whileTap={{ scale: 0.98 }}
              >
                Read the Blog
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}
