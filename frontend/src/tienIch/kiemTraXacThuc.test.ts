import { describe, expect, it } from 'vitest'
import { kiemTraDangKy, kiemTraDangNhap } from './kiemTraXacThuc'

const bieuHopLe = {
  hoTen: 'Nguyen Van A',
  tenDangNhap: 'user_test',
  email: 'a@example.com',
  matKhau: '123456',
  soDienThoai: '0912345678',
}

describe('kiemTraDangKy', () => {
  it('biểu hợp lệ không có lỗi', () => {
    expect(kiemTraDangKy(bieuHopLe)).toEqual({})
  })

  it('bắt buộc họ tên, email, mật khẩu, tên đăng nhập', () => {
    const loi = kiemTraDangKy({ ...bieuHopLe, hoTen: '', email: '', matKhau: '', tenDangNhap: '' })
    expect(loi.hoTen).toBeTruthy()
    expect(loi.email).toBeTruthy()
    expect(loi.matKhau).toBeTruthy()
    expect(loi.tenDangNhap).toBeTruthy()
  })

  it('tên đăng nhập chỉ cho phép chữ số . _ -', () => {
    expect(kiemTraDangKy({ ...bieuHopLe, tenDangNhap: 'user@bad' }).tenDangNhap).toBeTruthy()
  })

  it('email sai định dạng', () => {
    expect(kiemTraDangKy({ ...bieuHopLe, email: 'not-email' }).email).toBeTruthy()
  })

  it('mật khẩu ngắn hơn 6 ký tự', () => {
    expect(kiemTraDangKy({ ...bieuHopLe, matKhau: '12345' }).matKhau).toBeTruthy()
  })

  it('số điện thoại không bắt buộc nhưng phải đúng định dạng nếu có', () => {
    expect(kiemTraDangKy({ ...bieuHopLe, soDienThoai: '' }).soDienThoai).toBeUndefined()
    expect(kiemTraDangKy({ ...bieuHopLe, soDienThoai: '123' }).soDienThoai).toBeTruthy()
  })
})

describe('kiemTraDangNhap', () => {
  it('thiếu tên hoặc mật khẩu', () => {
    expect(kiemTraDangNhap('', 'mk').tenDangNhap).toBeTruthy()
    expect(kiemTraDangNhap('user', '').matKhau).toBeTruthy()
  })

  it('đủ thông tin không lỗi', () => {
    expect(kiemTraDangNhap('user', 'secret')).toEqual({})
  })
})
