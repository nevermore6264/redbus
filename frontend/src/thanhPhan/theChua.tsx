import type { ReactNode } from 'react'

export function TheChua({
  children,
  className = '',
  padding = 'md',
}: {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}) {
  const pad = padding === 'none' ? '' : ` card--pad-${padding}`
  return <div className={`card ${pad} ${className}`.trim()}>{children}</div>
}

export function TieuDeThe({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="card__head">
      <div>
        <h2 className="card__title">{title}</h2>
        {subtitle ? <p className="card__sub">{subtitle}</p> : null}
      </div>
      {action ? <div className="card__action">{action}</div> : null}
    </div>
  )
}
