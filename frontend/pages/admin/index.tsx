import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

const TiptapEditor = dynamic(() => import('../../components/admin/TiptapEditor'), { ssr: false })
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../../components/layout/Layout'
import { api, Post } from '../../lib/api'

const CATEGORIES = ['AI Automation', 'Prompt Engineering', 'GenAI Systems', 'LLM Architectures', 'Mini LLM Research', 'Experiments']
const COLORS = ['cyan', 'purple', 'green', 'orange', 'pink']

// ── Cloudinary config (unsigned preset — safe to commit) ──────────────────
const CLOUDINARY_CLOUD = 'drizd8t4g'
const CLOUDINARY_PRESET = 'genai-lab'

async function uploadToCloudinary(file: File | Blob): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.secure_url as string
}

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

function UploadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
      style={{ background: 'rgba(8,15,23,0.85)', backdropFilter: 'blur(4px)' }}>
      <motion.div
        animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-8 h-8 rounded-full border-2 mb-3"
        style={{ borderColor: '#00d4ff transparent #00d4ff transparent' }}
      />
      <div className="text-sm font-semibold" style={{ color: '#00d4ff' }}>Uploading to Cloudinary...</div>
      <div className="text-xs mt-1" style={{ color: '#4a7a9b' }}>Please wait</div>
    </div>
  )
}

// ── Cover Image Uploader ──────────────────────────────────────────────────────
function CoverImageUploader({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      onChange(url)
    } catch {
      alert('Cover image upload failed. Check your Cloudinary config.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-4">
      <label style={{ fontSize: '11px', color: '#4a7a9b', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'block' }}>
        Cover Image
      </label>

      {/* Preview */}
      {value && !uploading && (
        <div className="relative mb-3 rounded-xl overflow-hidden" style={{ border: '1px solid #1a3048', height: '160px' }}>
          <img src={value} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer border-none"
            style={{ background: 'rgba(255,77,109,0.85)', color: '#fff', fontWeight: 700 }}
            title="Remove cover image"
          >✕</button>
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs"
            style={{ background: 'rgba(13,30,46,0.85)', color: '#00ff9d', fontFamily: 'Syne, sans-serif' }}>
            ✓ Cover set
          </div>
        </div>
      )}

      {/* Upload zone */}
      {!value && (
        <div
          className="relative rounded-xl text-center cursor-pointer transition-all duration-200"
          style={{
            border: `2px dashed ${dragOver ? '#00d4ff' : '#1a3048'}`,
            background: dragOver ? 'rgba(0,212,255,0.04)' : '#080f17',
            padding: '28px 16px',
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={async e => {
            e.preventDefault(); setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-7 h-7 rounded-full border-2"
                style={{ borderColor: '#00d4ff transparent #00d4ff transparent' }}
              />
              <div className="text-xs" style={{ color: '#00d4ff' }}>Uploading cover...</div>
            </div>
          ) : (
            <>
              <div className="text-3xl mb-2">🖼️</div>
              <div className="text-sm font-semibold mb-1" style={{ color: '#8ab4d4' }}>
                {dragOver ? 'Drop to upload' : 'Upload cover image'}
              </div>
              <div className="text-xs" style={{ color: '#4a7a9b' }}>
                Drag & drop or click · JPG, PNG, WebP · Recommended: 1200×630px
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>
      )}

      {/* URL input fallback */}
      <div className="mt-2 flex gap-2">
        <input
          style={{
            flex: 1, background: '#080f17', border: '1px solid #1a3048',
            color: '#e8f4ff', padding: '8px 12px', borderRadius: '8px',
            fontFamily: 'Syne, sans-serif', fontSize: '12px', outline: 'none',
          }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste image URL directly..."
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="px-3 py-2 rounded-lg text-xs cursor-pointer"
            style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: '#ff4d6d', fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap' }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

function ImageModal({ onInsert, onClose }: { onInsert: (md: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [uploading, setUploading] = useState(false)
  const inp = { width: '100%', background: '#080f17', border: '1px solid #1a3048', color: '#e8f4ff', padding: '10px 13px', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: '14px', outline: 'none' }
  const lbl = { fontSize: '11px', color: '#4a7a9b', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'block' }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const uploadedUrl = await uploadToCloudinary(file)
      setUrl(uploadedUrl)
    } catch { alert('Upload failed. Check your Cloudinary config.') }
    finally { setUploading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-7 w-full max-w-md relative"
        style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}
        onClick={e => e.stopPropagation()}
      >
        {uploading && <UploadingOverlay />}
        <div className="text-sm font-bold text-white mb-5">🖼️ Insert Image</div>

        <div className="mb-4 p-4 rounded-xl text-center cursor-pointer transition-all"
          style={{ border: '2px dashed #1a3048', background: '#080f17' }}
          onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#00d4ff' }}
          onDragLeave={e => { e.currentTarget.style.borderColor = '#1a3048' }}
          onDrop={async e => {
            e.preventDefault()
            e.currentTarget.style.borderColor = '#1a3048'
            const file = e.dataTransfer.files[0]
            if (file && file.type.startsWith('image/')) {
              setUploading(true)
              try { setUrl(await uploadToCloudinary(file)) } catch { alert('Upload failed') } finally { setUploading(false) }
            }
          }}
        >
          <div className="text-2xl mb-1">☁️</div>
          <div className="text-xs mb-2" style={{ color: '#4a7a9b' }}>Drag & drop or click to upload</div>
          <label className="px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>
            Choose File
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div style={{ flex: 1, height: '1px', background: '#1a3048' }} />
          <span className="text-xs" style={{ color: '#2a4a6b' }}>or paste a URL</span>
          <div style={{ flex: 1, height: '1px', background: '#1a3048' }} />
        </div>

        <div className="mb-4">
          <label style={lbl}>Image URL</label>
          <input style={inp} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.png" />
        </div>
        <div className="mb-5">
          <label style={lbl}>Alt Text / Caption</label>
          <input style={inp} value={alt} onChange={e => setAlt(e.target.value)} placeholder="Describe the image..." />
        </div>
        {url && (
          <div className="mb-5 rounded-xl overflow-hidden" style={{ border: '1px solid #1a3048' }}>
            <img src={url} alt={alt} style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => { if (url.trim()) { onInsert(`![${alt || 'image'}](${url.trim()})`); onClose() } }}
            disabled={!url.trim() || uploading}
            className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer border-none"
            style={{ background: url.trim() ? 'linear-gradient(135deg, #00d4ff, #0088cc)' : '#1a3048', color: url.trim() ? '#000' : '#4a7a9b', fontFamily: 'Syne, sans-serif' }}
          >Insert Image</button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm cursor-pointer"
            style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function TableModal({ onInsert, onClose }: { onInsert: (md: string) => void; onClose: () => void }) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const inp = { background: '#080f17', border: '1px solid #1a3048', color: '#e8f4ff', padding: '10px 13px', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: '14px', outline: 'none', width: '100%' }
  const lbl = { fontSize: '11px', color: '#4a7a9b', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'block' }

  const buildTable = () => {
    const headers = Array.from({ length: cols }, (_, i) => `Column ${i + 1}`)
    const sep = Array.from({ length: cols }, () => '---')
    const dataRow = Array.from({ length: cols }, () => 'Cell')
    let md = `| ${headers.join(' | ')} |\n`
    md += `| ${sep.join(' | ')} |\n`
    for (let r = 0; r < rows; r++) md += `| ${dataRow.join(' | ')} |\n`
    return md
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-7 w-full max-w-sm"
        style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-sm font-bold text-white mb-5">📊 Insert Table</div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div><label style={lbl}>Rows</label><input style={inp} type="number" min={1} max={20} value={rows} onChange={e => setRows(Math.max(1, +e.target.value))} /></div>
          <div><label style={lbl}>Columns</label><input style={inp} type="number" min={1} max={10} value={cols} onChange={e => setCols(Math.max(1, +e.target.value))} /></div>
        </div>
        <div className="mb-5 p-3 rounded-xl overflow-x-auto" style={{ background: '#080f17', border: '1px solid #1a3048' }}>
          <pre style={{ fontSize: '11px', color: '#4a7a9b', margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>{buildTable()}</pre>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { onInsert('\n' + buildTable()); onClose() }}
            className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Syne, sans-serif', color: '#000' }}>
            Insert Table
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm cursor-pointer"
            style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>Cancel</button>
        </div>
      </motion.div>
    </div>
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

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tags, setTags] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [color, setColor] = useState('cyan')
  const [coverImage, setCoverImage] = useState('')   // ← NEW
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('published')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [editorLabel, setEditorLabel] = useState('New Article')
  const [showImageModal, setShowImageModal] = useState(false)
  const [showTableModal, setShowTableModal] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [pasteUploading, setPasteUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('genai_token')
    if (saved) setToken(saved)
  }, [])

  const loadPosts = useCallback(async (tok: string) => {
    try { const data = await api.getAllPosts(tok); setPosts(data) }
    catch { setPosts([]) }
  }, [])

  useEffect(() => { if (token) loadPosts(token) }, [token, loadPosts])

  const doLogin = async () => {
    setLoginErr('')
    try {
      const res = await api.login(loginUser, loginPass)
      setToken(res.token)
      sessionStorage.setItem('genai_token', res.token)
    } catch { setLoginErr('Invalid credentials') }
  }

  const clearForm = () => {
    setTitle(''); setSlug(''); setCategory(CATEGORIES[0]); setTags('')
    setExcerpt(''); setColor('cyan'); setCoverImage(''); setContent('')
    setStatus('published'); setEditingSlug(null)
    setEditorLabel('New Article'); setPreviewMode(false)
  }

  const insertMarkdown = (prefix: string, suffix = '', block = false, placeholder = '') => {
    const ta = textareaRef.current
    if (!ta) { setContent(prev => prev + prefix + (placeholder || '') + suffix); return }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end)
    const insert = selected || placeholder || ''
    let before = content.slice(0, start)
    let after = content.slice(end)
    if (block) {
      if (before.length && !before.endsWith('\n')) before += '\n'
      if (after.length && !after.startsWith('\n')) after = '\n' + after
    }
    const newContent = before + prefix + insert + suffix + after
    setContent(newContent)
    setTimeout(() => {
      ta.focus()
      const pos = before.length + prefix.length + insert.length + suffix.length
      ta.setSelectionRange(pos, pos)
    }, 0)
  }

  const insertRaw = (text: string) => {
    const ta = textareaRef.current
    if (!ta) { setContent(prev => prev + text); return }
    const start = ta.selectionStart
    const newContent = content.slice(0, start) + text + content.slice(start)
    setContent(newContent)
    setTimeout(() => {
      ta.focus()
      const pos = start + text.length
      ta.setSelectionRange(pos, pos)
    }, 0)
  }

  const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items)
    const imageItem = items.find(item => item.type.startsWith('image/'))
    if (imageItem) {
      e.preventDefault()
      setPasteUploading(true)
      setToast('⏳ Uploading pasted image...')
      try {
        const blob = imageItem.getAsFile()
        if (!blob) throw new Error('No file')
        const url = await uploadToCloudinary(blob)
        insertRaw(`![diagram](${url})`)
        setToast('✓ Image uploaded and inserted!')
      } catch {
        setToast('❌ Image upload failed. Try the 🖼 Image button instead.')
      } finally {
        setPasteUploading(false)
      }
      return
    }

    const htmlItem = items.find(item => item.type === 'text/html')
    if (htmlItem) {
      htmlItem.getAsString((html) => {
        if (!html.includes('<table')) return
        e.preventDefault()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const tables = Array.from(doc.querySelectorAll('table'))
        if (tables.length === 0) return
        const markdownTables = tables.map((table) => {
          const rows = Array.from(table.querySelectorAll('tr'))
          if (rows.length === 0) return ''
          const parseRow = (row: Element) =>
            Array.from(row.querySelectorAll('th, td'))
              .map(cell => cell.textContent?.trim().replace(/\|/g, '\\|') || '')
          const headerRow = parseRow(rows[0])
          const separator = headerRow.map(() => '---')
          const bodyRows = rows.slice(1).map(parseRow)
          const lines = [
            `| ${headerRow.join(' | ')} |`,
            `| ${separator.join(' | ')} |`,
            ...bodyRows.map(r => `| ${r.join(' | ')} |`),
          ]
          return lines.join('\n')
        })
        insertRaw('\n' + markdownTables.join('\n\n') + '\n')
        setToast('✓ Table converted to Markdown!')
      })
      return
    }
  }, [content])

  const handlePublish = async (s: 'published' | 'draft') => {
    if (!title.trim()) { setToast('Please enter a title'); return }
    if (!token) return
    setLoading(true)
    const payload = {
      title,
      slug: slug || slugify(title),
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      excerpt,
      color,
      cover_image: coverImage,   // ← NEW — sent to backend
      content,
      status: s,
      featured: false,
    }
    try {
      if (editingSlug) {
        await api.updatePost(token, editingSlug, payload)
        setToast(s === 'published' ? '✓ Article updated and published!' : 'Draft saved!')
      } else {
        await api.createPost(token, payload)
        setToast(s === 'published' ? '✓ Article published!' : 'Draft saved!')
      }
      clearForm(); await loadPosts(token)
    } catch (e: any) {
      const msg = typeof e === 'string' ? e : e?.message && e.message !== '[object Object]' ? e.message : e?.detail ? e.detail : JSON.stringify(e)
      setToast(`Error: ${msg}`)
    } finally { setLoading(false) }
  }

  const editPost = (p: Post) => {
    setTitle(p.title || ''); setSlug(p.slug || '')
    setCategory(p.category || CATEGORIES[0])
    setTags((p.tags || []).join(', '))
    setExcerpt(p.excerpt || ''); setColor(p.color || 'cyan')
    setCoverImage((p as any).cover_image || '')   // ← NEW
    setContent(p.content || '')
    setStatus((p.status as 'published' | 'draft') || 'published')
    setEditingSlug(p.slug || null)
    setEditorLabel(`Editing: ${p.title?.slice(0, 35)}...`)
    setPreviewMode(false)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const deletePost = async (slug: string) => {
    if (!token || !confirm('Delete this article?')) return
    try { await api.deletePost(token, slug); setToast('Article deleted'); await loadPosts(token) }
    catch (e: any) { setToast(`Error: ${e.message}`) }
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm rounded-2xl p-10"
            style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-black mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #a78bfa)' }}>MP</div>
              <h2 className="font-bold text-lg text-white">Admin Access</h2>
              <p className="text-sm mt-1" style={{ color: '#4a7a9b' }}>Manohar's GenAI Lab Dashboard</p>
            </div>
            {loginErr && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: '#ff4d6d' }}>{loginErr}</div>}
            <div className="mb-4">
              <label style={labelStyle}>Username</label>
              <input style={inputStyle} value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="admin" />
            </div>
            <div className="mb-6">
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && doLogin()} />
            </div>
            <button onClick={doLogin} className="w-full py-4 rounded-xl font-bold text-sm text-black border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Syne, sans-serif' }}>
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
      <AnimatePresence>
        {showImageModal && <ImageModal onInsert={insertRaw} onClose={() => setShowImageModal(false)} />}
        {showTableModal && <TableModal onInsert={insertRaw} onClose={() => setShowTableModal(false)} />}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10 pb-6" style={{ borderBottom: '1px solid #1a3048' }}>
          <div>
            <h1 className="font-black text-2xl text-white" style={{ letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: '#4a7a9b' }}>Manage your GenAI Lab content</p>
          </div>
          <div className="flex gap-3">
            <button onClick={clearForm} className="px-4 py-2 rounded-lg text-sm cursor-pointer"
              style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>+ New Post</button>
            <button onClick={() => { setToken(null); sessionStorage.removeItem('genai_token') }} className="px-4 py-2 rounded-lg text-sm cursor-pointer"
              style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>Logout</button>
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
              <input style={inputStyle} value={title} onChange={e => { setTitle(e.target.value); if (!editingSlug) setSlug(slugify(e.target.value)) }} placeholder="Enter article title..." />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label style={labelStyle}>Slug</label>
                <input style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }} value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated" />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Tags (comma separated)</label>
              <input style={inputStyle} value={tags} onChange={e => setTags(e.target.value)} placeholder="LLM, RAG, Automation" />
            </div>

            <div className="mb-4">
              <label style={labelStyle}>Excerpt</label>
              <input style={inputStyle} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief description for card preview..." />
            </div>

            {/* ── Cover Image Upload ── */}
            <CoverImageUploader value={coverImage} onChange={setCoverImage} />

            <div className="mb-4">
              <label style={labelStyle}>Cover Color Theme</label>
              <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} value={color} onChange={e => setColor(e.target.value)}>
                {COLORS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>

            <div style={{ margin: '0 -7px' }}>
              <label style={{ ...labelStyle, marginLeft: '7px' }}>Content</label>
              <TiptapEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your article... Paste images or tables from Claude directly!"
              />
          </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-6" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#4a7a9b' }}>🚀 Publish</div>
              <button onClick={() => handlePublish('published')} disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm text-black border-none cursor-pointer mb-3 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0088cc)', fontFamily: 'Syne, sans-serif', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Publishing...' : 'Publish Article'}
              </button>
              <button onClick={() => handlePublish('draft')} disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer mb-5 transition-all"
                style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>
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

            <div className="rounded-2xl p-6" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#4a7a9b' }}>☁️ Image Workflow</div>
              <div className="text-xs leading-loose" style={{ color: '#4a7a9b' }}>
                <strong style={{ color: '#00d4ff' }}>Cover image:</strong><br />
                Upload above → replaces gradient banner ✓<br /><br />
                <strong style={{ color: '#00d4ff' }}>Auto (recommended):</strong><br />
                Copy any image → Paste in editor → Auto-uploads ✓<br /><br />
                <strong style={{ color: '#8ab4d4' }}>Manual:</strong><br />
                Click 🖼 Image → Upload file or paste URL<br /><br />
                <strong style={{ color: '#8ab4d4' }}>Markdown:</strong><br />
                <code style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace' }}>![alt](url)</code>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#4a7a9b' }}>📝 Markdown Tips</div>
              <div className="text-xs leading-relaxed" style={{ color: '#4a7a9b' }}>
                {[
                  ['## Heading', 'H2 section'],
                  ['**bold**', 'Bold text'],
                  ['_italic_', 'Italic text'],
                  ['`code`', 'Inline code'],
                  ['![alt](url)', '→ Image'],
                  ['| col | col |', '→ Table row'],
                  ['> quote', 'Blockquote'],
                ].map(([syntax, desc]) => (
                  <div key={syntax} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #0d1e2e' }}>
                    <span style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace' }}>{syntax}</span>
                    <span style={{ color: '#2a4a6b' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 flex-1" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#4a7a9b' }}>📋 All Posts ({posts.length})</div>
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-sm" style={{ color: '#4a7a9b' }}>No posts yet. Create your first!</div>
                ) : posts.map(p => (
                  <div key={p.slug} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{ background: '#080f17', border: '1px solid #1a3048' }}>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white truncate">{p.title}</div>
                      <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: '#4a7a9b' }}>
                        {formatDate(p.date)}
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: p.status === 'published' ? 'rgba(0,255,157,0.1)' : 'rgba(255,140,66,0.1)', color: p.status === 'published' ? '#00ff9d' : '#ff8c42' }}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => editPost(p)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                        style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>Edit</button>
                      <button onClick={() => deletePost(p.slug!)} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                        style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', color: '#ff4d6d', fontFamily: 'Syne, sans-serif' }}>Del</button>
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
