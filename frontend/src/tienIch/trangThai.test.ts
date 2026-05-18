import { describe, expect, it } from 'vitest'
import { trangThaiSangTiengViet } from './trangThai'

describe('trangThaiSangTiengViet', () => {
  it('trả về gạch ngang khi mã null hoặc rỗng', () => {
    expect(trangThaiSangTiengViet(null)).toBe('—')
    expect(trangThaiSangTiengViet('')).toBe('—')
  })

  it('dịch mã trạng thái đã biết', () => {
    expect(trangThaiSangTiengViet('PENDING')).toBe('Chờ thanh toán')
    expect(trangThaiSangTiengViet(' paid ')).toBe('Đã thanh toán')
  })

  it('giữ nguyên mã khi không có trong bảng', () => {
    expect(trangThaiSangTiengViet('CUSTOM')).toBe('CUSTOM')
  })
})
