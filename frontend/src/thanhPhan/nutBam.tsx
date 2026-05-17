import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react'
import { Pencil, Save, Trash2, X } from 'lucide-react'

export type BienNut = 'chinh' | 'phu' | 'mo' | 'nguyHiem' | 'vien' | 'huy'

const lop: Record<BienNut, string> = {
  chinh: 'btn btn--primary',
  phu: 'btn btn--secondary',
  mo: 'btn btn--ghost',
  nguyHiem: 'btn btn--danger',
  vien: 'btn btn--outline',
  huy: 'btn btn--cancel',
}

const KICH_THUOC_ICON = 16

function laChuoi(node: ReactNode): node is string {
  return typeof node === 'string'
}

function noiDungCoIcon(bien: BienNut, con?: ReactNode): ReactNode {
  if (con == null || con === '') return con
  if (bien === 'huy' && laChuoi(con) && /^Hủy/i.test(con.trim())) {
    return (
      <>
        <X size={KICH_THUOC_ICON} strokeWidth={2} aria-hidden />
        {con}
      </>
    )
  }
  if (bien === 'chinh' && laChuoi(con) && /^Lưu/i.test(con.trim())) {
    return (
      <>
        <Save size={KICH_THUOC_ICON} strokeWidth={2} aria-hidden />
        {con}
      </>
    )
  }
  return con
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
      {noiDungCoIcon(bien, con)}
    </button>
  )
}

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
