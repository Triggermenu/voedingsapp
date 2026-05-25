import { Link } from 'react-router-dom'

interface Props {
  size?: number
  className?: string
  to?: string
}

// Brand mark — rounded square with editorial T-shape + ochre accent dot
function Mark({ size = 32 }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="0" y="0" width="32" height="32" rx="9" fill="var(--brand)" />
      <path d="M9 10 H23 M16 10 V23" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="22.5" cy="9.5" r="3" fill="var(--ochre)" />
    </svg>
  )
}

export function Logo({ size = 28, className = '', to }: Props) {
  const textSize = Math.round(size * 0.72)
  const inner = (
    <>
      <Mark size={size + 4} />
      <span
        className="serif"
        style={{ fontSize: textSize, fontWeight: 500, letterSpacing: -0.4, color: 'var(--ink)' }}
      >
        Triggermenu
      </span>
    </>
  )
  if (to) {
    return (
      <Link to={to} className={`flex items-center gap-2.5 ${className}`} style={{ lineHeight: 1, textDecoration: 'none' }}>
        {inner}
      </Link>
    )
  }
  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ lineHeight: 1 }}>
      {inner}
    </div>
  )
}
