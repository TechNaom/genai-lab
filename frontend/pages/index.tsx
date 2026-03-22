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

const ACHIEVEMENTS = [
  { icon: '⚡', metric: '4×', label: 'Throughput gain on CRQ compliance reviews' },
  { icon: '🎯', metric: '75%', label: 'Manual review effort eliminated at BofA' },
  { icon: '🏦', metric: '20K+', label: 'Change Requests processed by AI pipeline' },
  { icon: '🧪', metric: '167+', label: 'Prompt scenarios validated in production' },
]

interface Props { posts: Post[] }

export default function Home({ posts }: Props) {
  const featured = posts.filter((p) => p.featured).slice(0, 2)
  const recent = posts.slice(0, 6)

  return (
    <Layout>
      <Head>
        <title>Manohar's GenAI Lab — AVP & AI Transformation Architect @ Bank of America</title>
        <meta name="description" content="AVP & AI Transformation Architect at Bank of America. Built agentic AI systems that eliminated 75% of manual compliance review effort. Real enterprise AI. No fluff." />
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
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Live · Enterprise GenAI Research
            </span>
          </motion.div>

          {/* BofA credential badge */}
          <motion.div
            className="boa-badge inline-flex items-center gap-3 rounded-2xl px-6 py-3 mb-8"
            style={{ width: 'fit-content', margin: '0 auto 2rem' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ background: 'linear-gradient(135deg, #e31837, #c41230)', color: '#fff' }}>
              B
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e8f4ff' }}>AVP · Bank of America</div>
              <div style={{ fontSize: '11px', color: '#8ab4d4' }}>AI Transformation Architect · Top 5% Performer</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(0,212,255,0.2)', margin: '0 4px' }} />
            <div style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 600, letterSpacing: '0.5px' }}>AI Ignition Educator</div>
          </motion.div>

          {/* Main title — lighter weight, more elegant */}
          <h1
            className="leading-none mb-6"
            style={{
              fontSize: 'clamp(3rem, 8.5vw, 6rem)',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 700,
              letterSpacing: '-3px',
            }}
          >
            <span className="block text-white">Manohar's</span>
            <span className="block text-gradient" style={{ fontWeight: 800 }}>GenAI Lab</span>
          </h1>

          {/* NEW powerful description based on real work */}
          <motion.p
            className="mx-auto mb-3"
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
              color: '#e8f4ff',
              maxWidth: '800px',
              lineHeight: 1.75,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            I don't just study AI — I ship it inside one of the world's largest banks.
            As <span style={{ color: '#00d4ff', fontWeight: 700 }}>AVP & AI Transformation Architect at Bank of America</span>,
            I build agentic pipelines, prompt engineering frameworks, and LLM automation tools
            that run on 20,000+ real enterprise workflows — not in sandboxes.
          </motion.p>

          <motion.p
            className="mx-auto mb-10"
            style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
              color: '#8ab4d4',
              maxWidth: '650px',
              lineHeight: 1.8,
              fontFamily: 'Inter, sans-serif',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            This lab documents what I build, what breaks, and what actually works in production.
            <span style={{ color: '#a78bfa', fontWeight: 600 }}> Battle-tested. Enterprise-grade. No fluff.</span>
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
                className="px-8 py-4 rounded-xl font-bold text-black cursor-pointer border-none"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
                whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,212,255,0.35)' }}
                whileTap={{ scale: 0.98 }}
              >
                Explore the Lab →
              </motion.button>
            </Link>
            <Link href="/projects">
              <motion.button
                className="px-8 py-4 rounded-xl font-semibold cursor-pointer"
                style={{ background: 'transparent', border: '1px solid #1f3a58', color: '#e8f4ff', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
                whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
              </motion.button>
            </Link>
          </motion.div>

          {/* Real achievement stats */}
          <motion.div
            className="grid gap-4 mx-auto"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', maxWidth: '800px', paddingTop: '2rem', borderTop: '1px solid rgba(26,48,72,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.label}
                className="text-center rounded-xl p-4"
                style={{ background: 'rgba(13,30,46,0.5)', border: '1px solid #1a3048' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{a.icon}</div>
                <div className="font-black" style={{ fontSize: '2rem', letterSpacing: '-1px', fontFamily: 'Bricolage Grotesque, sans-serif', color: '#00d4ff' }}>
                  {a.metric}
                </div>
                <div style={{ fontSize: '11px', color: '#4a7a9b', lineHeight: 1.4, marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
                  {a.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── What I Build (replaces generic categories) ── */}
      <section className="py-10 px-6" style={{ background: '#080f17', borderTop: '1px solid #1a3048' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {['Agentic AI Pipelines', 'Prompt Engineering', 'LLM Automation', 'Enterprise AI Tools', 'Change Management AI', 'RAG Systems', 'Python AI Dev', 'AI Ignition Educator'].map((tag) => (
              <span key={tag} className="text-xs font-semibold px-4 py-2 rounded-full"
                style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: '#8ab4d4', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Posts ── */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10">
            <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff', fontFamily: 'Inter, sans-serif' }}>
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
          <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff', fontFamily: 'Inter, sans-serif' }}>
            <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
            Latest from the Lab
          </div>
          <h2 className="font-black text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Recent <span style={{ color: '#00d4ff' }}>Articles</span>
          </h2>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
            <h3 className="font-bold text-white mb-2" style={{ fontSize: '1.2rem', fontFamily: 'Bricolage Grotesque, sans-serif' }}>Lab is warming up</h3>
            <p style={{ color: '#8ab4d4', fontSize: '14px', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
              First articles are being prepared. Check back soon.
            </p>
            <Link href="/admin">
              <button className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#0088cc)', color: '#000', border: 'none', fontFamily: 'Inter, sans-serif' }}>
                Publish First Article →
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {recent.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
            </div>
            <div className="text-center mt-10">
              <Link href="/blog">
                <motion.button
                  className="px-8 py-3 rounded-xl font-semibold text-sm cursor-pointer"
                  style={{ background: 'transparent', border: '1px solid #1f3a58', color: '#e8f4ff', fontFamily: 'Inter, sans-serif' }}
                  whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
                >
                  View All Articles →
                </motion.button>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── Research Areas ── */}
      <section className="py-20 px-6" style={{ background: '#080f17' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="text-xs tracking-widest uppercase font-semibold mb-3 flex items-center gap-2" style={{ color: '#00d4ff', fontFamily: 'Inter, sans-serif' }}>
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
                    <div className="rounded-2xl p-6 transition-all duration-300 cursor-pointer"
                      style={{ background: '#0d1e2e', border: '1px solid #1a3048', borderLeft: `3px solid ${cat.color}` }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{cat.emoji}</div>
                      <div className="font-bold text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{cat.name}</div>
                      <div style={{ fontSize: '12px', color: '#4a7a9b', fontFamily: 'Inter, sans-serif' }}>{count} article{count !== 1 ? 's' : ''}</div>
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
        <div className="rounded-2xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #0d1e2e, #112436)', border: '1px solid #1f3a58' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔬</div>
          <h2 className="font-black text-white mb-3"
            style={{ fontSize: '1.8rem', letterSpacing: '-0.5px', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Stay in the Loop
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: '#8ab4d4', fontFamily: 'Inter, sans-serif' }}>
            Get enterprise AI insights, production system breakdowns, and real experiment results — straight from the lab.
          </p>
          <div className="flex gap-3 max-w-md mx-auto flex-wrap justify-center">
            <input type="email" placeholder="your@email.com"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#080f17', border: '1px solid #1a3048', color: '#e8f4ff', fontFamily: 'Inter, sans-serif' }} />
            <motion.button
              className="px-6 py-3 rounded-xl font-bold text-sm text-black border-none cursor-pointer whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Inter, sans-serif' }}
              whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
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
