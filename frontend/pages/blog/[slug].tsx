import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../../components/layout/Layout'
import PostCard from '../../components/blog/PostCard'
import SEO from '../../components/ui/SEO'
import { api, Post } from '../../lib/api'
import { COVER_GRADIENTS, CAT_EMOJI, formatDate } from '../../lib/utils'

interface Props { post: Post; related: Post[] }

// ── Share helpers ──────────────────────────────────────────────────────────────
function shareOnX(url: string, title: string) {
  const tweet = `${title}\n${url}\n\nby @ManoharPap91329`
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
    '_blank',
    'noopener,noreferrer'
  )
}

function shareOnLinkedIn(url: string) {
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    '_blank',
    'noopener,noreferrer'
  )
}

// ── Table of Contents ──────────────────────────────────────────────────────────
function TOC({ content, title }: { content: string; title: string }) {
  const [tocCopied, setTocCopied] = useState(false)
  const headings: { level: number; text: string; id: string }[] = []

  const allMatches: { index: number; level: number; text: string }[] = []

  ;[...content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].forEach(m => {
    const text = m[1].replace(/<[^>]+>/g, '').trim()
    allMatches.push({ index: m.index || 0, level: 2, text })
  })
  ;[...content.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi)].forEach(m => {
    const text = m[1].replace(/<[^>]+>/g, '').trim()
    allMatches.push({ index: m.index || 0, level: 3, text })
  })

  allMatches.sort((a, b) => a.index - b.index).forEach(({ level, text }) => {
    headings.push({
      level,
      text,
      id: text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    })
  })

  const handleTocShare = (icon: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (icon === '𝕏') shareOnX(url, title)
    else if (icon === 'in') shareOnLinkedIn(url)
    else if (icon === '🔗') {
      navigator.clipboard?.writeText(url)
      setTocCopied(true)
      setTimeout(() => setTocCopied(false), 2000)
    }
  }

  if (!headings.length) return null

  return (
    <div className="rounded-2xl p-6" style={{ background: '#0d1e2e', border: '1px solid #1a3048', position: 'sticky', top: '84px' }}>
      <div className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4a7a9b' }}>On this page</div>
      <ul className="list-none p-0 m-0">
        {headings.map((h) => (
          <li
            key={h.id}
            className="text-sm cursor-pointer py-1.5 transition-all duration-200"
            style={{ paddingLeft: h.level === 3 ? '20px' : '12px', borderLeft: '2px solid #1a3048', color: '#8ab4d4' }}
            onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#00d4ff'
              el.style.borderLeftColor = '#00d4ff'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#8ab4d4'
              el.style.borderLeftColor = '#1a3048'
            }}
          >
            {h.text}
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-5" style={{ borderTop: '1px solid #1a3048' }}>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: '#4a7a9b' }}>Share</div>
        <div className="flex gap-2">
          {[
            { icon: '𝕏',  label: 'Share on X' },
            { icon: 'in', label: 'Share on LinkedIn' },
            { icon: '🔗', label: tocCopied ? 'Copied!' : 'Copy link' },
          ].map(({ icon, label }) => (
            <button
              key={icon}
              title={label}
              className="flex-1 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200"
              style={{
                background: '#112436',
                border: '1px solid #1a3048',
                color: icon === '🔗' && tocCopied ? '#00ff9d' : '#8ab4d4',
                fontFamily: 'Syne, sans-serif',
              }}
              onClick={() => handleTocShare(icon)}
            >
              {icon === '🔗' && tocCopied ? '✓' : icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Article Page ───────────────────────────────────────────────────────────────
export default function ArticlePage({ post, related }: Props) {
  const [copied, setCopied] = useState(false)
  const grad = COVER_GRADIENTS[post.color || 'cyan']
  const coverImage = post.cover_image || ''

  const getPageUrl = () => typeof window !== 'undefined' ? window.location.href : ''
  const handleCopy = () => {
    navigator.clipboard?.writeText(getPageUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const handleShareX = () => shareOnX(getPageUrl(), post.title)
  const handleShareLinkedIn = () => shareOnLinkedIn(getPageUrl())

  return (
    <Layout showProgress>
      <SEO
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        type="article"
        publishedTime={post.date}
        tags={post.tags}
      />

      {/* ── Cover Banner ─────────────────────────────────────────────────────── */}
      {coverImage ? (
        // Real photo uploaded via admin — full bleed with gradient overlay
        <div className="w-full relative overflow-hidden" style={{ height: '420px' }}>
          <img
            src={coverImage}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
          {/* Dark gradient overlay — bottom fade into page background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(8,15,23,0.1) 0%, rgba(8,15,23,0.5) 60%, rgba(8,15,23,0.92) 100%)',
            }}
          />
          {/* Category emoji badge pinned at bottom-center */}
          <div className="absolute bottom-6 left-1/2" style={{ transform: 'translateX(-50%)' }}>
            <span
              className="text-3xl px-4 py-2 rounded-xl"
              style={{
                background: 'rgba(13,30,46,0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,212,255,0.2)',
                display: 'inline-block',
              }}
            >
              {CAT_EMOJI[post.category || ''] || '📄'}
            </span>
          </div>
        </div>
      ) : (
        // Fallback: gradient + big faded emoji (original behaviour)
        <div
          className="w-full flex items-center justify-center overflow-hidden"
          style={{ background: grad, height: '320px' }}
        >
          <span className="text-9xl opacity-15 select-none">
            {CAT_EMOJI[post.category || ''] || '📄'}
          </span>
        </div>
      )}

      <div
        className="max-w-6xl mx-auto px-6 py-10"
        style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '3rem', alignItems: 'start' }}
      >
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-6 no-underline"
            style={{ color: '#8ab4d4' }}
          >
            ← Back to Blog
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags?.map(t => (
              <Link
                key={t}
                href={`/blog/tag/${encodeURIComponent(t)}`}
                className="text-xs px-3 py-1.5 rounded-full no-underline transition-all duration-200"
                style={{ border: '1px solid #1f3a58', color: '#8ab4d4' }}
              >
                {t}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1
            className="font-black text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-1.5px' }}
          >
            {post.title}
          </h1>

          {/* Meta bar */}
          <div
            className="flex items-center gap-6 py-4 mb-8 flex-wrap"
            style={{ borderTop: '1px solid #1a3048', borderBottom: '1px solid #1a3048' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-black"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#a78bfa)' }}
              >
                MP
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Manohar Papasani</div>
                <div className="text-xs" style={{ color: '#4a7a9b' }}>GenAI Automation Lead</div>
              </div>
            </div>
            <div className="w-px h-8 hidden sm:block" style={{ background: '#1a3048' }} />
            <div className="text-sm" style={{ color: '#8ab4d4' }}>{formatDate(post.date)}</div>
            <div className="w-px h-8 hidden sm:block" style={{ background: '#1a3048' }} />
            <div className="text-sm" style={{ color: '#8ab4d4' }}>📖 {post.readTime || 5} min read</div>
            <div className="w-px h-8 hidden sm:block" style={{ background: '#1a3048' }} />
            <div className="text-sm font-semibold text-white">{post.category}</div>
          </div>

          {/* ── Article body — renders HTML content correctly ── */}
          <div className="article-card">
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 mt-10 pt-8" style={{ borderTop: '1px solid #1a3048' }}>
            <button
              onClick={handleShareX}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200"
              style={{ background: '#0d1e2e', border: '1px solid #1a3048', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}
            >
              Share on 𝕏
            </button>
            <button
              onClick={handleShareLinkedIn}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200"
              style={{ background: '#0d1e2e', border: '1px solid #1a3048', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}
            >
              Share on LinkedIn
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200"
              style={{
                background: '#0d1e2e',
                border: '1px solid #1a3048',
                color: copied ? '#00ff9d' : '#8ab4d4',
                fontFamily: 'Syne, sans-serif',
              }}
            >
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
          </div>
        </motion.article>

        <aside className="hidden lg:block">
          <TOC content={post.content || ''} title={post.title} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div
            className="text-xs tracking-widest uppercase font-semibold mb-6 flex items-center gap-2"
            style={{ color: '#00d4ff' }}
          >
            <span className="inline-block w-6 h-px" style={{ background: '#00d4ff' }} />
            Related Articles
          </div>
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}
          >
            {related.map((p, i) => <PostCard key={p.slug} post={p} index={i} />)}
          </div>
        </section>
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await api.getPosts()
    return { paths: posts.map(p => ({ params: { slug: p.slug } })), fallback: 'blocking' }
  } catch {
    return { paths: [], fallback: 'blocking' }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  try {
    const post = await api.getPost(slug)
    const all = await api.getPosts()
    const related = all
      .filter(p => p.slug !== slug && (p.category === post.category || p.tags?.some(t => post.tags?.includes(t))))
      .slice(0, 3)
    return { props: { post, related }, revalidate: 1 }
  } catch {
    return { notFound: true }
  }
}
