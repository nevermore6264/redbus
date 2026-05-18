import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import { khachHttp, moKhoiDuLieu } from '../nguon/apiClient'
import type { PhanHoi, PhanHoiDangNhap } from '../nguon/kieu'
import { dungModalXacThuc } from '../dinhDanh/boiCanhModalXacThuc'
import { dungNguoiDung } from '../dinhDanh/boiCanhNguoiDung'
import { kiemTraDangKy, kiemTraDangNhap, type TruongDangKy } from '../tienIch/kiemTraXacThuc'
import { TruongNhap } from './truongNhap'
import { NutBam, NutVanBan } from './nutBam'
import { CuaSo } from './cuaSo'

export function CuaSoXacThuc() {
  const { cheDo, redirectSauThanhCong, dong, doiSangDangKy, doiSangDangNhap } = dungModalXacThuc()
  const { ganPhien } = dungNguoiDung()
  const navigate = useNavigate()

  const mo = cheDo !== null

  const [tenDn, datTenDn] = useState('')
  const [mk, datMk] = useState('')
  const [loiDn, datLoiDn] = useState<{ tenDangNhap?: string; matKhau?: string; chung?: string }>({})
  const [taiDn, datTaiDn] = useState(false)

  const [bieuKy, datBieuKy] = useState({
    tenDangNhap: '',
    email: '',
    matKhau: '',
    hoTen: '',
    soDienThoai: '',
  })
  const [loiKy, datLoiKy] = useState<Partial<Record<TruongDangKy | 'chung', string>>>({})
  const [taiKy, datTaiKy] = useState(false)

  useEffect(() => {
    if (!mo) {
      datTenDn('')
      datMk('')
      datLoiDn({})
      datLoiKy({})
      datBieuKy({
        tenDangNhap: '',
        email: '',
        matKhau: '',
        hoTen: '',
        soDienThoai: '',
      })
    }
  }, [mo])

  function xoaLoiKy(truong: TruongDangKy) {
    datLoiKy((truoc) => {
      if (!truoc[truong]) return truoc
      const sau = { ...truoc }
      delete sau[truong]
      return sau
    })
  }

  async function submitDn(e: React.FormEvent) {
    e.preventDefault()
    const loi = kiemTraDangNhap(tenDn, mk)
    datLoiDn(loi)
    if (Object.keys(loi).length > 0) return

    datTaiDn(true)
    try {
      const phien = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<PhanHoiDangNhap>>('/xac-thuc/dang-nhap', {
          tenDangNhap: tenDn.trim(),
          matKhau: mk,
        }),
      )
      ganPhien(phien)
      const di = redirectSauThanhCong ?? '/dat-ve'
      dong()
      navigate(di, { replace: true })
    } catch (err: unknown) {
      datLoiDn({ chung: err instanceof Error ? err.message : 'Lỗi đăng nhập' })
    } finally {
      datTaiDn(false)
    }
  }

  async function submitKy(e: React.FormEvent) {
    e.preventDefault()
    const loi = kiemTraDangKy(bieuKy)
    datLoiKy(loi)
    if (Object.keys(loi).length > 0) return

    datTaiKy(true)
    try {
      const phien = await moKhoiDuLieu(
        khachHttp.post<PhanHoi<PhanHoiDangNhap>>('/xac-thuc/dang-ky', {
          tenDangNhap: bieuKy.tenDangNhap.trim(),
          email: bieuKy.email.trim(),
          matKhau: bieuKy.matKhau,
          hoTen: bieuKy.hoTen.trim(),
          soDienThoai: bieuKy.soDienThoai.replace(/\s/g, '').trim() || undefined,
        }),
      )
      ganPhien(phien)
      const di = redirectSauThanhCong ?? '/dat-ve'
      dong()
      navigate(di, { replace: true })
    } catch (err: unknown) {
      datLoiKy({ chung: err instanceof Error ? err.message : 'Có lỗi xảy ra' })
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
          <form className="form-stack" onSubmit={submitDn} noValidate>
            <TruongNhap
              nhan="Tên đăng nhập"
              name="tenDangNhap"
              value={tenDn}
              onChange={(e) => {
                datTenDn(e.target.value)
                if (loiDn.tenDangNhap) datLoiDn((l) => ({ ...l, tenDangNhap: undefined }))
              }}
              batBuoc
              autoComplete="username"
              loi={loiDn.tenDangNhap}
              bieuTuong={<User size={18} />}
            />
            <TruongNhap
              nhan="Mật khẩu"
              name="matKhau"
              type="password"
              value={mk}
              onChange={(e) => {
                datMk(e.target.value)
                if (loiDn.matKhau) datLoiDn((l) => ({ ...l, matKhau: undefined }))
              }}
              batBuoc
              autoComplete="current-password"
              loi={loiDn.matKhau}
              bieuTuong={<Lock size={18} />}
            />
            {loiDn.chung ? <p className="field__err">{loiDn.chung}</p> : null}
            <NutBam bien="chinh" type="submit" className="btn--block" dangTai={taiDn} con="Đăng nhập" />
          </form>
          <p className="auth-card__foot muted" style={{ marginBottom: 0, marginTop: '1rem' }}>
            <NutVanBan onClick={doiSangDangKy} con="Đăng ký tài khoản khách hàng" />
          </p>
        </>
      ) : null}

      {cheDo === 'dang-ky' ? (
        <>
          <form className="form-grid-2" onSubmit={submitKy} noValidate style={{ marginTop: '0.25rem' }}>
            <TruongNhap
              nhan="Họ và tên"
              name="hoTen"
              value={bieuKy.hoTen}
              onChange={(e) => {
                datBieuKy({ ...bieuKy, hoTen: e.target.value })
                xoaLoiKy('hoTen')
              }}
              batBuoc
              autoComplete="name"
              loi={loiKy.hoTen}
            />
            <TruongNhap
              nhan="Số điện thoại"
              name="soDienThoai"
              type="tel"
              value={bieuKy.soDienThoai}
              onChange={(e) => {
                datBieuKy({ ...bieuKy, soDienThoai: e.target.value })
                xoaLoiKy('soDienThoai')
              }}
              goiY="Tùy chọn · VD: 0912345678"
              autoComplete="tel"
              loi={loiKy.soDienThoai}
            />
            <TruongNhap
              nhan="Tên đăng nhập"
              name="tenDangNhap"
              value={bieuKy.tenDangNhap}
              onChange={(e) => {
                datBieuKy({ ...bieuKy, tenDangNhap: e.target.value })
                xoaLoiKy('tenDangNhap')
              }}
              batBuoc
              autoComplete="username"
              loi={loiKy.tenDangNhap}
            />
            <TruongNhap
              nhan="Email"
              name="email"
              type="email"
              value={bieuKy.email}
              onChange={(e) => {
                datBieuKy({ ...bieuKy, email: e.target.value })
                xoaLoiKy('email')
              }}
              batBuoc
              autoComplete="email"
              loi={loiKy.email}
            />
            <div className="form-grid-2__full">
              <TruongNhap
                nhan="Mật khẩu"
                name="matKhau"
                type="password"
                value={bieuKy.matKhau}
                onChange={(e) => {
                  datBieuKy({ ...bieuKy, matKhau: e.target.value })
                  xoaLoiKy('matKhau')
                }}
                batBuoc
                goiY="Ít nhất 6 ký tự"
                autoComplete="new-password"
                loi={loiKy.matKhau}
              />
            </div>
            {loiKy.chung ? (
              <p className="field__err form-grid-2__full">{loiKy.chung}</p>
            ) : null}
            <div className="form-grid-2__full">
              <NutBam bien="chinh" type="submit" className="btn--block" dangTai={taiKy} con="Đăng ký" />
            </div>
          </form>
          <p className="auth-card__foot muted" style={{ marginBottom: 0, marginTop: '1rem' }}>
            <NutVanBan onClick={doiSangDangNhap} con="Đã có tài khoản? Đăng nhập" />
          </p>
        </>
      ) : null}
    </CuaSo>
  )
}
