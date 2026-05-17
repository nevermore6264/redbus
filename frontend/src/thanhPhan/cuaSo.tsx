import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { NutBam } from './nutBam'

export function CuaSo({
  open,
  title,
  children,
  footer,
  onClose,
  size = 'md',
}: {
  open: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Dong" />
      <div className={`modal-panel modal-panel--${size}`}>
        <div className="modal-head">
          <h2 className="modal-title">{title}</h2>
          <NutBam bien="mo" className="modal-x" onClick={onClose} aria-label="Dong" con={<X size={20} />} />
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-foot">{footer}</div> : null}
      </div>
    </div>
  )
}
