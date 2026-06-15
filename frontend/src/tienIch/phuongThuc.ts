const NHAN: Record<string, string> = {
  TIEN_MAT: 'Tiền mặt tại quầy',
  CHUYEN_KHOAN: 'PayOS / Chuyển khoản',
}

const TONE: Record<string, string> = {
  TIEN_MAT: 'TIEN_MAT',
  CHUYEN_KHOAN: 'CHUYEN_KHOAN',
}

export function phuongThucSangTiengViet(ma: string | undefined | null): string {
  if (ma == null || ma === '') return '—'
  const k = ma.trim().toUpperCase()
  return NHAN[k] ?? ma
}

export function phuongThucTone(ma: string | undefined | null): string | undefined {
  if (ma == null || ma === '') return undefined
  const k = ma.trim().toUpperCase()
  return TONE[k]
}
