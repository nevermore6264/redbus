import { describe, expect, it } from 'vitest'
import {
  PHUT_CHO_THANH_TOAN,
  conLaiGiayThanhToan,
  daHetHanThanhToan,
  dinhDangDemNguoc,
  lucHetHanThanhToan,
  phanTramConLai,
} from './hetHanThanhToan'

describe('hetHanThanhToan', () => {
  const lucDat = '2026-05-19T10:00:00.000Z'
  const lucDatMs = new Date(lucDat).getTime()

  it('lucHetHanThanhToan cộng đúng số phút', () => {
    const hetHan = lucHetHanThanhToan(lucDat)!
    expect(hetHan).toBe(lucDatMs + PHUT_CHO_THANH_TOAN * 60 * 1000)
  })

  it('lucHetHanThanhToan trả null khi thiếu hoặc sai ISO', () => {
    expect(lucHetHanThanhToan(undefined)).toBeNull()
    expect(lucHetHanThanhToan('khong-phai-ngay')).toBeNull()
  })

  it('conLaiGiayThanhToan giảm dần theo thời gian', () => {
    const truoc5Phut = lucDatMs + 5 * 60 * 1000
    expect(conLaiGiayThanhToan(lucDat, truoc5Phut)).toBe(10 * 60)
    const sauHetHan = lucDatMs + PHUT_CHO_THANH_TOAN * 60 * 1000 + 1000
    expect(conLaiGiayThanhToan(lucDat, sauHetHan)).toBe(0)
  })

  it('daHetHanThanhToan true khi hết thời gian', () => {
    const sauHetHan = lucDatMs + PHUT_CHO_THANH_TOAN * 60 * 1000 + 1
    expect(daHetHanThanhToan(lucDat, sauHetHan)).toBe(true)
    expect(daHetHanThanhToan(lucDat, lucDatMs)).toBe(false)
  })

  it('dinhDangDemNguoc hiển thị mm:ss', () => {
    expect(dinhDangDemNguoc(125)).toBe('02:05')
    expect(dinhDangDemNguoc(0)).toBe('00:00')
  })

  it('phanTramConLai trong khoảng 0..100', () => {
    expect(phanTramConLai(PHUT_CHO_THANH_TOAN * 60)).toBe(100)
    expect(phanTramConLai(0)).toBe(0)
    expect(phanTramConLai(PHUT_CHO_THANH_TOAN * 60 + 100)).toBe(100)
  })
})
