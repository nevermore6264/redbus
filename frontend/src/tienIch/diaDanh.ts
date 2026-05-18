import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { DonViHanhChinh, PhanHoi } from '../nguon/kieu'

export function taoChuoiDiaDanh(tinh: DonViHanhChinh, xa: DonViHanhChinh): string {
  return `${xa.name}, ${tinh.name}`
}

export async function layDanhSachTinh() {
  return moKhoiDuLieu(
    khachHttp.get<PhanHoi<DonViHanhChinh[]>>('/dia-danh/tinh'),
  )
}

export async function layXaTheoTinh(maTinh: number) {
  return moKhoiDuLieu(
    khachHttp.get<PhanHoi<DonViHanhChinh[]>>(`/dia-danh/tinh/${maTinh}/xa`),
  )
}

export type UocTinhLoTrinh = {
  khoangCachKm: number
  thoiGianUocTinhPhut: number
  ghiChu?: string
}

export async function uocTinhLoTrinh(diemDi: string, diemDen: string) {
  return moKhoiDuLieu(
    khachHttp.get<PhanHoi<UocTinhLoTrinh>>('/dia-danh/uoc-tinh-lo-trinh', {
      params: { diemDi, diemDen },
    }),
  )
}
