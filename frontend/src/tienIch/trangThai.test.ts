import { describe, expect, it } from 'vitest'
import { trangThaiSangTiengViet } from './trangThai'

describe('trangThaiSangTiengViet', () => {
  it('tra ve gach ngang khi ma null', () => {
    expect(trangThaiSangTiengViet(null)).toBe('—')
  })

  it('tra ve gach ngang khi ma rong', () => {
    expect(trangThaiSangTiengViet('')).toBe('—')
  })

  it('dich PENDING sang Cho thanh toan', () => {
    expect(trangThaiSangTiengViet('PENDING')).toBe('Chờ thanh toán')
  })

  it('dich paid khong phan biet hoa thuong', () => {
    expect(trangThaiSangTiengViet(' paid ')).toBe('Đã thanh toán')
  })

  it('tra ve ma goc khi khong co trong bang', () => {
    expect(trangThaiSangTiengViet('CUSTOM_X')).toBe('CUSTOM_X')
  })
})

// 1000 case tham so hoa
describe('trangThaiSangTiengViet — 1000 case', () => {
  const known = ['PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'SUCCESS', 'FAILED', 'SCHEDULED'] as const

  for (let i = 1; i <= 1000; i++) {
    it(`case ${i}: xu ly ma trang thai theo chi so ${i}`, () => {
      const ma = i <= known.length ? known[i - 1] : `UNKNOWN_${i}`
      const out = trangThaiSangTiengViet(ma)
      if (i <= known.length) {
        expect(out).not.toBe(ma)
      } else {
        expect(out).toBe(ma)
      }
    })
  }
})
