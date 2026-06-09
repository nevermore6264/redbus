import { describe, expect, it } from 'vitest'
import { DS_HANG_XE, hopNhatHangXe } from './danhSachHangXe'

describe('hopNhatHangXe', () => {
  it('giữ danh sách cố định khi không thêm gì', () => {
    const kq = hopNhatHangXe([])
    expect(kq.length).toBe(DS_HANG_XE.length)
    expect(kq).toContain('Phương Trang (Futa)')
  })

  it('thêm hãng mới và bỏ qua null/rỗng', () => {
    const kq = hopNhetHangXeSafe(['  Hãng Mới  ', null, '', undefined])
    expect(kq).toContain('Hãng Mới')
    expect(kq.filter((h) => h === 'Hãng Mới').length).toBe(1)
  })

  it('sắp xếp theo locale vi', () => {
    const kq = hopNhetHangXeSafe(['Zebra Bus', 'An Anh'])
    const iAn = kq.indexOf('An Anh')
    const iZ = kq.indexOf('Zebra Bus')
    expect(iAn).toBeLessThan(iZ)
  })
})

function hopNhetHangXeSafe(ds: (string | null | undefined)[]) {
  return hopNhatHangXe(ds)
}
