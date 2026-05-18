import { describe, expect, it } from 'vitest'
import { chuanHoaBienSo, chuanHoaChuoi, chuanHoaMaCode, soSanhKhongPhanBiet } from './kiemTraQuanTri'

describe('kiemTraQuanTri', () => {
  it('chuanHoaChuoi trim và gộp khoảng trắng', () => {
    expect(chuanHoaChuoi('  a   b  ')).toBe('a b')
  })

  it('soSanhKhongPhanBiet bỏ qua hoa thường và khoảng trắng', () => {
    expect(soSanhKhongPhanBiet('  Ab C ', 'ab c')).toBe(true)
    expect(soSanhKhongPhanBiet('abc', 'xyz')).toBe(false)
  })

  it('chuanHoaBienSo và chuanHoaMaCode uppercase không khoảng trắng', () => {
    expect(chuanHoaBienSo(' 51a - 12345 ')).toBe('51A-12345')
    expect(chuanHoaMaCode(' km 10 ')).toBe('KM10')
  })
})
