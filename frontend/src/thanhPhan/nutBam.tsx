import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  CheckCheck,
  CreditCard,
  Home,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Ticket,
  TicketCheck,
  Trash2,
  Unlock,
  UserPlus,
  X,
} from 'lucide-react'

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

function chonIcon(chuoi: string, bien: BienNut): LucideIcon | null {
  const s = chuoi.trim()
  if (/^Hủy/i.test(s)) return X
  if (/^Lưu/i.test(s)) return Save
  if (/^\+?\s*Thêm/i.test(s)) return Plus
  if (/đăng nhập|Đăng nhập/i.test(s)) return LogIn
  if (/Đăng ký/i.test(s)) return UserPlus
  if (/^Đăng xuất/i.test(s)) return LogOut
  if (/Tìm chuyến|Tra cứu/i.test(s)) return Search
  if (/Làm mới|Cập nhật|Tải lại/i.test(s)) return RefreshCw
  if (/Gửi mã OTP/i.test(s)) return Send
  if (/Gửi đánh giá/i.test(s)) return Send
  if (/^Gửi$/i.test(s)) return Send
  if (/Đổi mật khẩu/i.test(s)) return KeyRound
  if (/Đánh dấu đã đọc/i.test(s)) return CheckCheck
  if (bien === 'nguyHiem' || /^Xóa|^Đang xóa/i.test(s)) return Trash2
  if (/Thanh toán/i.test(s)) return CreditCard
  if (/Xác nhận đặt vé/i.test(s)) return TicketCheck
  if (/Gen lịch/i.test(s)) return CalendarPlus
  if (/Đặt vé/i.test(s)) return CalendarPlus
  if (/Khóa ghế/i.test(s)) return Lock
  if (/Mở khóa/i.test(s)) return Unlock
  if (/Về trang chủ/i.test(s)) return Home
  if (/Quay lại/i.test(s)) return ArrowLeft
  if (/Đến trang tin/i.test(s)) return Search
  if (/Xem tất cả|Xem vé của tôi/i.test(s)) return ArrowRight
  if (/Vé của tôi/i.test(s)) return Ticket
  return null
}

export function ganIconNut(con: ReactNode, bien: BienNut = 'phu'): ReactNode {
  if (con == null || con === '') return con
  if (!laChuoi(con)) return con
  const Icon = chonIcon(con, bien)
  if (!Icon) return con
  const chu = /^\+\s*/.test(con) ? con.replace(/^\+\s*/, '') : con
  return (
    <>
      <Icon size={KICH_THUOC_ICON} strokeWidth={2} aria-hidden />
      {chu}
    </>
  )
}

function noiDungCoIcon(bien: BienNut, con?: ReactNode): ReactNode {
  return ganIconNut(con, bien)
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

export function NutLienKet({
  bien = 'chinh',
  con,
  className = '',
  to,
  ...props
}: LinkProps & {
  bien?: BienNut
  con: ReactNode
}) {
  return (
    <Link to={to} className={`${lop[bien]} ${className}`.trim()} {...props}>
      {noiDungCoIcon(bien, con)}
    </Link>
  )
}

export function NutVanBan({
  con,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  con: ReactNode
}) {
  return (
    <button type="button" className={`btn-text ${className}`.trim()} {...props}>
      {ganIconNut(con, 'mo')}
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
