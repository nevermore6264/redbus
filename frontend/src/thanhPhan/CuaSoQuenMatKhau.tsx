import { useState } from 'react'
import { KeyRound, Mail } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { CuaSo } from './cuaSo'
import { NutBam, NutVanBan } from './nutBam'
import { TruongNhap } from './truongNhap'

type Props = {
  mo: boolean
  onDong: () => void
}

export function CuaSoQuenMatKhau({ mo, onDong }: Props) {
  const { hienThi } = dungThongBao()
  const [buoc, datBuoc] = useState<1 | 2>(1)
  const [email, datEmail] = useState('')
  const [maOtp, datMaOtp] = useState('')
  const [mkMoi, datMkMoi] = useState('')
  const [tai, datTai] = useState(false)

  function dong() {
    datBuoc(1)
    datEmail('')
    datMaOtp('')
    datMkMoi('')
    onDong()
  }

  async function guiOtp(e: React.FormEvent) {
    e.preventDefault()
    datTai(true)
    try {
      await moKhoiDuLieu(khachHttp.post<PhanHoi<unknown>>('/xac-thuc/quen-mat-khau/gui-otp', { email: email.trim() }))
      hienThi({ loai: 'thanhCong', noiDung: 'Đã gửi mã OTP tới email' })
      datBuoc(2)
    } catch (err: unknown) {
      hienThi({ loai: 'loi', noiDung: err instanceof Error ? err.message : 'Gửi OTP thất bại' })
    } finally {
      datTai(false)
    }
  }

  async function datLai(e: React.FormEvent) {
    e.preventDefault()
    datTai(true)
    try {
      await moKhoiDuLieu(
        khachHttp.post<PhanHoi<unknown>>('/xac-thuc/quen-mat-khau/dat-lai', {
          email: email.trim(),
          maOtp: maOtp.trim(),
          matKhauMoi: mkMoi,
        }),
      )
      hienThi({ loai: 'thanhCong', noiDung: 'Đã đặt lại mật khẩu — vui lòng đăng nhập' })
      dong()
    } catch (err: unknown) {
      hienThi({ loai: 'loi', noiDung: err instanceof Error ? err.message : 'Đặt lại mật khẩu thất bại' })
    } finally {
      datTai(false)
    }
  }

  return (
    <CuaSo open={mo} onClose={dong} title="Quên mật khẩu">
      {buoc === 1 ? (
        <form className="form-stack" onSubmit={(e) => void guiOtp(e)} noValidate>
          <p className="muted small">Nhập email đăng ký — mã OTP có hiệu lực 10 phút.</p>
          <TruongNhap
            nhan="Email"
            type="email"
            value={email}
            onChange={(e) => datEmail(e.target.value)}
            bieuTuong={<Mail size={16} />}
            batBuoc
          />
          <div className="form-actions">
            <NutVanBan type="button" onClick={dong} con="Hủy" />
            <NutBam bien="chinh" type="submit" dangTai={tai} con="Gửi mã OTP" />
          </div>
        </form>
      ) : (
        <form className="form-stack" onSubmit={(e) => void datLai(e)} noValidate>
          <TruongNhap nhan="Mã OTP" value={maOtp} onChange={(e) => datMaOtp(e.target.value)} batBuoc />
          <TruongNhap
            nhan="Mật khẩu mới"
            type="password"
            value={mkMoi}
            onChange={(e) => datMkMoi(e.target.value)}
            bieuTuong={<KeyRound size={16} />}
            batBuoc
          />
          <div className="form-actions">
            <NutVanBan type="button" onClick={() => datBuoc(1)} con="Quay lại" />
            <NutBam bien="chinh" type="submit" dangTai={tai} con="Đặt lại mật khẩu" />
          </div>
        </form>
      )}
    </CuaSo>
  )
}
