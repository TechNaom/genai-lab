import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Layout from '../../components/layout/Layout'
import PostCard from '../../components/blog/PostCard'
import { api, Post } from '../../lib/api'

interface Props {
  initialPosts: Post[]
  initialTag: string
  initialCategory: string
  initialQ: string
}

const ALL_TAGS = ['AI Automation', 'Prompt Engineering', 'GenAI Systems', 'LLM Architectures', 'Mini LLM Research', 'Experiments', 'RAG', 'LangChain', 'Fine-tuning', 'Agents']

export default function BlogIndex({ initialPosts, initialTag, initialCategory, initialQ }: Props) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [search, setSearch] = useState(initialQ)
  const [activeTag, setActiveTag] = useState(initialTag || initialCategory || 'all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (search) params.q = search
        if (activeTag !== 'all') {
          const isCategory = ALL_TAGS.slice(0, 6).includes(activeTag)
          if (isCategory) params.category = activeTag
          else params.tag = activeTag
        }
        const data = await api.getPosts(params)
        setPosts(data)
      } catch {
        // keep existing
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, activeTag])

  const allTags = ['all', ...ALL_TAGS]

  return (
    <Layout>
      <Head>
        <title>Blog — Manohar's GenAI Lab</title>
        <meta name="description" content="AI engineering articles on RAG, LLMs, prompt engineering, automation and more." />
      </Head>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
            <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
            Blog
          </div>
          <h1 className="font-black text-white mb-2" style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-1.5px' }}>
            AI Engineering <span style={{ color: '#00d4ff' }}>Insights</span>
          </h1>
          <p style={{ color: '#8ab4d4' }}>Deep dives into LLMs, RAG, automation, and everything in between.</p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-lg mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-colors duration-200"
            style={{
              background: '#0d1e2e',
              border: '1px solid #1a3048',
              color: '#e8f4ff',
              fontFamily: 'Syne, sans-serif',
            }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#4a7a9b' }}>⌕</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allTags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-all duration-200 border"
              style={{
                background: activeTag === tag ? 'rgba(0,212,255,0.1)' : '#0d1e2e',
                borderColor: activeTag === tag ? '#00d4ff' : '#1a3048',
                color: activeTag === tag ? '#00d4ff' : '#8ab4d4',
                fontFamily: 'Syne, sans-serif',
              }}
              whileTap={{ scale: 0.96 }}
            >
              {tag === 'all' ? 'All Posts' : tag}
            </motion.button>
          ))}
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#4a7a9b' }}>Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#8ab4d4' }}>No articles found</h3>
            <p style={{ color: '#4a7a9b' }}>Try a different search or tag</p>
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
            {posts.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const tag = (query.tag as string) || ''
  const category = (query.category as string) || ''
  const q = (query.q as string) || ''

  try {
    const params: Record<string, string> = {}
    if (q) params.q = q
    if (tag) params.tag = tag
    if (category) params.category = category
    const posts = await api.getPosts(params)
    return { props: { initialPosts: posts, initialTag: tag, initialCategory: category, initialQ: q } }
  } catch {
    return { props: { initialPosts: [], initialTag: tag, initialCategory: category, initialQ: q } }
  }
}
