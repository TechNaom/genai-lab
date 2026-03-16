import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import PostCard from '../components/blog/PostCard'
import { api, Post } from '../lib/api'

const CATEGORIES = [
  { name: 'AI Automation', emoji: '🤖', color: '#00d4ff' },
  { name: 'Prompt Engineering', emoji: '✍️', color: '#a78bfa' },
  { name: 'GenAI Systems', emoji: '⚙️', color: '#00ff9d' },
  { name: 'LLM Architectures', emoji: '🏗️', color: '#ff8c42' },
  { name: 'Mini LLM Research', emoji: '🧪', color: '#ff4d6d' },
  { name: 'Experiments', emoji: '🔬', color: '#ffd700' },
]

interface Props {
  posts: Post[]
}

export default function Home({ posts }: Props) {
  const featured = posts.filter((p) => p.featured).slice(0, 2)
  const recent = posts.slice(0, 6)

  return (
    <Layout>
      <Head>
        <title>Manohar's GenAI Lab — AI Engineering Blog</title>
        <meta name="description" content="GenAI Automation Lead & Mentor. Building intelligent systems through prompt engineering, automation, and modern AI frameworks." />
      </Head>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden flex items-center justify-center text-center px-6" style={{ minHeight: '92vh' }}>
        {/* Background */}
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        <div className="absolute pointer-events-none" style={{ top: '-20%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-20%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase mb-8"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live · GenAI Research & Engineering
          </motion.div>

          <h1 className="font-black leading-none mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '-3px' }}>
            <span className="block text-white">Manohar's</span>
            <span className="block text-gradient">GenAI Lab</span>
          </h1>

          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#00d4ff' }}>
            GenAI Automation Lead &amp; Mentor
          </p>

          <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#8ab4d4' }}>
            Building intelligent systems that transform AI ideas into real-world software through prompt engineering, end-to-end automation, and modern AI frameworks.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/blog">
              <motion.button
                className="px-8 py-4 rounded-xl font-bold text-sm text-black cursor-pointer border-none"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)' }}
                whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,212,255,0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                Read the Blog
              </motion.button>
            </Link>
            <Link href="/projects">
              <motion.button
                className="px-8 py-4 rounded-xl font-semibold text-sm cursor-pointer"
                style={{ background: 'transparent', border: '1px solid #1f3a58', color: '#e8f4ff' }}
                whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-12 justify-center mt-16 pt-10" style={{ borderTop: '1px solid #1a3048' }}>
            {[
              { num: `${posts.length}+`, label: 'Articles' },
              { num: '5+', label: 'AI Projects' },
              { num: '10+', label: 'Experiments' },
              { num: '∞', label: 'Ideas in Queue' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-black text-3xl text-white" style={{ letterSpacing: '-1px' }}>
                  <span style={{ color: '#00d4ff' }}>{s.num}</span>
                </div>
                <div className="text-xs tracking-widest uppercase mt-1" style={{ color: '#4a7a9b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Featured Posts ──────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10">
            <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
              <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
              Featured
            </div>
            <h2 className="font-black text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px' }}>
              From the <span style={{ color: '#00d4ff' }}>Lab</span>
            </h2>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
            {featured.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
          </div>
        </section>
      )}

      {/* ── Recent Posts ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-10">
          <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
            <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
            Latest Posts
          </div>
          <h2 className="font-black text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px' }}>
            Recent <span style={{ color: '#00d4ff' }}>Articles</span>
          </h2>
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {recent.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
        </div>
        <div className="text-center mt-10">
          <Link href="/blog">
            <motion.button
              className="px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer"
              style={{ background: 'transparent', border: '1px solid #1f3a58', color: '#e8f4ff' }}
              whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
            >
              View All Articles →
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#080f17' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
              <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
              Categories
            </div>
            <h2 className="font-black text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px' }}>
              Research <span style={{ color: '#00d4ff' }}>Areas</span>
            </h2>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {CATEGORIES.map((cat, i) => {
              const count = posts.filter((p) => p.category === cat.name).length
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                >
                  <Link href={`/blog?category=${encodeURIComponent(cat.name)}`} className="no-underline block">
                    <div
                      className="rounded-2xl p-6 transition-all duration-300 cursor-pointer"
                      style={{ background: '#0d1e2e', border: '1px solid #1a3048', borderLeft: `3px solid ${cat.color}` }}
                    >
                      <div className="text-2xl mb-3">{cat.emoji}</div>
                      <div className="font-bold text-sm text-white mb-1">{cat.name}</div>
                      <div className="text-xs" style={{ color: '#4a7a9b' }}>{count} article{count !== 1 ? 's' : ''}</div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}
        >
          <h2 className="font-black text-white mb-3" style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>
            Stay in the Loop 🔬
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: '#8ab4d4' }}>
            Get notified when new AI experiments, tutorials, and insights drop from the lab.
          </p>
          <div className="flex gap-3 max-w-md mx-auto flex-wrap justify-center">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm font-sans outline-none"
              style={{ background: '#080f17', border: '1px solid #1a3048', color: '#e8f4ff', fontFamily: 'Syne, sans-serif' }}
            />
            <motion.button
              className="px-6 py-3 rounded-xl font-bold text-sm text-black cursor-pointer border-none whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)' }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await api.getPosts({ limit: 10 })
    return { props: { posts }, revalidate: 60 }
  } catch {
    return { props: { posts: [] }, revalidate: 30 }
  }
}
