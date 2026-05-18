import { describe, expect, it } from 'vitest'
import { phanTichMaTuQr } from './maVeQr'

describe('phanTichMaTuQr', () => {
  it('đọc mã từ URL tra cứu', () => {
    expect(phanTichMaTuQr('http://localhost:5173/tra-cuu-ve?ma=RBRWUC8QWQ')).toBe('RBRWUC8QWQ')
  })

  it('đọc mã từ chuỗi REDBUS', () => {
    expect(phanTichMaTuQr('REDBUS|RBRWUC8QWQ|44|PAID')).toBe('RBRWUC8QWQ')
  })

  it('đọc mã thuần', () => {
    expect(phanTichMaTuQr('RBRWUC8QWQ')).toBe('RBRWUC8QWQ')
  })
})
