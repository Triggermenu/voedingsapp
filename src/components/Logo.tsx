interface Props {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#1d9e75" />
      <path
        d="M21.5 8C21.5 8 25.5 16.5 16 21.5C16 21.5 8 21.5 8 14C8 10 11 8 21.5 8Z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M21.5 8L16 21.5"
        stroke="#178a65"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M16 21.5L15 27"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
