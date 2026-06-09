import { describe, expect, it } from 'vitest'
import { dinhDangNgayGio, dinhDangVnd } from './dinhDang'

describe('dinhDangVnd', () => {
  it('định dạng số thành tiền VND', () => {
    expect(dinhDangVnd(150000)).toContain('150')
    expect(dinhDangVnd(150000)).toMatch(/₫|VND|đ/)
  })

  it('undefined được coi là 0 và vẫn format', () => {
    expect(dinhDangVnd(undefined)).toContain('0')
  })

  it('NaN hoặc chuỗi không phải số trả gạch ngang', () => {
    expect(dinhDangVnd('abc')).toBe('—')
  })

  it('chuỗi số hợp lệ vẫn format được', () => {
    expect(dinhDangVnd('250000')).toContain('250')
  })
})

describe('dinhDangNgayGio', () => {
  it('undefined trả gạch ngang', () => {
    expect(dinhDangNgayGio(undefined)).toBe('—')
  })

  it('ISO hợp lệ trả chuỗi không rỗng', () => {
    const s = dinhDangNgayGio('2026-05-19T14:30:00.000Z')
    expect(s.length).toBeGreaterThan(5)
    expect(s).not.toBe('—')
  })
})
