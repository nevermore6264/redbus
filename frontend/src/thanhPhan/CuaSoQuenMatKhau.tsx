import { useState } from 'react'
import { KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi } from '../nguon/kieu'
import { dungThongBao } from '../dinhDanh/boiCanhThongBao'
import { CuaSo } from './cuaSo'
import { NutBam } from './nutBam'
import { TruongNhap } from './truongNhap'

type Props = {
  mo: boolean
  onDong: () => void
}

const ID_FORM_OTP = 'form-quen-mk-otp'
const ID_FORM_DAT_LAI = 'form-quen-mk-dat-lai'

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

  const footer =
    buoc === 1 ? (
      <>
        <NutBam bien="huy" type="button" onClick={dong} con="Hủy" />
        <NutBam bien="chinh" type="submit" form={ID_FORM_OTP} dangTai={tai} con="Gửi mã OTP" />
      </>
    ) : (
      <>
        <NutBam bien="huy" type="button" onClick={() => datBuoc(1)} con="Quay lại" />
        <NutBam bien="chinh" type="submit" form={ID_FORM_DAT_LAI} dangTai={tai} con="Đặt lại mật khẩu" />
      </>
    )

  return (
    <CuaSo open={mo} onClose={dong} title="Quên mật khẩu" size="md" footer={footer}>
      <div className="quen-mk">
        <ol className="quen-mk__steps" aria-label="Tiến trình đặt lại mật khẩu">
          <li className={`quen-mk__step${buoc >= 1 ? ' quen-mk__step--on' : ''}${buoc > 1 ? ' quen-mk__step--done' : ''}`}>
            <span className="quen-mk__step-num">1</span>
            <span className="quen-mk__step-lab">Nhận OTP</span>
          </li>
          <li className={`quen-mk__step${buoc >= 2 ? ' quen-mk__step--on' : ''}`} aria-current={buoc === 2 ? 'step' : undefined}>
            <span className="quen-mk__step-num">2</span>
            <span className="quen-mk__step-lab">Mật khẩu mới</span>
          </li>
        </ol>

        {buoc === 1 ? (
          <form id={ID_FORM_OTP} className="form-stack quen-mk__form" onSubmit={(e) => void guiOtp(e)} noValidate>
            <div className="quen-mk__hint">
              <Mail size={20} className="quen-mk__hint-ico" aria-hidden />
              <p>
                Nhập <strong>email đã đăng ký</strong>. Hệ thống gửi mã OTP (hiệu lực{' '}
                <strong>10 phút</strong>) để xác minh danh tính.
              </p>
            </div>
            <TruongNhap
              nhan="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => datEmail(e.target.value)}
              bieuTuong={<Mail size={18} />}
              autoComplete="email"
              batBuoc
            />
          </form>
        ) : (
          <form id={ID_FORM_DAT_LAI} className="form-stack quen-mk__form" onSubmit={(e) => void datLai(e)} noValidate>
            <div className="quen-mk__hint quen-mk__hint--ok">
              <ShieldCheck size={20} className="quen-mk__hint-ico" aria-hidden />
              <p>
                Mã OTP đã gửi tới <strong>{email}</strong>. Nhập mã và mật khẩu mới (tối thiểu 6 ký tự).
              </p>
            </div>
            <TruongNhap
              nhan="Mã OTP"
              name="maOtp"
              value={maOtp}
              onChange={(e) => datMaOtp(e.target.value)}
              autoComplete="one-time-code"
              inputMode="numeric"
              batBuoc
            />
            <TruongNhap
              nhan="Mật khẩu mới"
              name="matKhauMoi"
              type="password"
              value={mkMoi}
              onChange={(e) => datMkMoi(e.target.value)}
              bieuTuong={<KeyRound size={18} />}
              goiY="Ít nhất 6 ký tự"
              autoComplete="new-password"
              batBuoc
            />
          </form>
        )}
      </div>
    </CuaSo>
  )
}
