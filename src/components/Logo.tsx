interface Props {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = '' }: Props) {
  const fontSize = Math.round(size * 0.52)
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#163b2a" />
      <text x="16" y="22" textAnchor="middle" fill="white" fontFamily="Lora, Georgia, serif" fontWeight="600" fontSize={fontSize}>T</text>
    </svg>
  )
}
