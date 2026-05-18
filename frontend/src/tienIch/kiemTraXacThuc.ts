export type TruongDangKy = 'hoTen' | 'tenDangNhap' | 'email' | 'matKhau' | 'soDienThoai'

export interface BieuDangKy {
  tenDangNhap: string
  email: string
  matKhau: string
  hoTen: string
  soDienThoai: string
}

const EMAIL_HOP_LE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TEN_DN_HOP_LE = /^[a-zA-Z0-9._-]+$/
const SDT_HOP_LE = /^0\d{8,10}$/

export function kiemTraDangKy(bieu: BieuDangKy): Partial<Record<TruongDangKy, string>> {
  const loi: Partial<Record<TruongDangKy, string>> = {}

  const hoTen = bieu.hoTen.trim()
  if (!hoTen) loi.hoTen = 'Nhập họ và tên'
  else if (hoTen.length < 2) loi.hoTen = 'Họ và tên ít nhất 2 ký tự'

  const ten = bieu.tenDangNhap.trim()
  if (!ten) loi.tenDangNhap = 'Nhập tên đăng nhập'
  else if (ten.length < 3) loi.tenDangNhap = 'Tên đăng nhập ít nhất 3 ký tự'
  else if (ten.length > 64) loi.tenDangNhap = 'Tên đăng nhập tối đa 64 ký tự'
  else if (!TEN_DN_HOP_LE.test(ten)) loi.tenDangNhap = 'Chỉ dùng chữ, số và . _ -'

  const email = bieu.email.trim()
  if (!email) loi.email = 'Nhập email'
  else if (!EMAIL_HOP_LE.test(email)) loi.email = 'Email không hợp lệ'

  if (!bieu.matKhau) loi.matKhau = 'Nhập mật khẩu'
  else if (bieu.matKhau.length < 6) loi.matKhau = 'Mật khẩu ít nhất 6 ký tự'
  else if (bieu.matKhau.length > 128) loi.matKhau = 'Mật khẩu tối đa 128 ký tự'

  const sdt = bieu.soDienThoai.replace(/\s/g, '').trim()
  if (sdt && !SDT_HOP_LE.test(sdt)) {
    loi.soDienThoai = 'Số điện thoại không hợp lệ (VD: 0912345678)'
  }

  return loi
}

export function kiemTraDangNhap(tenDangNhap: string, matKhau: string) {
  const loi: { tenDangNhap?: string; matKhau?: string } = {}
  if (!tenDangNhap.trim()) loi.tenDangNhap = 'Nhập tên đăng nhập'
  if (!matKhau) loi.matKhau = 'Nhập mật khẩu'
  return loi
}
