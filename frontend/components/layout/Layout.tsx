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

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: '#ffffff',
        zIndex: 100,
      }}
    />
  )
}

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
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      {showProgress && <ReadingProgress />}

      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #222',
          height: '64px',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm bg-white text-black">
              ML
            </div>
            <span className="font-semibold text-base tracking-tight text-white">
              GenAI Lab
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden md:flex gap-8 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium no-underline transition-colors"
                  style={{
                    color: isActive(link.href) ? '#ffffff' : '#9ca3af',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center text-xs font-medium px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
            >
              Admin
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-full left-0 right-0 px-6 py-4"
              style={{
                background: '#0a0a0a',
                borderBottom: '1px solid #222',
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-sm no-underline"
                  style={{
                    color: isActive(link.href) ? '#ffffff' : '#9ca3af',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/admin"
                className="block py-3 text-sm no-underline text-white"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ paddingTop: '64px' }}>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="prose prose-invert max-w-none">
            {children}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="text-center py-12 px-6 mt-16"
        style={{
          background: '#0a0a0a',
          borderTop: '1px solid #222',
        }}
      >
        <div className="font-semibold text-lg mb-3">
          GenAI Lab
        </div>

        <div className="flex gap-6 justify-center mb-4 flex-wrap text-sm text-zinc-500">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Manohar — Building GenAI systems
        </div>
      </footer>
    </div>
  )
}
