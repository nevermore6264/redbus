import { describe, expect, it } from 'vitest'
import { rutGonTenDiaDanh } from './rutGonDiaDanh'

describe('rutGonTenDiaDanh', () => {
  it('trả về gạch ngang khi tên rỗng', () => {
    expect(rutGonTenDiaDanh('   ')).toBe('—')
  })

  it('giữ nguyên nếu ngắn hơn max', () => {
    expect(rutGonTenDiaDanh('Hà Nội', 36)).toBe('Hà Nội')
  })

  it('cắt trước dấu phẩy khi đủ dài', () => {
    const ten = 'Quận 1, Thành phố Hồ Chí Minh rất dài thêm nữa'
    expect(rutGonTenDiaDanh(ten, 20)).toBe('Quận 1')
  })

  it('cắt bằng slice và thêm ellipsis khi vẫn quá dài', () => {
    expect(rutGonTenDiaDanh('X'.repeat(50), 20)).toBe('X'.repeat(19) + '…')
  })
})
