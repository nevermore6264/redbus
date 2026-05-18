import { describe, expect, it } from 'vitest'
import { nhomTheoTang, tinSoCotTrai, xayDungLuoiGhe } from './soDoGhe'
import type { GheNgoi } from '../nguon/kieu'

function ghe(partial: Partial<GheNgoi> & Pick<GheNgoi, 'maGhe'>): GheNgoi {
  return {
    ma: partial.ma ?? 1,
    maXe: partial.maXe ?? 1,
    maGhe: partial.maGhe,
    hang: partial.hang,
    cot: partial.cot,
    tang: partial.tang,
    trangThai: partial.trangThai ?? 'AVAILABLE',
  }
}

describe('tinSoCotTrai', () => {
  it('tra 1 khi maxCot <= 1', () => {
    expect(tinSoCotTrai(1)).toBe(1)
  })

  it('tra floor(maxCot/2) khi lon hon 1', () => {
    expect(tinSoCotTrai(5)).toBe(2)
  })
})

describe('xayDungLuoiGhe', () => {
  it('tra mang rong khi khong co ghe', () => {
    const r = xayDungLuoiGhe([])
    expect(r.maxHang).toBe(0)
    expect(r.hangGhe).toEqual([])
  })

  it('xay luoi uoc luong khi ghe khong co hang/cot', () => {
    const ds = [
      ghe({ maGhe: '10' }),
      ghe({ maGhe: '2' }),
      ghe({ maGhe: '5' }),
      ghe({ maGhe: 'x' }),
    ]
    const r = xayDungLuoiGhe(ds)
    expect(r.maxHang).toBeGreaterThan(0)
    expect(r.maxCot).toBeGreaterThanOrEqual(3)
    expect(r.hangGhe.flat().filter(Boolean).length).toBe(4)
  })

  it('xay luoi theo hang cot khi du thong tin', () => {
    const ds = [
      ghe({ maGhe: '1', hang: 1, cot: 1 }),
      ghe({ maGhe: '2', hang: 1, cot: 2 }),
    ]
    const r = xayDungLuoiGhe(ds)
    expect(r.maxHang).toBe(1)
    expect(r.maxCot).toBe(2)
    expect(r.hangGhe[0][0]?.maGhe).toBe('1')
  })
})

describe('nhomTheoTang', () => {
  it('dat o trong khi khong co ghe tai vi tri hang cot', () => {
    const ds = [ghe({ maGhe: '1', hang: 1, cot: 2 })]
    const r = xayDungLuoiGhe(ds)
    expect(r.hangGhe[0][0]).toBeNull()
    expect(r.hangGhe[0][1]?.maGhe).toBe('1')
  })

  it('nhom ghe theo tang va sap xep', () => {
    const ds = [
      ghe({ maGhe: 'A', tang: 2 }),
      ghe({ maGhe: 'B', tang: 1 }),
    ]
    const r = nhomTheoTang(ds)
    expect(r.map((x) => x.tang)).toEqual([1, 2])
  })

  it('nhom ghe mac dinh tang 1 khi khong khai bao tang', () => {
    const ds = [ghe({ maGhe: 'A' })]
    expect(nhomTheoTang(ds)[0].tang).toBe(1)
  })
})

for (let i = 1; i <= 1000; i++) {
  it(`case ${i}: tinSoCotTrai voi maxCot = ${1 + (i % 12)}`, () => {
    const maxCot = 1 + (i % 12)
    const cotTrai = tinSoCotTrai(maxCot)
    expect(cotTrai).toBe(maxCot <= 1 ? 1 : Math.floor(maxCot / 2))
  })
}
