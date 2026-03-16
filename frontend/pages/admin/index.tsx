import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../../components/layout/Layout'
import { api, Post } from '../../lib/api'

const CATEGORIES = ['AI Automation', 'Prompt Engineering', 'GenAI Systems', 'LLM Architectures', 'Mini LLM Research', 'Experiments']
const COLORS = ['cyan', 'purple', 'green', 'orange', 'pink']

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').trim()
}

function formatDate(d?: string) {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return d }
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium"
      style={{ background: '#112436', border: '1px solid #00ff9d', color: '#e8f4ff' }}
    >
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#00ff9d' }} />
      {msg}
    </motion.div>
  )
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [loginUser, setLoginUser] = useState('admin')
  const [loginPass, setLoginPass] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  // Editor state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tags, setTags] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [color, setColor] = useState('cyan')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('published')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [editorLabel, setEditorLabel] = useState('New Article')

  useEffect(() => {
    const saved = sessionStorage.getItem('genai_token')
    if (saved) setToken(saved)
  }, [])

  const loadPosts = useCallback(async (tok: string) => {
    try {
      const data = await api.getAllPosts(tok)
      setPosts(data)
    } catch { setPosts([]) }
  }, [])

  useEffect(() => { if (token) loadPosts(token) }, [token, loadPosts])

  const doLogin = async () => {
    setLoginErr('')
    try {
      const res = await api.login(loginUser, loginPass)
      setToken(res.token)
      sessionStorage.setItem('genai_token', res.token)
    } catch {
      setLoginErr('Invalid credentials')
    }
  }

  const clearForm = () => {
    setTitle(''); setSlug(''); setCategory(CATEGORIES[0]); setTags('')
    setExcerpt(''); setColor('cyan'); setContent(''); setStatus('published')
    setEditingSlug(null); setEditorLabel('New Article')
  }

  const handlePublish = async (s: 'published' | 'draft') => {
    if (!title.trim()) { setToast('Please enter a title'); return }
    if (!token) return
    setLoading(true)
    const payload = {
      title, slug: slug || slugify(title), category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      excerpt, color, content, status: s, featured: false,
    }
    try {
      if (editingSlug) {
        await api.updatePost(token, editingSlug, payload)
        setToast(s === 'published' ? '✓ Article updated and published!' : 'Draft saved!')
      } else {
        await api.createPost(token, payload)
        setToast(s === 'published' ? '✓ Article published!' : 'Draft saved!')
      }
      clearForm()
      await loadPosts(token)
    } catch (e: any) {
      setToast(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const editPost = (p: Post) => {
    setTitle(p.title || ''); setSlug(p.slug || '')
    setCategory(p.category || CATEGORIES[0])
    setTags((p.tags || []).join(', '))
    setExcerpt(p.excerpt || ''); setColor(p.color || 'cyan')
    setContent(p.content || '')
    setStatus((p.status as 'published' | 'draft') || 'published')
    setEditingSlug(p.slug || null)
    setEditorLabel(`Editing: ${p.title?.slice(0, 35)}...`)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const deletePost = async (slug: string) => {
    if (!token || !confirm('Delete this article?')) return
    try {
      await api.deletePost(token, slug)
      setToast('Article deleted')
      await loadPosts(token)
    } catch (e: any) { setToast(`Error: ${e.message}`) }
  }

  const inputStyle = {
    width: '100%', background: '#080f17', border: '1px solid #1a3048',
    color: '#e8f4ff', padding: '11px 14px', borderRadius: '10px',
    fontFamily: 'Syne, sans-serif', fontSize: '14px', outline: 'none',
  }
  const labelStyle = { fontSize: '11px', color: '#4a7a9b', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'block' }

  if (!token) {
    return (
      <Layout>
        <Head><title>Admin — Manohar's GenAI Lab</title></Head>
        <div className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: '64px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm rounded-2xl p-10"
            style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-black mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #00d4ff, #a78bfa)' }}>MP</div>
              <h2 className="font-bold text-lg text-white">Admin Access</h2>
              <p className="text-sm mt-1" style={{ color: '#4a7a9b' }}>Manohar's GenAI Lab Dashboard</p>
            </div>
            {loginErr && (
              <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: '#ff4d6d' }}>{loginErr}</div>
            )}
            <div className="mb-4">
              <label style={labelStyle}>Username</label>
              <input style={inputStyle} value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="admin" />
            </div>
            <div className="mb-6">
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && doLogin()} />
            </div>
            <button
              onClick={doLogin}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-black border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Syne, sans-serif' }}
            >
              Access Dashboard →
            </button>
          </motion.div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head><title>Admin Dashboard — Manohar's GenAI Lab</title></Head>
      <AnimatePresence>{toast && <Toast msg={toast} onClose={() => setToast('')} />}</AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10 pb-6" style={{ borderBottom: '1px solid #1a3048' }}>
          <div>
            <h1 className="font-black text-2xl text-white" style={{ letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: '#4a7a9b' }}>Manage your GenAI Lab content</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearForm}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer"
              style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}
            >
              + New Post
            </button>
            <button
              onClick={() => { setToken(null); sessionStorage.removeItem('genai_token') }}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer"
              style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 360px' }}>
          {/* Editor */}
          <div className="rounded-2xl p-7" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
            <div className="text-xs font-semibold tracking-widest uppercase mb-6 flex items-center gap-2" style={{ color: '#4a7a9b' }}>
              ✏️ {editorLabel}
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} value={title} onChange={(e) => { setTitle(e.target.value); if (!editingSlug) setSlug(slugify(e.target.value)) }} placeholder="Enter article title..." />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label style={labelStyle}>Slug</label>
                <input style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Tags (comma separated)</label>
              <input style={inputStyle} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="LLM, RAG, Automation" />
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Excerpt</label>
              <input style={inputStyle} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief description for card preview..." />
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Cover Color Theme</label>
              <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} value={color} onChange={(e) => setColor(e.target.value)}>
                {COLORS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Content (Markdown)</label>
              <textarea
                style={{ ...inputStyle, minHeight: '320px', resize: 'vertical', lineHeight: '1.6', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`## Introduction\n\nWrite your article in Markdown...\n\n\`\`\`python\n# Code example\n\`\`\``}
              />
            </div>
          </div>

          {/* Sidebar: publish + posts list */}
          <div className="flex flex-col gap-5">
            {/* Publish panel */}
            <div className="rounded-2xl p-6" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#4a7a9b' }}>🚀 Publish</div>
              <button
                onClick={() => handlePublish('published')}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm text-black border-none cursor-pointer mb-3 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Syne, sans-serif', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Publishing...' : 'Publish Article'}
              </button>
              <button
                onClick={() => handlePublish('draft')}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer mb-5 transition-all"
                style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}
              >
                Save as Draft
              </button>
              <div className="text-xs leading-loose" style={{ color: '#4a7a9b' }}>
                <strong style={{ color: '#8ab4d4' }}>Publishing will:</strong><br />
                ✓ Create article with auto slug<br />
                ✓ Add to blog listing instantly<br />
                ✓ Generate table of contents<br />
                ✓ Auto-calculate reading time
              </div>
            </div>

            {/* Posts list */}
            <div className="rounded-2xl p-6 flex-1" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#4a7a9b' }}>📋 All Posts ({posts.length})</div>
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-sm" style={{ color: '#4a7a9b' }}>No posts yet. Create your first!</div>
                ) : posts.map((p) => (
                  <div key={p.slug} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{ background: '#080f17', border: '1px solid #1a3048' }}>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white truncate">{p.title}</div>
                      <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: '#4a7a9b' }}>
                        {formatDate(p.date)}
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: p.status === 'published' ? 'rgba(0,255,157,0.1)' : 'rgba(255,140,66,0.1)',
                            color: p.status === 'published' ? '#00ff9d' : '#ff8c42',
                          }}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => editPost(p)}
                        className="px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all"
                        style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(p.slug!)}
                        className="px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all"
                        style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: '#ff4d6d', fontFamily: 'Syne, sans-serif' }}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
