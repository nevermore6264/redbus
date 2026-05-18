import type { ReactNode } from 'react'

const sac: Record<string, string> = {
  PENDING: 'badge--warn',
  PAID: 'badge--ok',
  CANCELLED: 'badge--muted',
  EXPIRED: 'badge--warn',
  SCHEDULED: 'badge--info',
  SUCCESS: 'badge--ok',
  BLOCKED: 'badge--muted',
  AVAILABLE: 'badge--ok',
}

export function NhanHieu({ children, tone }: { children: ReactNode; tone?: string }) {
  const l = tone ? sac[tone] ?? 'badge--neutral' : 'badge--neutral'
  return <span className={`badge ${l}`}>{children}</span>
}
