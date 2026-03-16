import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        height: '2px',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #00d4ff, #a78bfa)',
        zIndex: 101,
        transition: 'width 0.1s linear',
        pointerEvents: 'none',
      }}
    />
  )
}
