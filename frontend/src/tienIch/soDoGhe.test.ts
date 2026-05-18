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

describe('soDoGhe', () => {
  it('tinSoCotTrai trả 1 khi chỉ có 1 cột', () => {
    expect(tinSoCotTrai(1)).toBe(1)
    expect(tinSoCotTrai(5)).toBe(2)
  })

  it('xayDungLuoiGhe trả rỗng khi không có ghế', () => {
    const r = xayDungLuoiGhe([])
    expect(r.hangGhe).toEqual([])
    expect(r.maxHang).toBe(0)
  })

  it('xayDungLuoiGhe theo hang/cot', () => {
    const ds = [ghe({ maGhe: '1', hang: 1, cot: 1 }), ghe({ maGhe: '2', hang: 1, cot: 2 })]
    const r = xayDungLuoiGhe(ds)
    expect(r.maxCot).toBe(2)
    expect(r.hangGhe[0][0]?.maGhe).toBe('1')
    expect(r.hangGhe[0][1]?.maGhe).toBe('2')
  })

  it('xayDungLuoiGhe ước lượng khi thiếu hang/cot', () => {
    const ds = [ghe({ maGhe: '10' }), ghe({ maGhe: '2' }), ghe({ maGhe: '5' })]
    const r = xayDungLuoiGhe(ds)
    expect(r.hangGhe.length).toBeGreaterThan(0)
    expect(r.hangGhe.flat().filter(Boolean)).toHaveLength(3)
  })

  it('nhomTheoTang nhóm và sắp xếp tầng', () => {
    const ds = [ghe({ maGhe: 'A', tang: 2 }), ghe({ maGhe: 'B', tang: 1 })]
    expect(nhomTheoTang(ds).map((x) => x.tang)).toEqual([1, 2])
  })
})
