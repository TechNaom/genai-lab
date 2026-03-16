import Link from 'next/link'
import { motion } from 'framer-motion'
import { Post } from '../../lib/api'

const COVER_GRADIENTS: Record<string, string> = {
  cyan: 'linear-gradient(135deg, #051520, #003d5c, #006688)',
  purple: 'linear-gradient(135deg, #0a0520, #2d1b6e, #5b3bb8)',
  green: 'linear-gradient(135deg, #041208, #0d3320, #1a6640)',
  orange: 'linear-gradient(135deg, #150800, #4a2000, #8a4000)',
  pink: 'linear-gradient(135deg, #150510, #4a1030, #882050)',
}

const CAT_EMOJI: Record<string, string> = {
  'AI Automation': '🤖',
  'Prompt Engineering': '✍️',
  'GenAI Systems': '⚙️',
  'LLM Architectures': '🏗️',
  'Mini LLM Research': '🧪',
  Experiments: '🔬',
}

interface Props {
  post: Post
  featured?: boolean
  index?: number
}

function formatDate(d?: string) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch { return d }
}

export default function PostCard({ post, featured, index = 0 }: Props) {
  const grad = COVER_GRADIENTS[post.color || 'cyan']
  const firstTag = post.tags?.[0] || post.category || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: '#0d1e2e',
        border: '1px solid #1a3048',
        gridColumn: featured ? 'span 2' : undefined,
        display: featured ? 'grid' : 'flex',
        gridTemplateColumns: featured ? '1fr 1fr' : undefined,
        flexDirection: featured ? undefined : 'column',
      }}
    >
      <Link href={`/blog/${post.slug}`} className="no-underline contents">
        {/* Cover */}
        <div
          className="flex items-end p-5 relative overflow-hidden"
          style={{
            background: grad,
            minHeight: featured ? '100%' : '180px',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 text-7xl pointer-events-none select-none">
            {CAT_EMOJI[post.category || ''] || '📄'}
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <span
              className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full text-white"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {firstTag}
            </span>
            {post.featured && (
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full text-black tracking-wide"
                style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c42)' }}
              >
                ★ Featured
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col justify-between">
          {featured && (
            <div className="text-xs tracking-widest uppercase mb-2 font-semibold" style={{ color: '#00d4ff' }}>
              Featured
            </div>
          )}
          <div>
            <h3 className="font-bold leading-snug mb-3 text-white" style={{ fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
              {post.title}
            </h3>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: '#8ab4d4' }}>
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs" style={{ color: '#4a7a9b' }}>
            <div className="flex items-center gap-3">
              <span>📖 {post.readTime || 5} min read</span>
              <span>{formatDate(post.date)}</span>
            </div>
            <span style={{ color: '#00d4ff' }}>→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
