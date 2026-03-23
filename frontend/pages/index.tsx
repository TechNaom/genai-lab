import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import PostCard from '../components/blog/PostCard'
import NewsletterForm from '../components/ui/NewsletterForm'
import { api } from '../lib/api'

const CATEGORIES = [
  { name: 'AI Automation', emoji: '🤖', color: '#00d4ff' },
  { name: 'Prompt Engineering', emoji: '✍️', color: '#a78bfa' },
  { name: 'GenAI Systems', emoji: '⚙️', color: '#00ff9d' },
  { name: 'LLM Architectures', emoji: '🏗️', color: '#ff8c42' },
  { name: 'Mini LLM Research', emoji: '🧪', color: '#ff4d6d' },
  { name: 'Experiments', emoji: '🔬', color: '#ffd700' },
]

const ROLES = [
  { icon: '🐍', title: 'AI Engineer', desc: 'Python · Agentic Pipelines · RAG · DevOps · LLM Tools built for production', color: '#00d4ff' },
  { icon: '✍️', title: 'Prompt Engineering Consultant', desc: 'Advising BofA teams on building their own AI automations from scratch', color: '#a78bfa' },
  { icon: '🔬', title: 'GenAI R&D Leader', desc: 'Researching mini-LLMs, embeddings, agentic systems, and what comes next', color: '#00ff9d' },
  { icon: '📝', title: 'Technical Writer', desc: 'Documenting real AI systems on this blog and LinkedIn — no theory, only practice', color: '#ff8c42' },
  { icon: '🎓', title: 'GenAI Educator', desc: "AI Ignition program — teaching engineers inside one of the world's largest banks", color: '#ffd700' },
]

const D = 'Montserrat, sans-serif'
const B = 'Montserrat, sans-serif'

interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags?: string[]
  featured?: boolean
  color?: string
  readTime?: number
}

interface Props { posts: Post[] }

export default function Home({ posts }: Props) {
  const featured = posts.filter((p) => p.featured).slice(0, 2)
  const recent = posts.slice(0, 6)

  return (
    <Layout>
      <Head>
        <title>Manohar's GenAI Lab — AI Engineer · Consultant · Educator @ Bank of America</title>
        <meta name="description" content="AVP & AI Transformation Architect at Bank of America. I build AI systems, consult teams on prompt engineering, lead GenAI R&D, write about it, and teach it." />
      </Head>

      <section
        className="relative overflow-hidden flex items-center justify-center text-center px-6"
        style={{ minHeight: '96vh' }}
      >
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
            transition={{ delay: 0.15 }}
          >
            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff9d' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: B }}>
              Live · Enterprise GenAI R&D
            </span>
          </motion.div>

          {/* BofA badge */}
          <motion.div
            className="boa-badge inline-flex items-center gap-3 rounded-2xl px-6 py-3 mb-10"
            style={{ width: 'fit-content', margin: '0 auto 2.5rem' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #e31837, #c41230)' }}>B</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e8f4ff', fontFamily: D }}>AVP · Bank of America</div>
              <div style={{ fontSize: '11px', color: '#8ab4d4', fontFamily: B }}>AI Transformation Architect · Top 5% Performer</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(0,212,255,0.2)', margin: '0 4px' }} />
            <div style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 600, fontFamily: B }}>AI Ignition Educator</div>
          </motion.div>

          {/* HERO TITLE */}
          <motion.h1
            style={{ fontFamily: D, marginBottom: '2rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span
              className="block"
              style={{
                fontWeight: 600,
                fontSize: 'clamp(0.85rem, 1.8vw, 1.2rem)',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                color: '#8ab4d4',
                lineHeight: 1.2,
                marginBottom: '10px',
              }}
            >
              Manohar's
            </span>
            <span
              className="block"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                letterSpacing: '-1px',
                textTransform: 'uppercase',
                lineHeight: 1.0,
              }}
            >
              <span style={{ color: '#00d4ff' }}>GenAI</span>
              <span style={{ color: '#e8f4ff' }}> Lab.</span>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mx-auto mb-10"
            style={{
              fontFamily: B,
              fontSize: '16px',
              color: '#ffffff',
              maxWidth: '680px',
              lineHeight: 1.8,
              fontWeight: 400,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            I build AI systems, consult BofA teams on prompt engineering and automation, lead GenAI R&D, write about what I learn, and teach it — all inside Bank of America. Python · Agentic pipelines · RAG · LLM frameworks · DevOps for AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/blog">
              <motion.button
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', color: '#000', padding: '14px 32px', borderRadius: '12px', border: 'none', fontFamily: D, fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
                whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,212,255,0.35)' }}
                whileTap={{ scale: 0.97 }}
              >
                Explore the Lab →
              </motion.button>
            </Link>
            <Link href="/projects">
              <motion.button
                style={{ background: 'transparent', color: '#e8f4ff', padding: '14px 32px', borderRadius: '12px', border: '1px solid #1f3a58', fontFamily: D, fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}
                whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
                whileTap={{ scale: 0.97 }}
              >
                View Projects
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FIVE ROLES */}
      <section className="py-20 px-6" style={{ background: '#080f17', borderTop: '1px solid #1a3048' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div style={{ fontFamily: B, fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#00d4ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '1px', background: '#00d4ff', display: 'inline-block' }} />
              What I Do
            </div>
            <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', color: '#e8f4ff' }}>
              Five roles. <span style={{ color: '#00d4ff' }}>One mission.</span>
            </h2>
            <p style={{ fontFamily: B, fontSize: '15px', color: '#8ab4d4', marginTop: '8px' }}>Transform how enterprises think about and use AI.</p>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {ROLES.map((role, i) => (
              <motion.div key={role.title} className="rounded-2xl p-6"
                style={{ background: '#0d1e2e', border: '1px solid #1a3048', borderTop: `3px solid ${role.color}` }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{role.icon}</div>
                <div style={{ fontFamily: D, fontWeight: 700, fontSize: '15px', color: role.color, marginBottom: '8px' }}>{role.title}</div>
                <div style={{ fontFamily: B, fontSize: '13px', color: '#8ab4d4', lineHeight: 1.65 }}>{role.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10">
            <div style={{ fontFamily: B, fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#00d4ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '1px', background: '#00d4ff', display: 'inline-block' }} />Featured
            </div>
            <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', color: '#e8f4ff' }}>
              From the <span style={{ color: '#00d4ff' }}>Lab</span>
            </h2>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
            {featured.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
          </div>
        </section>
      )}

      {/* RECENT POSTS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-10">
          <div style={{ fontFamily: B, fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#00d4ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '24px', height: '1px', background: '#00d4ff', display: 'inline-block' }} />Latest from the Lab
          </div>
          <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', color: '#e8f4ff' }}>
            Recent <span style={{ color: '#00d4ff' }}>Articles</span>
          </h2>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
            <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.2rem', color: '#e8f4ff', marginBottom: '8px' }}>Lab is warming up</h3>
            <p style={{ fontFamily: B, color: '#8ab4d4', fontSize: '14px', marginBottom: '1.5rem' }}>First articles coming soon — real systems, real code, real lessons.</p>
            <Link href="/admin">
              <button style={{ background: 'linear-gradient(135deg,#00d4ff,#0088cc)', color: '#000', padding: '12px 24px', borderRadius: '12px', border: 'none', fontFamily: D, fontWeight: 700, cursor: 'pointer' }}>
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
                  style={{ background: 'transparent', border: '1px solid #1f3a58', color: '#e8f4ff', padding: '12px 32px', borderRadius: '12px', fontFamily: D, fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                  whileHover={{ background: '#0d1e2e', borderColor: '#00d4ff' }}
                >View All Articles →</motion.button>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* RESEARCH AREAS */}
      <section className="py-20 px-6" style={{ background: '#080f17' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div style={{ fontFamily: B, fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#00d4ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '1px', background: '#00d4ff', display: 'inline-block' }} />Research Areas
            </div>
            <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-1px', color: '#e8f4ff' }}>
              What I <span style={{ color: '#00d4ff' }}>Build & Research</span>
            </h2>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {CATEGORIES.map((cat, i) => {
              const count = posts.filter((p) => p.category === cat.name).length
              return (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }}>
                  <Link href={`/blog?category=${encodeURIComponent(cat.name)}`} className="no-underline block">
                    <div className="rounded-2xl p-6 transition-all duration-300" style={{ background: '#0d1e2e', border: '1px solid #1a3048', borderLeft: `3px solid ${cat.color}` }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{cat.emoji}</div>
                      <div style={{ fontFamily: D, fontWeight: 700, fontSize: '13px', color: '#e8f4ff', marginBottom: '4px' }}>{cat.name}</div>
                      <div style={{ fontFamily: B, fontSize: '12px', color: '#4a7a9b' }}>{count} article{count !== 1 ? 's' : ''}</div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-2xl p-12 text-center" style={{ background: 'linear-gradient(135deg, #0d1e2e, #112436)', border: '1px solid #1f3a58' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔬</div>
          <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.8rem', letterSpacing: '-0.5px', color: '#e8f4ff', marginBottom: '12px' }}>Stay in the Loop</h2>
          <p style={{ fontFamily: B, color: '#8ab4d4', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Enterprise AI breakdowns, prompt engineering playbooks, agentic system walkthroughs — straight from the lab.
          </p>
          <NewsletterForm />
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
