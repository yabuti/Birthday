interface OrnamentProps {
  className?: string
}

export function Ornament({ className = '' }: OrnamentProps) {
  return (
    <svg className={`ornament ${className}`.trim()} viewBox="0 0 190 10" fill="none" aria-hidden="true">
      <path d="M2 5h72" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
      <path d="M116 5h72" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
      <path d="M95 1.4 98.6 5 95 8.6 91.4 5Z" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="84" cy="5" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="106" cy="5" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="78" cy="5" r="0.6" fill="currentColor" opacity="0.35" />
      <circle cx="112" cy="5" r="0.6" fill="currentColor" opacity="0.35" />
    </svg>
  )
}
