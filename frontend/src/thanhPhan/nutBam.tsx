import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

export type BienNut = 'chinh' | 'phu' | 'mo' | 'nguyHiem' | 'vien' | 'huy'

const lop: Record<BienNut, string> = {
  chinh: 'btn btn--primary',
  phu: 'btn btn--secondary',
  mo: 'btn btn--ghost',
  nguyHiem: 'btn btn--danger',
  vien: 'btn btn--outline',
  huy: 'btn btn--cancel',
}

export function NutBam({
  bien = 'phu',
  con,
  className = '',
  dangTai,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  bien?: BienNut
  con?: ReactNode
  dangTai?: boolean
}) {
  return (
    <button
      type={type}
      className={`${lop[bien]} ${className}`.trim()}
      disabled={props.disabled || dangTai}
      {...props}
    >
      {dangTai ? <span className="btn__spinner" aria-hidden /> : null}
      {con}
    </button>
  )
}

/** Nút « Sửa » trong bảng quản trị — icon + màu xanh */
export function NutSuaQt({
  className = '',
  ...props
}: Omit<ComponentProps<typeof NutBam>, 'con' | 'bien'>) {
  return (
    <NutBam
      bien="mo"
      className={`btn--qt-sua btn--sm ${className}`.trim()}
      con={
        <>
          <Pencil size={15} strokeWidth={2} aria-hidden />
          Sửa
        </>
      }
      {...props}
    />
  )
}

/** Nút « Xóa » trong bảng quản trị — icon + màu đỏ nhạt */
export function NutXoaQt({
  className = '',
  ...props
}: Omit<ComponentProps<typeof NutBam>, 'con' | 'bien'>) {
  return (
    <NutBam
      bien="mo"
      className={`btn--qt-xoa btn--sm ${className}`.trim()}
      con={
        <>
          <Trash2 size={15} strokeWidth={2} aria-hidden />
          Xóa
        </>
      }
      {...props}
    />
  )
}
