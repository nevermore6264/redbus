const BANG: Record<string, string> = {
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền',
  REFUND_PENDING: 'Chờ hoàn tiền',
  EXPIRED: 'Quá hạn thanh toán',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  SCHEDULED: 'Đã lên lịch',
}

export function trangThaiSangTiengViet(ma: string | undefined | null): string {
  if (ma == null || ma === '') return '—'
  const k = ma.trim().toUpperCase()
  return BANG[k] ?? ma
}
