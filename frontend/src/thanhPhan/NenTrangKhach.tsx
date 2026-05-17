import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'


export function NenTrangKhach({
  tieuDe,
  moTa,
  Icon,
  children,
  hep = false,
}: {
  tieuDe: string
  moTa?: string
  Icon: LucideIcon
  children: ReactNode
  
  hep?: boolean
}) {
  return (
    <div className="cust-page">
      <div className={`container cust-shell${hep ? ' cust-shell--narrow' : ''}`}>
        <header className="cust-hero">
          <div className="cust-hero__badge" aria-hidden>
            <Icon size={28} strokeWidth={1.85} />
          </div>
          <div className="cust-hero__copy">
            <h1 className="cust-hero__title">{tieuDe}</h1>
            {moTa ? <p className="cust-hero__lead">{moTa}</p> : null}
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
