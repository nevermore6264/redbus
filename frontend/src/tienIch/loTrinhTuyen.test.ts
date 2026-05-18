import { beforeEach, describe, expect, it, vi } from 'vitest'
import { chuoiLoTrinh, sapXepDiemDung, taoDanhSachLoTrinh, taiDiemDungTheoTuyen } from './loTrinhTuyen'
import type { DiemDungChan, TuyenDuong } from '../nguon/kieu'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'

vi.mock('../nguon/apiClient', () => ({
  khachHttp: { get: vi.fn() },
  moKhoiDuLieu: vi.fn(async (p: Promise<unknown>) => p),
}))

const tuyen: Pick<TuyenDuong, 'diemDi' | 'diemDen'> = { diemDi: 'A', diemDen: 'B' }

describe('loTrinhTuyen', () => {
  it('sapXepDiemDung theo thuTu', () => {
    const ds: DiemDungChan[] = [
      { ma: 2, maTuyen: 1, tenDiem: 'Y', thuTu: 2 },
      { ma: 1, maTuyen: 1, tenDiem: 'X', thuTu: 1 },
    ]
    expect(sapXepDiemDung(ds).map((d) => d.tenDiem)).toEqual(['X', 'Y'])
  })

  it('taoDanhSachLoTrinh nối điểm đi, dừng, đến', () => {
    const ds: DiemDungChan[] = [{ ma: 1, maTuyen: 1, tenDiem: 'Giữa', thuTu: 1 }]
    expect(taoDanhSachLoTrinh(tuyen, ds)).toEqual(['A', 'Giữa', 'B'])
    expect(chuoiLoTrinh(tuyen, ds)).toBe('A → Giữa → B')
  })

  describe('taiDiemDungTheoTuyen', () => {
    beforeEach(() => {
      vi.mocked(khachHttp.get).mockReset()
      vi.mocked(moKhoiDuLieu).mockImplementation(async (p) => p)
    })

    it('trả rỗng khi không có tuyến', async () => {
      await expect(taiDiemDungTheoTuyen([])).resolves.toEqual({})
    })

    it('tải điểm dừng thành công', async () => {
      const dsTuyen = [{ ma: 1, diemDi: 'A', diemDen: 'B' }] as TuyenDuong[]
      const diem: DiemDungChan[] = [{ ma: 1, maTuyen: 1, tenDiem: 'Giữa' }]
      vi.mocked(moKhoiDuLieu).mockResolvedValue(diem)
      await expect(taiDiemDungTheoTuyen(dsTuyen)).resolves.toEqual({ 1: diem })
    })

    it('trả mảng rỗng khi API lỗi', async () => {
      const dsTuyen = [{ ma: 2, diemDi: 'X', diemDen: 'Y' }] as TuyenDuong[]
      vi.mocked(khachHttp.get).mockRejectedValue(new Error('network'))
      await expect(taiDiemDungTheoTuyen(dsTuyen)).resolves.toEqual({ 2: [] })
    })
  })
})
