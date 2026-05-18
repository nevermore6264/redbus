import { describe, expect, it } from 'vitest'
import { rutGonTenDiaDanh } from './rutGonDiaDanh'

describe('rutGonTenDiaDanh', () => {
  it('tra ve gach ngang khi ten rong', () => {
    expect(rutGonTenDiaDanh('   ')).toBe('—')
  })

  it('giu nguyen neu ngan hon max', () => {
    expect(rutGonTenDiaDanh('Ha Noi', 36)).toBe('Ha Noi')
  })

  it('cat truoc dau phay khi chuoi day du dai hon max', () => {
    const ten = 'Quan 1, Thanh pho Ho Chi Minh Viet Nam rat dai'
    expect(rutGonTenDiaDanh(ten, 20)).toBe('Quan 1')
  })

  it('cat bang slice va them ellipsis khi qua dai', () => {
    const ten = 'X'.repeat(50)
    expect(rutGonTenDiaDanh(ten, 20)).toBe('X'.repeat(19) + '…')
  })
})

for (let i = 1; i <= 1000; i++) {
  it(`case ${i}: rut gon ten dia danh do dai ${10 + (i % 40)}`, () => {
    const max = 10 + (i % 40)
    const ten = 'Dia danh ' + 'a'.repeat(i % 60)
    const out = rutGonTenDiaDanh(ten, max)
    expect(out.length).toBeLessThanOrEqual(max + 1)
  })
}
