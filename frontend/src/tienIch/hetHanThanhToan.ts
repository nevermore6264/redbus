export const PHUT_CHO_THANH_TOAN = 5

export function lucHetHanThanhToan(thoiGianDat: string | undefined): number | null {
  if (!thoiGianDat) return null
  const lucDat = new Date(thoiGianDat).getTime()
  if (Number.isNaN(lucDat)) return null
  return lucDat + PHUT_CHO_THANH_TOAN * 60 * 1000
}

export function conLaiGiayThanhToan(thoiGianDat: string | undefined, lucHienTai = Date.now()): number {
  const hetHan = lucHetHanThanhToan(thoiGianDat)
  if (hetHan == null) return 0
  return Math.max(0, Math.floor((hetHan - lucHienTai) / 1000))
}

export function daHetHanThanhToan(thoiGianDat: string | undefined, lucHienTai = Date.now()): boolean {
  return conLaiGiayThanhToan(thoiGianDat, lucHienTai) <= 0
}

export function dinhDangDemNguoc(giay: number): string {
  const p = Math.floor(giay / 60)
  const s = giay % 60
  return `${String(p).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function phanTramConLai(giay: number): number {
  const tong = PHUT_CHO_THANH_TOAN * 60
  return Math.min(100, Math.max(0, (giay / tong) * 100))
}
