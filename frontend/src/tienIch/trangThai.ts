/** Mã trạng thái từ API → nhãn tiếng Việt hiển thị cho người dùng */

const BANG: Record<string, string> = {
  // Vé
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
  // Giao dịch (mapper lịch sử dùng SUCCESS khi vé PAID)
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  // Chuyến xe
  SCHEDULED: 'Đã lên lịch',
}

export function trangThaiSangTiengViet(ma: string | undefined | null): string {
  if (ma == null || ma === '') return '—'
  const k = ma.trim().toUpperCase()
  return BANG[k] ?? ma
}
