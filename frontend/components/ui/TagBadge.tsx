import Link from 'next/link'

interface Props {
  tag: string
  active?: boolean
  onClick?: () => void
  href?: string
}

export default function TagBadge({ tag, active, onClick, href }: Props) {
  const style = {
    background: active ? 'rgba(0,212,255,0.1)' : '#0d1e2e',
    borderColor: active ? '#00d4ff' : '#1a3048',
    color: active ? '#00d4ff' : '#8ab4d4',
    fontFamily: 'Syne, sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    padding: '5px 14px',
    borderRadius: '50px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-block',
    textDecoration: 'none',
  }

  if (href) {
    return (
      <Link href={href} style={style}>
        {tag}
      </Link>
    )
  }

  return (
    <span style={style} onClick={onClick}>
      {tag}
    </span>
  )
}
