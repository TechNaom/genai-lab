import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

interface LayoutProps {
  children: ReactNode
  showProgress?: boolean
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    window.addEventListener('scroll', update)
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <div id="reading-progress" style={{ width: `${progress}%` }} />
}

const D = 'Plus Jakarta Sans, sans-serif'
const B = 'Inter, sans-serif'

export default function Layout({ children, showProgress }: LayoutProps) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/experiments', label: 'Experiments' },
    { href: '/about', label: 'About' },
  ]

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href)

  return (
    <>
      {showProgress && <ReadingProgress />}

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(5,10,15,0.95)' : 'rgba(5,10,15,0.75)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #1a3048',
          height: '64px',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-black"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #a78bfa)', fontFamily: D }}
            >
              MP
            </div>
            <span style={{ fontFamily: D, fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px', color: '#e8f4ff' }}>
              Manohar's{' '}
              <span style={{ color: '#00d4ff' }}>GenAI</span>
              {' '}Lab
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-8 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="no-underline transition-colors duration-200"
                  style={{
                    fontFamily: B,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isActive(link.href) ? '#e8f4ff' : '#8ab4d4',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-2 no-underline transition-all duration-200 px-4 py-2 rounded-lg"
              style={{
                fontFamily: B,
                fontSize: '13px',
                fontWeight: 600,
                background: '#112436',
                border: '1px solid #1f3a58',
                color: '#00d4ff',
              }}
            >
              Admin ⌘
            </Link>
            <button
              className="md:hidden text-white bg-transparent border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-full left-0 right-0 py-4 px-6"
              style={{ background: '#080f17', borderBottom: '1px solid #1a3048' }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-sm no-underline"
                  style={{ fontFamily: B, color: isActive(link.href) ? '#00d4ff' : '#8ab4d4' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="block py-3 text-sm no-underline"
                style={{ fontFamily: B, color: '#00d4ff' }}
                onClick={() => setMobileOpen(false)}
              >
                Admin ⌘
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page content */}
      <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        className="text-center py-12 px-6 mt-16"
        style={{ background: '#080f17', borderTop: '1px solid #1a3048' }}
      >
        <div style={{ fontFamily: D, fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.3px', marginBottom: '12px', color: '#e8f4ff' }}>
          Manohar's <span style={{ color: '#00d4ff' }}>GenAI</span> Lab
        </div>
        <div className="flex gap-8 justify-center mb-4 flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="no-underline transition-colors duration-200"
              style={{ fontFamily: B, fontSize: '13px', color: '#4a7a9b' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div style={{ fontFamily: B, fontSize: '12px', color: '#4a7a9b' }}>
          © {new Date().getFullYear()} Manohar Papasani · AVP & AI Transformation Architect @ Bank of America
        </div>
      </footer>
    </>
  )
}
