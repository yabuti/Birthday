import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  icon?: ReactNode
  variant?: 'default' | 'primary' | 'ghost' | 'quiet'
}

export function GoldButton({
  children,
  icon,
  variant = 'default',
  className = '',
  type = 'button',
  ...rest
}: GoldButtonProps) {
  const variantClass = variant === 'default' ? '' : ` btn--${variant}`
  return (
    <button type={type} className={`btn${variantClass} ${className}`.trim()} {...rest}>
      <span className="btn__label">{children}</span>
      {icon ? <span className="btn__icon">{icon}</span> : null}
      <span className="btn__sheen" aria-hidden="true" />
    </button>
  )
}
