import { motion } from 'framer-motion'
import PostCard from './PostCard'
import { Post } from '../../lib/api'

interface Props {
  posts: Post[]
  loading?: boolean
  emptyMessage?: string
  emptySubtext?: string
}

export default function PostGrid({
  posts,
  loading = false,
  emptyMessage = 'No articles found',
  emptySubtext = 'Try a different search or tag',
}: Props) {
  if (loading) {
    return (
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#0d1e2e', border: '1px solid #1a3048', height: '320px' }}
          >
            {/* Shimmer cover */}
            <div
              className="animate-pulse"
              style={{ height: '180px', background: 'linear-gradient(90deg, #0d1e2e 25%, #112436 50%, #0d1e2e 75%)', backgroundSize: '200% 100%' }}
            />
            <div className="p-6">
              <div className="animate-pulse rounded mb-3" style={{ height: '20px', background: '#112436', width: '80%' }} />
              <div className="animate-pulse rounded mb-2" style={{ height: '14px', background: '#112436', width: '100%' }} />
              <div className="animate-pulse rounded" style={{ height: '14px', background: '#112436', width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!posts.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-5xl mb-4">🔬</div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#8ab4d4' }}>
          {emptyMessage}
        </h3>
        <p style={{ color: '#4a7a9b' }}>{emptySubtext}</p>
      </motion.div>
    )
  }

  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
    >
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} index={i} />
      ))}
    </div>
  )
}
