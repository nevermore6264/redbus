import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

export function goiYPlaceholderTuNhan(nhan?: string) {
  if (!nhan?.trim()) return undefined
  const t = nhan.trim()
  return `Nhập ${t.charAt(0).toLowerCase()}${t.slice(1)}`
}

export function TruongNhap({
  nhan,
  goiY,
  loi,
  bieuTuong,
  id,
  className = '',
  placeholder,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  nhan?: string
  goiY?: string
  loi?: string
  bieuTuong?: ReactNode
}) {
  const idTruong = id ?? props.name
  const placeholderCuoi = placeholder ?? goiYPlaceholderTuNhan(nhan)
  return (
    <div className={`field ${loi ? 'field--error' : ''}`.trim()}>
      {nhan ? (
        <label className="field__label" htmlFor={idTruong}>
          {nhan}
        </label>
      ) : null}
      <div className="field__control">
        {bieuTuong ? <span className="field__icon">{bieuTuong}</span> : null}
        <input
          id={idTruong}
          className={`field__input ${className}`.trim()}
          placeholder={placeholderCuoi}
          {...props}
        />
      </div>
      {goiY && !loi ? <p className="field__hint">{goiY}</p> : null}
      {loi ? <p className="field__err">{loi}</p> : null}
    </div>
  )
}

export function TruongVanBan({
  nhan,
  goiY,
  loi,
  id,
  className = '',
  placeholder,
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  nhan?: string
  goiY?: string
  loi?: string
}) {
  const idTruong = id ?? props.name
  const placeholderCuoi = placeholder ?? goiYPlaceholderTuNhan(nhan)
  return (
    <div className={`field ${loi ? 'field--error' : ''}`.trim()}>
      {nhan ? (
        <label className="field__label" htmlFor={idTruong}>
          {nhan}
        </label>
      ) : null}
      <textarea
        id={idTruong}
        className={`field__input ${className}`.trim()}
        rows={rows}
        placeholder={placeholderCuoi}
        {...props}
      />
      {goiY && !loi ? <p className="field__hint">{goiY}</p> : null}
      {loi ? <p className="field__err">{loi}</p> : null}
    </div>
  )
}

export function TruongChon({
  nhan,
  loi,
  id,
  children,
  className = '',
  ...props
}: React.ComponentProps<'select'> & { nhan?: string; loi?: string }) {
  const sid = id ?? props.name
  return (
    <div className={`field ${loi ? 'field--error' : ''}`.trim()}>
      {nhan ? (
        <label className="field__label" htmlFor={sid}>
          {nhan}
        </label>
      ) : null}
      <select id={sid} className={`field__input field__select ${className}`.trim()} {...props}>
        {children}
      </select>
      {loi ? <p className="field__err">{loi}</p> : null}
    </div>
  )
}
