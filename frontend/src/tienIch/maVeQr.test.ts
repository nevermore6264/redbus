import { afterEach, describe, expect, it, vi } from 'vitest'
import { layNoiDungQr, phanTichMaTuQr, taoLinkTraCuuVe } from './maVeQr'

describe('taoLinkTraCuuVe', () => {
  it('bỏ slash cuối và uppercase mã vé trong query', () => {
    expect(taoLinkTraCuuVe('http://localhost:5173/', 'rbabc123')).toBe(
      'http://localhost:5173/tra-cuu-ve?ma=RBABC123',
    )
  })

  it('encode ký tự đặc biệt trong mã', () => {
    expect(taoLinkTraCuuVe('https://redbus.vn', 'RB+TEST')).toContain('ma=RB%2BTEST')
  })
})

describe('phanTichMaTuQr', () => {
  it('trả null khi chuỗi rỗng', () => {
    expect(phanTichMaTuQr('')).toBeNull()
    expect(phanTichMaTuQr('   ')).toBeNull()
  })

  it('đọc mã từ URL tra cứu', () => {
    expect(phanTichMaTuQr('http://localhost:5173/tra-cuu-ve?ma=RBRWUC8QWQ')).toBe('RBRWUC8QWQ')
  })

  it('đọc mã từ URL có khoảng trắng quanh query', () => {
    expect(phanTichMaTuQr('https://x.com/tra-cuu-ve?ma=  rb123456  ')).toBe('RB123456')
  })

  it('đọc mã từ chuỗi REDBUS pipe', () => {
    expect(phanTichMaTuQr('REDBUS|RBRWUC8QWQ|44|PAID')).toBe('RBRWUC8QWQ')
  })

  it('REDBUS không có mã sau pipe trả null', () => {
    expect(phanTichMaTuQr('REDBUS|')).toBeNull()
    expect(phanTichMaTuQr('REDBUS|   ')).toBeNull()
  })

  it('đọc mã thuần RB + 6-14 ký tự', () => {
    expect(phanTichMaTuQr('RBRWUC8QWQ')).toBe('RBRWUC8QWQ')
    expect(phanTichMaTuQr(' rb123456 ')).toBe('RB123456')
  })

  it('chuỗi không khớp định dạng trả null', () => {
    expect(phanTichMaTuQr('HELLO')).toBeNull()
    expect(phanTichMaTuQr('RB12')).toBeNull()
    expect(phanTichMaTuQr('not-a-url')).toBeNull()
  })
})

describe('layNoiDungQr', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('trả apiQr khi không có window (SSR)', () => {
    vi.stubGlobal('window', undefined)
    expect(layNoiDungQr('https://api.payos.com/qr', 'RB12345678')).toBe('https://api.payos.com/qr')
  })

  it('DEV: thay localhost API bằng link tra cứu frontend', () => {
    vi.stubGlobal('window', { location: { origin: 'http://192.168.1.5:5173' } })
    vi.stubEnv('DEV', true)
    vi.stubEnv('PROD', false)
    const out = layNoiDungQr('http://127.0.0.1:8080/api/qr.png', 'RBRWUC8QWQ')
    expect(out).toBe('http://192.168.1.5:5173/tra-cuu-ve?ma=RBRWUC8QWQ')
  })

  it('production URL giữ nguyên apiQr', () => {
    vi.stubGlobal('window', { location: { origin: 'https://redbus.vn' } })
    vi.stubEnv('DEV', false)
    vi.stubEnv('PROD', true)
    const api = 'https://payos.vn/checkout/abc'
    expect(layNoiDungQr(api, 'RB999')).toBe(api)
  })
})
