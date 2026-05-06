import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, PhanHoiDangNhap } from '../nguon/kieu'
import { dungModalXacThuc } from '../dinhDanh/boiCanhModalXacThuc'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'
import { TruongNhap } from './truongNhap'
import { NutBam } from './nutBam'
import { CuaSo } from './cuaSo'

export function CuaSoXacThuc() {
  const { cheDo, redirectSauThanhCong, dong, doiSangDangKy, doiSangDangNhap } = dungModalXacThuc()
  const { ganPhien } = dungNguoiDung()
  const navigate = useNavigate()

  const mo = cheDo !== null

  const [tenDn, datTenDn] = useState('')
  const [mk, datMk] = useState('')
  const [loiDn, datLoiDn] = useState('')
  const [taiDn, datTaiDn] = useState(false)

  const [bieuKy, datBieuKy] = useState({
    tenDangNhap: '',
    email: '',
    matKhau: '',
    hoTen: '',
    soDienThoai: '',
  })
  const [loiKy, datLoiKy] = useState('')
  const [taiKy, datTaiKy] = useState(false)

  useEffect(() => {
    if (!mo) {
      datTenDn('')
      datMk('')
      datLoiDn('')
      datLoiKy('')
      datBieuKy({
        tenDangNhap: '',
        email: '',
        matKhau: '',
        hoTen: '',
        soDienThoai: '',
      })
    }
  }, [mo])

  async function submitDn(e: React.FormEvent) {
    e.preventDefault()
    datLoiDn('')
    datTaiDn(true)
    try {
      const phien = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<PhanHoiDangNhap>>('/xac-thuc/dang-nhap', {
          tenDangNhap: tenDn,
          matKhau: mk,
        }),
      )
      ganPhien(phien)
      const di = redirectSauThanhCong ?? '/dat-ve'
      dong()
      navigate(di, { replace: true })
    } catch (err: unknown) {
      datLoiDn(err instanceof Error ? err.message : 'Lỗi đăng nhập')
    } finally {
      datTaiDn(false)
    }
  }

  async function submitKy(e: React.FormEvent) {
    e.preventDefault()
    datLoiKy('')
    datTaiKy(true)
    try {
      const phien = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<PhanHoiDangNhap>>('/xac-thuc/dang-ky', bieuKy),
      )
      ganPhien(phien)
      const di = redirectSauThanhCong ?? '/dat-ve'
      dong()
      navigate(di, { replace: true })
    } catch (err: unknown) {
      datLoiKy(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      datTaiKy(false)
    }
  }

  const title = cheDo === 'dang-ky' ? 'Đăng ký tài khoản' : 'Đăng nhập'

  return (
    <CuaSo
      open={mo}
      title={title}
      onClose={dong}
      size={cheDo === 'dang-ky' ? 'lg' : 'md'}
    >
      {cheDo === 'dang-nhap' ? (
        <>
          <p className="auth-card__sub" style={{ marginTop: 0 }}>
            Quản trị demo: admin / Admin@123
          </p>
          <form className="form-stack" onSubmit={submitDn}>
            <TruongNhap
              nhan="Tên đăng nhập"
              name="tenDangNhap"
              value={tenDn}
              onChange={(e) => datTenDn(e.target.value)}
              required
              autoComplete="username"
              bieuTuong={<User size={18} />}
            />
            <TruongNhap
              nhan="Mật khẩu"
              name="matKhau"
              type="password"
              value={mk}
              onChange={(e) => datMk(e.target.value)}
              required
              autoComplete="current-password"
              bieuTuong={<Lock size={18} />}
            />
            {loiDn ? <p className="field__err">{loiDn}</p> : null}
            <NutBam bien="chinh" type="submit" className="btn--block" dangTai={taiDn} con="Đăng nhập" />
          </form>
          <p className="auth-card__foot muted" style={{ marginBottom: 0, marginTop: '1rem' }}>
            <button type="button" className="btn-text" onClick={doiSangDangKy}>
              Đăng ký tài khoản khách hàng
            </button>
          </p>
        </>
      ) : null}

      {cheDo === 'dang-ky' ? (
        <>
          <form className="form-grid-2" onSubmit={submitKy} style={{ marginTop: '0.25rem' }}>
            <TruongNhap
              nhan="Họ và tên"
              value={bieuKy.hoTen}
              onChange={(e) => datBieuKy({ ...bieuKy, hoTen: e.target.value })}
              required
            />
            <TruongNhap
              nhan="Số điện thoại"
              value={bieuKy.soDienThoai}
              onChange={(e) => datBieuKy({ ...bieuKy, soDienThoai: e.target.value })}
            />
            <TruongNhap
              nhan="Tên đăng nhập"
              value={bieuKy.tenDangNhap}
              onChange={(e) => datBieuKy({ ...bieuKy, tenDangNhap: e.target.value })}
              required
              minLength={3}
              autoComplete="username"
            />
            <TruongNhap
              nhan="Email"
              type="email"
              value={bieuKy.email}
              onChange={(e) => datBieuKy({ ...bieuKy, email: e.target.value })}
              required
              autoComplete="email"
            />
            <div className="form-grid-2__full">
              <TruongNhap
                nhan="Mật khẩu"
                type="password"
                value={bieuKy.matKhau}
                onChange={(e) => datBieuKy({ ...bieuKy, matKhau: e.target.value })}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            {loiKy ? <p className="field__err form-grid-2__full">{loiKy}</p> : null}
            <div className="form-grid-2__full">
              <NutBam bien="chinh" type="submit" className="btn--block" dangTai={taiKy} con="Đăng ký" />
            </div>
          </form>
          <p className="auth-card__foot muted" style={{ marginBottom: 0, marginTop: '1rem' }}>
            <button type="button" className="btn-text" onClick={doiSangDangNhap}>
              Đã có tài khoản? Đăng nhập
            </button>
          </p>
        </>
      ) : null}
    </CuaSo>
  )
}
