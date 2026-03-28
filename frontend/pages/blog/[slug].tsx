import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Layout from '../../components/layout/Layout'
import PostCard from '../../components/blog/PostCard'
import SEO from '../../components/ui/SEO'
import { api, Post } from '../../lib/api'
import { COVER_GRADIENTS, CAT_EMOJI, formatDate } from '../../lib/utils'

interface Props { post: Post; related: Post[] }

function TOC({ content }: { content: string }) {
  const headings: { level: number; text: string; id: string }[] = []
  content.split('\n').forEach((line) => {
    const m2 = line.match(/^## (.+)/)
    const m3 = line.match(/^### (.+)/)
    if (m2) { const t = m2[1].trim(); headings.push({ level:2, text:t, id:t.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'') }) }
    else if (m3) { const t = m3[1].trim(); headings.push({ level:3, text:t, id:t.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'') }) }
  })
  if (!headings.length) return null
  return (
    <div className="rounded-2xl p-6" style={{ background:'#0d1e2e', border:'1px solid #1a3048', position:'sticky', top:'84px' }}>
      <div className="text-xs tracking-widest uppercase mb-4" style={{ color:'#4a7a9b' }}>On this page</div>
      <ul className="list-none p-0 m-0">
        {headings.map((h) => (
          <li key={h.id} className="text-sm cursor-pointer py-1.5 transition-all duration-200"
            style={{ paddingLeft: h.level===3 ? '20px':'12px', borderLeft:'2px solid #1a3048', color:'#8ab4d4' }}
            onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior:'smooth' })}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color='#00d4ff'; el.style.borderLeftColor='#00d4ff' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color='#8ab4d4'; el.style.borderLeftColor='#1a3048' }}
          >{h.text}</li>
        ))}
      </ul>
      <div className="mt-6 pt-5" style={{ borderTop:'1px solid #1a3048' }}>
        <div className="text-xs tracking-widest uppercase mb-3" style={{ color:'#4a7a9b' }}>Share</div>
        <div className="flex gap-2">
          {['𝕏','in','🔗'].map(icon => (
            <button key={icon} className="flex-1 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200"
              style={{ background:'#112436', border:'1px solid #1a3048', color:'#8ab4d4', fontFamily:'Syne, sans-serif' }}
              onClick={() => icon === '🔗' && navigator.clipboard?.writeText(window.location.href)}
            >{icon}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ArticlePage({ post, related }: Props) {
  const [copied, setCopied] = useState(false)
  const grad = COVER_GRADIENTS[post.color || 'cyan']
  const handleCopy = () => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <Layout showProgress>
      <SEO title={post.title} description={post.excerpt} slug={post.slug} type="article" publishedTime={post.date} tags={post.tags} />

      {/* Cover banner — full width, uses real image if set, else gradient */}
      <div className="w-full overflow-hidden" style={{ height: '360px', position: 'relative' }}>
        {(post as any).coverImage ? (
          <img
            src={(post as any).coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: grad }}>
            <span className="text-9xl opacity-15 select-none">{CAT_EMOJI[post.category || ''] || '📄'}</span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10" style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'3rem', alignItems:'start' }}>
        <motion.article initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>

          <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-6 no-underline" style={{ color:'#8ab4d4' }}>← Back to Blog</Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags?.map(t => (
              <Link key={t} href={`/blog/tag/${encodeURIComponent(t)}`} className="text-xs px-3 py-1.5 rounded-full no-underline transition-all duration-200" style={{ border:'1px solid #1f3a58', color:'#8ab4d4' }}>{t}</Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-black text-white leading-tight mb-6" style={{ fontSize:'clamp(2rem,5vw,3rem)', letterSpacing:'-1.5px' }}>{post.title}</h1>

          {/* Meta bar */}
          <div className="flex items-center gap-6 py-4 mb-8 flex-wrap" style={{ borderTop:'1px solid #1a3048', borderBottom:'1px solid #1a3048' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-black" style={{ background:'linear-gradient(135deg,#00d4ff,#a78bfa)' }}>MP</div>
              <div><div className="text-sm font-semibold text-white">Manohar Papasani</div><div className="text-xs" style={{ color:'#4a7a9b' }}>GenAI Automation Lead</div></div>
            </div>
            <div className="w-px h-8 hidden sm:block" style={{ background:'#1a3048' }} />
            <div className="text-sm" style={{ color:'#8ab4d4' }}>{formatDate(post.date)}</div>
            <div className="w-px h-8 hidden sm:block" style={{ background:'#1a3048' }} />
            <div className="text-sm" style={{ color:'#8ab4d4' }}>📖 {post.readTime||5} min read</div>
            <div className="w-px h-8 hidden sm:block" style={{ background:'#1a3048' }} />
            <div className="text-sm font-semibold text-white">{post.category}</div>
          </div>

          {/* ── White article card — Hashnode style ── */}
          <div className="article-card">
            <div className="article-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}
                components={{
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !match ? <code className={className} {...props}>{children}</code> : (
                      <SyntaxHighlighter style={vscDarkPlus as any} language={match[1]} PreTag="div"
                        customStyle={{ borderRadius:'10px', fontSize:'14px', border:'1px solid #e5e7eb', margin:'1.5rem 0' }}>
                        {String(children).replace(/\n$/,'')}
                      </SyntaxHighlighter>
                    )
                  },
                  table({ children }: any) {
                    return (
                      <div style={{ overflowX:'auto', margin:'1.5rem 0', borderRadius:'10px', border:'1px solid #e5e7eb' }}>
                        <table style={{ width:'100%', borderCollapse:'collapse' }}>{children}</table>
                      </div>
                    )
                  },
                  th({ children }: any) {
                    return <th style={{ padding:'10px 16px', textAlign:'left', background:'#f3f4f6', color:'#111827', fontSize:'13px', fontWeight:700, borderBottom:'2px solid #e5e7eb' }}>{children}</th>
                  },
                  td({ children }: any) {
                    return <td style={{ padding:'10px 16px', fontSize:'14px', color:'#374151', borderBottom:'1px solid #f3f4f6' }}>{children}</td>
                  },
                  tr({ children }: any) {
                    return <tr style={{ transition:'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background='#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background='')}>{children}</tr>
                  },
                  img({ src, alt }: any) {
                    return (
                      <span style={{ display:'block', margin:'2rem 0' }}>
                        <img
                          src={src}
                          alt={alt || ''}
                          style={{
                            maxWidth:'100%',
                            width:'100%',
                            borderRadius:'10px',
                            border:'1px solid #e5e7eb',
                            boxShadow:'0 1px 8px rgba(0,0,0,0.08)',
                            display:'block',
                          }}
                        />
                        {alt && alt !== 'image' && alt !== 'diagram' && (
                          <span style={{ display:'block', fontSize:'13px', color:'#6b7280', marginTop:'8px', fontStyle:'italic', textAlign:'center' }}>
                            {alt}
                          </span>
                        )}
                      </span>
                    )
                  },
                  a({ href, children }: any) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        style={{ color:'#0077cc', textDecoration:'underline', textUnderlineOffset:'3px' }}>
                        {children}
                      </a>
                    )
                  },
                  blockquote({ children }: any) {
                    return (
                      <blockquote style={{
                        borderLeft:'4px solid #00d4ff',
                        paddingLeft:'1.5rem',
                        margin:'2rem 0',
                        background:'#f0fbff',
                        borderRadius:'0 10px 10px 0',
                        padding:'1rem 1.5rem',
                        fontStyle:'italic',
                        color:'#374151',
                      }}>
                        {children}
                      </blockquote>
                    )
                  },
                }}
              >{post.content || ''}</ReactMarkdown>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 mt-10 pt-8" style={{ borderTop:'1px solid #1a3048' }}>
            {[{label:'Share on 𝕏'},{label:'Share on LinkedIn'},{label: copied ? '✓ Copied!' : '🔗 Copy Link', onClick: handleCopy}].map(btn => (
              <button key={btn.label} onClick={btn.onClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200"
                style={{ background:'#0d1e2e', border:'1px solid #1a3048', color: btn.label.includes('Copied') ? '#00ff9d' : '#8ab4d4', fontFamily:'Syne, sans-serif' }}>
                {btn.label}
              </button>
            ))}
          </div>
        </motion.article>

        <aside className="hidden lg:block"><TOC content={post.content||''} /></aside>
      </div>
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="text-xs tracking-widest uppercase font-semibold mb-6 flex items-center gap-2" style={{ color:'#00d4ff' }}>
            <span className="inline-block w-6 h-px" style={{ background:'#00d4ff' }} /> Related Articles
          </div>
          <div className="grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))' }}>
            {related.map((p,i) => <PostCard key={p.slug} post={p} index={i} />)}
          </div>
        </section>
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try { const posts = await api.getPosts(); return { paths: posts.map(p => ({ params:{ slug:p.slug } })), fallback:'blocking' } }
  catch { return { paths:[], fallback:'blocking' } }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  try {
    const post = await api.getPost(slug)
    const all = await api.getPosts()
    const related = all.filter(p => p.slug!==slug && (p.category===post.category || p.tags?.some(t => post.tags?.includes(t)))).slice(0,3)
    return { props:{ post, related }, revalidate:60 }
  } catch { return { notFound:true } }
}
