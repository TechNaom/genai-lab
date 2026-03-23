import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { createLowlight, common } from 'lowlight'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const lowlight = createLowlight(common)

const CLOUDINARY_CLOUD = 'drizd8t4g'
const CLOUDINARY_PRESET = 'genai-lab'

async function uploadToCloudinary(file: File | Blob): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return (await res.json()).secure_url as string
}

function ImageModal({ onInsert, onClose }: { onInsert: (url: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const inp = { width: '100%', background: '#080f17', border: '1px solid #1a3048', color: '#e8f4ff', padding: '10px 13px', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: '14px', outline: 'none' }
  const lbl = { fontSize: '11px', color: '#4a7a9b', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'block' }

  const handleFile = async (file: File) => {
    setUploading(true)
    try { setUrl(await uploadToCloudinary(file)) } catch { alert('Upload failed') } finally { setUploading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-7 w-full max-w-md relative" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}
        onClick={e => e.stopPropagation()}>
        {uploading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(8,15,23,0.85)' }}>
            <span className="text-sm" style={{ color: '#00d4ff' }}>Uploading...</span>
          </div>
        )}
        <div className="text-sm font-bold text-white mb-5">🖼️ Insert Image</div>
        <div className="mb-4 p-4 rounded-xl text-center" style={{ border: '2px dashed #1a3048', background: '#080f17' }}
          onDragOver={e => e.preventDefault()}
          onDrop={async e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f) }}>
          <div className="text-2xl mb-1">☁️</div>
          <div className="text-xs mb-2" style={{ color: '#4a7a9b' }}>Drag & drop or click to upload</div>
          <label className="px-3 py-1.5 rounded-lg text-xs cursor-pointer" style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>
            Choose File
            <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </label>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div style={{ flex: 1, height: '1px', background: '#1a3048' }} />
          <span className="text-xs" style={{ color: '#2a4a6b' }}>or paste a URL</span>
          <div style={{ flex: 1, height: '1px', background: '#1a3048' }} />
        </div>
        <div className="mb-5">
          <label style={lbl}>Image URL</label>
          <input style={inp} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.png" />
        </div>
        {url && <div className="mb-5 rounded-xl overflow-hidden" style={{ border: '1px solid #1a3048' }}>
          <img src={url} alt="" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>}
        <div className="flex gap-3">
          <button onClick={() => { if (url.trim()) { onInsert(url.trim()); onClose() } }} disabled={!url.trim() || uploading}
            className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer border-none"
            style={{ background: url.trim() ? 'linear-gradient(135deg,#00d4ff,#0088cc)' : '#1a3048', color: url.trim() ? '#000' : '#4a7a9b', fontFamily: 'Syne, sans-serif' }}>
            Insert Image
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm cursor-pointer"
            style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function TableModal({ onInsert, onClose }: { onInsert: (rows: number, cols: number) => void; onClose: () => void }) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const s = { background: '#080f17', border: '1px solid #1a3048', color: '#e8f4ff', padding: '10px 13px', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: '14px', outline: 'none', width: '100%' }
  const l = { fontSize: '11px', color: '#4a7a9b', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'block' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-7 w-full max-w-sm" style={{ background: '#0d1e2e', border: '1px solid #1a3048' }}
        onClick={e => e.stopPropagation()}>
        <div className="text-sm font-bold text-white mb-5">📊 Insert Table</div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div><label style={l}>Rows</label><input style={s} type="number" min={1} max={20} value={rows} onChange={e => setRows(Math.max(1, +e.target.value))} /></div>
          <div><label style={l}>Columns</label><input style={s} type="number" min={1} max={10} value={cols} onChange={e => setCols(Math.max(1, +e.target.value))} /></div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { onInsert(rows, cols); onClose() }}
            className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg,#00d4ff,#0088cc)', fontFamily: 'Syne, sans-serif', color: '#000' }}>
            Insert Table
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm cursor-pointer"
            style={{ background: '#112436', border: '1px solid #1f3a58', color: '#8ab4d4', fontFamily: 'Syne, sans-serif' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function TBtn({ label, title, onClick, active = false, disabled = false }: { label: string; title: string; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled} className="px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all select-none"
      style={{ background: active ? 'rgba(0,212,255,0.15)' : 'transparent', border: active ? '1px solid rgba(0,212,255,0.4)' : '1px solid transparent', color: disabled ? '#2a4a6b' : active ? '#00d4ff' : '#8ab4d4', fontFamily: 'JetBrains Mono, monospace', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {label}
    </button>
  )
}

function Div() {
  return <span style={{ width: '1px', height: '18px', background: '#1a3048', display: 'inline-block', margin: '0 4px', verticalAlign: 'middle' }} />
}

interface Props { value: string; onChange: (html: string) => void; placeholder?: string }

export default function TiptapEditor({ value, onChange, placeholder }: Props) {
  const [showImage, setShowImage] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, heading: { levels: [1, 2, 3, 4] } }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: false }),
      TableRow, TableHeader, TableCell,
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing your article...' }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'tiptap-content focus:outline-none' },
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const img = items.find(i => i.type.startsWith('image/'))
        if (img) {
          event.preventDefault()
          const blob = img.getAsFile()
          if (!blob) return false
          setUploading(true)
          uploadToCloudinary(blob)
            .then(url => editor?.chain().focus().setImage({ src: url }).run())
            .catch(() => alert('Image upload failed'))
            .finally(() => setUploading(false))
          return true
        }
        return false
      },
    },
  })

  if (!editor) return null

  const wordCount = editor.getText().split(/\s+/).filter(Boolean).length

  return (
    <div style={{ position: 'relative' }}>
      <AnimatePresence>
        {showImage && <ImageModal onInsert={url => editor.chain().focus().setImage({ src: url }).run()} onClose={() => setShowImage(false)} />}
        {showTable && <TableModal onInsert={(r, c) => editor.chain().focus().insertTable({ rows: r, cols: c, withHeaderRow: true }).run()} onClose={() => setShowTable(false)} />}
      </AnimatePresence>

      {/* Hint */}
      <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg text-xs" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', color: '#4a7a9b' }}>
        <span style={{ color: '#00d4ff' }}>✨</span>
        Paste images → auto-uploads to Cloudinary · Paste tables from Claude → renders instantly
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 rounded-t-xl" style={{ background: '#0a1929', border: '1px solid #1a3048', borderBottom: 'none' }}>
        <TBtn label="H1" title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} />
        <TBtn label="H2" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} />
        <TBtn label="H3" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} />
        <Div />
        <TBtn label="B" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} />
        <TBtn label="I" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} />
        <TBtn label="S̶" title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} />
        <TBtn label="`" title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} />
        <Div />
        <TBtn label="```" title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} />
        <TBtn label="❝" title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} />
        <TBtn label="—" title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <Div />
        <TBtn label="• List" title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} />
        <TBtn label="1. List" title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} />
        <Div />
        <TBtn label={uploading ? '⏳' : '🖼 Image'} title="Insert image" onClick={() => setShowImage(true)} />
        <TBtn label="📊 Table" title="Insert table" onClick={() => setShowTable(true)} />
        {editor.isActive('table') && <>
          <Div />
          <TBtn label="+Col" title="Add column" onClick={() => editor.chain().focus().addColumnAfter().run()} />
          <TBtn label="-Col" title="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()} />
          <TBtn label="+Row" title="Add row" onClick={() => editor.chain().focus().addRowAfter().run()} />
          <TBtn label="-Row" title="Delete row" onClick={() => editor.chain().focus().deleteRow().run()} />
          <TBtn label="✕ Tbl" title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()} />
        </>}
        <div className="ml-auto flex gap-1">
          <TBtn label="↩" title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
          <TBtn label="↪" title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
        </div>
      </div>

      {/* Editor */}
      <div style={{ background: '#ffffff', border: '1px solid #1a3048', borderRadius: '0 0 10px 10px', minHeight: '400px', padding: '24px 28px' }}>
        <EditorContent editor={editor} />
      </div>

      <div className="flex gap-3 mt-2">
        <span className="text-xs" style={{ color: '#2a4a6b' }}>{wordCount} words · ~{Math.ceil(wordCount / 200)} min read</span>
      </div>

      <style>{`
        .tiptap-content { font-family: Georgia, serif; font-size: 16px; line-height: 1.8; color: #1a1a1a; min-height: 360px; outline: none; }
        .tiptap-content h1 { font-size: 2rem; font-weight: 800; margin: 1.5rem 0 0.75rem; color: #111; letter-spacing: -0.5px; line-height: 1.2; }
        .tiptap-content h2 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.75rem; color: #111; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px; }
        .tiptap-content h3 { font-size: 1.2rem; font-weight: 700; margin: 1.25rem 0 0.5rem; color: #1f2937; }
        .tiptap-content h4 { font-size: 1rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #374151; }
        .tiptap-content p { margin-bottom: 1rem; color: #374151; }
        .tiptap-content ul, .tiptap-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .tiptap-content li { margin-bottom: 0.35rem; color: #374151; }
        .tiptap-content strong { color: #111; font-weight: 700; }
        .tiptap-content em { font-style: italic; }
        .tiptap-content s { text-decoration: line-through; }
        .tiptap-content code:not(pre code) { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.875em; color: #d63384; }
        .tiptap-content pre { background: #1e1e1e; border-radius: 10px; padding: 1rem 1.25rem; margin: 1.25rem 0; overflow-x: auto; }
        .tiptap-content pre code { background: none; border: none; padding: 0; color: #d4d4d4; font-size: 14px; font-family: 'JetBrains Mono', monospace; }
        .tiptap-content blockquote { border-left: 4px solid #00d4ff; padding: 0.75rem 1.25rem; margin: 1.25rem 0; background: #f0fbff; border-radius: 0 8px 8px 0; color: #374151; font-style: italic; }
        .tiptap-content hr { border: none; border-top: 2px solid #f3f4f6; margin: 2rem 0; }
        .tiptap-content a { color: #0077cc; text-decoration: underline; text-underline-offset: 3px; }
        .tiptap-content img { max-width: 100%; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 1px 8px rgba(0,0,0,0.08); margin: 1.25rem 0; display: block; }
        .tiptap-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
        .tiptap-content th { background: #f3f4f6; padding: 10px 14px; text-align: left; font-weight: 700; font-size: 13px; color: #111; border-bottom: 2px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
        .tiptap-content td { padding: 10px 14px; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6; border-right: 1px solid #f3f4f6; }
        .tiptap-content tr:last-child td { border-bottom: none; }
        .tiptap-content tr:hover td { background: #fafafa; }
        .tiptap-content .selectedCell { background: rgba(0,212,255,0.08) !important; }
        .tiptap-content p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #adb5bd; pointer-events: none; float: left; height: 0; font-style: italic; font-family: Georgia, serif; }
      `}</style>
    </div>
  )
}
