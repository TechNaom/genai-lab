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

const STATS = [
  { num: '', dynamic: true, label: 'Articles Published' },
  { num: '5+', label: 'AI Projects Shipped' },
  { num: 'Top 5%', label: 'Performer @ BofA' },
  { num: '∞', label: 'Ideas in Queue' },
]

interface Props { posts: Post[] }

export default function Home({ posts }: Props) {
  const featured = posts.filter((p) => p.featured).slice(0, 2)
  const recent = posts.slice(0, 6)

  return (
    <Layout>
      <Head>
        <title>Manohar's GenAI Lab — AI Transformation Architect @ Bank of America</title>
        <meta name="description" content="AVP & AI Transformation Architect at Bank of America. Production-grade GenAI systems — from prompt engineering to end-to-end agentic automation. Real systems. No fluff." />
      </Head>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden flex items-center justify-center text-center px-6" style={{ minHeight: '96vh' }}>
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        <div className="absolute pointer-events-none" style={{ top: '-20%', left: '-10%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-20%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)' }} />

        <motion.div
          className="relative z-10 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Live badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff9d' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Live · GenAI Research & Engineering</span>
          </motion.div>

          {/* BofA credential badge */}
          <motion.div
            className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 mb-8 boa-badge"
            style={{ display: 'flex', width: 'fit-content', margin: '0 auto 2rem' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ background: 'linear-gradient(135deg, #e31837, #c41230)', color: '#fff', letterSpacing: '-0.5px' }}
            >
              B
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e8f4ff', letterSpacing: '-0.2px' }}>AVP · Bank of America</div>
              <div style={{ fontSize: '11px', color: '#8ab4d4', letterSpacing: '0.3px' }}>AI Transformation Architect · Top 5% Performer</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(0,212,255,0.2)', margin: '0 4px' }} />
            <div style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 600, letterSpacing: '0.5px' }}>AI Ignition Educator</div>
          </motion.div>

          {/* Main title */}
          <h1
            className="font-black leading-none mb-6"
            style={{
              fontSize: 'clamp(3.2rem, 9vw, 6.5rem)',
              letterSpacing: '-4px',
              fontFamily: 'Bricolage Grotesque, Space Grotesk, sans-serif',
            }}
          >
            <span className="block text-white">Manohar's</span>
            <span className="block text-gradient">GenAI Lab</span>
          </h1>

          {/* Powerful bio */}
          <motion.p
            className="mx-auto mb-4"
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
              color: '#e8f4ff',
              maxWidth: '780px',
              lineHeight: 1.7,
              fontWeight: 500,
              fontFamily: 'Space Grotesk, sans-serif',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            I transform how one of the world's largest banks thinks about AI.
            As AVP & AI Transformation Architect at{' '}
            <span style={{ color: '#00d4ff', fontWeight: 700 }}>Bank of America</span>,
            I build agentic systems, automation pipelines, and LLM frameworks that run in production — not in demos.
          </motion.p>

          <motion.p
            className="mx-auto mb-10"
            style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
              color: '#8ab4d4',
              maxWidth: '620px',
              lineHeight: 1.75,
              fontFamily: 'Space Grotesk, sans-serif',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            This is my research lab. Everything here is battle-tested, enterprise-grade, and brutally honest.
            <span style={{ color: '#a78bfa', fontWeight: 600 }}> Real systems. No fluff.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/blog">
              <motion.button
                className="px-8 py-4 rounded-xl font-bold text-sm text-black cursor-pointer border-none"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', letterSpacing: '-0.2px' }}
                whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,212,255,0.35)' }}
                whileTap={{ scale: 0.98 }}
              >
                Explore the Lab →
              </motion.button>
            </Link>
            <Link href="/projects">
              <motion.button
                className="px-8 py-4 rounded-xl font-semibold text-sm cursor-pointer"
                style={{ background: 'transparent', border: '1px solid #1f3a58', color: '#e8f4ff', fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px' }}
                whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-10 justify-center flex-wrap pt-8"
            style={{ borderTop: '1px solid rgba(26,48,72,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="text-center">
              <div className="font-black text-white" style={{ fontSize: '2.2rem', letterSpacing: '-1.5px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                <span style={{ color: '#00d4ff' }}>{posts.length > 0 ? `${posts.length}+` : '6+'}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#4a7a9b', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>Articles Published</div>
            </div>
            <div className="text-center">
              <div className="font-black text-white" style={{ fontSize: '2.2rem', letterSpacing: '-1.5px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                <span style={{ color: '#00d4ff' }}>Top 5%</span>
              </div>
              <div style={{ fontSize: '11px', color: '#4a7a9b', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>Performer @ BofA</div>
            </div>
            <div className="text-center">
              <div className="font-black text-white" style={{ fontSize: '2.2rem', letterSpacing: '-1.5px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                <span style={{ color: '#00d4ff' }}>5+</span>
              </div>
              <div style={{ fontSize: '11px', color: '#4a7a9b', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>AI Projects Shipped</div>
            </div>
            <div className="text-center">
              <div className="font-black text-white" style={{ fontSize: '2.2rem', letterSpacing: '-1.5px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                <span style={{ color: '#a78bfa' }}>AVP</span>
              </div>
              <div style={{ fontSize: '11px', color: '#4a7a9b', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>Bank of America</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Featured Posts ── */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10">
            <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
              <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
              Featured
            </div>
            <h2 className="font-black text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              From the <span style={{ color: '#00d4ff' }}>Lab</span>
            </h2>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
            {featured.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
          </div>
        </section>
      )}

      {/* ── Recent Posts ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-10">
          <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
            <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
            Latest Posts
          </div>
          <h2 className="font-black text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Recent <span style={{ color: '#00d4ff' }}>Articles</span>
          </h2>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
            <h3 className="font-bold text-white mb-2" style={{ fontSize: '1.2rem' }}>Lab is warming up</h3>
            <p style={{ color: '#8ab4d4', fontSize: '14px', marginBottom: '1.5rem' }}>First articles are being prepared. Check back soon.</p>
            <Link href="/admin">
              <button
                className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#0088cc)', color: '#000', border: 'none', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Publish First Article →
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
            {recent.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
          </div>
        )}
        {recent.length > 0 && (
          <div className="text-center mt-10">
            <Link href="/blog">
              <motion.button
                className="px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                style={{ background: 'transparent', border: '1px solid #1f3a58', color: '#e8f4ff', fontFamily: 'Space Grotesk, sans-serif' }}
                whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
              >
                View All Articles →
              </motion.button>
            </Link>
          </div>
        )}
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-6" style={{ background: '#080f17' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff' }}>
              <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
              Research Areas
            </div>
            <h2 className="font-black text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              What I <span style={{ color: '#00d4ff' }}>Build & Research</span>
            </h2>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {CATEGORIES.map((cat, i) => {
              const count = posts.filter((p) => p.category === cat.name).length
              return (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }}>
                  <Link href={`/blog?category=${encodeURIComponent(cat.name)}`} className="no-underline block">
                    <div className="rounded-2xl p-6 transition-all duration-300 cursor-pointer" style={{ background: '#0d1e2e', border: '1px solid #1a3048', borderLeft: `3px solid ${cat.color}` }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{cat.emoji}</div>
                      <div className="font-bold text-sm text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{cat.name}</div>
                      <div style={{ fontSize: '12px', color: '#4a7a9b' }}>{count} article{count !== 1 ? 's' : ''}</div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-2xl p-12 text-center" style={{ background: 'linear-gradient(135deg, #0d1e2e, #112436)', border: '1px solid #1f3a58' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔬</div>
          <h2 className="font-black text-white mb-3" style={{ fontSize: '1.8rem', letterSpacing: '-0.5px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Stay in the Loop
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: '#8ab4d4', fontFamily: 'Space Grotesk, sans-serif' }}>
            Get notified when new AI experiments, enterprise insights, and production-grade tutorials drop from the lab.
          </p>
          <div className="flex gap-3 max-w-md mx-auto flex-wrap justify-center">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#080f17', border: '1px solid #1a3048', color: '#e8f4ff', fontFamily: 'Space Grotesk, sans-serif' }}
            />
            <motion.button
              className="px-6 py-3 rounded-xl font-bold text-sm text-black border-none cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Space Grotesk, sans-serif' }}
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
