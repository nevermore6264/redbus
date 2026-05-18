import { describe, expect, it } from 'vitest'
import { chuanHoaBienSo, chuanHoaChuoi, chuanHoaMaCode, soSanhKhongPhanBiet } from './kiemTraQuanTri'

describe('chuanHoaChuoi', () => {
  it('trim va gop khoang trang thua', () => {
    expect(chuanHoaChuoi('  a   b  ')).toBe('a b')
  })
})

describe('soSanhKhongPhanBiet', () => {
  it('so sanh khong phan biet hoa thuong va khoang trang', () => {
    expect(soSanhKhongPhanBiet('  Ab C ', 'ab c')).toBe(true)
  })
})

describe('chuanHoaBienSo va chuanHoaMaCode', () => {
  it('bien so uppercase khong khoang trang', () => {
    expect(chuanHoaBienSo(' 51a - 12345 ')).toBe('51A-12345')
  })

  it('ma code giong chuan hoa bien so', () => {
    expect(chuanHoaMaCode(' km 10 ')).toBe('KM10')
  })
})

for (let i = 1; i <= 1000; i++) {
  describe(`kiemTraQuanTri case ${i}`, () => {
    it(`case ${i}: chuanHoaChuoi voi chuoi co chi so ${i}`, () => {
      const raw = `  tu${i}   ${i}  `
      expect(chuanHoaChuoi(raw)).toBe(`tu${i} ${i}`)
    })

    it(`case ${i}: soSanhKhongPhanBiet tu dong ${i}`, () => {
      const a = `Item ${i}`
      expect(soSanhKhongPhanBiet(a, a.toUpperCase())).toBe(true)
    })
  })
}
