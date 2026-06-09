import { describe, expect, it } from 'vitest'
import { anhAvatar, anhChoTuyen, anhTinFallback, SLIDE_HERO } from './anhTrang'

describe('anhChoTuyen', () => {
  it('luân phiên ảnh theo mã tuyến', () => {
    const a = anhChoTuyen(0)
    const b = anhChoTuyen(6)
    expect(a).toBe(b)
    expect(a).toMatch(/^\/images\/xe-khach\//)
  })
})

describe('anhAvatar', () => {
  it('encode tên vào seed dicebear', () => {
    expect(anhAvatar('Nguyễn Văn A')).toContain('seed=')
    expect(anhAvatar('Nguyễn Văn A')).toContain(encodeURIComponent('Nguyễn Văn A'))
  })

  it('tên rỗng dùng seed khach', () => {
    expect(anhAvatar('   ')).toContain('seed=khach')
  })
})

describe('anhTinFallback', () => {
  it('trả đường dẫn ảnh trong bộ cố định', () => {
    expect(anhTinFallback(1)).toMatch(/\.jpg$/)
  })
})

describe('SLIDE_HERO', () => {
  it('có ít nhất một slide với alt', () => {
    expect(SLIDE_HERO.length).toBeGreaterThan(0)
    expect(SLIDE_HERO[0].alt.length).toBeGreaterThan(0)
  })
})
