import { beforeEach, describe, expect, it, vi } from 'vitest'
import { chuoiLoTrinh, sapXepDiemDung, taoDanhSachLoTrinh, taiDiemDungTheoTuyen } from './loTrinhTuyen'
import type { DiemDungChan, TuyenDuong } from '../nguon/kieu'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'

vi.mock('../nguon/apiClient', () => ({
  khachHttp: { get: vi.fn() },
  moKhoiDuLieu: vi.fn(async (p: Promise<unknown>) => p),
}))

const tuyen: Pick<TuyenDuong, 'diemDi' | 'diemDen'> = { diemDi: 'A', diemDen: 'B' }

describe('sapXepDiemDung', () => {
  it('sap xep theo thuTu tang dan', () => {
    const ds: DiemDungChan[] = [
      { ma: 2, maTuyen: 1, tenDiem: 'Y', thuTu: 2 },
      { ma: 1, maTuyen: 1, tenDiem: 'X', thuTu: 1 },
    ]
    expect(sapXepDiemDung(ds).map((d) => d.tenDiem)).toEqual(['X', 'Y'])
  })

  it('sap xep coi thuTu null la 0', () => {
    const ds: DiemDungChan[] = [
      { ma: 2, maTuyen: 1, tenDiem: 'Y', thuTu: 1 },
      { ma: 1, maTuyen: 1, tenDiem: 'X' },
    ]
    expect(sapXepDiemDung(ds)[0].tenDiem).toBe('X')
  })

  it('sap xep khi ca hai diem deu khong co thuTu', () => {
    const ds: DiemDungChan[] = [
      { ma: 2, maTuyen: 1, tenDiem: 'B' },
      { ma: 1, maTuyen: 1, tenDiem: 'A' },
    ]
    expect(sapXepDiemDung(ds)).toHaveLength(2)
  })
})

describe('taoDanhSachLoTrinh', () => {
  it('noi diem di, diem dung, diem den', () => {
    const ds: DiemDungChan[] = [{ ma: 1, maTuyen: 1, tenDiem: 'Giua', thuTu: 1 }]
    expect(taoDanhSachLoTrinh(tuyen, ds)).toEqual(['A', 'Giua', 'B'])
  })
})

describe('chuoiLoTrinh', () => {
  it('noi bang mui ten', () => {
    expect(chuoiLoTrinh(tuyen, [])).toBe('A → B')
  })
})

describe('taiDiemDungTheoTuyen', () => {
  beforeEach(() => {
    vi.mocked(khachHttp.get).mockReset()
    vi.mocked(moKhoiDuLieu).mockImplementation(async (p) => p)
  })

  it('tra object rong khi khong co tuyen', async () => {
    await expect(taiDiemDungTheoTuyen([])).resolves.toEqual({})
  })

  it('tai diem dung cho tung tuyen thanh cong', async () => {
    const dsTuyen = [{ ma: 1, diemDi: 'A', diemDen: 'B' }] as TuyenDuong[]
    const diem: DiemDungChan[] = [{ ma: 1, maTuyen: 1, tenDiem: 'Giua' }]
    vi.mocked(khachHttp.get).mockResolvedValue({ data: { duLieu: diem } } as never)
    vi.mocked(moKhoiDuLieu).mockResolvedValue(diem)
    await expect(taiDiemDungTheoTuyen(dsTuyen)).resolves.toEqual({ 1: diem })
  })

  it('tra mang rong khi goi API loi', async () => {
    const dsTuyen = [{ ma: 2, diemDi: 'X', diemDen: 'Y' }] as TuyenDuong[]
    vi.mocked(khachHttp.get).mockRejectedValue(new Error('network'))
    await expect(taiDiemDungTheoTuyen(dsTuyen)).resolves.toEqual({ 2: [] })
  })
})

for (let i = 1; i <= 1000; i++) {
  it(`case ${i}: taoDanhSachLoTrinh voi ${i % 5} diem dung`, () => {
    const diem: DiemDungChan[] = Array.from({ length: i % 5 }, (_, j) => ({
      ma: j,
      maTuyen: 1,
      tenDiem: `D${j}`,
      thuTu: j,
    }))
    const list = taoDanhSachLoTrinh(tuyen, diem)
    expect(list[0]).toBe('A')
    expect(list[list.length - 1]).toBe('B')
    expect(list.length).toBe(2 + diem.length)
  })
}
