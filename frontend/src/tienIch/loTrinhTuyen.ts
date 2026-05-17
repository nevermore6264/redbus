import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { DiemDungChan, PhanHoi, TuyenDuong } from '../nguon/kieu'

export function sapXepDiemDung(ds: DiemDungChan[]): DiemDungChan[] {
  return [...ds].sort((a, b) => (a.thuTu ?? 0) - (b.thuTu ?? 0))
}

export function taoDanhSachLoTrinh(
  tuyen: Pick<TuyenDuong, 'diemDi' | 'diemDen'>,
  diemDung: DiemDungChan[],
): string[] {
  const dung = sapXepDiemDung(diemDung).map((d) => d.tenDiem)
  return [tuyen.diemDi, ...dung, tuyen.diemDen]
}

export function chuoiLoTrinh(
  tuyen: Pick<TuyenDuong, 'diemDi' | 'diemDen'>,
  diemDung: DiemDungChan[] = [],
): string {
  return taoDanhSachLoTrinh(tuyen, diemDung).join(' → ')
}

export async function taiDiemDungTheoTuyen(
  dsTuyen: TuyenDuong[],
): Promise<Record<number, DiemDungChan[]>> {
  if (dsTuyen.length === 0) return {}
  const pairs = await Promise.all(
    dsTuyen.map(async (t) => {
      try {
        const d = await moKhoiDuLieu(
          khachHttp.get<PhanHoi<DiemDungChan[]>>(`/diem-dung/tuyen/${t.ma}`),
        )
        return [t.ma, d] as const
      } catch {
        return [t.ma, []] as const
      }
    }),
  )
  return Object.fromEntries(pairs)
}
